import { useMemo, useState } from "react";
import { ImagePlus, LayoutGrid, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import ThumbnailCard from "../../../components/ThumbnailCard";
import ThumbnailCardSkeleton from "../../../components/ThumbnailCardSkeleton";
import ConfirmDialog from "../../../components/modals/confirmation-dialog/ConfirmDialog";
import CommunityFilters from "../../community/components/CommunityFilters";
import Button from "../../../components/Button";
import useGetMyThumbnails from "../core/hooks/useGetMyThumbnails";
import useDeleteThumbnail from "../core/hooks/use-delete-thumbnail";
import { getApiErrorMessage } from "../../../lib/axios";
import { ALL_STYLES } from "../../../data/community";
import type { CommunitySort, Thumbnail } from "../../../types";

const PAGE_SIZE = 12;

export default function MyGallery() {
  const { data: myThumbnailsResponse, isPending: isLoading } =
    useGetMyThumbnails();
  const generations = myThumbnailsResponse?.thumbnails || [];

  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteThumbnail();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<CommunitySort>("newest");
  const [activeStyle, setActiveStyle] = useState(ALL_STYLES);
  const [limit, setLimit] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    const list = generations.filter((t: Thumbnail) => {
      const matchesStyle =
        activeStyle === ALL_STYLES || t.style === activeStyle;
      const matchesSearch = !query || t.title.toLowerCase().includes(query);
      return matchesStyle && matchesSearch;
    });

    return [...list].sort((a: Thumbnail, b: Thumbnail) => {
      switch (sort) {
        case "newest":
          return +new Date(b.createdAt) - +new Date(a.createdAt);
        case "trending":
          return (b.viewsCount ?? 0) - (a.viewsCount ?? 0);
        case "most-liked":
          return (b.likesCount ?? 0) - (a.likesCount ?? 0);
        default:
          return 0;
      }
    });
  }, [generations, search, sort, activeStyle]);

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

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    deleteMutate(deleteTarget, {
      onSuccess: () => {
        toast.success("Thumbnail moved to recycle bin.");
        setDeleteTarget(null);
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err, "Failed to delete thumbnail."));
        setDeleteTarget(null);
      },
    });
  };

  return (
    <main className="px-6 py-10 md:px-10">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <LayoutGrid size={18} className="text-primary" />
              <span className="rounded-full border border-border bg-background-card px-3 py-1 text-xs font-medium text-text-secondary">
                {generations.length} Thumbnails
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
              My <span className="text-primary">Gallery</span>
            </h1>
            <p className="mt-2 max-w-lg text-sm text-text-secondary">
              Browse, filter, and manage all your AI-generated thumbnails.
            </p>
          </div>

          <Link to="/dashboard/generate" className="hidden sm:block shrink-0">
            <Button
              variant="primary"
              size="sm"
              fullWidth={false}
              className="gap-2"
            >
              <Plus size={16} />
              New Thumbnail
            </Button>
          </Link>
        </div>

        <hr className="my-8 border-border" />

        {/* Filters */}
        <CommunityFilters
          search={search}
          onSearchChange={handleSearch}
          sort={sort}
          onSortChange={handleSort}
          activeStyle={activeStyle}
          onStyleChange={handleStyle}
        />

        {/* Grid */}
        {isLoading ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            <ThumbnailCardSkeleton count={8} />
          </div>
        ) : visible.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {visible.map((thumbnail, index) => (
              <ThumbnailCard
                key={thumbnail._id}
                thumbnail={thumbnail}
                index={index}
                showDelete
                showPublish
                source="gallery"
                onDelete={(id) => setDeleteTarget(id)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center gap-4 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-background-surface-2">
              <ImagePlus size={28} className="text-text-muted" />
            </div>
            <p className="text-sm text-text-muted">
              {search || activeStyle !== ALL_STYLES
                ? "No thumbnails match your filters."
                : "Your gallery is empty. Generate your first thumbnail!"}
            </p>
            {!search && activeStyle === ALL_STYLES && (
              <Link to="/dashboard/generate">
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth={false}
                  className="gap-2"
                >
                  <Plus size={16} />
                  Generate Thumbnail
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Load More */}
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

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Thumbnail?"
        description="This thumbnail will be moved to the recycle bin. You can restore it later."
        confirmLabel="Move to Bin"
        variant="danger"
        loading={isDeleting}
      />
    </main>
  );
}
