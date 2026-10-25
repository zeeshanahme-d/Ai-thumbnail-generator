import { useId, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff, X, type LucideIcon } from "lucide-react";
import Button from "./Button";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  onClear?: () => void;
  /** Visible label tied to the input, so screen readers and password managers can name it. */
  label?: string;
}

export default function Input({ icon: Icon, onClear, label, id, type, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  const field = (
    <div className="flex h-12 items-center gap-2 rounded-lg border border-border bg-background-surface px-4 transition-colors focus-within:border-primary">
      {Icon ? <Icon size={18} className="shrink-0 text-text-muted" /> : <></>}
      <input
        {...props}
        id={inputId}
        type={isPassword && showPassword ? "text" : type}
        className="w-full border-none bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
      />
      {isPassword && (
        <Button
          type="button"
          variant="ghost"
          size="iconSm"
          rounded="lg"
          onClick={() => setShowPassword((shown) => !shown)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          aria-controls={inputId}
          className="-mr-2 shrink-0 text-text-muted hover:text-text-primary"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </Button>
      )}
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

  if (!label) return field;

  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-text-secondary">
        {label}
      </label>
      {field}
    </div>
  );
}
