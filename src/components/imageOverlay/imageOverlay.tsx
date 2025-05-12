import type { IPic } from "@/interfaces/pic.interface";
import classes from "./imageOverlay.module.scss";
import arrowPrevNext from "@/assets/icons/arrow-prev-next.svg";
import swiperIcon from "@/assets/icons/swipe-finger.svg";
import { useFirebaseContext } from "@/hooks/useFirebase";
import Loader from "../loader/Loader";
import GalleryDialog from "../galleryDialog/GalleryDialog";
import { useCallback, useRef } from "react";
import ImageOverlayActions from "../imageOverlayActions/ImageOverlayActions";

interface ImageOverlayProps {
  filteredImages: IPic[];
  currentPicture: IPic | null;
  setCurrentPicture: React.Dispatch<React.SetStateAction<IPic | null>>;
  currentPictureIndex: number | null;
  setCurrentPictureIndex: React.Dispatch<React.SetStateAction<number | null>>;
  isAddSwipeAnimation: boolean;
  setIsAddSwipeAnimation: React.Dispatch<React.SetStateAction<boolean>>;
  isPopupOpen: boolean;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isRemoving: boolean;
  setIsRemoving: React.Dispatch<React.SetStateAction<boolean>>;
  removeImagesFromFirebase: (pictures: IPic[]) => void;
}

const ImageOverlay = ({
  filteredImages,
  currentPicture,
  setCurrentPicture,
  currentPictureIndex,
  setCurrentPictureIndex,
  isAddSwipeAnimation,
  setIsAddSwipeAnimation,
  isPopupOpen,
  setIsPopupOpen,
  isRemoving,
  setIsRemoving,
  removeImagesFromFirebase
}: ImageOverlayProps) => {  
  const { isLoading , setIsLoading} = useFirebaseContext();
  const touchStartX = useRef<number>(0);

  const closePictureHandler = useCallback(() => {
    setIsRemoving(false)
    setIsPopupOpen(false);
    setCurrentPicture(null);
  },[setCurrentPicture, setIsPopupOpen, setIsRemoving]);

  const setPrevImage = useCallback(() => {
    if (currentPictureIndex !== null) {
      setIsLoading(true);
      if (currentPictureIndex > 0) {
        setCurrentPicture(filteredImages[currentPictureIndex - 1]);
        setCurrentPictureIndex(currentPictureIndex - 1);
      } else if (currentPictureIndex === 0) {
        setCurrentPicture(filteredImages[filteredImages.length - 1]);
        setCurrentPictureIndex(filteredImages.length - 1);
      }
    }
  },[currentPictureIndex, filteredImages, setCurrentPicture, setCurrentPictureIndex, setIsLoading]);

  const setNextImage = useCallback(() => {
    if (currentPictureIndex !== null) {
      setIsLoading(true);
      if (currentPictureIndex < filteredImages.length - 1) {
        setCurrentPicture(filteredImages[currentPictureIndex + 1]);
        setCurrentPictureIndex(currentPictureIndex + 1);
      } else if (currentPictureIndex === filteredImages.length - 1) {
        setCurrentPicture(filteredImages[0]);
        setCurrentPictureIndex(0);
      }
    }
  },[currentPictureIndex, filteredImages, setCurrentPicture, setCurrentPictureIndex, setIsLoading]);

  const onTouchStartHandler = (event: React.TouchEvent) => {
    if(filteredImages.length > 1) {
      touchStartX.current = event.touches[0].clientX;
    }
  };

  const onTouchEndHandler = (event: React.TouchEvent) => {
    if(filteredImages.length > 1) {
      const touchEndX = event.changedTouches[0].clientX;
      const touchDifference = touchStartX.current - touchEndX;
  
      if (currentPictureIndex !== null) {
        if (touchDifference > 50) {
          setPrevImage();
        } else if (touchDifference < -50) {
          setNextImage();
        }
      }
  
      removeIsAddSwiper();
    }
  };

  const removeIsAddSwiper = useCallback(() => {
    setIsAddSwipeAnimation(false);
    localStorage.setItem("swiper", "false");
  },[setIsAddSwipeAnimation])

  const prevImageHandler = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if(filteredImages.length > 1) {
      setPrevImage();
    }
  },[filteredImages.length, setPrevImage]);

  const nextImageHandler = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if(filteredImages.length > 1) {
      setNextImage();
    }
  },[filteredImages.length, setNextImage]);

  const acceptRemoving = useCallback(() => {
    if(isRemoving && currentPicture) {
        removeImagesFromFirebase([currentPicture])
    }
    closePictureHandler()
  },[closePictureHandler, currentPicture, isRemoving, removeImagesFromFirebase])

  const declineRemoving = () => {
    setIsRemoving(false);
  }

  return (
    <div className={classes.imageOverlay}>
      {isLoading && <Loader />}
      <div
        className={classes.backdrop}
        onClick={closePictureHandler}
        onTouchStart={onTouchStartHandler}
        onTouchEnd={onTouchEndHandler}
      >

      <ImageOverlayActions 
        closePictureHandler={closePictureHandler}
        currentPicture={currentPicture}
        isPopupOpen={isPopupOpen}
        setIsPopupOpen={setIsPopupOpen} 
        setIsRemoving={setIsRemoving}      
      />

        <div
          className={classes.currentPicWrapper}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {isAddSwipeAnimation && (
            <div className={classes.swiperHelperWrapper}>
              <div className={classes.iconWeapper}>
                <img
                  className={classes.icon}
                  src={swiperIcon}
                  alt="swiper icon helper"
                  loading="lazy"
                />
              </div>
              <p className={classes.info}>
                Swipe right or left to see more
              </p>
            </div>
          )}

          <img
            className={classes.currentPic}
            src={`${currentPicture?.src}&blur=true`}
            alt={currentPicture?.src}
            loading="lazy"
            style={{ filter: "blur(10px)", transition: "filter 0.3s ease" }}
            onLoad={(e) => {
              e.currentTarget.style.filter = "none";
              setIsLoading(false)
            }}
            onError={(error) => {
              console.error('Error rendering the image:',error)
              setIsLoading(false);
            }}
          />
        </div>

        <button
          type="button"
          className={`${classes.btn} ${classes.prev}`}
          onClick={prevImageHandler}
        >
          <img
            className={classes.icon}
            src={arrowPrevNext}
            alt="previous image"
          />
        </button>

        <button
          type="button"
          className={`${classes.btn} ${classes.next}`}
          onClick={nextImageHandler}
        >
          <img
            className={classes.icon}
            src={arrowPrevNext}
            alt="next image"
            style={{ rotate: "180deg" }}
          />
        </button>
      </div>

      {isPopupOpen && <GalleryDialog 
        message="Are you sure you want to delete this image?" 
        confirmAction={acceptRemoving}
        cancelAction={declineRemoving}
        setIsPopupOpen={setIsPopupOpen}
        />}
    </div>
  );
};

export default ImageOverlay;
