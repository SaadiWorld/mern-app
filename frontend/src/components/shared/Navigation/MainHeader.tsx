import type { ReactNode } from "react";

import styles from "./MainHeader.module.css";

const MainHeader = ({ children }: { children?: ReactNode }) => {
  return <header className={styles["main-header"]}>{children}</header>;
};

export default MainHeader;
