import { useRef } from 'react';
import classes from './Actions.module.scss';
import cameraIcon from '../../assets/icons/camera-icon.svg';
import galleryIcon from '../../assets/icons/gallery-icon.svg';
import { Link } from 'react-router-dom';

const Actions = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const cameraHandler = () => {
    inputRef.current?.click();
  };

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      //
    }
  };

  return (
    <div className={classes.actions}>
        <Link to={'/gallery'} className={classes.circle}>
            <img className={classes.icon} src={galleryIcon} alt='gallery icon' />
        </Link>

        <button className={classes.btn} onClick={cameraHandler}>
            <img className={classes.icon} src={cameraIcon} alt='camera icon' />
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
  )
}

export default Actions;
