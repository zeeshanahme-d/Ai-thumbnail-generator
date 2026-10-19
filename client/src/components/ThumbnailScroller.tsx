import type { ThumbnailScrollerProps } from "../types";

// A row of thumbnails sliding sideways forever, in pure CSS (animate-marquee in globals.css).
// The track holds the list twice and slides by one copy, so the loop has no seam.
// Hover pauses it; with reduced motion on it stands still.
const ThumbnailScroller = ({ items, direction = "left", duration = 60, className = "" }: ThumbnailScrollerProps) => (
  <div className={`marquee-fade overflow-hidden ${className}`}>
    <div
      className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none"
      style={{ animationDuration: `${duration}s`, animationDirection: direction === "right" ? "reverse" : "normal" }}
    >
      {[...items, ...items].map((item, index) => {
        const isCopy = index >= items.length;

        return (
          <img
            key={`${item.src}-${index}`}
            src={item.src}
            alt={isCopy ? "" : item.alt}
            aria-hidden={isCopy || undefined}
            width={item.width}
            height={item.height}
            decoding="async"
            className="mr-3 h-36 w-auto shrink-0 rounded-xl border border-border object-cover sm:h-44 md:mr-4 lg:h-52"
          />
        );
      })}
    </div>
  </div>
);

export default ThumbnailScroller;
