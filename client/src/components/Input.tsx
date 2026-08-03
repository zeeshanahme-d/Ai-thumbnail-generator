import type { InputHTMLAttributes } from "react";
import { X, type LucideIcon } from "lucide-react";
import Button from "./Button";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  onClear?: () => void;
}

export default function Input({ icon: Icon, onClear, ...props }: InputProps) {
  return (
    <div className="flex h-12 items-center gap-2 rounded-lg border border-border bg-background-surface px-4 transition-colors focus-within:border-primary">
      {Icon ? <Icon size={18} className="shrink-0 text-text-muted" /> : <></>}
      <input
        {...props}
        className="w-full border-none bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
      />
      {onClear ?
        <Button type="button"
          variant="secondary"
          size="xs"
          onClick={onClear}
          className="rounded-lg">
          <X size={18} className="shrink-0 text-text-muted" />
        </Button> : <></>}
    </div>
  );
}
