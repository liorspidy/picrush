import classes from "./Header.module.scss";
import { useFirebaseContext } from "@/hooks/useFirebase";
import { useAppContext } from "@/store/useAppContext";
import useIcon from "@/assets/icons/usa.png";
import israelIcon from "@/assets/icons/israel.png";
import menuIcon from "@/assets/icons/menu.svg";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Language } from "@/store/AppContext";

interface HeaderProps {
    setIsInfoPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({ setIsInfoPopupOpen }: HeaderProps) => {
    const { val, maxVal } = useFirebaseContext();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const { setLanguageHandler, language } = useAppContext();
    const isHebrew = language === "HE";
    const menuRef = useRef<HTMLDivElement | null>(null);

    const infoHandler = useCallback(() => {
        setIsInfoPopupOpen(true);
        setIsMenuOpen(false);
    }, [setIsInfoPopupOpen]);

    const toggleMenuHandler = useCallback(() => {
        setIsMenuOpen(!isMenuOpen);
    }, [setIsMenuOpen, isMenuOpen]);

    const setLangugageMenuHandler = useCallback(
        (lang: Language) => {
            setLanguageHandler(lang);
            setIsMenuOpen(false);
        },
        [setLanguageHandler, setIsMenuOpen]
    );

    // === Close when clicking outside ===
    useEffect(() => {
        if (!isMenuOpen) return;

        const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("touchstart", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("touchstart", handleOutsideClick);
        };
    }, [isMenuOpen]);

    return (
        <header className={classes.header}>
            <div
                className={`${classes.menuContainer} ${
                    isHebrew ? classes.hebrew : null
                }`}
                ref={menuRef}
            >
                <button className={classes.menuBtn} onClick={toggleMenuHandler}>
                    <img className={classes.icon} src={menuIcon} alt="menu" />
                </button>

                {isMenuOpen && (
                    <div
                        className={`${classes.menuDropdown} ${
                            isHebrew ? classes.hebrew : null
                        }`}
                    >
                        <ul className={classes.listItems}>
                            <li className={classes.listItem}>
                                <button
                                    type="button"
                                    onClick={infoHandler}
                                    className={classes.menuItemButton}
                                >
                                    <p className={classes.text}>
                                        {isHebrew
                                            ? "מה עושים כאן?"
                                            : "what to do here?"}
                                    </p>
                                </button>
                            </li>
                            <li className={classes.listItem}>
                                <button
                                    type="button"
                                    className={classes.menuItemButton}
                                    onClick={setLangugageMenuHandler.bind(
                                        null,
                                        language === "HE" ? "EN" : "HE"
                                    )}
                                >
                                    <p className={classes.text}>
                                        {isHebrew ? "עברית" : "English"}
                                    </p>
                                    <img
                                        className={classes.icon}
                                        src={
                                            language === "HE"
                                                ? israelIcon
                                                : useIcon
                                        }
                                        alt="flag"
                                    />
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <div className={classes.logoWrapper}>
                <p className={classes.logo}>PICRUSH</p>
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
