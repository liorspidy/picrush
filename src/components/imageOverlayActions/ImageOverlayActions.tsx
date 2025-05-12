import classes from "./ImageOverlayActions.module.scss";
import closeImg from "@/assets/icons/close.svg";
import downloadImg from "@/assets/icons/download.svg";
import trashIcon from "@/assets/icons/trash.svg";
import shareIcon from "@/assets/icons/share.svg";
import { shortenUrls } from "@/tools/shortenUrls";
import { useCallback } from "react";
import type { IPic } from "@/interfaces/pic.interface";
import { useFirebaseContext } from "@/hooks/useFirebase";

interface ImageOverlayActionsProps {
    currentPicture: IPic | null;
    closePictureHandler: () => void;
    isPopupOpen: boolean;
    setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsRemoving: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageOverlayActions = ({
    currentPicture,
    closePictureHandler,
    isPopupOpen,
    setIsPopupOpen,
    setIsRemoving,
}: ImageOverlayActionsProps) => {
    const { setIsLoading, userId} = useFirebaseContext();
    
    const downloadHandler = useCallback(
        async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (!currentPicture || !currentPicture.path) {
            console.error("Missing currentPicture or path.");
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(currentPicture.src);
            if (!response.ok) throw new Error("Failed to fetch image blob");

            // Create a blob URL and trigger download
            const blob = await response.blob();
            const blobURL = URL.createObjectURL(blob);

            const anchor = document.createElement("a");
            anchor.href = blobURL;
            anchor.download = `image-${Date.now()}.jpg`;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            URL.revokeObjectURL(blobURL);
        } catch (error) {
            console.error("Error downloading image:", error);
        } finally {
            setIsLoading(false);
        }
        },
        [currentPicture, setIsLoading]
    );

    const shareHandler = useCallback(
        async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (!currentPicture) return;

        setIsLoading(true);

        try {
            const response = await fetch(currentPicture.src);
            if (!response.ok) throw new Error("Failed to fetch image");
            const blob = await response.blob();
            const file = new File([blob], "picrush-photo.jpg", { type: blob.type });

            // ✅ Android native file sharing
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                title: "Picrush Wedding Photo",
                files: [file],
            });
            }

            // ✅ iOS fallback using title + text + url
            else if (navigator.share) {
            const [shortUrl] = await shortenUrls([currentPicture.src]);
            await navigator.share({
                title: "Picrush Wedding Photo",
                url: shortUrl,
            });
            }

            // ❌ Fallback for older browsers — use WhatsApp link
            else {
            const [shortUrl] = await shortenUrls([currentPicture.src]);
            const message = `Here’s a memory from the wedding, shared with you via Picrush 💕\n\n${shortUrl}`;
            const whatsappURL = `https://wa.me/?text=${encodeURIComponent(
                message
            )}`;
            window.open(whatsappURL, "_blank");
            }
        } catch (error) {
            console.error("Sharing failed:", error);
        } finally {
            setIsLoading(false);
        }
        },
        [currentPicture, setIsLoading]
    );

    const removeHandler = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsRemoving(true);
        if(!isPopupOpen){
            setIsPopupOpen(true);
        }
    },[isPopupOpen, setIsPopupOpen, setIsRemoving])
  
  return (
    <div className={classes.actions}>
      <button
        type="button"
        className={classes.btn}
        onClick={closePictureHandler}
      >
        <img
          className={classes.icon}
          src={closeImg}
          alt="close image"
          loading="lazy"
        />
      </button>

      <button type="button" className={classes.btn} onClick={downloadHandler}>
        <img
          className={classes.icon}
          src={downloadImg}
          alt="download image"
          loading="lazy"
        />
      </button>

      <button type="button" className={classes.btn} onClick={shareHandler}>
        <img
          className={classes.icon}
          src={shareIcon}
          alt="share via whatsapp"
          loading="lazy"
        />
      </button>

      {currentPicture?.userId === userId && (
        <button type="button" className={classes.btn} onClick={removeHandler}>
          <img
            className={classes.icon}
            src={trashIcon}
            alt="remove image"
            loading="lazy"
          />
        </button>
      )}
    </div>
  );
};

export default ImageOverlayActions;
