import { useCallback, useEffect, useRef, useState } from "react";
import classes from "./Gallery.module.scss";
import arrowUp from '@/assets/icons/arrow.svg';
import arrowDown from '@/assets/icons/arrow-down.svg';
import arrowRight from '@/assets/icons/arrow-right.svg';
import refreshIcon from '@/assets/icons/refresh.svg';
import type { IPic } from '@/interfaces/pic.interface';
import { useFirebaseContext } from "@/hooks/useFirebase";
import Loader from "@/components/loader/Loader";
import { collection, collectionGroup, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import ImageOverlay  from '../../components/imageOverlay/imageOverlay';

const Gallery = () => {
  const { db, userId , isLoading, setIsLoading} = useFirebaseContext();
  const [images, setImages] = useState<IPic[]>([]);
  const [filteredImages , setFilteredImages] = useState<IPic[]>([]);
  const [currentPicture ,setCurrentPicture] = useState<IPic | null>(null);
  const [currentPictureIndex , setCurrentPictureIndex] = useState<number | null>(null);
  const [sortingMethod , setSortingMethod] = useState<number>(1);
  const [isAddSwipeAnimation, setIsAddSwipeAnimation] = useState<boolean>(false);
  const [isUserBased, setIsUserBased] = useState<boolean>(localStorage.getItem('showme') === 'true');
  const touchStartX = useRef<number>(0);

  // setups the swiper icon and isUserBased in localstorage
  useEffect(() => {
    const swiper = localStorage.getItem('swiper');
    if (swiper) {
      setIsAddSwipeAnimation(swiper === 'true');
    } else {
      localStorage.setItem('swiper','true');
      setIsAddSwipeAnimation(true);
    }

    setIsUserBased(localStorage.getItem('showme') === 'true');
  } ,[])

  // gets the images form firestore
  const fetchImages = useCallback(async () => {
    try {
      setIsLoading(true);
      const imagesArray: IPic[] = [];
  
      if (isUserBased) {
        // Current user's images only
        const querySnapshot = await getDocs(collection(db, `images/${userId}/userImages`));
        querySnapshot.forEach(doc => {
          const data = doc.data();
          imagesArray.push({
            userId: data.userId || userId,
            src: data.src,
            path: data.path,
            uploadTime: new Date(data.uploadTime?.seconds * 1000 || Date.now()),
            width: data.width || 0,
            height: data.height || 0,
          });
        });
  
      } else {
      // Fetch from all users using collectionGroup query
        const querySnapshot = await getDocs(collectionGroup(db, 'userImages'));
        querySnapshot.forEach(doc => {
        const data = doc.data();
        imagesArray.push({
          userId: data.userId || 'unknown',
          src: data.src,
          path: data.path,
          uploadTime: new Date(data.uploadTime?.seconds * 1000 || Date.now()),
          width: data.width || 0,
          height: data.height || 0,
        });
      });
      }
  
      setImages(imagesArray);
    } catch (error) {
      console.error("❌ Error fetching Firestore images:", error);
    } finally {
      setIsLoading(false);
    }
  }, [db, isUserBased, setIsLoading, userId]);
  
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // picks a picture on click
  const pictureHandler = (picture: IPic) => {
    setCurrentPicture(picture);
    const imageIndex = images.findIndex((img) => img === picture);
    setCurrentPictureIndex(imageIndex)
  }
  
  // switchs the sorting method
  const switchSortingHandler = () => {
    setSortingMethod((prev) => (prev === 1 ? 0 : 1))
  }

  // switchs the showing method
  const switchShowMeHandler = () => {
    localStorage.setItem('showme', (!isUserBased).toString());
    setIsUserBased((prev) => prev = !prev);
  }

  // sorting method
  useEffect(() => {
    if(images) {
      const sortedImages = [...images].sort((a, b) => {
        const aTime = a.uploadTime instanceof Date ? a.uploadTime.getTime() : 0;
        const bTime = b.uploadTime instanceof Date ? b.uploadTime.getTime() : 0;
        return sortingMethod === 1 ? bTime - aTime : aTime - bTime;
      });
      setFilteredImages(sortedImages);
    }
  },[sortingMethod,images])

  // avoiding scrolling while showing a pic
  useEffect(() => {
    if(currentPicture) {
      const bodyRef = document.body;
      bodyRef.style.overflow = 'hidden';

      return () => {
        bodyRef.style.overflow = 'auto';
      };
    }
  },[currentPicture])

  // the images grid
  const imagesGrid = filteredImages.map((img: IPic, index) => {
    return (
      <button
        type="button"
        key={`${img.userId}-${index}`}
        className={classes.imageBtn}
        onClick={() => pictureHandler(img)}
      >
        <img
          className={classes.image}
          src={`${img.src}&blur=true`}
          alt="image"
          loading="lazy"
          style={{ filter: "blur(10px)", transition: "filter 0.3s ease" }}
          onLoad={(e) => {
            e.currentTarget.style.filter = "none";
          }}
        />
      </button>
    );
  });

  // refreshing method
  const refreshHandler = () => {
    window.location.reload();
  }

  return (
    <div className={classes.gallery}>
      {isLoading && <Loader />}
      {currentPicture && (
        <ImageOverlay
          images={images}
          currentPicture={currentPicture}
          setCurrentPicture={setCurrentPicture}
          currentPictureIndex={currentPictureIndex}
          setCurrentPictureIndex={setCurrentPictureIndex}
          touchStartX={touchStartX}
          isAddSwipeAnimation={isAddSwipeAnimation}
          setIsAddSwipeAnimation={setIsAddSwipeAnimation}
        />
      )}

      <div className={classes.headerActions}>
        <button
          className={`${classes.btn} ${classes.refresh}`}
          type="button"
          onClick={refreshHandler}
        >
          <img className={classes.icon} src={refreshIcon} alt="back" loading="lazy" />
        </button>

        <Link to={"/"} className={`${classes.btn} ${classes.back}`}>
          <img className={classes.icon} src={arrowRight} alt="back" loading="lazy"/>
        </Link>
      </div>

      <div className={classes.textWrapper}>
        <h1 className={classes.mainTitle}>{`Netanela \u00A0&\u00A0 Lior`}</h1>
        <p className={classes.mainDate}>02/02/2026</p>
      </div>

      <div className={classes.subActions}>
        <button
          type="button"
          className={classes.sortBy}
          onClick={switchSortingHandler}
        >
          <p className={classes.text}>sort by:</p>
          <div className={classes.sortMethod}>
            <img
              className={classes.icon}
              src={sortingMethod === 1 ? arrowDown : arrowUp}
              alt="sorting method"
              loading="lazy"
              aria-label={sortingMethod === 1 ? "descending" : "ascending"}
            />
          </div>
        </button>

        <button
          type="button"
          className={classes.showMe}
          onClick={switchShowMeHandler}
        >
          <p className={classes.text}>show me:</p>
          <span className={classes.showMethod}>
            {isUserBased ? "only me" : "all"}
          </span>
        </button>
      </div>

      {filteredImages.length > 0 && (
        <div className={classes.imagesGrid}>{imagesGrid}</div>
      )}

      {filteredImages.length == 0 && (
        <div className={classes.noData}>
          <p>No Images Here Yet...</p>
        </div>
      )}
    </div>
  );
};

export default Gallery;
