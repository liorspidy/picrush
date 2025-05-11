import classes from './InfoPopup.module.scss';
import closeIcon from '@/assets/icons/close.svg';

interface InfoPopupProps {
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const InfoPopup = ({ setIsPopupOpen }: InfoPopupProps) => {

    const closeDialog = () => {
        setIsPopupOpen(false);
    }
    
  return (
    <div className={classes.backdrop} onClick={closeDialog}>
        <div className={classes.popup} role="dialog" onClick={(e) => e.stopPropagation()}>
            <button type='button' className={classes.closeBtn} onClick={closeDialog}>
                <img className={classes.icon} src={closeIcon} alt='close popup' />
            </button>

            <div className={classes.content}>
                <h2 className={classes.title}>Welcome to <strong>PICRUSH</strong> 🎉</h2>
                <ul className={classes.ul}>
                    <li className={classes.li}>📸 Tap the <strong>camera</strong> button to snap a moment on the spot</li>
                    <li className={classes.li}>🖼️ Use the <strong>upload</strong> button to add photos from your phone</li>
                    <li className={classes.li}>☁️ Your photos will start uploading — stay on the page 'til it's done</li>
                    <li className={classes.li}>👀 Tap the <strong>gallery</strong> button to browse the photo stream</li>
                    <li className={classes.li}>⏱️ Sort by time or filter to see just yours or everyone’s shots</li>
                    <li className={classes.li}>🖐️ Tap and hold a photo to select it — or hit <strong>select</strong> to pick multiples</li>
                    <li className={classes.li}>🗑️ You can remove <strong>only your own</strong> pics</li>
                    <li className={classes.li}>🔗 Tap the <strong>share</strong> button to send your best shots via WhatsApp</li>
                    <li className={classes.li}>📤 You can upload up to <strong>20 photos</strong> — make them count!</li>
                    <li className={classes.li}>❌ Removing a photo frees up space — it’s like it never happened!</li>
                </ul>

                <p className={classes.par}>Have fun, be creative, and capture unforgettable memories 💕</p>
            </div>

            <button className={classes.btn} onClick={closeDialog}>
                Let's Begin!
            </button>
        </div>
    </div>
  );
}

export default InfoPopup