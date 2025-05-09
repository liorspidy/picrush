import { Link } from 'react-router-dom';
import classes from './GalleryHeaderActions.module.scss';
import arrowRight from '@/assets/icons/arrow-right.svg';
import refreshIcon from '@/assets/icons/refresh.svg';

  // refreshing method
  const refreshHandler = () => {
    window.location.reload();
  }

const GalleryHeaderActions = () => {
  return (
    <div className={classes.galleryHeaderActions}>
    <button
      className={`${classes.btn} ${classes.refresh}`}
      type="button"
      onClick={refreshHandler}
    >
      <img className={classes.icon} src={refreshIcon} alt="back" loading="lazy" />
    </button>

    <Link to={"/"} className={`${classes.btn} ${classes.back}`}>
      <img className={classes.icon} src={arrowRight} alt="back" loading="lazy"/>
    </Link>
  </div>
  )
}

export default GalleryHeaderActions