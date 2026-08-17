import type { CSSProperties, ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const Card = ({ className, style, children }: CardProps) => {
  return (
    <div className={`${styles.card} ${className || ""}`} style={style}>
      {children}
    </div>
  );
};

export default Card;
