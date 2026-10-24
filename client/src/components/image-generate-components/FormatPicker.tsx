import Button from "../Button";
import Eyebrow from "../Eyebrow";
import { THUMBNAIL_FORMATS } from "../../data/generator";

interface FormatPickerProps {
  value: string;
  onChange: (format: string) => void;
}

// The first format of each platform, which picking the platform selects.
const PLATFORM_DEFAULTS = THUMBNAIL_FORMATS.filter(
  (format, index) => THUMBNAIL_FORMATS.findIndex(({ platform }) => platform === format.platform) === index,
);

export default function FormatPicker({ value, onChange }: FormatPickerProps) {
  const selected = THUMBNAIL_FORMATS.find((format) => format.value === value) ?? THUMBNAIL_FORMATS[0];
  const platformFormats = THUMBNAIL_FORMATS.filter(({ platform }) => platform === selected.platform);

  return (
    <div>
      <Eyebrow>Platform</Eyebrow>
      <div className="mt-3 flex flex-wrap gap-2">
        {PLATFORM_DEFAULTS.map(({ platform, value: defaultFormat }) => {
          const isSelected = platform === selected.platform;

          return (
            <Button
              key={platform}
              type="button"
              size="xs"
              rounded="lg"
              fullWidth={false}
              variant={isSelected ? "inverse" : "secondary"}
              aria-pressed={isSelected}
              onClick={() => !isSelected && onChange(defaultFormat)}
            >
              {platform}
            </Button>
          );
        })}
      </div>

      <Eyebrow className="mt-6">Format</Eyebrow>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {platformFormats.map((format) => {
          const isSelected = format.value === value;

          return (
            <button
              key={format.value}
              type="button"
              onClick={() => onChange(format.value)}
              aria-pressed={isSelected}
              className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border py-3 transition-colors ${isSelected
                  ? "border-text-primary bg-background-surface-2"
                  : "border-border hover:border-border-strong"
                }`}
            >
              <span className="flex h-10 items-center justify-center">
                <span
                  style={{ aspectRatio: format.aspectRatio.replace(":", " / ") }}
                  className={`block h-full max-w-14 rounded border-2 ${isSelected ? "border-text-primary" : "border-text-muted"
                    }`}
                />
              </span>
              <span className={`text-sm ${isSelected ? "text-text-primary" : "text-text-secondary"}`}>
                {format.label}
              </span>
              <span className="font-mono text-[11px] tabular-nums text-text-muted">{format.aspectRatio}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
