import { useAppContext } from '@/store/useAppContext';
import classes from './GalleryDialog.module.scss'

interface GalleryDialogProps {
  message: string;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  confirmAction: () => void,
  cancelAction: () => void
}

const GalleryDialog = ({ message, setIsPopupOpen , confirmAction, cancelAction }: GalleryDialogProps) => {
    const {language} = useAppContext();
    const isHebrew = language === "HE";

    const declineHandler = () => {
        cancelAction();
        closeDialog();
    }

    const confirmHandler = () => {
        confirmAction();
        closeDialog();
    }

    const closeDialog = () => {
        setIsPopupOpen(false);
    }
    
  return (
    <div className={classes.popup} role="dialog">
      <p className={classes.content} style={{ direction: isHebrew ? "rtl" : "ltr"}}>
        {message}
      </p>
      <div className={classes.actions} style={{ direction: isHebrew ? "rtl" : "ltr"}}>
        <button
          type="button"
          className={`${classes.actionBtn} ${classes.accept}`}
          onClick={confirmHandler}
        >
          <span className={classes.text}>{isHebrew ? "אישור" : "Accept"}</span>
        </button>
        <button
          type="button"
          className={`${classes.actionBtn} ${classes.decline}`}
          onClick={declineHandler}
        >
          <span className={classes.text}>{isHebrew ? "ביטול" : "Cancel"}</span>
        </button>
      </div>
    </div>
  );
}

export default GalleryDialog