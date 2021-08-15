import { FC, ReactNode, useEffect } from "react";
import { ClassNames } from "@44north/classnames";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";

import { Button } from "components";
import { BoldIcon, ItalicIcon, StrikeThroughIcon, UnderlineIcon } from "icons";

interface IDecorationConfig {
    /**
     * Classes to be applied to the decorator bar
     */
    className?: string;
    /**
     * Additional elements to be rendered inside of the decorator bar
     */
    decoratorActionsContent?: JSX.Element | ReactNode;
    /**
     * Classes to be applied to the decorator options row
     */
    decoratorOptionsRowClassName?: string;
    /**
     * Classes to be applied to the individual decorator items
     */
    decoratorItemClassName?: string;
    /**
     * Include an option to bold content
     */
    withBold?: boolean;
    /**
     * Include an option to italicize content
     */
    withItalic?: boolean;
    /**
     * Include an option to strikethrough content
     */
    withStrikethrough?: boolean;
    /**
     * Include an option to underline content
     */
    withUnderline?: boolean;
}

interface IWYSIWYGProps {
    /**
     * The maximum number of characters allowed in the editor's content
     */
    characterLimit?: number;
    /**
     * Classes to be applied to wrapper element
     */
    className?: string;
    /**
     * Configuration for the config bar
     */
    decorationConfig?: IDecorationConfig;
    /**
     * Default content to render in the editor
     */
    defaultContent?: string;
    /**
     * Classes to be applied to the editor
     */
    editorClassName?: string;
    /**
     * Callback to execute on submission
     */
    onChange: (value: string) => void;
    /**
     * Placeholder to display in the wysiwig
     */
    placeholder?: string;
}

const WYSIWYG: FC<IWYSIWYGProps> = ({
    characterLimit = 500,
    className = "",
    decorationConfig = {},
    defaultContent = "",
    editorClassName = "",
    onChange = () => {},
    placeholder = ""
}) => {
    const decoratorBarClasses = new ClassNames("grid grid-cols-12").add(
        decorationConfig.className || ""
    );
    const decoratorOptionsRowClasses = new ClassNames(
        decorationConfig?.decoratorActionsContent ? "col-span-10" : "col-span-12"
    ).add(decorationConfig?.decoratorOptionsRowClassName || "");
    const decoratorActionsClasses = new ClassNames("flex items-center justify-end col-span-2");
    const editor = useEditor({
        content: defaultContent,
        editable: true,
        editorProps: {
            attributes: {
                class: editorClassName
            }
        },
        enableInputRules: false,
        enablePasteRules: false,
        extensions: [
            StarterKit,
            CharacterCount.configure({ limit: characterLimit }),
            Placeholder.configure({ placeholder }),
            Underline
        ],
        onUpdate: ({ editor }) => onChange(editor.getHTML())
    });

    useEffect(() => {
        return () => {
            if (editor) editor.destroy();
        };
    }, []);

    return (
        <div className={className}>
            {editor && (
                <>
                    <EditorContent editor={editor} />
                    {Object.keys(decorationConfig).length > 0 && (
                        <div className={decoratorBarClasses.list()}>
                            <div className={decoratorOptionsRowClasses.list()}>
                                {decorationConfig.withBold && (
                                    <Button
                                        className={`${
                                            decorationConfig.decoratorItemClassName || ""
                                        } ${
                                            editor.isActive("bold")
                                                ? "text-success-3"
                                                : "text-white"
                                        }`}
                                        borderRadius="none"
                                        onClick={() => editor.chain().toggleBold().focus().run()}
                                        size="xs"
                                        style="none"
                                    >
                                        <BoldIcon className="w-6 h-6" />
                                    </Button>
                                )}
                                {decorationConfig.withItalic && (
                                    <Button
                                        className={`${
                                            decorationConfig.decoratorItemClassName || ""
                                        } ${
                                            editor.isActive("italic")
                                                ? "text-success-3"
                                                : "text-white"
                                        }`}
                                        borderRadius="none"
                                        onClick={() => editor.chain().toggleItalic().focus().run()}
                                        size="xs"
                                        style="none"
                                    >
                                        <ItalicIcon className="w-6 h-6" />
                                    </Button>
                                )}
                                {decorationConfig.withStrikethrough && (
                                    <Button
                                        className={`${
                                            decorationConfig.decoratorItemClassName || ""
                                        } ${
                                            editor.isActive("strike")
                                                ? "text-success-3"
                                                : "text-white"
                                        }`}
                                        borderRadius="none"
                                        onClick={() => editor.chain().toggleStrike().focus().run()}
                                        size="xs"
                                        style="none"
                                    >
                                        <StrikeThroughIcon className="w-6 h-6" />
                                    </Button>
                                )}
                                {decorationConfig.withUnderline && (
                                    <Button
                                        className={`${
                                            decorationConfig.decoratorItemClassName || ""
                                        } ${
                                            editor.isActive("underline")
                                                ? "text-success-3"
                                                : "text-white"
                                        }`}
                                        borderRadius="none"
                                        onClick={() =>
                                            editor.chain().toggleUnderline().focus().run()
                                        }
                                        size="xs"
                                        style="none"
                                    >
                                        <UnderlineIcon className="w-6 h-6" />
                                    </Button>
                                )}
                            </div>
                            {decorationConfig?.decoratorActionsContent && (
                                <div className={decoratorActionsClasses.list()}>
                                    {decorationConfig.decoratorActionsContent}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default WYSIWYG;
export { WYSIWYG };
