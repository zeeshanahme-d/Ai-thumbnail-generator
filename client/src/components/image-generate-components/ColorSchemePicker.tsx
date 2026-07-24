import { CircleCheck, Sparkles } from "lucide-react";
import { THUMBNAIL_STYLES_COLORS } from "../../data/generator";

interface ColorSchemePickerProps {
  value: string;
  onChange: (style: string) => void;
}

export default function ColorSchemePicker({
  value,
  onChange,
}: ColorSchemePickerProps) {
  const selectedStyle = THUMBNAIL_STYLES_COLORS.find(
    (scheme) => scheme.label === value,
  );

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {THUMBNAIL_STYLES_COLORS.map((scheme) => {
          const isSelected = scheme.label === value;

          return (
            <button
              key={scheme.label}
              type="button"
              onClick={() => onChange(scheme.label)}
              aria-pressed={isSelected}
              className={`rounded-xl cursor-pointer border p-1.5 transition ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-text-muted"
              }`}
            >
              <div className="flex relative h-14 rounded-lg overflow-hidden">
                {scheme.schemeColors.map((color) => (
                  <div
                    key={color}
                    className="flex-1 "
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
                {isSelected && (
                  <CircleCheck
                    size={18}
                    className="absolute right-1.5 top-1.5 fill-primary text-white"
                  />
                )}
              </div>
              <span
                className={`mt-2 block truncate text-xs font-medium ${
                  isSelected ? "text-primary" : "text-text-secondary"
                }`}
              >
                {scheme.label}
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
