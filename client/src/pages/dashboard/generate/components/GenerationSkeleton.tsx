import { Loader2 } from "lucide-react";
import Eyebrow from "../../../../components/Eyebrow";
import Skeleton from "../../../../components/Skeleton";

// Shown in place of the prompt while a thumbnail is being generated.
export default function GenerationSkeleton() {
  return (
    <div role="status" className="rounded-2xl border border-border bg-background-card p-5 shadow-card sm:p-6">
      <div className="border-b border-border pb-4">
        <Eyebrow dot>Generating</Eyebrow>
      </div>

      <div className="relative mt-5 aspect-video w-full overflow-hidden rounded-xl border border-border bg-background-surface-2">
        <Skeleton className="h-full w-full rounded-none" />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <Loader2 size={24} className="animate-spin text-text-secondary" />
          <p className="text-base font-medium text-text-primary">Generating your thumbnail</p>
          <p className="max-w-sm text-sm leading-relaxed text-text-secondary">
            This usually takes under a minute. Keep this tab open.
          </p>
        </div>
      </div>
    </div>
  );
}
