import { useState } from "react";
import { Trash2, Trash } from "lucide-react";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import useGetRecycleBinThumbnails from "../core/hooks/useGetRecycleBinThumbnails";
import useRestoreThumbnail from "../core/hooks/use-restore-thumbnail";
import usePermanentDeleteThumbnail from "../core/hooks/use-permanent-delete-thumbnail";
import ConfirmDialog from "../../../components/modals/confirmation-dialog/ConfirmDialog";
import ThumbnailCard from "../../../components/ThumbnailCard";
import ThumbnailCardSkeleton from "../../../components/ThumbnailCardSkeleton";
import { getApiErrorMessage } from "../../../lib/axios";

export default function RecycleBin() {
  const { data: recycleBinResponse, isPending: isLoading } = useGetRecycleBinThumbnails();
  const deletedThumbnails = recycleBinResponse?.thumbnails || [];

  const { mutate: restoreMutate, isPending: isRestoring } = useRestoreThumbnail();
  const { mutate: permanentDeleteMutate, isPending: isPermanentlyDeleting } = usePermanentDeleteThumbnail();
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState<string | null>(null);

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
    <main className="px-6 py-10">
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 70, mass: 1 }}
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-500">
          <Trash2 size={12} />
          Recycle Bin
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
          Deleted <span className="text-primary">Thumbnails</span>
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Restore your deleted thumbnails or permanently remove them.
        </p>
      </motion.div>

      <hr className="my-8 border-border" />

      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-text-primary">
            Recycle Bin
          </h2>
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-text-secondary">
            {deletedThumbnails.length}
          </span>
        </div>

        {isLoading ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {deletedThumbnails.map((thumbnail, index) => (
              <ThumbnailCard
                key={thumbnail._id}
                thumbnail={thumbnail}
                index={index}
                showRecycleBinActions
                onRestore={handleRestore}
                onPermanentDelete={(id) => setPermanentDeleteTarget(id)}
                restoring={isRestoring}
              />
            ))}
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
    </main>
  );
}
