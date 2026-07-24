import { useMemo, useState } from "react";
import { Plus, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Wrapper from "../../components/Wrapper";
import { ThumbnailData } from "../../data/thumbnail";
import { ALL_STYLES, getEngagement } from "../../data/community";
import CommunityFilters from "./components/CommunityFilters";
import type { CommunitySort } from "../../types";
import Button from "../../components/Button";
import ThumbnailCard from "../../components/ThumbnailCard";

const PAGE_SIZE = 12;

export default function Community() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<CommunitySort>("newest");
  const [activeStyle, setActiveStyle] = useState(ALL_STYLES);
  const [limit, setLimit] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    const list = ThumbnailData.filter((thumbnail) => {
      const matchesStyle =
        activeStyle === ALL_STYLES || thumbnail.style === activeStyle;
      const matchesSearch =
        !query ||
        thumbnail.title.toLowerCase().includes(query) ||
        (thumbnail.userId?.name ?? "").toLowerCase().includes(query);
      return matchesStyle && matchesSearch;
    });

    return [...list].sort((a, b) => {
      switch (sort) {
        case "newest":
          return +new Date(b.createdAt) - +new Date(a.createdAt);
        case "trending":
          return getEngagement(b._id).views - getEngagement(a._id).views;
        case "most-liked":
          return getEngagement(b._id).likes - getEngagement(a._id).likes;
        case "featured":
          return Number(b.model === "premium") - Number(a.model === "premium");
        default:
          return 0;
      }
    });
  }, [search, sort, activeStyle]);

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
    <main className="min-h-screen bg-background-surface">
      <Wrapper className="py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users size={18} className="text-primary" />
              <span className="rounded-full border border-border bg-background-card px-3 py-1 text-xs font-medium text-text-secondary">
                700+ Creators
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
            to="/generate"
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

        {visible.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((thumbnail, index) => (
              <ThumbnailCard
                key={thumbnail._id}
                thumbnail={thumbnail}
                index={index}
              />
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-text-secondary">
            No thumbnails match your search.
          </p>
        )}

        {limit < filtered.length && (
          <div className="mt-10 flex justify-center">
            <Button
              type="button"
              onClick={() => setLimit((prev) => prev + PAGE_SIZE)}
              fullWidth={false}
              variant="secondary"
              className={``}
            >
              Load More
            </Button>
          </div>
        )}
      </Wrapper>
    </main>
  );
}
