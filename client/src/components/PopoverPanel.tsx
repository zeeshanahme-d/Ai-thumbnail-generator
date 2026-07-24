import { useRef, type ReactNode, type ToggleEvent } from "react";
import Button from "./Button";

interface PopoverPanelProps {
  id: string;
  title: string;
  children: ReactNode;
  onOpenChange?: (isOpen: boolean) => void;
}

export default function PopoverPanel({
  id,
  title,
  children,
  onOpenChange,
}: PopoverPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={panelRef}
      id={id}
      popover="auto"
      onToggle={(event: ToggleEvent<HTMLDivElement>) =>
        onOpenChange?.(event.newState === "open")
      }
      className="prompt-popover"
    >
      <div className="w-[min(40rem,calc(100vw-2rem))] rounded-2xl border border-border bg-background-card p-5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">
            {title}
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            fullWidth={false}
            onClick={() => panelRef.current?.hidePopover()}
            className="uppercase tracking-wide"
          >
            Done
          </Button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
