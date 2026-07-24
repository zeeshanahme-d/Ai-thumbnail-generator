import { CircleCheck, Sparkles } from "lucide-react";
import { THUMBNAIL_STYLES } from "../../data/generator";

interface StylePickerProps {
  value: string;
  onChange: (style: string) => void;
}

export default function StylePicker({ value, onChange }: StylePickerProps) {
  const selectedStyle = THUMBNAIL_STYLES.find((style) => style.label === value);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {THUMBNAIL_STYLES.map((style) => {
          const isSelected = style.label === value;

          return (
            <button
              key={style.label}
              type="button"
              onClick={() => onChange(style.label)}
              aria-pressed={isSelected}
              className={`rounded-xl cursor-pointer border p-1.5 transition ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-text-muted"
              }`}
            >
              <span className="relative block h-14 rounded-lg bg-linear-to-b from-slate-200 to-slate-400">
                {isSelected && (
                  <CircleCheck
                    size={18}
                    className="absolute right-1.5 top-1.5 fill-primary text-white"
                  />
                )}
              </span>
              <span
                className={`mt-2 block truncate text-xs font-medium ${
                  isSelected ? "text-primary" : "text-text-secondary"
                }`}
              >
                {style.label}
              </span>
            </button>
          );
        })}
      </div>

      {selectedStyle && (
        <div className="mt-4 flex gap-3 rounded-xl border border-border bg-background-surface p-4">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles size={15} />
          </span>
          <p className="text-xs leading-relaxed text-text-secondary">
            <span className="font-semibold text-text-primary">
              {selectedStyle.label} Presets
            </span>{" "}
            {selectedStyle.description}
          </p>
        </div>
      )}
    </div>
  );
}
