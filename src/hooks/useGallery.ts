import { useCallback, useEffect, useRef, useState } from "react";
import { collection, collectionGroup, deleteDoc, getDocs, query, where } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import type { IPic } from "@/interfaces/pic.interface";
import { useFirebaseContext } from "./useFirebase";

const useGallery = () => {
  const swiperAnimationRef = useRef(false);
  const { db, storage, userId, isLoading, setIsLoading, val, setVal } = useFirebaseContext();
  const [images, setImages] = useState<IPic[]>([]);
  const [filteredImages, setFilteredImages] = useState<IPic[]>([]);
  const [currentPicture, setCurrentPicture] = useState<IPic | null>(null);
  const [currentPictureIndex, setCurrentPictureIndex] = useState<number | null>(null);
  const [sortingMethod, setSortingMethod] = useState<number>(1);
  const [isAddSwipeAnimation, setIsAddSwipeAnimation] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [allowRemoving, setAllowRemoving] = useState(false);
  const [isUserBased, setIsUserBased] = useState(localStorage.getItem("showme") === "true");
  const [isPicking, setIsPicking] = useState(false);
  const [pickedImages, setPickedImages] = useState<IPic[]>([]);

  const fetchImages = useCallback(async () => {
    try {
      setIsLoading(true);
      const imagesArray: IPic[] = [];
      if (isUserBased) {
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
        const querySnapshot = await getDocs(collectionGroup(db, "userImages"));
        querySnapshot.forEach(doc => {
          const data = doc.data();
          imagesArray.push({
            userId: data.userId || "unknown",
            src: data.src,
            path: data.path,
            uploadTime: new Date(data.uploadTime?.seconds * 1000 || Date.now()),
            width: data.width || 0,
            height: data.height || 0,
          });
        });
      }
      setImages(imagesArray);
    } catch (err) {
      console.error("Error fetching Firestore images:", err);
    } finally {
      setIsLoading(false);
    }
  }, [db, isUserBased, setIsLoading, userId]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  useEffect(() => {
    setIsUserBased(localStorage.getItem("showme") === "true");
  }, []);

  useEffect(() => {
    if (filteredImages.length > 1 && !swiperAnimationRef.current) {
      swiperAnimationRef.current = true;
      const swiper = localStorage.getItem("swiper");
      if (swiper) {
        setIsAddSwipeAnimation(swiper === "true");
      } else {
        localStorage.setItem("swiper", "true");
        setIsAddSwipeAnimation(true);
      }
    }
  }, [filteredImages]);

  const pictureHandler = useCallback((picture: IPic) => {
    if (isPicking && pickedImages.length > 0) {
      setPickedImages(prev =>
        prev.some(img => img === picture)
          ? prev.filter(img => img !== picture)
          : [...prev, picture]
      );
    } else {
      setCurrentPicture(picture);
      const index = filteredImages.findIndex(img => img === picture);
      setCurrentPictureIndex(index);
    }
  }, [filteredImages, isPicking, pickedImages]);

  useEffect(() => {
    if (pickedImages.length === 0) {
      setIsPicking(false);
    } else {
      setAllowRemoving(pickedImages.every(img => img.userId === userId));
    }
  }, [pickedImages, userId]);

  useEffect(() => {
    if (images) {
      const sorted = [...images].sort((a, b) => {
        const aTime = a.uploadTime instanceof Date ? a.uploadTime.getTime() : 0;
        const bTime = b.uploadTime instanceof Date ? b.uploadTime.getTime() : 0;
        return sortingMethod === 1 ? bTime - aTime : aTime - bTime;
      });
      setFilteredImages(sorted);
    }
  }, [sortingMethod, images]);

  useEffect(() => {
    if (currentPicture) {
      const body = document.body;
      body.style.overflow = "hidden";
      return () => { body.style.overflow = "auto"; };
    }
  }, [currentPicture]);

  const pickImageHandler = useCallback((img: IPic) => {
    setPickedImages(prev => [...prev, img]);
  }, []);

  const removeImagesFromFirebase = async (pictures: IPic[]) => {
    setIsLoading(true);
    try {
      const tasks = pictures.map(async (pic) => {
        const storageRef = ref(storage, pic.path);
        await deleteObject(storageRef);

        const userImagesRef = collection(db, `images/${pic.userId}/userImages`);
        const q = query(userImagesRef, where("path", "==", pic.path));
        const snapshot = await getDocs(q);
        for (const docSnap of snapshot.docs) {
          await deleteDoc(docSnap.ref);
        }
      });

      await Promise.all(tasks);
      const currVal = localStorage.getItem("val");
      if (currVal && +currVal > 0) {
        const newVal = +currVal - 1;
        localStorage.setItem("val", newVal.toString());
        setVal(val - 1);
      }

      const newImages = filteredImages.filter((img) => !pictures.some((p) => p.path === img.path));
      setFilteredImages(newImages);
      
    } catch (err) {
      console.error("Error removing images:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    images,
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
    userId,
    setFilteredImages
  };
};

export default useGallery;