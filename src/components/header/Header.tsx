import classes from "./Header.module.scss";
import { useFirebaseContext } from "@/hooks/useFirebase";
import infoIcon from "@/assets/icons/info.svg";
import { useAppContext } from "@/store/useAppContext";
import useIcon from "@/assets/icons/usa.png";
import israelIcon from "@/assets/icons/israel.png";

interface HeaderProps {
    setIsInfoPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({ setIsInfoPopupOpen }: HeaderProps) => {
    const { val, maxVal } = useFirebaseContext();
    const { setLanguageHandler, language } = useAppContext();

    const infoHandler = () => {
        setIsInfoPopupOpen(true);
    };

    return (
        <header className={classes.header}>
            <div className={classes.logoWrapper}>
                <p className={classes.logo}>PICRUSH</p>
            </div>

            <div className={classes.infoWrapper}>
                <button
                    type="button"
                    onClick={infoHandler}
                    className={classes.infoBtn}
                >
                    <img
                        className={classes.icon}
                        src={infoIcon}
                        alt="info on app"
                    />
                </button>

                <button
                    type="button"
                    className={classes.languageButton}
                    onClick={setLanguageHandler.bind(
                        null,
                        language === "HE" ? "EN" : "HE"
                    )}
                >
                    <img
                        className={classes.icon}
                        src={language === "HE" ? israelIcon : useIcon}
                        alt="flag"
                    />
                </button>
            </div>

            <label className={classes.barLabel} htmlFor="bar">
                {language === "EN" ? "Uploades Left" : "העלאות נותרו"}
            </label>
            <div className={classes.imagesLeft}>
                <span className={classes.value}>{val}</span>
                <div className={classes.bar}>
                    <span
                        className={classes.progress}
                        style={{
                            width: `${(val / maxVal) * 100}%`,
                            borderRadius:
                                val === maxVal ? "20px" : "20px 10px 10px 20px",
                        }}
                    ></span>
                </div>
                <span className={classes.value}>{maxVal}</span>
            </div>
        </header>
    );
};

export default Header;
