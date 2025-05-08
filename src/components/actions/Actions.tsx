import { useRef } from 'react';
import classes from './Actions.module.scss';
import cameraIcon from '@/assets/icons/camera-icon.svg';
import uploadIcon from '@/assets/icons/upload.svg';
import galleryIcon from '@/assets/icons/gallery-icon.svg';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useFirebaseContext } from '@/hooks/useFirebase';
import toast from 'react-hot-toast';
import imageCompression from 'browser-image-compression';
import type { IPic } from '@/interfaces/pic.interface';

const Actions = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { db, storage, setIsLoading, userId, val, setVal} = useFirebaseContext();

  const btnHandler = (ref: React.RefObject<HTMLInputElement | null>) => {
    if(val !== 20){
      ref.current?.click();
    } else {
      toast.error('No Uploades Left')
    }
  }

  const cameraBtnHandler = () => {
    btnHandler(inputRef);
  };

  const uploadBtnHandler = () => {
    btnHandler(fileInputRef)
  };

  const addImageToDb = async (file: File) => {
    try {
      setIsLoading(true);
  
      // Compress image
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });
  
      // Load compressed image into <img> to extract width & height
      const imageDimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          resolve({ width: img.width, height: img.height });
        };
        img.onerror = reject;
  
        // Create object URL for the blob
        const objectUrl = URL.createObjectURL(compressedFile);
        img.src = objectUrl;
      });
  
      // Create clean filename and path
      const safeFileName = file.name.replace(/[^\w.]+/g, "_");
      const timestamp = Date.now();
      const filePath = `images/${userId}/${timestamp}_${safeFileName}`;
      const storageRef = ref(storage, filePath);
  
      // Upload image
      await uploadBytes(storageRef, compressedFile);
      const downloadURL = await getDownloadURL(storageRef);
  
      // Store metadata in Firestore
      const imageMetadata: IPic = {
        src: downloadURL,
        uploadTime: serverTimestamp(),
        userId,
        width: imageDimensions.width,
        height: imageDimensions.height,
      };
  
      await addDoc(collection(db, `images/${userId}/userImages`), imageMetadata);
  
      // Update counter
      const currentVal = val + 1;
      localStorage.setItem("val", currentVal.toString());
      setVal(currentVal);
  
      toast.success("Got it! Added to the gallery.");
    } catch (err) {
      toast.error("Error - please try again later");
      console.error("Upload failed:", err);
    } finally {
      setIsLoading(false);
    }
  };  

  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await addImageToDb(file);
    }
  }

  return (
    <div className={classes.actions}>
      <div className={classes.actionsWrapper}>
        <Link to="/gallery" className={classes.circle}>
        <img className={classes.icon} src={galleryIcon} alt="gallery icon" />
        </Link>

        <button type="button" className={classes.btn} onClick={cameraBtnHandler}>
        <img className={classes.icon} src={cameraIcon} alt="camera icon" />
        </button>

        <input
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        ref={inputRef}
        onChange={handleInput}
        />

        <button type="button" className={classes.btn} onClick={uploadBtnHandler}>
        <img className={classes.icon} src={uploadIcon} alt="upload icon" />
        </button>

        <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleInput}
        />
      </div>
    </div>
  );
};

export default Actions;
