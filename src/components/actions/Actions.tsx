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

const Actions = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { db, storage, setIsLoading} = useFirebaseContext();

  const cameraBtnHandler = () => {
    inputRef.current?.click();
  };

  const uploadBtnHandler = () => {
    fileInputRef.current?.click();
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

  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await addImageToDb(file);
    }
  };

  return (
    <div className={classes.actions}>
      <div className={classes.imagesLeft}>
        <p className={classes.text}><span className={classes.value}>20</span> Pictures Left</p>
      </div>

      <div className={classes.actionsWrapper}>
        <Link to="/gallery" className={classes.circle}>
        <img className={classes.icon} src={galleryIcon} alt="gallery icon" />
        </Link>

        <button className={classes.btn} onClick={cameraBtnHandler}>
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

        <button className={classes.btn} onClick={uploadBtnHandler}>
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
