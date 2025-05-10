import { Link } from 'react-router-dom';
import classes from './GalleryHeaderActions.module.scss';
import arrowRight from '@/assets/icons/arrow-right.svg';
import refreshIcon from '@/assets/icons/refresh.svg';
import type { IPic } from '@/interfaces/pic.interface';

interface GalleryHeaderActionsProps {
  isPicking: boolean;
  setIsPicking:  React.Dispatch<React.SetStateAction<boolean>>; 
  deselectAllHandler: () => void;
  filteredImages: IPic[];
}

const GalleryHeaderActions = ({isPicking, setIsPicking, filteredImages, deselectAllHandler}: GalleryHeaderActionsProps) => {
  // refreshing method
  const refreshHandler = () => {
    window.location.reload();
  }

  const selectHandler = () => {
    if(isPicking){
      deselectAllHandler();
    } else {
      setIsPicking(true);
    }
  }
    
  return (
    <div className={classes.galleryHeaderActions}>
      <button
        type="button"
        className={`${classes.btn} ${classes.select} ${filteredImages.length === 0 ? classes.disabled : null}`}
        onClick={selectHandler}
        disabled={filteredImages.length === 0}
      >
        Select
      </button>

      <button
        className={`${classes.roundBtn} ${classes.refresh}`}
        type="button"
        onClick={refreshHandler}
      >
        <img className={classes.icon} src={refreshIcon} alt="refresh the page" loading="lazy" />
      </button>

      <Link to={"/"} className={`${classes.roundBtn} ${classes.back}`}>
        <img className={classes.icon} src={arrowRight} alt="go back" loading="lazy"/>
      </Link>
  </div>
  )
}

export default GalleryHeaderActions