import { useEffect, useRef, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import Button from "../../Button";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  loading?: boolean;
  confirmDisabled?: boolean;
  /** Extra content shown under the description, such as a confirmation input. */
  children?: ReactNode;
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
  confirmDisabled = false,
  children,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-border bg-background-card p-0 text-text-primary shadow-card backdrop:bg-backdrop backdrop:backdrop-blur-sm"
    >
      <div className="p-6">
        {/* Icon: brand red for destructive actions, neutral otherwise */}
        <div
          className={`mx-auto flex size-12 items-center justify-center rounded-full ${variant === "danger"
            ? "bg-primary/10 text-primary"
            : "bg-background-surface-2 text-text-primary"
            }`}
        >
          <AlertTriangle size={22} />
        </div>

        {/* Content */}
        <h3 className="mt-4 text-center text-lg font-medium tracking-[-0.015em] text-text-primary">
          {title}
        </h3>
        <p className="mt-2 text-center text-sm leading-relaxed text-text-secondary">
          {description}
        </p>

        {children && <div className="mt-4">{children}</div>}

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            rounded="lg"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            rounded="lg"
            onClick={onConfirm}
            disabled={loading || confirmDisabled}
          >
            {loading ? "Please wait..." : confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
