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
      <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">
        Aspect ratio &amp; format
      </p>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ASPECT_RATIOS.map((option) => {
          const isSelected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={isSelected}
              className={`flex flex-col cursor-pointer items-center gap-1.5 rounded-xl border py-3 transition ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-text-muted"
              }`}
            >
              <span className="flex h-10 items-center justify-center">
                <span
                  style={{ aspectRatio: option.ratio }}
                  className={`block h-full max-w-14 rounded border-2 ${
                    isSelected ? "border-primary" : "border-text-muted"
                  }`}
                />
              </span>
              <span
                className={`text-sm font-semibold ${
                  isSelected ? "text-primary" : "text-text-primary"
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
