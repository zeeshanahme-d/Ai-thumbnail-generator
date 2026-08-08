import Skeleton from "../../../components/Skeleton";

export default function ProfileHeaderSkeleton() {
  return (
    <>
      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <Skeleton className="size-24 rounded-full border-4 border-background-surface sm:size-32" />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {/* Name skeleton */}
        <Skeleton className="h-7 w-48 rounded-lg" />
        {/* Username skeleton */}
        <Skeleton className="h-4 w-32 rounded-md" />

        {/* Bio skeleton */}
        <div className="mt-3 space-y-2">
          <Skeleton className="h-4 w-full max-w-md rounded-md" />
          <Skeleton className="h-4 w-3/4 max-w-sm rounded-md" />
        </div>

        {/* Stats skeleton */}
        <div className="mt-6 flex gap-6">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-6 w-12 rounded-md" />
            <Skeleton className="h-3 w-16 rounded-md" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-6 w-12 rounded-md" />
            <Skeleton className="h-3 w-16 rounded-md" />
          </div>
        </div>
      </div>
    </>
  );
}
