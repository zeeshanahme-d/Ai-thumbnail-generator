import { useState } from "react";
import { Plus } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { ALL_STYLES, STYLE_FILTERS } from "../../data/community";
import CommunityFilters from "./components/CommunityFilters";
import type { CommunityProps, CommunitySort, ThumbnailFilters } from "../../types";
import Button from "../../components/Button";
import DashboardPage from "../../components/DashboardPage";
import Eyebrow from "../../components/Eyebrow";
import ListError from "../../components/ListError";
import PageHeader from "../../components/PageHeader";
import ThumbnailCard from "../../components/ThumbnailCard";
import ThumbnailCardSkeleton from "../../components/ThumbnailCardSkeleton";
import useInfiniteThumbnails from "../../core/thumbnails/hooks/useInfiniteThumbnails";
import Wrapper from "../../components/Wrapper";
import { buttonClasses } from "../../lib/buttonClasses";

const PAGE_SIZE = 12;

// Used by /community (variant="public") and /dashboard/community (the default).
export default function Community({ variant = "dashboard" }: CommunityProps) {
  // Links like "Browse Minimalist thumbnails" open the gallery already filtered (?style=Minimalist).
  const [searchParams] = useSearchParams();
  const styleParam = searchParams.get("style");
  const initialStyle = styleParam && STYLE_FILTERS.includes(styleParam) ? styleParam : ALL_STYLES;

  const [filters, setFilters] = useState<ThumbnailFilters>({
    limit: PAGE_SIZE,
    sort: "newest",
    style: initialStyle === ALL_STYLES ? undefined : initialStyle,
  });
  const { thumbnails, total, isPending, loadFailed, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteThumbnails("community", filters);
  const showTotal = !isPending && !loadFailed;
  const [sort, setSort] = useState<CommunitySort>("newest");
  const [activeStyle, setActiveStyle] = useState(initialStyle);

  const handleSort = (value: CommunitySort) => {
    setSort(value);
    setFilters((prev) => ({ ...prev, sort: value }));
  };

  const handleStyle = (value: string) => {
    setActiveStyle(value);
    setFilters((prev) => ({
      ...prev,
      style: value === ALL_STYLES ? undefined : value,
    }));
  };

  const gallery = (
    <>
      <CommunityFilters
        setParams={setFilters}
        sort={sort}
        onSortChange={handleSort}
        activeStyle={activeStyle}
        onStyleChange={handleStyle}
      />

      {/* Grid */}
      {isPending ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
          <ThumbnailCardSkeleton count={9} />
        </div>
      ) : loadFailed ? (
        <ListError className="mt-16" onRetry={refetch} />
      ) : thumbnails.length > 0 ? (
        <>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
            {thumbnails.map((thumbnail) => (
              <ThumbnailCard
                key={thumbnail._id}
                thumbnail={thumbnail}
                showLike
                source="community"
              />
            ))}
          </div>

          {isFetchingNextPage && (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
              <ThumbnailCardSkeleton count={3} />
            </div>
          )}
        </>
      ) : (
        <p className="mt-16 text-center text-text-secondary">
          No thumbnails found in the community gallery.
        </p>
      )}

      {/* Load More */}
      {hasNextPage && (
        <div className="mt-10 flex justify-center">
          <Button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            fullWidth={false}
            variant="secondary"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </>
  );

  if (variant === "public") {
    return (
      <main>
        <PageHeader
          eyebrow="Community"
          title={["See what creators", "are making."]}
          description="Thumbnails people made with Thumblify and chose to publish. Open any of them to see the prompt behind it."
        >
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link to="/dashboard/generate" className={buttonClasses({ rounded: "lg", fullWidth: false })}>
              <Plus size={16} />
              Create your own
            </Link>
            {showTotal && (
              <span className="font-mono text-xs uppercase tracking-[0.06em] tabular-nums text-text-muted">
                {total} published
              </span>
            )}
          </div>
        </PageHeader>

        <Wrapper className="pb-(--section-y)">{gallery}</Wrapper>
      </main>
    );
  }

  return (
    <DashboardPage
      eyebrow="Community"
      title="Community gallery"
      description="Thumbnails people made with Thumblify and chose to publish. Open any of them to see the prompt behind it."
      actions={showTotal && <Eyebrow className="tabular-nums">{total} published</Eyebrow>}
    >
      {gallery}
    </DashboardPage>
  );
}
