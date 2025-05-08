import { useState } from 'react';
import classes from './Header.module.scss';
import { useFirebaseContext } from '@/hooks/useFirebase';

const Header = () => {
  const { val } = useFirebaseContext();
  const [maxVal, setMaxVal] = useState<number>(20);

  return (
    <header className={classes.header}>
        <div className={classes.logoWrapper}>
            <p className={classes.logo}>PICRUSH</p>
        </div>

        <label className={classes.barLabel} htmlFor="bar">Uploades Left</label>
        <div className={classes.imagesLeft}>
          <span className={classes.value}>{val}</span>
          <div className={classes.bar}>
            <span className={classes.progress} style={{
              width: `${(val / maxVal) * 100}%`,
              borderRadius: val === maxVal ? '20px' : '20px 10px 10px 20px'
              }}></span>
          </div>
          <span className={classes.value}>{maxVal}</span>
        </div>
    </header>
  )
}

export default Header