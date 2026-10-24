import Button from "../Button";
import { THUMBNAIL_CATEGORIES } from "../../data/generator";

interface CategoryPickerProps {
  value: string;
  onChange: (category: string) => void;
}

export default function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  return (
    <div>
      <p className="text-xs leading-relaxed text-text-secondary">
        Tell the AI which niche this is for, so it uses the look viewers expect from it.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {THUMBNAIL_CATEGORIES.map(({ label, icon: Icon }) => {
          const isSelected = label === value;

          return (
            <Button
              key={label}
              type="button"
              size="xs"
              rounded="lg"
              fullWidth={false}
              variant={isSelected ? "inverse" : "secondary"}
              aria-pressed={isSelected}
              onClick={() => onChange(label)}
            >
              <Icon size={14} />
              {label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
