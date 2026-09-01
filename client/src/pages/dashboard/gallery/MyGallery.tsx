import { useEffect, useState } from "react";
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
  const [params, setParams] = useState<Record<string, any>>({
    page: 1,
    limit: PAGE_SIZE,
    sort: "newest",
  });
  const { data: generations, pagination, isPending: isLoading } = useGetMyThumbnails(params);
  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteThumbnail();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [sort, setSort] = useState<CommunitySort>("newest");
  const [activeStyle, setActiveStyle] = useState(ALL_STYLES);

  useEffect(() => {
    if (!generations) return;
    if (params.page === 1) {
      setThumbnails(generations);
    } else if (generations.length > 0) {
      setThumbnails((prev) => {
        const existingIds = new Set(prev.map((t) => t._id));
        const newItems = generations.filter((t) => !existingIds.has(t._id));
        return [...prev, ...newItems];
      });
    }
  }, [generations, params.page]);

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

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    deleteMutate(deleteTarget, {
      onSuccess: () => {
        toast.success("Thumbnail moved to recycle bin.");
        setThumbnails((prev) => prev.filter((t) => t._id !== deleteTarget));
        setDeleteTarget(null);
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err, "Failed to delete thumbnail."));
        setDeleteTarget(null);
      },
    });
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
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <LayoutGrid size={18} className="text-primary" />
              <span className="rounded-full border border-border bg-background-card px-3 py-1 text-xs font-medium text-text-secondary">
                {totalCount} Thumbnails
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
          setParams={setParams}
          sort={sort}
          onSortChange={handleSort}
          activeStyle={activeStyle}
          onStyleChange={handleStyle}
        />

        {/* Grid */}
        {isLoading && params.page === 1 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
            <ThumbnailCardSkeleton count={8} />
          </div>
        ) : thumbnails.length > 0 ? (
          <>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
              {thumbnails.map((thumbnail, index) => (
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

            {isLoading && params.page > 1 && (
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                <ThumbnailCardSkeleton count={4} />
              </div>
            )}
          </>
        ) : (
          <div className="mt-16 flex flex-col items-center gap-4 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-background-surface-2">
              <ImagePlus size={28} className="text-text-muted" />
            </div>
            <p className="text-sm text-text-muted">
              {params.search || params.style
                ? "No thumbnails match your filters."
                : "Your gallery is empty. Generate your first thumbnail!"}
            </p>
            {!params.search && !params.style && (
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
