import { useEffect, useState } from "react";
import { Plus, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { ALL_STYLES } from "../../data/community";
import CommunityFilters from "./components/CommunityFilters";
import type { CommunitySort, Thumbnail } from "../../types";
import Button from "../../components/Button";
import ThumbnailCard from "../../components/ThumbnailCard";
import ThumbnailCardSkeleton from "../../components/ThumbnailCardSkeleton";
import useGetCommunityThumbnails from "../dashboard/core/hooks/useGetCommunityThumbnails";
import Wrapper from "../../components/Wrapper";

const PAGE_SIZE = 12;

export default function Community() {
  const [params, setParams] = useState<Record<string, any>>({
    page: 1,
    limit: PAGE_SIZE,
    sort: "newest",
  });
  const { data: fetchedThumbnails, isPending: isLoading, pagination } =
    useGetCommunityThumbnails(params);

  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [sort, setSort] = useState<CommunitySort>("newest");
  const [activeStyle, setActiveStyle] = useState(ALL_STYLES);

  useEffect(() => {
    if (!fetchedThumbnails) return;
    if (params.page === 1) {
      setThumbnails(fetchedThumbnails);
    } else if (fetchedThumbnails.length > 0) {
      setThumbnails((prev) => {
        const existingIds = new Set(prev.map((t) => t._id));
        const nextItems = fetchedThumbnails.filter(
          (t) => !existingIds.has(t._id)
        );
        return [...prev, ...nextItems];
      });
    }
  }, [fetchedThumbnails, params.page]);

  const handleSort = (value: CommunitySort) => {
    setSort(value);
    setParams((prev) => ({ ...prev, sort: value, page: 1 }));
  };

  const handleStyle = (value: string) => {
    setActiveStyle(value);
    setParams((prev) => ({
      ...prev,
      style: value === ALL_STYLES ? undefined : value,
      page: 1,
    }));
  };

  const handleLoadMore = () => {
    setParams((prev) => ({
      ...prev,
      page: (prev.page || 1) + 1,
    }));
  };

  const totalCount = pagination?.total ?? thumbnails.length;

  return (
    <main className="px-6 py-10">
      <Wrapper>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users size={18} className="text-primary" />
              <span className="rounded-full border border-border bg-background-card px-3 py-1 text-xs font-medium text-text-secondary">
                {totalCount} Thumbnails
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
              AI Thumbnail <span className="text-primary">Community</span>{" "}
              Gallery
            </h1>
            <p className="mt-2 max-w-lg text-sm text-text-secondary">
              Browse, like, and get inspired by AI-generated thumbnails from
              creators worldwide.
            </p>
          </div>

          <Link
            to="/dashboard/generate"
            className="hidden shrink-0 items-center gap-2 rounded-full border border-border bg-background-card px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-background-surface-2 sm:flex"
          >
            <Plus size={16} />
            Create Your Own
          </Link>
        </div>

        <hr className="my-8 border-border" />

        <CommunityFilters
          setParams={setParams}
          sort={sort}
          onSortChange={handleSort}
          activeStyle={activeStyle}
          onStyleChange={handleStyle}
        />

        {/* Grid */}
        {isLoading && params.page === 1 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
            <ThumbnailCardSkeleton count={9} />
          </div>
        ) : thumbnails.length > 0 ? (
          <>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
              {thumbnails.map((thumbnail, index) => (
                <ThumbnailCard
                  key={thumbnail._id}
                  thumbnail={thumbnail}
                  index={index}
                  showLike
                  source="community"
                />
              ))}
            </div>

            {isLoading && params.page > 1 && (
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
        {pagination?.total && pagination.total > thumbnails.length ? (
          <div className="mt-10 flex justify-center">
            <Button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoading}
              fullWidth={false}
              variant="secondary"
            >
              {isLoading ? "Loading..." : "Load More"}
            </Button>
          </div>
        ) : null}
      </Wrapper>
    </main>
  );
}
