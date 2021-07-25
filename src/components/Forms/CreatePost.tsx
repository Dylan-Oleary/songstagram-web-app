import { FC, FormEvent, MouseEvent, useEffect } from "react";
import { useRouter } from "next/router";
import { ClassNames } from "@44north/classnames";
import { v4 as uuid } from "uuid";
import { gql, useMutation } from "@apollo/client";
import { CloudUploadIcon } from "@heroicons/react/outline";

import { Button, TextInput } from "components";
import { FormInputControl, FormProvider, IFormData, useFlyout, useForm, useUser } from "context";
import { gqlErrorHandler, logout } from "lib";

enum PostSubmissionArgKeys {
    CreatePost = "createPostSubmission",
    UpdatePost = "updatePostSubmission"
}

interface IPostSubmissionBody {
    body: string;
    spotifyId?: string;
    spotifyRecordType?: "album" | "track";
}

interface ICreatePostFormData extends IFormData {
    body: string;
}

interface ICreatePostFormProps {
    /**
     * The name of the artist
     */
    artistName: string;
    /**
     * Classes to apply to the wrapper element
     */
    className?: string | ClassNames;
    /**
     * The image associated with the spotify record
     */
    imgSrc?: string;
    /**
     * The post id -- if provided the form is an update form
     */
    postId?: string;
    /**
     * The name of the track or album
     */
    recordName: string;
    /**
     * Spotify record data used in the form submission
     */
    spotifyRecordData: {
        id: string;
        recordType: "album" | "track";
    };
}

const Form: FC<ICreatePostFormProps> = ({
    artistName,
    className = "",
    imgSrc,
    postId,
    recordName,
    spotifyRecordData
}) => {
    const wrapperClasses = new ClassNames("flex flex-col p-8 h-full space-y-2").add(className);
    const router = useRouter();
    const { action, formValues, inputControl, onChange, onSubmit } = useForm<ICreatePostFormData>();
    const { closeFlyout } = useFlyout();
    const { accessToken, setAccessToken, setUser, user } = useUser();
    const [submitData] = useMutation(postId ? UPDATE_POST : CREATE_POST);

    /**
     * Function to execute on submission of the form
     *
     * @param event The form submission event
     */
    const handleFormSubmit: (event?: FormEvent | MouseEvent) => void = (event) => {
        const submissionKey = postId
            ? PostSubmissionArgKeys.UpdatePost
            : PostSubmissionArgKeys.CreatePost;
        const submission: IPostSubmissionBody = { body: formValues.body };

        if (submissionKey === PostSubmissionArgKeys.CreatePost) {
            submission.spotifyId = spotifyRecordData.id;
            submission.spotifyRecordType = spotifyRecordData.recordType;
        }

        onSubmit(event, () => {
            submitData({
                context: { headers: { authorization: accessToken } },
                variables: { [submissionKey]: submission, userNo: user.userNo },
                optimisticResponse: {
                    postNo: uuid(),
                    __typename: "Post",
                    userNo: user.userNo,
                    spotifyId: submission.spotifyId,
                    spotifyRecordType: submission.spotifyRecordType,
                    body: formValues.body
                }
            }).catch(async (error) => {
                const e = gqlErrorHandler(error, true) as ServerError;

                if (e.status === 401) {
                    await logout().then(() => {
                        setAccessToken(null);
                        setUser(null);

                        router.replace("/login");
                    });
                }
            });

            closeFlyout();
        });
    };

    useEffect(() => {
        document
            .querySelector<HTMLTextAreaElement>(`textarea[name="${inputControl.body.name}"]`)
            .focus();
    }, []);

    return (
        <div className={wrapperClasses.list()}>
            {imgSrc && (
                <div className="w-full">
                    <img className="mx-auto shadow-lg h-96" src={imgSrc} />
                </div>
            )}
            <div className="text-center dark:text-white">
                <div className="font-extrabold text-7xl">{recordName}</div>
                <div>{artistName}</div>
            </div>
            <form action={action} className="flex flex-col flex-grow" onSubmit={handleFormSubmit}>
                <TextInput
                    className="flex-grow w-full p-4 text-xl resize-none focus:outline-none dark:text-white dark:bg-dark"
                    name={inputControl?.body?.name}
                    onChange={(value) => onChange(inputControl.body.name, value)}
                    placeholder={`Tell the world why you love ${recordName} by ${artistName}...`}
                    type="textarea"
                    value={formValues.body}
                />
                <div className="flex items-center justify-between space-x-4">
                    <div className="dark:text-white">{formValues?.body?.length || 0} / 1500</div>
                    <Button
                        childClassName="flex items-center"
                        onClick={handleFormSubmit}
                        size="sm"
                        type="submit"
                    >
                        Submit
                        <CloudUploadIcon className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </form>
        </div>
    );
};

const CreatePostForm: FC<ICreatePostFormProps> = ({
    artistName,
    className = "",
    imgSrc,
    postId,
    recordName,
    spotifyRecordData
}) => {
    const formClasses = new ClassNames().add(className);
    const inputControl: FormInputControl<ICreatePostFormData> = {
        body: {
            initialValue: "",
            isRequired: false,
            label: "Body",
            name: "body",
            validators: [
                (value: string) => {
                    if (value.length > 1500) {
                        return new Error("Post body cannot be more than 1500 characters");
                    }

                    return undefined;
                }
            ]
        }
    };

    return (
        <FormProvider method="POST" inputControl={inputControl}>
            <Form
                artistName={artistName}
                className={formClasses.list()}
                imgSrc={imgSrc}
                postId={postId}
                recordName={recordName}
                spotifyRecordData={spotifyRecordData}
            />
        </FormProvider>
    );
};

const CREATE_POST = gql`
    mutation CreatePost($createPostSubmission: CreatePostSubmission!, $userNo: Int!) {
        createPost(submission: $createPostSubmission, userNo: $userNo) {
            postNo
            body
        }
    }
`;

const UPDATE_POST = gql`
    mutation UpdatePost($updatePostSubmission: UpdatePostSubmission!, $userNo: Int!) {
        updatePost(submission: $createPostSubmission, userNo: $userNo) {
            postNo
            body
        }
    }
`;

export default CreatePostForm;
export { CreatePostForm };
