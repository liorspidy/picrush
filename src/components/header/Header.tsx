import classes from './Header.module.scss';

const Header = () => {
  return (
    <header className={classes.header}>
        <div className={classes.logoWrapper}>
            <p className={classes.logo}>PICRUSH</p>
        </div>
    </header>
  )
}

export default Header