import { FC } from "react";
import { ClassNames } from "@44north/classnames";

interface IPostProps {
    /**
     * Classes to be applied to the wrapper element
     */
    className?: string | ClassNames;
    /**
     * The post to display
     */
    post: IPostRecord;
}

const Post: FC<IPostProps> = ({ className = "", post }) => {
    const wrapperClasses = new ClassNames("relative").add(className);
    const { album } = post;

    return (
        <div className={wrapperClasses.list()}>
            <img alt={album?.name} className="object-fill" src={album?.images[0]?.url} />
        </div>
    );
};

export default Post;
export { Post };
