import Eyebrow from "../Eyebrow";

interface TextOverlayToggleProps {
  value: boolean;
  onChange: (textOverlay: boolean) => void;
}

// A native checkbox with role="switch", so keyboard and screen readers work without extra code.
export default function TextOverlayToggle({ value, onChange }: TextOverlayToggleProps) {
  return (
    <div>
      <Eyebrow>Text</Eyebrow>

      <label className="mt-3 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border p-4 transition-colors hover:border-border-strong">
        <span>
          <span className="block text-sm font-medium text-text-primary">Text on image</span>
          <span className="mt-0.5 block text-xs text-text-muted">
            {value
              ? "A short headline based on your prompt."
              : "Visuals only, with no words on the image."}
          </span>
        </span>

        <input
          type="checkbox"
          role="switch"
          checked={value}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className="relative h-5 w-9 shrink-0 rounded-full bg-border-strong transition-colors duration-200 after:absolute after:left-0.5 after:top-0.5 after:size-4 after:rounded-full after:bg-background-card after:transition-transform after:duration-200 peer-checked:bg-text-primary peer-checked:after:translate-x-4 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary"
        />
      </label>
    </div>
  );
}
