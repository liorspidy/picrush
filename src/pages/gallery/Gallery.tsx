import { useCallback, useEffect, useRef, useState, type SetStateAction } from "react";
import classes from "./Gallery.module.scss";
import type { IPic } from '@/interfaces/pic.interface';
import { useFirebaseContext } from "@/hooks/useFirebase";
import Loader from "@/components/loader/Loader";
import { collection, collectionGroup, deleteDoc, getDocs, query, where } from "firebase/firestore";
import ImageOverlay  from '../../components/imageOverlay/imageOverlay';
import GallerySubActions from "@/components/gallerySubActions.tsx/GallerySubActions";
import GalleryHeaderActions from "@/components/galleryHeaderActions/GalleryHeaderActions";
import { deleteObject, ref } from "firebase/storage";
import checkmarkIcon from '@/assets/icons/checkmark.svg';
import GalleryDialog from "@/components/galleryDialog/GalleryDialog";

const Gallery = () => {
  const { db, storage, userId , isLoading, setIsLoading, val ,setVal} = useFirebaseContext();
  const [images, setImages] = useState<IPic[]>([]);
  const [filteredImages , setFilteredImages] = useState<IPic[]>([]);
  const [currentPicture ,setCurrentPicture] = useState<IPic | null>(null);
  const [currentPictureIndex , setCurrentPictureIndex] = useState<number | null>(null);
  const [sortingMethod , setSortingMethod] = useState<number>(1);
  const [isAddSwipeAnimation, setIsAddSwipeAnimation] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const [allowRemoving, setAllowRemoving] = useState<boolean>(false); 
  const [isUserBased, setIsUserBased] = useState<boolean>(localStorage.getItem('showme') === 'true');
  const [isPicking, setIsPicking] = useState<boolean>(false);
  const [pickedImages, setPickedImages] = useState<IPic[]>([]);
  const swiperAnimationRef = useRef<boolean>(false);
  const LONG_PRESS_DURATION = 500;

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
        console.error("Error fetching Firestore images:", error);
      } finally {
        setIsLoading(false);
      }
    }, [db, isUserBased, setIsLoading, userId]);
    
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);  

  // setups isUserBased in localstorage
  useEffect(() => {
    setIsUserBased(localStorage.getItem('showme') === 'true');
  }, [])

  // setups the swiper icon in localstorage
  useEffect(() => {
    if(filteredImages.length > 1 && !swiperAnimationRef.current) {
      swiperAnimationRef.current = true;
      const swiper = localStorage.getItem('swiper');
      if (swiper) {
        setIsAddSwipeAnimation(swiper === 'true');
      } else {
        localStorage.setItem('swiper','true');
        setIsAddSwipeAnimation(true);
      }
    }
  } ,[filteredImages])

  // picks a picture on click
  const pictureHandler = useCallback((picture: IPic) => {
    if(isPicking && pickedImages.length > 0) {
      setPickedImages(prev =>
        prev.some(img => img === picture)
          ? prev.filter(img => img !== picture) 
          : [...prev, picture]                 
      );
    } else {
      setCurrentPicture(picture);
      const imageIndex = filteredImages.findIndex((img) => img === picture);
      setCurrentPictureIndex(imageIndex);
    }
  }, [filteredImages, isPicking, pickedImages]);

  useEffect(() => {
    if(pickedImages.length === 0) {
      setIsPicking(false);
    } else {
      setAllowRemoving(pickedImages.every((img) => img.userId === userId));
    }
  },[pickedImages, userId])
  
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

  const pickImageHandler = (img: IPic) => {
    setPickedImages(prev => [...prev, img]);
  };

  const deselectAllHandler = () => {
    setIsPicking(false);
    setPickedImages([]);
  }

  const removeAllHandler = () => {
    setIsPopupOpen(true);
    setIsRemoving(true);
  }

  // the images grid
  const imagesGrid = filteredImages.map((img: IPic, index) => {
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
      className={`${classes.imageBtnWrapper} ${isPicked ? classes.picked : null}`} 
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
            style={{ filter: "blur(10px)", transition: "filter 0.3s ease" }}
            onLoad={(e) => {
              e.currentTarget.style.filter = "none";
            }}
          />
        </button>
      </div>
    );
  });

  const removeImagesFromFirebase = async (pictures: IPic[]) => {  
    setIsLoading(true);
    try {
      const deletePromises = pictures.map(async (pic) => {
        // Delete from Firebase Storage
        const storageRef = ref(storage, pic.path);
        await deleteObject(storageRef);
  
        // Find and delete the Firestore document by matching 'path'
        const userImagesRef = collection(db, `images/${pic.userId}/userImages`);
        const q = query(userImagesRef, where("path", "==", pic.path));
        const snapshot = await getDocs(q);
  
        for (const docSnap of snapshot.docs) {
          await deleteDoc(docSnap.ref);
        }
      });
  
      await Promise.all(deletePromises);
      const currVal: string | null = localStorage.getItem('val');
      if(currVal && +currVal > 0) {
        const newVal = +currVal - 1;
        localStorage.setItem('val',newVal.toString());
        setVal(val - 1);
      }
    } catch (error: unknown) {
      console.error("Error removing images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeRemovingPopup = () => {
    setIsPopupOpen(false);
    setIsRemoving(false);
  };

  const confirmRemoveAll = () => {
    closeRemovingPopup();
  };

  const cancelRemoveAll = () => {
    closeRemovingPopup();
  };

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
          setFilteredImages={setFilteredImages}
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
      <div className={classes.bottomActionsWrapper}>
        {allowRemoving && <button type="button" className={`${classes.btn} ${classes.removeAll}`} onClick={removeAllHandler}>
          Remove
        </button>}

        <button type="button" className={`${classes.btn} ${classes.deselectAll}`} onClick={deselectAllHandler}>
          Deselect All
        </button>
        </div>}
    </div>
  );
};

export default Gallery;
