import styles from "./LoadingSpinner.module.css";

type LoadingSpinnerProps = {
  asOverlay?: boolean;
};

const LoadingSpinner = ({ asOverlay = false }: LoadingSpinnerProps) => {
  return (
    <div className={asOverlay ? styles.overlay : undefined}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default LoadingSpinner;
