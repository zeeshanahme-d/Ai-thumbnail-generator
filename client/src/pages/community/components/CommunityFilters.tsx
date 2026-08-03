import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useMemo, useState } from "react";
import { debounce } from "../../../lib/herlper-fuctions";
import { Search } from "lucide-react";
import type { CommunityFiltersProps } from "../../../types";
import { SORT_TABS, STYLE_DOTS, STYLE_FILTERS } from "../../../data/community";

export default function CommunityFilters({
  setParams,
  search: externalSearch,
  onSearchChange,
  sort,
  onSortChange,
  activeStyle,
  onStyleChange,
}: CommunityFiltersProps) {
  const [internalSearch, setInternalSearch] = useState('');
  const searchValue = externalSearch !== undefined ? externalSearch : internalSearch;

  const debouncedSetParams = useMemo(() =>
    debounce((value: string) => {
      if (setParams) {
        setParams((prev) => ({ ...prev, search: value, page: 1 }));
      }
      if (onSearchChange) {
        onSearchChange(value);
      }
    }, 400),
    [setParams, onSearchChange]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setInternalSearch(next);
    debouncedSetParams(next.trim());
  };
  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Input
            icon={Search}
            type="text"
            value={searchValue}
            onChange={handleChange}
            placeholder="Search thumbnails..."
            className="w-full"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {SORT_TABS.map((tab) => (
            <Button
              key={tab.value}
              type="button"
              onClick={() => onSortChange(tab.value)}
              fullWidth={false}
              variant="secondary"
              className={`flex items-center gap-2 py-1.5! ${sort === tab.value
                ? "border-primary! bg-primary! text-text-on-primary!"
                : "border-border! text-text-secondary! hover:text-text-primary!"
                }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {STYLE_FILTERS.map((style) => {
          const isActive = activeStyle === style;
          const dot = STYLE_DOTS[style];
          return (
            <Button
              key={style}
              type="button"
              fullWidth={false}
              variant="secondary"
              onClick={() => onStyleChange(style)}
              className={`flex items-center gap-2 py-1.5! ${isActive
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-text-secondary hover:text-text-primary"
                }`}
            >
              {dot && <span className={`size-2 rounded-full ${dot}`} />}
              {style}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
