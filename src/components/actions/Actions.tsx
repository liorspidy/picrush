import { useRef } from 'react';
import classes from './Actions.module.scss';
import cameraIcon from '../../assets/icons/camera-icon.svg';
import galleryIcon from '../../assets/icons/gallery-icon.svg';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useFirebaseContext } from '@/hooks/useFirebase';
import toast from 'react-hot-toast';

const Actions = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { db, storage, setIsLoading} = useFirebaseContext();

  const cameraHandler = () => {
    inputRef.current?.click();
  };

  const addImageToDb = async (file: File) => {
    try {
      setIsLoading(true);
      // Sanitize filename and create storage path
      const safeFileName = file.name.replace(/[^\w.]+/g, "_");
      const filePath = `images/${Date.now()}_${safeFileName}`;
      const storageRef = ref(storage, filePath);

      // Upload file to Firebase Storage
      const uploadResult = await uploadBytes(storageRef, file);

      // Get public URL
      const downloadURL = await getDownloadURL(uploadResult.ref);

      // Save metadata to Firestore
      const imageMetadata = {
        src: downloadURL,
        uploadTime: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "images"), imageMetadata);
      setIsLoading(false);

      toast.success("התמונה נוספה בהצלחה!");
    } catch (err) {
      toast.error('קרתה שגיאה - אנא נסו שנית');
      console.error("❌ Upload failed:", err);
    }
  };

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await addImageToDb(file);
    }
  };

  return (
    <div className={classes.actions}>
      <Link to="/gallery" className={classes.circle}>
        <img className={classes.icon} src={galleryIcon} alt="gallery icon" />
      </Link>

      <button className={classes.btn} onClick={cameraHandler}>
        <img className={classes.icon} src={cameraIcon} alt="camera icon" />
      </button>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        ref={inputRef}
        onChange={handleCapture}
      />

      <div className={`${classes.circle} ${classes.imagesLeft}`}>
        <span className={classes.number}>20</span>
        <span className={classes.text}>Left</span>
      </div>
    </div>
  );
};

export default Actions;
