import { Link } from "react-router";

import type { ButtonProps } from "../../../types/ui";
import styles from "./Button.module.css";

const buttonClassName = (props: ButtonProps) =>
  [
    styles.button,
    styles[`button--${props.size || "default"}`],
    props.inverse ? styles["button--inverse"] : "",
    props.danger ? styles["button--danger"] : "",
  ]
    .filter(Boolean)
    .join(" ");

const Button = (props: ButtonProps) => {
  if (props.href) {
    return (
      <a className={buttonClassName(props)} href={props.href}>
        {props.children}
      </a>
    );
  }
  if (props.to) {
    return (
      <Link to={props.to} className={buttonClassName(props)}>
        {props.children}
      </Link>
    );
  }
  return (
    <button
      className={buttonClassName(props)}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
