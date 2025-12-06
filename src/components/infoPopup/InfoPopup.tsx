import { useAppContext } from "@/store/useAppContext";
import classes from "./InfoPopup.module.scss";
import closeIcon from "@/assets/icons/close.svg";

interface InfoPopupProps {
    setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const InfoPopup = ({ setIsPopupOpen }: InfoPopupProps) => {
    const { language } = useAppContext();

    const closeDialog = () => {
        setIsPopupOpen(false);
    };

    const isHebrew = language === "HE";

    return (
        <div className={classes.backdrop} onClick={closeDialog}>
            <div
                className={classes.popup}
                role="dialog"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className={classes.closeBtn}
                    onClick={closeDialog}
                >
                    <img
                        className={classes.icon}
                        src={closeIcon}
                        alt={isHebrew ? "סגור חלון" : "close popup"}
                    />
                </button>

                <div
                    className={`${classes.content} ${
                        isHebrew ? classes.hebrew : ""
                    }`}
                >
                    <h2 className={classes.title}>
                        {isHebrew ? (
                            <>הגעתם ל<strong>PICRUSH</strong> 🎉</>
                        ) : (
                            <>Welcome to <strong>PICRUSH</strong> 🎉</>
                        )}
                    </h2>

                    <ul className={classes.ul}>
                        <li className={classes.li}>
                            {isHebrew ? (
                                <>📸 לוחצים על כפתור ה<strong>מצלמה</strong> ומצלמים במקום!</>
                            ) : (
                                <>📸 Tap the <strong>camera</strong> button to snap a moment on the spot</>
                            )}
                        </li>

                        <li className={classes.li}>
                            {isHebrew ? (
                                <>🖼️ מעלים תמונות מהטלפון עם כפתור ה<strong>העלאה</strong></>
                            ) : (
                                <>🖼️ Use the <strong>upload</strong> button to add photos from your phone</>
                            )}
                        </li>

                        <li className={classes.li}>
                            {isHebrew ? (
                                <>☁️ התמונות יעלו באוויר — נשארים פה עד שזה נגמר 😉</>
                            ) : (
                                <>☁️ Your photos will start uploading — stay on the page 'til it's done</>
                            )}
                        </li>

                        <li className={classes.li}>
                            {isHebrew ? (
                                <>👀 נכנסים ל<strong>גלריה</strong> לראות מה כולם צילמו</>
                            ) : (
                                <>👀 Tap the <strong>gallery</strong> button to browse the photo stream</>
                            )}
                        </li>

                        <li className={classes.li}>
                            {isHebrew ? (
                                <>⏱️ מסדרים לפי זמן או מסננים — רק שלי או של כולם</>
                            ) : (
                                <>⏱️ Sort by time or filter to see just yours or everyone's shots</>
                            )}
                        </li>

                        <li className={classes.li}>
                            {isHebrew ? (
                                <>🖐️ לחיצה ארוכה בוחרת תמונה — או <strong>בחר</strong> לכמה ביחד</>
                            ) : (
                                <>🖐️ Tap and hold a photo to select it — or hit <strong>select</strong> to pick multiples</>
                            )}
                        </li>

                        <li className={classes.li}>
                            {isHebrew ? (
                                <>🗑️ אפשר למחוק <strong>רק את התמונות שלך</strong></>
                            ) : (
                                <>🗑️ You can remove <strong>only your own</strong> pics</>
                            )}
                        </li>

                        <li className={classes.li}>
                            {isHebrew ? (
                                <>🔗 משתפים את השוטים הכי טובים שלך ב-WhatsApp</>
                            ) : (
                                <>🔗 Tap the <strong>share</strong> button to send your best shots via WhatsApp</>
                            )}
                        </li>

                        <li className={classes.li}>
                            {isHebrew ? (
                                <>📤 אפשר להעלות עד <strong>20 תמונות</strong> — תשאירו רק את הדה בסט 😎</>
                            ) : (
                                <>📤 You can upload up to <strong>20 photos</strong> — make them count!</>
                            )}
                        </li>

                        <li className={classes.li}>
                            {isHebrew ? (
                                <>❌ מוחקים תמונה? מתקבל מקום חדש — כאילו לא הייתה פה!</>
                            ) : (
                                <>❌ Removing a photo frees up space — it's like it never happened!</>
                            )}
                        </li>
                    </ul>

                    <p className={classes.par}>
                        {isHebrew
                            ? "פשוט ליהנות, להיות יצירתיים ולתפוס רגעים שיישארו 💕"
                            : "Have fun, be creative, and capture unforgettable memories 💕"}
                    </p>
                </div>

                <button
                    className={`${classes.btn} ${
                        isHebrew ? classes.hebrew : ""
                    }`}
                    onClick={closeDialog}
                >
                    {isHebrew ? "יאללה מתחילים!" : "Let's Begin!"}
                </button>
            </div>
        </div>
    );
};

export default InfoPopup;
