import { FC } from "react";
import { ClassNames } from "@44north/classnames";
import { ChatIcon, HeartIcon } from "@heroicons/react/solid";

interface IPostProps {
    /**
     * Classes to be applied to the wrapper element
     */
    className?: string | ClassNames;
    /**
     * Callback to execute on click
     */
    onClick?: () => void;
    /**
     * The post to display
     */
    post: IPostRecord;
}

const Post: FC<IPostProps> = ({ className = "", onClick = () => {}, post }) => {
    const wrapperClasses = new ClassNames("relative group cursor-pointer").add(className);
    const { album, commentCount = 0, likeCount = 0 } = post;

    return (
        <div className={wrapperClasses.list()} onClick={onClick}>
            <div className="absolute inset-0 flex items-center justify-center w-full h-full group-hover:z-10 group-hover:bg-gray-3 group-hover:bg-opacity-70 group-hover:backdrop-filter group-hover:backdrop-blur-sm">
                <div className="justify-center hidden w-full space-x-8 text-3xl font-bold text-white group-hover:flex">
                    <span className="flex items-center space-x-1">
                        <HeartIcon className="w-10 h-10" />
                        <span>{likeCount}</span>
                    </span>
                    <span className="flex items-center space-x-1 font-bold">
                        <ChatIcon className="w-10 h-10" />
                        <span>{commentCount}</span>
                    </span>
                </div>
            </div>
            <img alt={album?.name} className="object-fill" src={album?.images[0]?.url} />
        </div>
    );
};

export default Post;
export { Post };
