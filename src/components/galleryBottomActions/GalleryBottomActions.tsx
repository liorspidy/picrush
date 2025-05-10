import type { SetStateAction } from "react";
import classes from "./GalleryBottomActions.module.scss";
import trashIcon from "@/assets/icons/trash.svg";
import shareIcon from "@/assets/icons/share.svg";
import downloadImg from "@/assets/icons/download.svg";
import type { IPic } from "@/interfaces/pic.interface";
import { shortenUrls } from "@/tools/shortenUrls";

interface GalleryBottomActionsProps {
  allowRemoving: boolean;
  deselectAllHandler: () => void;
  setIsPopupOpen: React.Dispatch<SetStateAction<boolean>>;
  setIsRemoving: React.Dispatch<SetStateAction<boolean>>;
  pickedImages: IPic[];
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
}

const GalleryBottomActions = ({
  allowRemoving,
  deselectAllHandler,
  setIsPopupOpen,
  setIsRemoving,
  pickedImages,
  setIsLoading,
}: GalleryBottomActionsProps) => {
  const removeAllHandler = () => {
    setIsPopupOpen(true);
    setIsRemoving(true);
  };

  const shareHandler = async () => {
    if (pickedImages.length === 0) return;
    setIsLoading(true);
  
    try {
      // Step 1: Try native file sharing
      const files: File[] = [];
  
      for (const image of pickedImages) {
        const response = await fetch(image.src);
        if (!response.ok) throw new Error("Failed to fetch image");
        const blob = await response.blob();
        const file = new File([blob], 'picrush-photo.jpg', { type: blob.type });
        files.push(file);
      }
  
      // Step 2: Check for native support
      if (navigator.canShare && navigator.canShare({ files })) {
        await navigator.share({
          files,
        });
      } else {
        throw new Error("Native share not supported");
      }
  
    } catch (error) {
      console.warn("Native share failed or not supported, using WhatsApp fallback:", error);
  
      try {
        const urls = pickedImages.map(img => img.src);
        const shortUrls = await shortenUrls(urls);
        const message = `Here are my photos from the wedding, shared with you via Picrush 💕\n\n${shortUrls.join("\n")}`;
        const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, "_blank");
      } catch (linkError) {
        console.error("Fallback to WhatsApp also failed:", linkError);
      }
    } finally {
      setIsLoading(false);
    }
  };  
  
  const downloadAllHandler = async () => {
    if (pickedImages.length === 0) return;
    setIsLoading(true);

    for (const [index, image] of pickedImages.entries()) {
      try {
        const response = await fetch(image.src);
        if (!response.ok) throw new Error("Failed to download image");

        const blob = await response.blob();
        const blobURL = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobURL;
        link.download = `image-${index + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobURL);
      } catch (error) {
        console.error("Error downloading image:", error);
      }
    }

    setIsLoading(false);
  };

  return (
    <div className={classes.bottomActionsWrapper}>
      <div className={classes.roundBtnsWrapper}>
        <button
          type="button"
          className={`${classes.roundBtn} ${classes.shareViaWhatsapp}`}
          onClick={shareHandler}
        >
          <img
            className={classes.icon}
            src={shareIcon}
            alt="share via whatsapp"
            loading="lazy"
          />
        </button>

        <button
          type="button"
          className={`${classes.roundBtn} ${classes.downloadAll}`}
          onClick={downloadAllHandler}
        >
          <img
            className={classes.icon}
            src={downloadImg}
            alt="download all images"
            loading="lazy"
          />
        </button>

        {allowRemoving && (
          <button
            type="button"
            className={`${classes.roundBtn} ${classes.removeAll}`}
            onClick={removeAllHandler}
          >
            <img className={classes.icon} src={trashIcon} alt="remove images" loading="lazy" />
          </button>
        )}
      </div>

      <button
        type="button"
        className={`${classes.btn} ${classes.deselectAll}`}
        onClick={deselectAllHandler}
      >
        Cancel
      </button>
    </div>
  );
};

export default GalleryBottomActions;
