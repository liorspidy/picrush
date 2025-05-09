import classes from './GalleryDialog.module.scss'

interface GalleryDialogProps {
  message: string;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  confirmAction: () => void,
  cancelAction: () => void
}

const GalleryDialog = ({ message, setIsPopupOpen , confirmAction, cancelAction }: GalleryDialogProps) => {

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
      <p className={classes.content}>
        {message}
      </p>
      <div className={classes.actions}>
        <button
          type="button"
          className={`${classes.actionBtn} ${classes.accept}`}
          onClick={confirmHandler}
        >
          <span className={classes.text}>Accept</span>
        </button>
        <button
          type="button"
          className={`${classes.actionBtn} ${classes.decline}`}
          onClick={declineHandler}
        >
          <span className={classes.text}>Decline</span>
        </button>
      </div>
    </div>
  );
}

export default GalleryDialog