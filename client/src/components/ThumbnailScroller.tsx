import Marquee from "react-fast-marquee";
import { useTheme } from "../store/useTheme";
import { Sparkles } from "lucide-react";
import type { ThumbnailScrollerProps } from "../types";

// Lives in client/public/assets, so these are served from the site root.
const THUMBNAILS = Array.from(
  { length: 7 },
  (_, i) => `/assets/thumb_${i + 1}.jpg`,
);

const ThumbnailScroller = ({
  images = THUMBNAILS,
  direction = "left",
  speed = 25,
  pauseOnHover = true,
  className = "",
}: ThumbnailScrollerProps) => {
  const { theme } = useTheme();
  const gradientColor = theme === "dark" ? "#000" : "#fff";
  return (
    <Marquee
      className={className}
      direction={direction}
      speed={speed}
      gradient={true}
      gradientWidth={300}
      gradientColor={gradientColor}
      pauseOnHover={pauseOnHover}
      autoFill
    >
      {images.map((src, index) => (
        <div
          key={`${src}-${index}`}
          className="group relative mx-2 w-65 md:w-75 shrink-0 overflow-hidden rounded-xl border border-border shadow-[0_2px_16px_-4px_rgba(0,0,0,0.15)]"
        >
          <img
            src={src}
            alt="AI generated thumbnail"
            loading="lazy"
            decoding="async"
            className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
          <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[0.5rem] text-white backdrop-blur-sm">
            <Sparkles size={10} className="text-primary" />
            AI Generated
          </span>
        </div>
      ))}
    </Marquee>
  );
};

export default ThumbnailScroller;
