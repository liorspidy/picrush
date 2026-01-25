import { useEffect, useState, useRef, useCallback } from "react";
import classes from "./BgImages.module.scss";
import { useFirebaseContext } from "@/hooks/useFirebase";

// Preload a single image and return a promise
const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = src;
    });
};

const BgImages = () => {
    const { bgImages } = useFirebaseContext();
    const [currentImage, setCurrentImage] = useState<string>(bgImages[0]);
    const [previousImage, setPreviousImage] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isInitialImageLoaded, setIsInitialImageLoaded] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const preloadedImagesRef = useRef<Set<string>>(new Set());

    // Preload all images on mount
    useEffect(() => {
        const preloadAllImages = async () => {
            // First, load the initial image
            try {
                await preloadImage(bgImages[0]);
                preloadedImagesRef.current.add(bgImages[0]);
                setIsInitialImageLoaded(true);
            } catch (error) {
                console.error("Failed to load initial image:", error);
                setIsInitialImageLoaded(true); // Show anyway on error
            }

            // Then preload the rest in the background
            for (let i = 1; i < bgImages.length; i++) {
                try {
                    await preloadImage(bgImages[i]);
                    preloadedImagesRef.current.add(bgImages[i]);
                } catch (error) {
                    console.error(`Failed to preload image ${i}:`, error);
                }
            }
        };

        preloadAllImages();
    }, [bgImages]);

    // Preload the next image before transitioning
    const preloadNextImage = useCallback(
        (nextIndex: number) => {
            const nextSrc = bgImages[nextIndex];
            if (!preloadedImagesRef.current.has(nextSrc)) {
                preloadImage(nextSrc)
                    .then(() => {
                        preloadedImagesRef.current.add(nextSrc);
                    })
                    .catch(console.error);
            }
        },
        [bgImages],
    );

    useEffect(() => {
        if (!isInitialImageLoaded) return;

        const interval = setInterval(() => {
            setCurrentImage((prevImage: string) => {
                setPreviousImage(prevImage);
                setIsTransitioning(true);

                const currentIndex = bgImages.indexOf(prevImage);
                const nextIndex = (currentIndex + 1) % bgImages.length;

                // Preload the image after next
                const afterNextIndex = (nextIndex + 1) % bgImages.length;
                preloadNextImage(afterNextIndex);

                return bgImages[nextIndex];
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [bgImages, isInitialImageLoaded, preloadNextImage]);

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

    // Don't render until initial image is loaded
    if (!isInitialImageLoaded) {
        return <div className={classes.bgImageWrapper} />;
    }

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
