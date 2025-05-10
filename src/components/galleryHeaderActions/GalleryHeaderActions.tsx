import { Link } from 'react-router-dom';
import classes from './GalleryHeaderActions.module.scss';
import arrowRight from '@/assets/icons/arrow-right.svg';
import refreshIcon from '@/assets/icons/refresh.svg';

interface GalleryHeaderActionsProps {
  setIsPicking:  React.Dispatch<React.SetStateAction<boolean>>; 
}

const GalleryHeaderActions = ({setIsPicking}: GalleryHeaderActionsProps) => {
  // refreshing method
  const refreshHandler = () => {
    window.location.reload();
  }

  const selectHandler = () => {
    setIsPicking(prev => prev = !prev);
  }
    
  return (
    <div className={classes.galleryHeaderActions}>
      <button
        type="button"
        className={`${classes.btn} ${classes.select}`}
        onClick={selectHandler}
      >
        Select
      </button>

      <button
        className={`${classes.roundBtn} ${classes.refresh}`}
        type="button"
        onClick={refreshHandler}
      >
        <img className={classes.icon} src={refreshIcon} alt="back" loading="lazy" />
      </button>

      <Link to={"/"} className={`${classes.roundBtn} ${classes.back}`}>
        <img className={classes.icon} src={arrowRight} alt="back" loading="lazy"/>
      </Link>
  </div>
  )
}

export default GalleryHeaderActions