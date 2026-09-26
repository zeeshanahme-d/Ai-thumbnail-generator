import Skeleton from "./Skeleton";

interface ThumbnailCardSkeletonProps {
  showRecycleBinActions?: boolean;
  count?: number;
}

function SingleSkeleton({ showRecycleBinActions = false }: { showRecycleBinActions?: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background-card">
      {/* Image area */}
      <Skeleton className="aspect-video w-full rounded-none" />

      <div className="p-4">
        {/* Title */}
        <Skeleton className="mt-0.5 h-4 w-3/4" />
        <Skeleton className="mt-1 h-4 w-1/2" />

        <div className="mt-3.5 flex items-center justify-between gap-3">
          {/* Author avatar + name */}
          <div className="flex items-center gap-2">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>

          {/* Stats row (likes / views / time) — hidden when recycle bin */}
          {!showRecycleBinActions && (
            <div className="flex items-center gap-3">
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-10" />
            </div>
          )}
        </div>

        {/* Recycle-bin action buttons */}
        {showRecycleBinActions && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ThumbnailCardSkeleton({
  showRecycleBinActions = false,
  count = 6,
}: ThumbnailCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SingleSkeleton key={i} showRecycleBinActions={showRecycleBinActions} />
      ))}
    </>
  );
}
