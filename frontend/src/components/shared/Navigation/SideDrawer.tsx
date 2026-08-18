import ReactDOM from "react-dom";

import type { SideDrawerProps } from "../../../types/ui";
import styles from "./SideDrawer.module.css";

const SideDrawer = (props: SideDrawerProps) => {
  const content = (
    <aside
      className={`${styles["side-drawer"]} ${
        props.show ? styles["side-drawer--open"] : styles["side-drawer--closed"]
      }`}
      onClick={props.onClick}
    >
      {props.children}
    </aside>
  );

  const target = document.getElementById("drawer-hook");

  return target ? ReactDOM.createPortal(content, target) : null;
};

export default SideDrawer;
