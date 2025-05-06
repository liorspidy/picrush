import classes from './Actions.module.scss';
import cameraIcon from '../../assets/icons/camera-icon.svg';
import galleryIcon from '../../assets/icons/gallery-icon.svg';
import { Link } from 'react-router-dom';

const Actions = () => {
  const cameraHandler = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          const videoElement = document.createElement('video');
          videoElement.srcObject = stream;
          videoElement.play();
          document.body.appendChild(videoElement);
          videoElement.addEventListener('click', () => {
            stream.getTracks().forEach((track) => track.stop());
            document.body.removeChild(videoElement);
          });
        })
        .catch((error) => {
          console.error('Error accessing the camera:', error);
        });
    } else {
      alert('Camera not supported on this device.');
    }
  };

  return (
    <div className={classes.actions}>
        <Link to={'/gallery'} className={classes.circle}>
            <img className={classes.icon} src={galleryIcon} alt='camera icon' />
        </Link>

        <button className={classes.btn} onClick={cameraHandler}>
            <img className={classes.icon} src={cameraIcon} alt='camera icon' />
        </button>

        <div className={`${classes.circle} ${classes.imagesLeft}`}>
            <span className={classes.number}>20</span>
            <span className={classes.text}>Left</span>
        </div>
    </div>
  )
}

export default Actions