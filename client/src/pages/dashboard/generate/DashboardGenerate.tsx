import { useState } from "react";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import PromptCard from "../../../components/image-generate-components/PromptCard";
import ThumbnailCard from "../../../components/ThumbnailCard";
import Alert from "../../../components/Alert";
import ConfirmDialog from "../../../components/modals/confirmation-dialog/ConfirmDialog";
import { getApiErrorMessage } from "../../../lib/axios";
import { buildThumbnailTitle } from "../../../lib/thumbnail";

import type { PromptSubmission } from "../../../types";
import useGenerateThumbnail from "../core/hooks/use-generate-thumbnail";
import useMyThumbnails from "../core/hooks/use-my-thumbnails";
import { useDeleteThumbnail } from "../core/hooks/use-delete-thumbnail";

export default function DashboardGenerate() {
  const { data: generations = [], isLoading } = useMyThumbnails();
  const { generateThumbnailMutate, isPending } = useGenerateThumbnail();
  const deleteMutation = useDeleteThumbnail();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleSubmit = async (submission: PromptSubmission) => {
    setError(null);
    setSuccess(null);

    console.log("Submitting prompt:", submission);

    const payload = {
      title: buildThumbnailTitle(submission.prompt),
      prompt: submission.prompt,
      style: submission.style,
      aspect_ratio: submission.aspectRatio,
      color_scheme: submission.colorScheme,
      referenceImage: submission.referenceImage,
    };
    generateThumbnailMutate(payload, {
      onSuccess: () => {
        setSuccess("Your thumbnail was generated successfully.");
      },
      onError: (err) => {
        setError(getApiErrorMessage(err, "Failed to generate thumbnail."));
      }
    });
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    deleteMutation.mutate(deleteTarget, {
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
    <div className="px-6 py-10 md:px-10">
      <motion.div
        className="mx-auto max-w-3xl text-center"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 70, mass: 1 }}
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-text-on-primary">
          <Sparkles size={12} />
          Powered by top-tier AI.
        </span>
        <h1 className="mt-5 text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.03em] text-text-primary">
          AI <span className="text-primary">Thumbnail</span> Generator
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Describe your vision, pick a style, and let the AI do the rest.
        </p>
      </motion.div>

      <div className="mx-auto mt-10 max-w-5xl space-y-4">
        {error && <Alert variant="error">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <PromptCard
          label="Your prompt"
          disabled={isPending}
          submitLabel={
            isPending ? "Generating..." : "Generate Thumbnail"
          }
          onSubmit={handleSubmit}
        />
      </div>

      <hr className="mx-auto my-12 max-w-6xl border-border" />

      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-text-primary">
            My Generation
          </h2>
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-text-secondary">
            {generations.length}
          </span>
        </div>

        {isLoading ? (
          <p className="mt-6 text-sm text-text-muted">Loading your thumbnails...</p>
        ) : generations.length === 0 ? (
          <p className="mt-6 text-sm text-text-muted">
            No thumbnails yet. Generate your first one above.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {generations.map((thumbnail, index) => (
              <ThumbnailCard
                key={thumbnail._id}
                thumbnail={thumbnail}
                index={index}
                showDelete
                onDelete={(id) => setDeleteTarget(id)}
              />
            ))}
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
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

