import classes from './Main.module.scss';
import Actions from '../../components/actions/Actions';
import { useEffect, useState } from 'react';
import Header from '../../components/header/Header';
import Loader from '@/components/loader/Loader';
import { useFirebaseContext } from '@/hooks/useFirebase';

const Main = () => {
    const { isLoading, bgImages } = useFirebaseContext();
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
    }, [bgImages]);

    return (
        <>
            <Header />
            <main className={classes.main}>
                {isLoading && <Loader />}
                <div className={classes.bgImageWrapper} style={{ '--bgImage': `url(${currentImage})` } as React.CSSProperties}>
                    <img className={classes.mainImage} src={currentImage} alt='background image' />
                </div>

                    <div className={classes.overlay}>
                        <div className={classes.textWrapper}>
                            <div className={classes.content}>
                                <h1 className={classes.mainTitle}>{`Netanela \u00A0&\u00A0 Lior`}</h1>
                                <p className={classes.mainDate}>02/02/2026</p>
                            </div>
                        </div>
                        <Actions />
                    </div>
            </main>
        </>
    )
}

export default Main