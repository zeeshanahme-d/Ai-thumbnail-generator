import { CircleCheck } from "lucide-react";
import Eyebrow from "../Eyebrow";
import { THUMBNAIL_STYLES } from "../../data/generator";
import { STYLE_DOTS } from "../../data/community";

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
              className={`cursor-pointer rounded-xl border p-1.5 transition-colors ${
                isSelected
                  ? "border-text-primary bg-background-surface-2"
                  : "border-border hover:border-border-strong"
              }`}
            >
              {/* Each style's color dot, the same one the community filters use */}
              <span className="relative flex h-14 items-center justify-center rounded-lg bg-background-surface">
                <span className={`size-3 rounded-full ${STYLE_DOTS[style.label] ?? "bg-text-muted"}`} />
                {isSelected && (
                  <CircleCheck
                    size={18}
                    className="absolute right-1.5 top-1.5 fill-text-primary text-background"
                  />
                )}
              </span>
              <span
                className={`mt-2 block truncate text-xs font-medium ${
                  isSelected ? "text-text-primary" : "text-text-secondary"
                }`}
              >
                {style.label}
              </span>
            </button>
          );
        })}
      </div>

      {selectedStyle && (
        <div className="mt-4 rounded-xl border border-border bg-background-surface p-4">
          <Eyebrow>{selectedStyle.label}</Eyebrow>
          <p className="mt-2 text-xs leading-relaxed text-text-secondary">
            {selectedStyle.description}
          </p>
        </div>
      )}
    </div>
  );
}
