import { FC, FormEvent, MouseEvent, useState } from "react";
import { ClassNames } from "@44north/classnames";
import { v4 as uuid } from "uuid";
import { ApolloCache, gql, useMutation } from "@apollo/client";

import { FormInputControl, FormProvider, IFormData, useForm, useUser } from "context";
import { Button, WYSIWYG } from "components";

interface ICommentFormData extends IFormData {
    /**
     * The body of the comment
     */
    body: string;
}

interface ICommentFormProps {
    /**
     * Classes to apply to the wrapper element
     */
    className?: string | ClassNames;
    /**
     * The parent comment number - useful for replying to comments
     */
    parentCommentNo?: number;
    /**
     * The post number that the comment will belong to
     */
    postNo: number;
}

const Form: FC<ICommentFormProps> = ({ className = "", parentCommentNo, postNo }) => {
    const {
        action,
        formAlerts,
        formErrors,
        formValues,
        inputControl,
        isSubmitting,
        method,
        onChange,
        onSubmit,
        setIsSubmitting,
        updateFormAlerts
    } = useForm<ICommentFormData>();
    const { accessToken, user } = useUser();
    const [submitData] = useMutation(CREATE_COMMENT);
    const [isSubmissionValid, setIsSubmissionValid] = useState<boolean>(false);

    /**
     * Function to execute on submission of the form
     *
     * @param event The form submission event
     */
    const handleSubmit: (event?: FormEvent | MouseEvent) => void = (event) => {
        onSubmit(event, () => {
            const isEmpty = new RegExp(/<[^/>]+>[ \n\r\t]*<\/[^>]+>/, "gi").test(
                formValues.body as string
            );

            if (!isEmpty) {
                submitData({
                    context: { headers: { authorization: accessToken } },
                    variables: { submission: { ...formValues, postNo }, userNo: user.userNo },
                    optimisticResponse: {
                        commentNo: uuid(),
                        __typename: "Comment",
                        userNo: user.userNo,
                        postNo,
                        body: formValues.body,
                        parentCommentNo: parentCommentNo || null
                    },
                    update: (cache) => hydrateApolloCache(cache)
                });
            }
        });
    };

    /**
     * Hydrates the Apollo cache with the new comment count
     *
     * @param cache The apollo client cache
     */
    const hydrateApolloCache: (cache: ApolloCache<any>) => void = (cache) => {
        const { post } = cache.readQuery<{ post: IPostRecord }>({
            query: GET_COMMENT_COUNT,
            variables: { postNo }
        });

        cache.writeQuery({
            query: GET_COMMENT_COUNT,
            data: { post: { ...post, commentCount: post.commentCount + 1 } },
            variables: { postNo }
        });
    };

    return (
        <form
            action={action}
            className={className as string}
            method={method}
            onSubmit={handleSubmit}
        >
            <WYSIWYG
                className="w-full h-[200px] flex flex-col rounded-sm border-gray-2 border overflow-hidden"
                decorationConfig={{
                    className: "flex-grow bg-gray-2",
                    decoratorActionsContent: (
                        <Button
                            borderRadius="rounded"
                            className="mr-2 py-0.5 text-white bg-success-3 disabled:cursor-not-allowed disabled:text-opacity-60 disabled:opacity-40"
                            disabled={!isSubmissionValid}
                            onClick={handleSubmit}
                            size="sm"
                            style="none"
                            type="submit"
                        >
                            Comment
                        </Button>
                    ),
                    decoratorItemClassName: "h-full px-2 hover:bg-gray-6 focus:outline-none",
                    withBold: true,
                    withItalic: true,
                    withStrikethrough: true,
                    withUnderline: true
                }}
                editorClassName="w-full focus:outline-none dark:bg-dark bg-white p-2 h-[160px] overflow-hidden dark:text-white"
                onChange={(value) => {
                    setIsSubmissionValid(
                        !new RegExp(/<[^/>]+>[ \n\r\t]*<\/[^>]+>/, "gi").test(value)
                    );
                    onChange(inputControl.body.name, value);
                }}
                placeholder="What are your thoughts?"
            />
        </form>
    );
};

const CommentForm: FC<ICommentFormProps> = ({ className = "", parentCommentNo, postNo }) => {
    const formClasses = new ClassNames().add(className);
    const inputControl: FormInputControl<ICommentFormData> = {
        body: {
            initialValue: "",
            isRequired: true,
            label: "Body",
            name: "body"
        }
    };

    return (
        <FormProvider method="POST" inputControl={inputControl}>
            <Form
                className={formClasses.list()}
                parentCommentNo={parentCommentNo}
                postNo={postNo}
            />
        </FormProvider>
    );
};

const CREATE_COMMENT = gql`
    mutation CreateComment($submission: CreateCommentSubmission!, $userNo: Int!) {
        createComment(submission: $submission, userNo: $userNo) {
            commentNo
            parentCommentNo
            userNo
            postNo
            body
            createdDate
        }
    }
`;

const GET_COMMENT_COUNT = gql`
    query GetPostCommentCount($postNo: Int!) {
        post(pk: $postNo) {
            postNo
            commentCount
        }
    }
`;

export default CommentForm;
export { CommentForm };
