import type { CSSProperties } from "react";
import styles from "./Avatar.module.css";

interface AvatarProps {
  image: string;
  alt: string;
  width?: string;
  className?: string;
  style?: CSSProperties;
}

const Avatar = ({ image, alt, width, className, style }: AvatarProps) => {
  return (
    <div className={`${styles.avatar} ${className || ""}`} style={style}>
      <img src={image} alt={alt} style={{ width: width, height: width }} />
    </div>
  );
};

export default Avatar;
