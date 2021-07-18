import { FC, useEffect } from "react";
import { ClassNames } from "@44north/classnames";
import { CloudUploadIcon } from "@heroicons/react/outline";

import { Button, TextInput } from "components";
import { FormInputControl, FormProvider, IFormData, useFlyout, useForm } from "context";

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
     * The name of the track or album
     */
    recordName: string;
}

const Form: FC<ICreatePostFormProps> = ({ artistName, className = "", imgSrc, recordName }) => {
    const wrapperClasses = new ClassNames("flex flex-col p-8 h-full space-y-2").add(className);
    const {
        action,
        formErrors,
        formValues,
        inputControl,
        onChange,
        onSubmit,
        setIsSubmitting,
        updateFormAlerts
    } = useForm<ICreatePostFormData>();
    const { closeFlyout } = useFlyout();

    const handleFormSubmit = () => {
        closeFlyout();
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
            <form action={action} className="flex-grow" onSubmit={handleFormSubmit}>
                <TextInput
                    className="w-full h-full p-4 text-xl resize-none focus:outline-none dark:text-white dark:bg-dark"
                    name={inputControl?.body?.name}
                    onChange={(value) => onChange(inputControl.body.name, value)}
                    placeholder="Tell the world what you've been listening to..."
                    type="textarea"
                    value={formValues.body}
                />
            </form>
            <div className="flex items-center justify-between space-x-4">
                <div className="dark:text-white">{formValues?.body?.length || 0} / 1500</div>
                <Button childClassName="flex items-center" onClick={() => {}} size="sm">
                    Submit
                    <CloudUploadIcon className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
};

const CreatePostForm: FC<ICreatePostFormProps> = ({
    artistName,
    className = "",
    imgSrc,
    recordName
}) => {
    const formClasses = new ClassNames().add(className);
    const inputControl: FormInputControl<ICreatePostFormData> = {
        body: {
            initialValue: "",
            isRequired: false,
            label: "Body",
            name: "body"
        }
    };

    return (
        <FormProvider method="POST" inputControl={inputControl}>
            <Form
                artistName={artistName}
                className={formClasses.list()}
                imgSrc={imgSrc}
                recordName={recordName}
            />
        </FormProvider>
    );
};

export default CreatePostForm;
export { CreatePostForm };
