import classes from './Actions.module.scss';
import cameraIcon from '../../assets/icons/camera-icon.svg';
import galleryIcon from '../../assets/icons/gallery-icon.svg';

const Actions = () => {
  return (
    <div className={classes.actions}>
        <button className={classes.btn}>
            <img className={classes.icon} src={galleryIcon} alt='camera icon' />
        </button>

        <button className={classes.btn}>
            <img className={classes.icon} src={cameraIcon} alt='camera icon' />
        </button>

        <div className={classes.imagesLeft}>
            <span className={classes.number}>20</span>
            <span className={classes.text}>Left</span>
        </div>
    </div>
  )
}

export default Actions