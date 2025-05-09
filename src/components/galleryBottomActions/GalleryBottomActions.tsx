import type { SetStateAction } from 'react';
import classes from './GalleryBottomActions.module.scss';
import trashIcon from '@/assets/icons/trash.svg';
import shareIcon from '@/assets/icons/share.svg';
import whatsapp from '@/assets/icons/whatsapp.svg';

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

  const shareHandler = () => {
    //
  }

  return (
    <div className={classes.bottomActionsWrapper}>
      <div className={classes.roundBtnsWrapper}>
        {allowRemoving && (
          <button
            type="button"
            className={`${classes.roundBtn} ${classes.removeAll}`}
            onClick={removeAllHandler}
          >
            <img className={classes.icon} src={trashIcon} alt='remove images' />
          </button>
        )}
          <button
            type="button"
            className={`${classes.roundBtn} ${classes.shareViaWhatsapp}`}
            onClick={shareHandler}
          >
            <img className={classes.icon} src={whatsapp} alt='share via whatsapp' />
          </button>
      </div>

      <button
        type="button"
        className={`${classes.btn} ${classes.deselectAll}`}
        onClick={deselectAllHandler}
      >
        Canecl
      </button>
    </div>
  );
};

export default GalleryBottomActions