import { RotateCcw } from "lucide-react";
import Button from "./Button";
import type { ListErrorProps } from "../types";

// Shown when a thumbnail list fails to load, so a failure never reads as an empty list.
export default function ListError({ onRetry, className = "" }: ListErrorProps) {
  return (
    <div role="alert" className={`flex flex-col items-center gap-4 text-center ${className}`}>
      <p className="text-sm text-text-secondary">Couldn't load thumbnails. Try again in a moment.</p>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        rounded="lg"
        fullWidth={false}
        onClick={() => onRetry()}
      >
        <RotateCcw size={14} />
        Try again
      </Button>
    </div>
  );
}
