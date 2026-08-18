import ReactDOM from "react-dom";

import type { BackdropProps } from "../../../types/ui";
import styles from "./Backdrop.module.css";

const Backdrop = ({ onClick }: BackdropProps) => {
  const target = document.getElementById("backdrop-hook");

  if (!target) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className={styles.backdrop} onClick={onClick}></div>,
    target,
  );
};

export default Backdrop;
