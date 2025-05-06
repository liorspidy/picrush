import { useEffect, useState } from "react";
import classes from "./Gallery.module.scss";
import img1 from "@/assets/stockImages/360_F_281433227_vhKFUbLpKSvWnXxl8TV3uDIgu52Fs4id.jpg";
import img2 from "@/assets/stockImages/bride-and-groom-together-for-a-portrait-in-a-vineyard-in-oregon-on-DTX2DP.jpg";
import img3 from "@/assets/stockImages/download (1).jpeg";
import img4 from "@/assets/stockImages/download (2).jpeg";
import img5 from "@/assets/stockImages/download.jpeg";
import img6 from "@/assets/stockImages/happy-wedding-couple-bride-groom-600nw-2478961111.webp";
import img7 from "@/assets/stockImages/sourced-co-wedding-stock-photos-12.jpg";
import img8 from "@/assets/stockImages/wedding-1183270_640.jpg";
import closeImg from '@/assets/icons/close.svg';
import downloadImg from '@/assets/icons/download.svg';
import arrowUp from '@/assets/icons/arrow.svg';
import arrowDown from '@/assets/icons/arrow-down.svg';
import type { IPic } from '@/interfaces/pic.interface';

const Gallery = () => {
  const [images, setImages] = useState<IPic[]>([]);
  const [filteredImages , setFilteredImages] = useState<IPic[]>([]);
  const [currentPicture ,setCurrentPicture] = useState<IPic | null>(null);
  const [sortingMethod , setSortingMethod] = useState<number>(1);

  const fetchImages = async () => {
    // try {
    //   const response = await fetch('').json();
    // } catch{

    // }
    // TODO: remove and replace with firebase
    const imagesArray: IPic[] = [
      { id: 1, src: img1, uploadTime: new Date('2023-01-01T10:00:00') },
      { id: 2, src: img2, uploadTime: new Date('2023-01-02T11:00:00') },
      { id: 3, src: img3, uploadTime: new Date('2023-01-03T12:00:00') },
      { id: 4, src: img4, uploadTime: new Date('2023-01-04T13:00:00') },
      { id: 5, src: img5, uploadTime: new Date('2023-01-05T14:00:00') },
      { id: 6, src: img6, uploadTime: new Date('2023-01-06T15:00:00') },
      { id: 7, src: img7, uploadTime: new Date('2023-01-07T16:00:00') },
      { id: 8, src: img8, uploadTime: new Date('2023-01-08T17:00:00') },
    ];
    setImages(imagesArray);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const pictureHandler = (picture: IPic) => {
    setCurrentPicture(picture);
  }

  const closePictureHandler = () => {
    setCurrentPicture(null);
  }

  const downloadHandler = () => {
    if (currentPicture) {
      const link = document.createElement('a');
      link.href = currentPicture.src;
      link.download = `image-${currentPicture.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  const switchSortingHandler = () => {
    setSortingMethod((prev) => (prev === 1 ? 0 : 1))
  }

  useEffect(() => {
    if(images) {
      const sortedImages = [...images].sort((a, b) => sortingMethod === 1 ? b.uploadTime.getTime() - a.uploadTime.getTime() : a.uploadTime.getTime() - b.uploadTime.getTime());
      setFilteredImages(sortedImages);
    }
  },[sortingMethod,images])

  useEffect(() => {
    if(currentPicture) {
      const bodyRef = document.body;
      bodyRef.style.overflow = 'hidden';

      return () => {
        bodyRef.style.overflow = 'auto';
      };
    }
  },[currentPicture])

  const imagesGrid = filteredImages.map((img) => {
    return (
      <button key={img.id} className={classes.imageBtn} onClick={() => pictureHandler(img)}>
        <img className={classes.image} src={img.src} alt="image" />
      </button>
    );
  })

  return (
    <div className={classes.gallery}>
     {currentPicture && 
      <div className={classes.backdrop} onClick={closePictureHandler}>
        <div className={classes.actions}>
          <button className={classes.btn} onClick={closePictureHandler}>
            <img className={classes.icon} src={closeImg} alt="close image" />
          </button>

          <button className={classes.btn} onClick={downloadHandler}>
            <img className={classes.icon} src={downloadImg} alt="download image" />
          </button>
        </div>
        <div className={classes.currentPicWrapper} onClick={(e) => {e.stopPropagation()}}>
          <img className={classes.currentPic} src={currentPicture?.src} alt={currentPicture?.src} />
        </div>
      </div>
      }

      <div className={classes.textWrapper}>
        <h1 className={classes.mainTitle}>{`Netanela \u00A0&\u00A0 Lior`}</h1>
        <p className={classes.mainDate}>02/02/2026</p>
      </div>

      <div className={classes.sortBy}>
        <p className={classes.text}>sort by:</p>
        <button className={classes.sortMethod} onClick={switchSortingHandler}>
          <img className={classes.icon} src={sortingMethod === 1 ? arrowDown : arrowUp} alt="sorting method" />
        </button>
      </div>

      <div className={classes.imagesGrid}>
        {imagesGrid}
      </div>
    </div>
  );
};

export default Gallery;
