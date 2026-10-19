import { CircleCheck } from "lucide-react";
import Eyebrow from "../Eyebrow";
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
              className={`cursor-pointer rounded-xl border p-1.5 transition-colors ${
                isSelected
                  ? "border-text-primary bg-background-surface-2"
                  : "border-border hover:border-border-strong"
              }`}
            >
              <div className="relative flex h-14 overflow-hidden rounded-lg">
                {scheme.schemeColors.map((color) => (
                  <div
                    key={color}
                    className="flex-1"
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
                {isSelected && (
                  <CircleCheck
                    size={18}
                    className="absolute right-1.5 top-1.5 fill-text-primary text-background"
                  />
                )}
              </div>
              <span
                className={`mt-2 block truncate text-xs font-medium ${
                  isSelected ? "text-text-primary" : "text-text-secondary"
                }`}
              >
                {scheme.label}
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
