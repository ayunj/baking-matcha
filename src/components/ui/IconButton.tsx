import type { ReactNode } from "react";
import styles from "@/styles/app.module.css";

type IconButtonProps = {
  onClick: (e: React.MouseEvent) => void;
  children: ReactNode;
  danger?: boolean;
  className?: string;
};

export function IconButton({
  onClick,
  children,
  danger,
  className,
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.ibt} ${danger ? styles.ibtDel : ""} ${className ?? ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
