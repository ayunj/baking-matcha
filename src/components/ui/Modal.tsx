"use client";

import type { ReactNode } from "react";
import styles from "@/styles/app.module.css";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className={styles.ovlOpen}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </div>
  );
}
