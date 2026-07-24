import type { ReactNode } from 'react';

export interface IConfirmationModalProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  /** Icon shown in the circular badge above the title. */
  icon?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  /** Renders the confirm action in a destructive (red) style. */
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
