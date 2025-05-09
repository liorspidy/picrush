import useGallery from '@/hooks/useGallery';
import classes from './Gallery.module.scss';
import GalleryDialog from '@/components/galleryDialog/GalleryDialog';
import Loader from '@/components/loader/Loader';
import ImageOverlay from '@/components/imageOverlay/imageOverlay';
import { useMemo } from 'react';
import checkmarkIcon from '@/assets/icons/checkmark.svg';
import type { IPic } from '@/interfaces/pic.interface';
import GalleryHeaderActions from '@/components/galleryHeaderActions/GalleryHeaderActions';
import GallerySubActions from '@/components/gallerySubActions.tsx/GallerySubActions';
import GalleryBottomActions from '@/components/galleryBottomActions/GalleryBottomActions';

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
    userId
  } = useGallery();

  const closeRemovingPopup = () => {
    setIsPopupOpen(false);
    setIsRemoving(false);
  };

  const confirmRemoveAll = () => {
    removeImagesFromFirebase(pickedImages);
    closeRemovingPopup();
    setIsPicking(false);
    setPickedImages([]);
  };

  const cancelRemoveAll = () => {
    closeRemovingPopup();
  };

  const deselectAllHandler = () => {
    setIsPicking(false);
    setPickedImages([]);
  };
  
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
        <div 
          key={`${img.userId}-${index}`} 
          className={`${classes.imageBtnWrapper} ${isPicked ? classes.picked : ''}`} 
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchEnd}
        >
          <div className={classes.isPicked} role="checkbox" aria-label="is picked">
            {isPicked && <img className={classes.checkmark} src={checkmarkIcon} alt="checkmark" />}
          </div>
  
          <button
            type="button"
            className={classes.imageBtn}
            onClick={() => pictureHandler(img)}
            onContextMenu={(e) => e.preventDefault()} // prevent mobile image menu
          >
            <img
              className={classes.image}
              src={`${img.src}&blur=true`}
              alt="image"
              loading="lazy"
              style={{
                filter: "blur(10px)",
                transition: "filter 0.3s ease",
                WebkitTouchCallout: "none",
                userSelect: "none",
              }}
              onLoad={(e) => {
                e.currentTarget.style.filter = "none";
              }}
            />
          </button>
        </div>
      );
    });
  }, [filteredImages, pickedImages, pictureHandler, pickImageHandler, setIsPicking]);

  return (
    <div className={classes.gallery}>
      {isLoading && <Loader />}
      {isPopupOpen && pickedImages.length > 0 && 
        <GalleryDialog 
          message={"Are you sure you want to delete all these images?"} 
          setIsPopupOpen={setIsPopupOpen} 
          confirmAction={confirmRemoveAll} 
          cancelAction={cancelRemoveAll}      
        />
      }
      {currentPicture && (
        <ImageOverlay
          filteredImages={filteredImages}
          userId={userId}
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

      <GalleryHeaderActions />

      <div className={classes.textWrapper}>
        <h1 className={classes.mainTitle}>{`Netanela \u00A0&\u00A0 Lior`}</h1>
        <p className={classes.mainDate}>02/02/2026</p>
      </div>

      <GallerySubActions 
          sortingMethod={sortingMethod}
          setSortingMethod={setSortingMethod}
          isUserBased={isUserBased}
          setIsUserBased={setIsUserBased}
          deselectAllHandler={deselectAllHandler}
      />

      {filteredImages.length > 0 && (
        <div className={`${classes.imagesGrid} ${pickedImages.length > 0 ? classes.picking : null}`}>
          {imagesGrid}
        </div>
      )}

      {filteredImages.length == 0 && (
        <div className={classes.noData}>
          <p>No Images Here Yet...</p>
        </div>
      )}

      {isPicking && 
        <GalleryBottomActions 
        allowRemoving={allowRemoving}
        deselectAllHandler={deselectAllHandler} 
        setIsPopupOpen={setIsPopupOpen} 
        setIsRemoving={setIsRemoving}  
        />
        }
    </div>
  );
};

export default Gallery;
