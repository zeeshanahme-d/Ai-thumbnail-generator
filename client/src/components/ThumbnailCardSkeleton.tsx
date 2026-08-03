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
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="mt-1.5 h-4 w-1/2" />

        <div className="flex justify-between items-center">
          {/* Author avatar + name */}
          <div className="mt-3 flex items-center gap-2">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>

          {/* Stats row (likes / views / time) — hidden when recycle bin */}
          {!showRecycleBinActions && (
            <div className="mt-3 flex items-center gap-3">
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-10" />
            </div>
          )}
        </div>

        {/* Recycle-bin action buttons */}
        {showRecycleBinActions && (
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-32 rounded-lg" />
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
