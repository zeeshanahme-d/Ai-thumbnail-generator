import { useState } from "react";
import { ImagePlus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardPage from "../../../components/DashboardPage";
import Eyebrow from "../../../components/Eyebrow";
import ListError from "../../../components/ListError";
import ThumbnailCard from "../../../components/ThumbnailCard";
import ThumbnailCardSkeleton from "../../../components/ThumbnailCardSkeleton";
import ConfirmDialog from "../../../components/modals/confirmation-dialog/ConfirmDialog";
import CommunityFilters from "../../community/components/CommunityFilters";
import Button from "../../../components/Button";
import useInfiniteThumbnails from "../../../core/thumbnails/hooks/useInfiniteThumbnails";
import useDeleteThumbnail from "../../../core/thumbnails/hooks/use-delete-thumbnail";
import { getApiErrorMessage } from "../../../lib/axios";
import { buttonClasses } from "../../../lib/buttonClasses";
import { ALL_STYLES } from "../../../data/community";
import type { CommunitySort, ThumbnailFilters } from "../../../types";

const PAGE_SIZE = 12;

export default function MyGallery() {
  const [filters, setFilters] = useState<ThumbnailFilters>({
    limit: PAGE_SIZE,
    sort: "newest",
  });
  const { thumbnails, total, isPending, loadFailed, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteThumbnails("mine", filters);
  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteThumbnail();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [sort, setSort] = useState<CommunitySort>("newest");
  const [activeStyle, setActiveStyle] = useState(ALL_STYLES);

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
    <DashboardPage
      eyebrow="Gallery"
      title="My gallery"
      description="Every thumbnail you've generated. Filter them, publish them to the community, or move them to the recycle bin."
      actions={
        <>
          {!isPending && !loadFailed && <Eyebrow className="tabular-nums">{total} thumbnails</Eyebrow>}
          <Link to="/dashboard/generate" className={buttonClasses({ size: "sm", rounded: "lg", fullWidth: false })}>
            <Plus size={16} />
            New thumbnail
          </Link>
        </>
      }
    >
      <div>
        {/* Filters */}
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
            <ThumbnailCardSkeleton count={8} />
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
                  showDelete
                  showPublish
                  source="gallery"
                  onDelete={(id) => setDeleteTarget(id)}
                />
              ))}
            </div>

            {isFetchingNextPage && (
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
                <ThumbnailCardSkeleton count={4} />
              </div>
            )}
          </>
        ) : (
          <div className="mt-16 flex flex-col items-center gap-4 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-background-surface-2">
              <ImagePlus size={28} className="text-text-muted" />
            </div>
            <p className="text-sm text-text-secondary">
              {filters.search || filters.style
                ? "No thumbnails match your filters."
                : "Your gallery is empty. Generate your first thumbnail."}
            </p>
            {!filters.search && !filters.style && (
              <Link to="/dashboard/generate" className={buttonClasses({ size: "sm", rounded: "lg", fullWidth: false })}>
                <Plus size={16} />
                Generate a thumbnail
              </Link>
            )}
          </div>
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
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete this thumbnail?"
        description="This thumbnail will be moved to the recycle bin. You can restore it later."
        confirmLabel="Move to bin"
        variant="danger"
        loading={isDeleting}
      />
    </DashboardPage>
  );
}
