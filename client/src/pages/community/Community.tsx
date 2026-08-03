import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { ALL_STYLES } from "../../data/community";
import CommunityFilters from "./components/CommunityFilters";
import type { CommunitySort } from "../../types";
import Button from "../../components/Button";
import ThumbnailCard from "../../components/ThumbnailCard";
import ThumbnailCardSkeleton from "../../components/ThumbnailCardSkeleton";
import useGetCommunityThumbnails from "../dashboard/core/hooks/useGetCommunityThumbnails";

export default function Community() {
  const [params, setParams] = useState<{ [key: string]: any }>({ page: 1, limit: 10, sort: "newest" });
  const { data: fetchedThumbnails, isPending: isLoading, pagination } = useGetCommunityThumbnails(params);

  const [sort, setSort] = useState<CommunitySort>("newest");
  const [activeStyle, setActiveStyle] = useState(ALL_STYLES);

  const handleSort = (value: CommunitySort) => {
    setSort(value);
    setParams((prev) => ({ ...prev, sort: value, page: 1 }));
  };
  const handleStyle = (value: string) => {
    setActiveStyle(value);
    setParams((prev) => ({ ...prev, style: value === ALL_STYLES ? undefined : value, page: 1 }));
  };

  return (
    <main className="px-6 py-10">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users size={18} className="text-primary" />
              <span className="rounded-full border border-border bg-background-card px-3 py-1 text-xs font-medium text-text-secondary">
                {fetchedThumbnails.length}+ Thumbnails
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

        {isLoading ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <ThumbnailCardSkeleton count={9} />
          </div>
        ) : fetchedThumbnails.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {fetchedThumbnails.map((thumbnail, index) => (
              <ThumbnailCard
                key={thumbnail._id}
                thumbnail={thumbnail}
                index={index}
                showLike
                source="community"
              />
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-text-secondary">
            No thumbnails found in the community gallery.
          </p>
        )}

        {(pagination?.total && pagination.total > fetchedThumbnails.length) ? (
          <div className="mt-10 flex justify-center">
            <Button
              type="button"
              onClick={() => setParams((prev) => ({ ...prev, page: prev.page + 1 }))}
              fullWidth={false}
              variant="secondary"
            >
              Load More
            </Button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
