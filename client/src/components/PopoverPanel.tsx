import { useRef, type ReactNode, type ToggleEvent } from "react";
import Button from "./Button";
import Eyebrow from "./Eyebrow";

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
      <div className="w-[min(40rem,calc(100vw-2rem))] rounded-2xl border border-border bg-background-card p-5 shadow-card">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
          <h3>
            <Eyebrow>{title}</Eyebrow>
          </h3>
          <Button
            type="button"
            variant="secondary"
            size="xs"
            rounded="lg"
            fullWidth={false}
            onClick={() => panelRef.current?.hidePopover()}
          >
            Done
          </Button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
