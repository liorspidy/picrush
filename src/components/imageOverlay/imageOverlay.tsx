import type { IPic } from "@/interfaces/pic.interface";
import classes from "./imageOverlay.module.scss";
import closeImg from "@/assets/icons/close.svg";
import downloadImg from "@/assets/icons/download.svg";
import arrowPrevNext from "@/assets/icons/arrow-prev-next.svg";
import swiperIcon from "@/assets/icons/swipe-finger.svg";
import trashIcon from "@/assets/icons/trash.svg";
import shareIcon from "@/assets/icons/share.svg";
import { useFirebaseContext } from "@/hooks/useFirebase";
import Loader from "../loader/Loader";
import GalleryDialog from "../galleryDialog/GalleryDialog";
import { useRef } from "react";
import { shortenUrls } from "@/tools/shortenUrls";
interface ImageOverlayProps {
  filteredImages: IPic[];
  userId: string | null;
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
  userId,
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

  const closePictureHandler = () => {
    setIsRemoving(false)
    setIsPopupOpen(false);
    setCurrentPicture(null);
  };

  const setPrevImage = () => {
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
  };

  const setNextImage = () => {
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
  };

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

  const removeIsAddSwiper = () => {
    setIsAddSwipeAnimation(false);
    localStorage.setItem("swiper", "false");
  }

  const prevImageHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if(filteredImages.length > 1) {
      setPrevImage();
    }
  };

  const nextImageHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if(filteredImages.length > 1) {
      setNextImage();
    }
  };

  const removeHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsRemoving(true);
    if(!isPopupOpen){
      setIsPopupOpen(true);
    }
  }

  const acceptRemoving = () => {
    if(isRemoving && currentPicture) {
        removeImagesFromFirebase([currentPicture])
    }
    closePictureHandler()
  }

  const declineRemoving = () => {
    setIsRemoving(false);
  }

  const downloadHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!currentPicture || !currentPicture.path) {
      console.error("Missing currentPicture or path.");
      return;
    }
  
    try {
      setIsLoading(true);
      const response = await fetch(currentPicture.src);
      if (!response.ok) throw new Error("Failed to fetch image blob");

      // Create a blob URL and trigger download
      const blob = await response.blob();
      const blobURL = URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = blobURL;
      anchor.download = `image-${Date.now()}.jpg`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(blobURL);
      
    } catch (error) {
      console.error("Error downloading image:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
    const shareHandler = async () => {
      if (!currentPicture) return;
    
      setIsLoading(true);
      const shortUrls = await shortenUrls([currentPicture.src]);
    
      const message = `Here are my photos from the wedding, shared with you via Picrush 💕\n\n${shortUrls.join("\n")}`;
      const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
      setIsLoading(false);
  
      window.open(whatsappURL, "_blank");
    };

  return (
    <div className={classes.imageOverlay}>
      {isLoading && <Loader />}
      <div
        className={classes.backdrop}
        onClick={closePictureHandler}
        onTouchStart={onTouchStartHandler}
        onTouchEnd={onTouchEndHandler}
      >
        <div className={classes.actions}>
          <button
            type="button"
            className={classes.btn}
            onClick={closePictureHandler}
          >
            <img 
            className={classes.icon} 
            src={closeImg} 
            alt="close image"
            loading="lazy"
            />
          </button>

          <button
            type="button"
            className={classes.btn}
            onClick={downloadHandler}
          >
            <img
              className={classes.icon}
              src={downloadImg}
              alt="download image"
              loading="lazy"
            />
          </button>

          <button
          type="button"
          className={classes.btn}
          onClick={shareHandler}
        >
          <img
            className={classes.icon}
            src={shareIcon}
            alt="share via whatsapp"
            loading="lazy"
          />
        </button>

         {currentPicture?.userId === userId && 
         <button
            type="button"
            className={classes.btn}
            onClick={removeHandler}
          >
            <img
              className={classes.icon}
              src={trashIcon}
              alt="remove image"
              loading="lazy"
            />
          </button>}
        </div>

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
