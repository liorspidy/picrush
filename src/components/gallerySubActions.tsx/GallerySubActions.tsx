import classes from "./GallerySubActions.module.scss";
import arrowUp from "@/assets/icons/arrow.svg";
import arrowDown from "@/assets/icons/arrow-down.svg";
import { useAppContext } from "@/store/useAppContext";

interface GallerySubActionsProps {
  sortingMethod: number;
  setSortingMethod: React.Dispatch<React.SetStateAction<number>>;
  isUserBased: boolean;
  setIsUserBased: React.Dispatch<React.SetStateAction<boolean>>;
  deselectAllHandler: () => void;
}

const GallerySubActions = ({
  sortingMethod,
  setSortingMethod,
  setIsUserBased,
  isUserBased,
  deselectAllHandler,
}: GallerySubActionsProps) => {
  const {language} = useAppContext();
  const isHebrew = language === "HE";

  // switchs the sorting method
  const switchSortingHandler = () => {
    setSortingMethod((prev) => (prev === 1 ? 0 : 1));
  };

  // switchs the showing method
  const switchShowMeHandler = () => {
    localStorage.setItem("showme", (!isUserBased).toString());
    setIsUserBased((prev) => (prev = !prev));
    deselectAllHandler();
  };

  return (
    <div className={`${classes.subActions} ${isHebrew ? classes.hebrew : null}`}>
      <button
        type="button"
        className={classes.sortBy}
        onClick={switchSortingHandler}
      >
        <p className={classes.text}>{isHebrew ? "מיין לפי:" : "Sort by:"}</p>
        <div className={classes.sortMethod}>
          <img
            className={classes.icon}
            src={sortingMethod === 1 ? arrowDown : arrowUp}
            alt="sorting method"
            loading="lazy"
            aria-label={sortingMethod === 1 ? "descending" : "ascending"}
          />
        </div>
      </button>

      <button
        type="button"
        className={classes.showMe}
        onClick={switchShowMeHandler}
      >
        <p className={classes.text}>{isHebrew ? "הצג:" : "show me:"}</p>
        <span className={classes.showMethod}>
          {isUserBased ? isHebrew ? "רק שלי" : "only me" : isHebrew ?  "של כולם" : "all"}
        </span>
      </button>
    </div>
  );
};

export default GallerySubActions;
