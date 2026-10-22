import Eyebrow from "../Eyebrow";
import { ASPECT_RATIOS } from "../../data/generator";

interface AspectRatioPickerProps {
  value: string;
  onChange: (aspectRatio: string) => void;
}

export default function AspectRatioPicker({
  value,
  onChange,
}: AspectRatioPickerProps) {
  return (
    <div>
      <Eyebrow>Aspect ratio &amp; format</Eyebrow>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ASPECT_RATIOS.map((option) => {
          const isSelected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={isSelected}
              className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border py-3 transition-colors ${
                isSelected
                  ? "border-text-primary bg-background-surface-2"
                  : "border-border hover:border-border-strong"
              }`}
            >
              <span className="flex h-10 items-center justify-center">
                <span
                  style={{ aspectRatio: option.ratio }}
                  className={`block h-full max-w-14 rounded border-2 ${
                    isSelected ? "border-text-primary" : "border-text-muted"
                  }`}
                />
              </span>
              <span
                className={`font-mono text-sm tabular-nums ${
                  isSelected ? "text-text-primary" : "text-text-secondary"
                }`}
              >
                {option.value}
              </span>
              <span className="text-[11px] text-text-muted">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
