import classes from './Main.module.scss';
import Actions from '../../components/actions/Actions';
import { useEffect, useState } from 'react';
import Header from '../../components/header/Header';
import Loader from '@/components/loader/Loader';
import InfoPopup from '@/components/infoPopup/InfoPopup';
import { useFirebaseContext } from '@/hooks/useFirebase';
import BgImages from '@/components/bgImages/BgImages';

const Main = () => {
    const [isInfoPopupOpen, setIsInfoPopupOpen] = useState<boolean>(false);
    const { isLoading } = useFirebaseContext();

    useEffect(() => {
        const firstTime = localStorage.getItem('ft');
        if (!firstTime) {
            setIsInfoPopupOpen(true);
            localStorage.setItem('ft', 'true');
        }
    },[])

    return (
        <>
            <Header setIsInfoPopupOpen={setIsInfoPopupOpen}/>
            <main className={classes.main}>
                {isLoading && <Loader />}

                {isInfoPopupOpen && 
                    <InfoPopup 
                    setIsPopupOpen={setIsInfoPopupOpen}
                    />
                }

                <BgImages />

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