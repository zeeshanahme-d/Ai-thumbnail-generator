import { useState } from "react";
import { Trash2, Trash } from "lucide-react";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import useMyThumbnails from "../core/hooks/use-my-thumbnails";
import { useRestoreThumbnail } from "../core/hooks/use-restore-thumbnail";
import { usePermanentDeleteThumbnail } from "../core/hooks/use-permanent-delete-thumbnail";
import ConfirmDialog from "../../../components/modals/confirmation-dialog/ConfirmDialog";
import ThumbnailCard from "../../../components/ThumbnailCard";
import { getApiErrorMessage } from "../../../lib/axios";

export default function RecycleBin() {
  const { data: deletedThumbnails = [], isLoading } = useMyThumbnails(true);
  const restoreMutation = useRestoreThumbnail();
  const permanentDeleteMutation = usePermanentDeleteThumbnail();
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState<string | null>(null);

  const handleRestore = (id: string) => {
    restoreMutation.mutate(id, {
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

    permanentDeleteMutation.mutate(permanentDeleteTarget, {
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
    <div className="px-6 py-10 md:px-10">
      <motion.div
        className="mx-auto max-w-3xl text-center"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 70, mass: 1 }}
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-500">
          <Trash2 size={12} />
          Recycle Bin
        </span>
        <h1 className="mt-5 text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.03em] text-text-primary">
          Deleted <span className="text-primary">Thumbnails</span>
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Restore your deleted thumbnails or permanently remove them.
        </p>
      </motion.div>

      <hr className="mx-auto my-12 max-w-6xl border-border" />

      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-text-primary">
            Recycle Bin
          </h2>
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-text-secondary">
            {deletedThumbnails.length}
          </span>
        </div>

        {isLoading ? (
          <p className="mt-6 text-sm text-text-muted">Loading deleted thumbnails...</p>
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
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {deletedThumbnails.map((thumbnail, index) => (
              <ThumbnailCard
                key={thumbnail._id}
                thumbnail={thumbnail}
                index={index}
                showRecycleBinActions
                onRestore={handleRestore}
                onPermanentDelete={(id) => setPermanentDeleteTarget(id)}
                restoring={restoreMutation.isPending && restoreMutation.variables === thumbnail._id}
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
        loading={permanentDeleteMutation.isPending}
      />
    </div>
  );
}
