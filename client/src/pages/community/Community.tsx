import { useMemo, useState } from "react";
import { Plus, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { ALL_STYLES } from "../../data/community";
import CommunityFilters from "./components/CommunityFilters";
import type { CommunitySort } from "../../types";
import Button from "../../components/Button";
import ThumbnailCard from "../../components/ThumbnailCard";
import ThumbnailCardSkeleton from "../../components/ThumbnailCardSkeleton";
import { getThumbnailAuthorName } from "../../lib/thumbnail";
import useGetCommunityThumbnails from "../dashboard/core/hooks/useGetCommunityThumbnails";

const PAGE_SIZE = 12;

export default function Community() {
  const { data: communityResponse, isPending: isLoading } =
    useGetCommunityThumbnails();
  const fetchedThumbnails = communityResponse?.thumbnails || [];

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<CommunitySort>("newest");
  const [activeStyle, setActiveStyle] = useState(ALL_STYLES);
  const [limit, setLimit] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    const list = fetchedThumbnails.filter((thumbnail) => {
      const matchesStyle =
        activeStyle === ALL_STYLES || thumbnail.style === activeStyle;
      const matchesSearch =
        !query ||
        thumbnail.title.toLowerCase().includes(query) ||
        getThumbnailAuthorName(thumbnail).toLowerCase().includes(query);
      return matchesStyle && matchesSearch;
    });

    return [...list].sort((a, b) => {
      switch (sort) {
        case "newest":
          return +new Date(b.createdAt) - +new Date(a.createdAt);
        case "trending":
          return (b.viewsCount || 0) - (a.viewsCount || 0);
        case "most-liked":
          return (b.likesCount || 0) - (a.likesCount || 0);
        case "featured":
          return Number(b.model === "premium") - Number(a.model === "premium");
        default:
          return 0;
      }
    });
  }, [fetchedThumbnails, search, sort, activeStyle]);

  const visible = filtered.slice(0, limit);

  const handleSearch = (value: string) => {
    setSearch(value);
    setLimit(PAGE_SIZE);
  };
  const handleSort = (value: CommunitySort) => {
    setSort(value);
    setLimit(PAGE_SIZE);
  };
  const handleStyle = (value: string) => {
    setActiveStyle(value);
    setLimit(PAGE_SIZE);
  };

  return (
    <main className="px-6 py-10 md:px-10">
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
          search={search}
          onSearchChange={handleSearch}
          sort={sort}
          onSortChange={handleSort}
          activeStyle={activeStyle}
          onStyleChange={handleStyle}
        />

        {isLoading ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ThumbnailCardSkeleton count={9} />
          </div>
        ) : visible.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((thumbnail, index) => (
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

        {limit < filtered.length && (
          <div className="mt-10 flex justify-center">
            <Button
              type="button"
              onClick={() => setLimit((prev) => prev + PAGE_SIZE)}
              fullWidth={false}
              variant="secondary"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
