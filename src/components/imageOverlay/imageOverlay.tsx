import type { IPic } from "@/interfaces/pic.interface";
import classes from "./imageOverlay.module.scss";
import closeImg from "@/assets/icons/close.svg";
import downloadImg from "@/assets/icons/download.svg";
import arrowPrevNext from "@/assets/icons/arrow-prev-next.svg";
import swiperIcon from "@/assets/icons/swipe-finger.svg";
import { useState } from "react";
import { useFirebaseContext } from "@/hooks/useFirebase";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

interface ImageOverlayProps {
  images: IPic[];
  currentPicture: IPic | null;
  setCurrentPicture: React.Dispatch<React.SetStateAction<IPic | null>>;
  currentPictureIndex: number | null;
  setCurrentPictureIndex: React.Dispatch<React.SetStateAction<number | null>>;
  touchStartX: React.RefObject<number>;
  isAddSwipeAnimation: boolean;
  setIsAddSwipeAnimation: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageOverlay = ({
  images,
  currentPicture,
  setCurrentPicture,
  currentPictureIndex,
  setCurrentPictureIndex,
  touchStartX,
  isAddSwipeAnimation,
  setIsAddSwipeAnimation,
}: ImageOverlayProps) => {
  const [test, setTest] = useState<string>('');
  const { storage } = useFirebaseContext();

  const closePictureHandler = () => {
    setCurrentPicture(null);
  };

  const setPrevImage = () => {
    if (currentPictureIndex !== null) {
      if (currentPictureIndex > 0) {
        setCurrentPicture(images[currentPictureIndex - 1]);
        setCurrentPictureIndex(currentPictureIndex - 1);
      } else if (currentPictureIndex === 0) {
        setCurrentPicture(images[images.length - 1]);
        setCurrentPictureIndex(images.length - 1);
      }
    }
  };

  const setNextImage = () => {
    if (currentPictureIndex !== null) {
      if (currentPictureIndex < images.length - 1) {
        setCurrentPicture(images[currentPictureIndex + 1]);
        setCurrentPictureIndex(currentPictureIndex + 1);
      } else if (currentPictureIndex === images.length - 1) {
        setCurrentPicture(images[0]);
        setCurrentPictureIndex(0);
      }
    }
  };

  const onTouchStartHandler = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const onTouchEndHandler = (event: React.TouchEvent) => {
    const touchEndX = event.changedTouches[0].clientX;
    const touchDifference = touchStartX.current - touchEndX;

    if (currentPictureIndex !== null) {
      if (touchDifference > 50) {
        setPrevImage();
      } else if (touchDifference < -50) {
        setNextImage();
      }
    }

    setIsAddSwipeAnimation(false);
    localStorage.setItem("swiper", "false");
  };

  const prevImageHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setPrevImage();
  };

  const nextImageHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setNextImage();
  };

  const downloadHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!currentPicture || !currentPicture.path) {
      console.error("Missing currentPicture or path.");
      return;
    }

    try {
      const fileRef = ref(storage, currentPicture.path);
      const url = await getDownloadURL(fileRef);
  
      // Create a temporary anchor element
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `image-${Date.now()}.jpg`;  
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
  
      setTest("Download triggered.");
    } catch (error) {
      console.error("Error getting download URL:", error);
      setTest(String(error));
    }
  };

  return (
    <div className={classes.imageOverlay}>
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
            <img className={classes.icon} src={closeImg} alt="close image" />
          </button>
          {/* <pre style={{ position: "relative", color: "black", zIndex: "10" }}>
            {test}
          </pre> */}
          <button
            type="button"
            className={classes.btn}
            onClick={downloadHandler}
          >
            <img
              className={classes.icon}
              src={downloadImg}
              alt="download image"
            />
          </button>
        </div>

        <div
          className={classes.currentPicWrapper}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {isAddSwipeAnimation && (
            <div className={classes.swiperHelperWrapper}>
              <img
                className={classes.icon}
                src={swiperIcon}
                alt="swiper icon helper"
              />
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

        {/* 🔽 Hidden download anchor for programmatic click */}
        <a id="myimg" style={{ display: "none" }} />
      </div>
    </div>
  );
};

export default ImageOverlay;
