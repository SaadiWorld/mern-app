import ReactDOM from "react-dom";

import Backdrop from "./Backdrop";
import type { ModalProps } from "../../../types/ui";
import styles from "./Modal.module.css";

const ModalOverlay = (props: ModalProps) => {
  const content = (
    <div
      className={`${styles.modal} ${
        props.show ? styles["modal--open"] : styles["modal--closed"]
      } ${props.className || ""}`}
      style={props.style}
    >
      <header className={`${styles.modal__header} ${props.headerClass || ""}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
        }
      >
        <div className={`${styles.modal__content} ${props.contentClass || ""}`}>
          {props.children}
        </div>
        <footer
          className={`${styles.modal__footer} ${props.footerClass || ""}`}
        >
          {props.footer}
        </footer>
      </form>
    </div>
  );
  const target = document.getElementById("modal-hook");

  return target ? ReactDOM.createPortal(content, target) : null;
};

const Modal = (props: ModalProps) => {
  return (
    <>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <ModalOverlay {...props} />
    </>
  );
};

export default Modal;
