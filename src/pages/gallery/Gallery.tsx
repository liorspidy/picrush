import useGallery from "@/hooks/useGallery";
import classes from "./Gallery.module.scss";
import GalleryDialog from "@/components/galleryDialog/GalleryDialog";
import Loader from "@/components/loader/Loader";
import ImageOverlay from "@/components/imageOverlay/imageOverlay";
import { useCallback, useMemo } from "react";
import type { IPic } from "@/interfaces/pic.interface";
import GalleryHeaderActions from "@/components/galleryHeaderActions/GalleryHeaderActions";
import GallerySubActions from "@/components/gallerySubActions.tsx/GallerySubActions";
import GalleryBottomActions from "@/components/galleryBottomActions/GalleryBottomActions";
import { useAppContext } from "@/store/useAppContext";
import GalleryImageItem from "@/components/galleryImageItem/GalleryImageItem";

const Gallery = () => {
    const LONG_PRESS_DURATION = 500;
    const {
        filteredImages,
        currentPicture,
        setCurrentPicture,
        currentPictureIndex,
        setCurrentPictureIndex,
        sortingMethod,
        setSortingMethod,
        isAddSwipeAnimation,
        setIsAddSwipeAnimation,
        isPopupOpen,
        setIsPopupOpen,
        isRemoving,
        setIsRemoving,
        allowRemoving,
        isUserBased,
        setIsUserBased,
        isPicking,
        setIsPicking,
        pickedImages,
        setPickedImages,
        pictureHandler,
        pickImageHandler,
        removeImagesFromFirebase,
        isLoading,
        setIsLoading,
    } = useGallery();
    const { language } = useAppContext();
    const isHebrew = language === "HE";

    const closeRemovingPopup = useCallback(() => {
        setIsPopupOpen(false);
        setIsRemoving(false);
    }, [setIsPopupOpen, setIsRemoving]);

    const confirmRemoveAll = useCallback(() => {
        removeImagesFromFirebase(pickedImages);
        closeRemovingPopup();
        setIsPicking(false);
        setPickedImages([]);
    }, [
        pickedImages,
        removeImagesFromFirebase,
        closeRemovingPopup,
        setIsPicking,
        setPickedImages,
    ]);

    const cancelRemoveAll = useCallback(() => {
        closeRemovingPopup();
    }, [closeRemovingPopup]);

    const deselectAllHandler = useCallback(() => {
        setIsPicking(false);
        setPickedImages([]);
    }, [setIsPicking, setPickedImages]);

    // the images grid
    const imagesGrid = useMemo(() => {
        return filteredImages.map((img: IPic, index) => {
            let longPressTimer: NodeJS.Timeout;

            const handleTouchStart = () => {
                longPressTimer = setTimeout(() => {
                    setIsPicking(true);
                    pickImageHandler(img);
                }, LONG_PRESS_DURATION);
            };

            const handleTouchEnd = () => {
                clearTimeout(longPressTimer);
            };

            const isPicked = pickedImages.some((pic) => pic === img);

            return (
                <GalleryImageItem
                    key={`${img.userId}-${index}`}
                    img={img}
                    index={index}
                    isPicked={isPicked}
                    isPicking={isPicking}
                    onPictureClick={pictureHandler}
                    onLongPressStart={handleTouchStart}
                    onLongPressEnd={handleTouchEnd}
                />
            );
        });
    }, [
        filteredImages,
        pickedImages,
        pictureHandler,
        pickImageHandler,
        setIsPicking,
        isPicking,
    ]);

    return (
        <div className={classes.gallery}>
            {isLoading && <Loader />}
            {isPopupOpen && pickedImages.length > 0 && (
                <GalleryDialog
                    message={
                        isHebrew
                            ? "האם אתה בטוח שתרצה למחוק את כל התמונות שבחרת?"
                            : "Are you sure you want to delete all these images?"
                    }
                    setIsPopupOpen={setIsPopupOpen}
                    confirmAction={confirmRemoveAll}
                    cancelAction={cancelRemoveAll}
                />
            )}
            {currentPicture && (
                <ImageOverlay
                    filteredImages={filteredImages}
                    currentPicture={currentPicture}
                    setCurrentPicture={setCurrentPicture}
                    currentPictureIndex={currentPictureIndex}
                    setCurrentPictureIndex={setCurrentPictureIndex}
                    isAddSwipeAnimation={isAddSwipeAnimation}
                    setIsAddSwipeAnimation={setIsAddSwipeAnimation}
                    isPopupOpen={isPopupOpen}
                    setIsPopupOpen={setIsPopupOpen}
                    isRemoving={isRemoving}
                    setIsRemoving={setIsRemoving}
                    removeImagesFromFirebase={removeImagesFromFirebase}
                />
            )}

            <GalleryHeaderActions
                isPicking={isPicking}
                setIsPicking={setIsPicking}
                deselectAllHandler={deselectAllHandler}
                filteredImagesLength={filteredImages.length}
            />

            <div className={classes.textWrapper}>
                <h1
                    className={classes.mainTitle}
                >{`Netanela \u00A0&\u00A0 Lior`}</h1>
                <p className={classes.mainDate}>27/01/2026</p>
            </div>

            <GallerySubActions
                sortingMethod={sortingMethod}
                setSortingMethod={setSortingMethod}
                isUserBased={isUserBased}
                setIsUserBased={setIsUserBased}
                deselectAllHandler={deselectAllHandler}
            />

            {filteredImages.length > 0 && (
                <div className={classes.imagesGrid}>{imagesGrid}</div>
            )}

            {!isLoading && filteredImages.length == 0 && (
                <div
                    className={`${classes.noData} ${isHebrew ? classes.hebrew : null}`}
                >
                    <p>
                        {isHebrew
                            ? "עדין אין כאן תמונות..."
                            : "No Images Here Yet..."}
                    </p>
                </div>
            )}

            {isPicking && (
                <GalleryBottomActions
                    allowRemoving={allowRemoving}
                    deselectAllHandler={deselectAllHandler}
                    setIsPopupOpen={setIsPopupOpen}
                    setIsRemoving={setIsRemoving}
                    pickedImages={pickedImages}
                    setIsLoading={setIsLoading}
                />
            )}
        </div>
    );
};

export default Gallery;
