import Skeleton from "../../../components/Skeleton";
import Wrapper from "../../../components/Wrapper";

const SidebarCard = ({ lines }: { lines: string[] }) => (
  <div className="rounded-2xl border border-border bg-background-card p-5 shadow-card">
    <Skeleton className="h-3 w-24" />
    {lines.map((width, index) => (
      <Skeleton key={index} className={`mt-3 h-4 ${width}`} />
    ))}
  </div>
);

/**
 * The thumbnail detail page's shape while its code or data loads. Imported by routes.tsx outside
 * the lazy page chunk, so it can be the Suspense fallback too.
 */
export default function ThumbnailPreviewSkeleton() {
  return (
    <main className="pb-(--section-y)" aria-busy="true" aria-label="Loading thumbnail">
      <Wrapper className="pt-8 lg:pt-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-40" />
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-8">
            {/* Image */}
            <div className="overflow-hidden rounded-2xl border border-border bg-background-card shadow-card">
              <Skeleton className="aspect-video w-full rounded-none" />
            </div>

            {/* Stats */}
            <div className="mt-5 flex gap-5">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-28" />
            </div>

            {/* Title */}
            <Skeleton className="mt-4 h-7 w-3/4" />

            {/* Prompt card */}
            <div className="mt-6 rounded-2xl border border-border bg-background-card p-5 shadow-card sm:p-6">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-4 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-5/6" />
              <Skeleton className="mt-5 h-8 w-28 rounded-lg" />
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <Skeleton className="h-8 w-28 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-lg" />
              <Skeleton className="h-8 w-36 rounded-lg" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4 lg:col-span-4">
            <SidebarCard lines={["w-3/4", "w-full"]} />
            <div className="rounded-2xl border border-border bg-background-card p-5 shadow-card">
              <Skeleton className="h-3 w-20" />
              <div className="mt-3 flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="mt-2 h-3 w-20" />
                </div>
              </div>
            </div>
            <SidebarCard lines={["w-1/2", "w-full"]} />
          </div>
        </div>
      </Wrapper>
    </main>
  );
}
