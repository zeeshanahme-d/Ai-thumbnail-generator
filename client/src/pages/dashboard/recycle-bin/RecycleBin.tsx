import { useState } from "react";
import { Loader2, RotateCcw, Trash2, Trash } from "lucide-react";
import toast from "react-hot-toast";
import useInfiniteThumbnails from "../../../core/thumbnails/hooks/useInfiniteThumbnails";
import useRestoreThumbnail from "../../../core/thumbnails/hooks/use-restore-thumbnail";
import usePermanentDeleteThumbnail from "../../../core/thumbnails/hooks/use-permanent-delete-thumbnail";
import useRestoreAllThumbnails from "../../../core/thumbnails/hooks/use-restore-all-thumbnails";
import useEmptyRecycleBin from "../../../core/thumbnails/hooks/use-empty-recycle-bin";
import Button from "../../../components/Button";
import ConfirmDialog from "../../../components/modals/confirmation-dialog/ConfirmDialog";
import ThumbnailCard from "../../../components/ThumbnailCard";
import ThumbnailCardSkeleton from "../../../components/ThumbnailCardSkeleton";
import { getApiErrorMessage } from "../../../lib/axios";
import { RECYCLE_BIN_RETENTION_DAYS } from "../../../lib/thumbnail";
import type { ThumbnailFilters } from "../../../types";

const PAGE_SIZE = 12;
const RECYCLE_BIN_FILTERS: ThumbnailFilters = { limit: PAGE_SIZE, sort: "newest" };

export default function RecycleBin() {
  const {
    thumbnails: deletedThumbnails,
    total,
    isPending: isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteThumbnails("recycleBin", RECYCLE_BIN_FILTERS);

  const { mutate: restoreMutate, restoringIds } = useRestoreThumbnail();
  const { mutate: permanentDeleteMutate, isPending: isPermanentlyDeleting } = usePermanentDeleteThumbnail();
  const { mutate: restoreAllMutate, isPending: isRestoringAll } = useRestoreAllThumbnails();
  const { mutate: emptyBinMutate, isPending: isEmptyingBin } = useEmptyRecycleBin();
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState<string | null>(null);
  const [isEmptyBinOpen, setIsEmptyBinOpen] = useState(false);
  const isBulkBusy = isRestoringAll || isEmptyingBin;

  const handleRestoreAll = () => {
    restoreAllMutate(undefined, {
      onSuccess: ({ restoredCount }) => {
        toast.success(`${restoredCount} thumbnail${restoredCount === 1 ? "" : "s"} restored.`);
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err, "Failed to restore thumbnails."));
      },
    });
  };

  const handleEmptyBinConfirm = () => {
    emptyBinMutate(undefined, {
      onSuccess: ({ deletedCount }) => {
        toast.success(`${deletedCount} thumbnail${deletedCount === 1 ? "" : "s"} permanently deleted.`);
        setIsEmptyBinOpen(false);
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err, "Failed to empty the recycle bin."));
        setIsEmptyBinOpen(false);
      },
    });
  };

  const handleRestore = (id: string) => {
    restoreMutate(id, {
      onSuccess: () => {
        toast.success("Thumbnail restored successfully.");
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err, "Failed to restore thumbnail."));
      },
    });
  };

  const handlePermanentDeleteConfirm = () => {
    if (!permanentDeleteTarget) return;

    permanentDeleteMutate(permanentDeleteTarget, {
      onSuccess: () => {
        toast.success("Thumbnail permanently deleted.");
        setPermanentDeleteTarget(null);
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err, "Failed to delete thumbnail."));
        setPermanentDeleteTarget(null);
      },
    });
  };

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-500">
          <Trash2 size={12} />
          Recycle Bin
        </span>
        <h1 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl md:text-4xl">
          Deleted <span className="text-primary">Thumbnails</span>
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Restore your deleted thumbnails or permanently remove them. Thumbnails are deleted
          forever {RECYCLE_BIN_RETENTION_DAYS} days after they are moved here.
        </p>
      </div>

      <hr className="my-8 border-border" />

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-text-primary">
              Recycle Bin
            </h2>
            <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-text-secondary">
              {total}
            </span>
          </div>

          {total > 0 && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                rounded="lg"
                size="sm"
                fullWidth={false}
                onClick={handleRestoreAll}
                disabled={isBulkBusy}
              >
                {isRestoringAll ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                Restore all
              </Button>
              <Button
                type="button"
                variant="secondary"
                rounded="lg"
                size="sm"
                fullWidth={false}
                onClick={() => setIsEmptyBinOpen(true)}
                disabled={isBulkBusy}
                className="text-red-500 hover:text-red-400 hover:border-red-500/30"
              >
                <Trash2 size={14} />
                Empty bin
              </Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
            <ThumbnailCardSkeleton count={6} showRecycleBinActions />
          </div>
        ) : deletedThumbnails.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-4 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-background-surface-2">
              <Trash size={28} className="text-text-muted" />
            </div>
            <p className="text-sm text-text-muted">
              Your recycle bin is empty. Deleted thumbnails will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
            {deletedThumbnails.map((thumbnail) => (
              <ThumbnailCard
                key={thumbnail._id}
                thumbnail={thumbnail}
                showRecycleBinActions
                onRestore={handleRestore}
                onPermanentDelete={(id) => setPermanentDeleteTarget(id)}
                restoring={restoringIds.includes(thumbnail._id)}
              />
            ))}
          </div>
        )}

        {isFetchingNextPage && (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
            <ThumbnailCardSkeleton count={3} showRecycleBinActions />
          </div>
        )}

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
        open={permanentDeleteTarget !== null}
        onClose={() => setPermanentDeleteTarget(null)}
        onConfirm={handlePermanentDeleteConfirm}
        title="Delete Permanently?"
        description="This action cannot be undone. The thumbnail and its image will be permanently removed."
        confirmLabel="Delete Forever"
        variant="danger"
        loading={isPermanentlyDeleting}
      />

      <ConfirmDialog
        open={isEmptyBinOpen}
        onClose={() => setIsEmptyBinOpen(false)}
        onConfirm={handleEmptyBinConfirm}
        title="Empty Recycle Bin?"
        description={`All ${total} thumbnail${total === 1 ? "" : "s"} in the recycle bin and their images will be permanently removed. This action cannot be undone.`}
        confirmLabel="Empty Bin"
        variant="danger"
        loading={isEmptyingBin}
      />
    </main>
  );
}
