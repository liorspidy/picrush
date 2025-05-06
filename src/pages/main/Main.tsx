import classes from './Main.module.scss';
import img1 from "@/assets/images/img1.jpeg";
import img2 from "@/assets/images/img2.jpeg";
import img3 from "@/assets/images/img3.jpeg";
import Actions from '../../components/actions/Actions';
import { useEffect, useState } from 'react';
import Header from '../../components/header/Header';

const Main = () => {
    const [bgImages , setBgImages] = useState([img1, img2, img3]);
    const [currentImage , setCurrentImage] = useState(bgImages[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prevImage) => {
                const currentIndex = bgImages.indexOf(prevImage);
                const nextIndex = (currentIndex + 1) % bgImages.length;
                return bgImages[nextIndex];
            });
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [bgImages]);

    return (
        <>
            <Header />
            <main className={classes.main}>
                <div className={classes.bgImageWrapper} style={{ '--bgImage': `url(${currentImage})` } as React.CSSProperties}>
                    <img className={classes.mainImage} src={currentImage} alt='background image' />
                </div>

                    <div className={classes.overlay}>
                        <div className={classes.textWrapper}>
                            <h1 className={`${classes.mainTitle} ${classes.strip}`}>{`Netanela \u00A0&\u00A0 Lior`}</h1>
                            <p className={`${classes.mainDate} ${classes.strip}`}>02/02/2026</p>
                        </div>
                        <Actions />
                    </div>
            </main>
        </>
    )
}

export default Main