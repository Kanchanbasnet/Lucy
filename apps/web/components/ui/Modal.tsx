'use client';

import { ReactNode } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnOverlay?: boolean;
}

export function Modal({ open, onClose, closeOnOverlay = true, children }: ModalProps) {
  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlay) {
      onClose();
    }
  };

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.sheet} onClick={handleModalContentClick}>
        <button className={styles.close} onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
