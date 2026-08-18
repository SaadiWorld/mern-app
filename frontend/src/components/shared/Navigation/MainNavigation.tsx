import { useState } from "react";
import { Link } from "react-router";

import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";
import styles from "./MainNavigation.module.css";

const MainNavigation = () => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };

  return (
    <>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        <nav className={styles["main-navigation__drawer-nav"]}>
          <NavLinks />
        </nav>
      </SideDrawer>

      <MainHeader>
        <button
          className={styles["main-navigation__menu-btn"]}
          onClick={openDrawerHandler}
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className={styles["main-navigation__title"]}>
          <Link to="/">YourPlaces</Link>
        </h1>
        <nav className={styles["main-navigation__header-nav"]}>
          <NavLinks />
        </nav>
      </MainHeader>
    </>
  );
};

export default MainNavigation;
