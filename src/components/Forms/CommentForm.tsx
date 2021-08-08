import { FC, FormEvent, MouseEvent } from "react";
import { ClassNames } from "@44north/classnames";
import { gql, useMutation } from "@apollo/client";

import { FormInputControl, FormProvider, IFormData, useForm, useUser } from "context";
import { Button, WYSIWYG } from "components";

interface ICommentFormData extends IFormData {
    body: Object;
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
    // const [submitData] = useMutation(postId ? UPDATE_POST : CREATE_POST);

    /**
     * Function to execute on submission of the form
     *
     * @param event The form submission event
     */
    const handleSubmit: (event?: FormEvent | MouseEvent) => void = (event) => {
        // console.log("Submitting");
    };

    return (
        <form
            action={action}
            className={className as string}
            method={method}
            onSubmit={handleSubmit}
        >
            <WYSIWYG
                className="w-full bg-white h-[200px] flex flex-col rounded-sm border-gray-2 border overflow-hidden"
                decorationConfig={{
                    className: "flex-grow bg-gray-2",
                    decoratorActionsContent: (
                        <Button
                            borderRadius="rounded"
                            className="mr-2 py-0.5 text-white bg-success-3"
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
                editorClassName="w-full focus:outline-none bg-white p-2 h-[160px] overflow-hidden"
                onChange={(value) => onChange(inputControl.body.name, value)}
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

export default CommentForm;
export { CommentForm };
