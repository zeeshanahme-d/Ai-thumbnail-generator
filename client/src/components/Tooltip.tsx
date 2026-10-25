import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { InsideTooltip } from "../lib/tooltipContext";

const GAP = 8;
const VIEWPORT_MARGIN = 8;
const SHOW_DELAY_MS = 200;

interface TooltipProps {
  label: string;
  children: ReactNode;
  /** "right" suits a vertical list such as the collapsed sidebar. */
  side?: "top" | "right";
}

/**
 * Shows `label` above its child (below when there is no room) on mouse hover or keyboard focus.
 * It is a manual popover, so it renders in the top layer and no `overflow-hidden` parent clips it.
 * The text is visual only: the child must carry the same name itself (an aria-label).
 */
export default function Tooltip({ label, children, side = "top" }: TooltipProps) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<number | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const show = () => {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
  };

  const hide = () => {
    window.clearTimeout(timerRef.current);
    setOpen(false);
  };

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  useLayoutEffect(() => {
    const tip = tipRef.current;
    // The wrapper is display: contents and has no box, so its first child is what gets measured.
    const trigger = wrapperRef.current?.firstElementChild;
    if (!open || !tip || !trigger) return;

    tip.showPopover();
    placeTooltip(tip, trigger, side);

    const close = () => setOpen(false);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("scroll", close, { capture: true, passive: true });
    window.addEventListener("resize", close);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("scroll", close, { capture: true });
      window.removeEventListener("resize", close);
      document.removeEventListener("keydown", closeOnEscape);
      if (tip.matches(":popover-open")) tip.hidePopover();
    };
  }, [open, label, side]);

  return (
    <span
      ref={wrapperRef}
      className="contents"
      onPointerEnter={(event) => event.pointerType === "mouse" && show()}
      onPointerLeave={hide}
      onPointerDown={hide}
      onFocus={(event) => event.target.matches(":focus-visible") && show()}
      onBlur={hide}
    >
      <InsideTooltip value>{children}</InsideTooltip>
      <span
        ref={tipRef}
        popover="manual"
        aria-hidden="true"
        className="pointer-events-none inset-auto m-0 whitespace-nowrap rounded-md border-0 bg-text-primary px-2 py-1 text-xs font-medium text-background shadow-card transition-[opacity,scale] duration-150 ease-out starting:scale-95 starting:opacity-0 motion-reduce:transition-none"
      >
        {label}
      </span>
    </span>
  );
}

// "top": centered above the trigger, flipped below near the top of the window, kept inside it
// sideways. "right": vertically centered beside it. offsetWidth/Height ignore the entrance
// scale, which getBoundingClientRect would include.
function placeTooltip(tip: HTMLElement, trigger: Element, side: "top" | "right") {
  const anchor = trigger.getBoundingClientRect();
  if (side === "right") {
    const middle = anchor.top + anchor.height / 2 - tip.offsetHeight / 2;
    const maxTop = window.innerHeight - tip.offsetHeight - VIEWPORT_MARGIN;
    tip.style.top = `${Math.max(VIEWPORT_MARGIN, Math.min(middle, maxTop))}px`;
    tip.style.left = `${anchor.right + GAP}px`;
    return;
  }

  const above = anchor.top - GAP - tip.offsetHeight;
  const centered = anchor.left + anchor.width / 2 - tip.offsetWidth / 2;
  const maxLeft = window.innerWidth - tip.offsetWidth - VIEWPORT_MARGIN;

  tip.style.top = `${above >= VIEWPORT_MARGIN ? above : anchor.bottom + GAP}px`;
  tip.style.left = `${Math.max(VIEWPORT_MARGIN, Math.min(centered, maxLeft))}px`;
}
