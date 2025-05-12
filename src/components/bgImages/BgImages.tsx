import { useEffect, useState } from 'react';
import classes from './BgImages.module.scss';
import { useFirebaseContext } from '@/hooks/useFirebase';

const BgImages = () => {
    const { bgImages } = useFirebaseContext();
    const [currentImage , setCurrentImage] = useState<string>(bgImages[0]);

    useEffect(() => {
    const interval = setInterval(() => {
        setCurrentImage((prevImage: string) => {
            const currentIndex = bgImages.indexOf(prevImage);
            const nextIndex = (currentIndex + 1) % bgImages.length;
            return bgImages[nextIndex];
        });
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
}, [bgImages, setCurrentImage]);


  return (
    <div className={classes.bgImageWrapper} style={{ '--bgImage': `url(${currentImage})` } as React.CSSProperties}>
        <img className={classes.mainImage} src={currentImage} alt='background image' />
    </div>
  )
}

export default BgImages