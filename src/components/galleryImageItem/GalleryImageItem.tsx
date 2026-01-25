import type { IPic } from "@/interfaces/pic.interface";
import classes from "./GalleryImageItem.module.scss";
import checkmarkIcon from "@/assets/icons/checkmark.svg";

interface GalleryImageItemProps {
    img: IPic;
    index: number;
    isPicked: boolean;
    isPicking: boolean;
    onPictureClick: (img: IPic) => void;
    onLongPressStart: () => void;
    onLongPressEnd: () => void;
}

const GalleryImageItem = ({
    img,
    index,
    isPicked,
    isPicking,
    onPictureClick,
    onLongPressStart,
    onLongPressEnd,
}: GalleryImageItemProps) => {
    const wrapperClasses = [
        classes.imageBtnWrapper,
        isPicked ? classes.picked : "",
        isPicking ? classes.picking : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div
            key={`${img.userId}-${index}`}
            className={wrapperClasses}
            onTouchStart={onLongPressStart}
            onTouchEnd={onLongPressEnd}
            onTouchMove={onLongPressEnd}
        >
            <div
                className={classes.isPicked}
                role="checkbox"
                aria-label="is picked"
            >
                {isPicked && (
                    <img
                        className={classes.checkmark}
                        src={checkmarkIcon}
                        alt="checkmark"
                    />
                )}
            </div>

            <button
                type="button"
                className={classes.imageBtn}
                onClick={() => onPictureClick(img)}
                onContextMenu={(e) => e.preventDefault()}
            >
                <img
                    className={classes.image}
                    src={`${img.src}&blur=true`}
                    alt="image"
                    loading="lazy"
                    style={{
                        WebkitTouchCallout: "none",
                        userSelect: "none",
                    }}
                    onLoad={(e) => {
                        e.currentTarget.classList.add(classes.loaded);
                    }}
                />
            </button>
        </div>
    );
};

export default GalleryImageItem;
