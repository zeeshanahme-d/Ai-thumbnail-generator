import Eyebrow from "../../../components/Eyebrow";
import { sampleThumbnails } from "../../../data/hero";
import { THUMBNAIL_FORMATS, THUMBNAIL_STYLES, THUMBNAIL_STYLES_COLORS } from "../../../data/generator";

// The 16:9 samples, split into two columns.
const wideSamples = sampleThumbnails.filter(({ width, height }) => width !== height);
const columns = [wideSamples.filter((_, i) => i % 2 === 0), wideSamples.filter((_, i) => i % 2 === 1)];

// The right half of the auth pages from lg up: the sample thumbnails running off the top,
// over the homepage's promise. Decoration only; the form on the left is the page.
export default function AuthShowcase() {
  return (
    <aside className="relative hidden overflow-hidden border-l border-border bg-background-surface lg:flex lg:flex-col lg:justify-end">
      <div aria-hidden="true" className="backdrop-grid pointer-events-none absolute inset-0" />

      <div
        aria-hidden="true"
        className="absolute inset-x-12 top-0 grid grid-cols-2 gap-4 [mask-image:linear-gradient(to_bottom,black_40%,transparent_80%)]"
      >
        {columns.map((column, index) => (
          <div key={index} className={`flex flex-col gap-4 ${index === 0 ? "-translate-y-16" : "-translate-y-2"}`}>
            {column.map(({ src }) => (
              <img
                key={src}
                src={src}
                alt=""
                width={640}
                height={357}
                loading="lazy"
                decoding="async"
                className="aspect-video w-full rounded-xl border border-border object-cover shadow-card"
              />
            ))}
          </div>
        ))}
      </div>

      <div aria-hidden="true" className="backdrop-grain pointer-events-none absolute inset-0" />

      <div className="relative p-12 xl:p-16">
        <Eyebrow dot>AI thumbnail generator</Eyebrow>
        <p className="mt-5 max-w-[16ch] text-[clamp(2rem,1.2rem+2vw,3rem)] font-medium leading-[1.04] tracking-[-0.035em] text-text-primary">
          Thumbnails that earn the <span className="text-primary">click.</span>
        </p>
        <p className="mt-5 font-mono text-xs uppercase tracking-[0.06em] text-text-muted">
          {THUMBNAIL_STYLES.length} styles · {THUMBNAIL_FORMATS.length} formats · {THUMBNAIL_STYLES_COLORS.length} color schemes
        </p>
      </div>
    </aside>
  );
}
