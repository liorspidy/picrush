import { useEffect, useState, useRef } from "react";
import classes from "./BgImages.module.scss";
import { useFirebaseContext } from "@/hooks/useFirebase";

const BgImages = () => {
    const { bgImages } = useFirebaseContext();
    const [currentImage, setCurrentImage] = useState<string>(bgImages[0]);
    const [previousImage, setPreviousImage] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prevImage: string) => {
                setPreviousImage(prevImage);
                setIsTransitioning(true);

                const currentIndex = bgImages.indexOf(prevImage);
                const nextIndex = (currentIndex + 1) % bgImages.length;
                return bgImages[nextIndex];
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [bgImages]);

    useEffect(() => {
        if (isTransitioning) {
            timeoutRef.current = setTimeout(() => {
                setIsTransitioning(false);
                setPreviousImage(null);
            }, 1500); // Match animation duration
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isTransitioning]);

    return (
        <div className={classes.bgImageWrapper}>
            {/* Previous image layer (fades out) */}
            {previousImage && isTransitioning && (
                <div
                    className={`${classes.imageLayer} ${classes.fadeOut}`}
                    style={
                        {
                            "--bgImage": `url(${previousImage})`,
                        } as React.CSSProperties
                    }
                >
                    <img
                        className={classes.mainImage}
                        src={previousImage}
                        alt="background image"
                    />
                </div>
            )}

            {/* Current image layer (fades in) */}
            <div
                key={currentImage}
                className={`${classes.imageLayer} ${isTransitioning ? classes.fadeIn : ""}`}
                style={
                    {
                        "--bgImage": `url(${currentImage})`,
                    } as React.CSSProperties
                }
            >
                <img
                    className={classes.mainImage}
                    src={currentImage}
                    alt="background image"
                />
            </div>
        </div>
    );
};

export default BgImages;
