import type { SetStateAction } from 'react';
import classes from './GalleryBottomActions.module.scss';

interface GalleryBottomActionsProps {
    allowRemoving: boolean;
    deselectAllHandler: () => void;
    setIsPopupOpen: React.Dispatch<SetStateAction<boolean>>;
    setIsRemoving: React.Dispatch<SetStateAction<boolean>>;
}

const GalleryBottomActions = ({
  allowRemoving,
  deselectAllHandler,
  setIsPopupOpen,
  setIsRemoving,
}: GalleryBottomActionsProps) => {

  const removeAllHandler = () => {
    setIsPopupOpen(true);
    setIsRemoving(true);
  };

  return (
    <div className={classes.bottomActionsWrapper}>
      {allowRemoving && (
        <button
          type="button"
          className={`${classes.btn} ${classes.removeAll}`}
          onClick={removeAllHandler}
        >
          Remove
        </button>
      )}

      <button
        type="button"
        className={`${classes.btn} ${classes.deselectAll}`}
        onClick={deselectAllHandler}
      >
        Deselect All
      </button>
    </div>
  );
};

export default GalleryBottomActions