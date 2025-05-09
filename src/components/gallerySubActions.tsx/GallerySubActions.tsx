import classes from "./GallerySubActions.module.scss";
import arrowUp from "@/assets/icons/arrow.svg";
import arrowDown from "@/assets/icons/arrow-down.svg";

interface GallerySubActionsProps {
  sortingMethod: number;
  setSortingMethod: React.Dispatch<React.SetStateAction<number>>;
  isUserBased: boolean;
  setIsUserBased: React.Dispatch<React.SetStateAction<boolean>>;
  deselectAllHandler: () => void
}

const GallerySubActions = ({
  sortingMethod,
  setSortingMethod,
  setIsUserBased,
  isUserBased,
  deselectAllHandler
}: GallerySubActionsProps) => {
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
    <div className={classes.subActions}>
      <button
        type="button"
        className={classes.sortBy}
        onClick={switchSortingHandler}
      >
        <p className={classes.text}>sort by:</p>
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
        <p className={classes.text}>show me:</p>
        <span className={classes.showMethod}>
          {isUserBased ? "only me" : "all"}
        </span>
      </button>
    </div>
  );
};

export default GallerySubActions;
