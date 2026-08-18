import type { CSSProperties, ReactNode, SubmitEvent } from "react";

export interface ButtonProps {
  children?: ReactNode;
  href?: string;
  to?: string;
  size?: "small" | "default" | "big";
  inverse?: boolean;
  danger?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
}

export interface MapProps {
  center: { lat: number; lng: number };
  zoom: number;
  className?: string;
  style?: CSSProperties;
}

export interface BackdropProps {
  onClick: () => void;
}

export interface SideDrawerProps {
  show: boolean;
  onClick: () => void;
  children?: ReactNode;
}

export interface ModalProps {
  show: boolean;
  onCancel: () => void;
  header?: string;
  headerClass?: string;
  contentClass?: string;
  footerClass?: string;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  onSubmit?: (event: SubmitEvent<HTMLFormElement>) => void;
}
