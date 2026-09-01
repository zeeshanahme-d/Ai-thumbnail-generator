import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import toast from "react-hot-toast";
//Components
import Alert from "../../../components/Alert";
import Button from "../../../components/Button";
import PromptCard from "../../../components/image-generate-components/PromptCard";
import ThumbnailCard from "../../../components/ThumbnailCard";
import ThumbnailCardSkeleton from "../../../components/ThumbnailCardSkeleton";
import ConfirmDialog from "../../../components/modals/confirmation-dialog/ConfirmDialog";
import GenerationSkeleton from "./components/GenerationSkeleton";
import GenerationResultCard from "./components/GenerationResultCard";
//Libs
import { getApiErrorMessage } from "../../../lib/axios";
import { buildThumbnailTitle } from "../../../lib/thumbnail";
//Types
import type { PromptSubmission, Thumbnail } from "../../../types";
import type { GenerateThumbnailPayload } from "../core/_models";
//Hooks
import useGenerateThumbnail from "../core/hooks/use-generate-thumbnail";
import { useDeleteThumbnail } from "../core/hooks/use-delete-thumbnail";
import useGetMyThumbnails from "../core/hooks/useGetMyThumbnails";

export default function DashboardGenerate() {
  const { data: generations = [], isPending: isLoading } = useGetMyThumbnails({
    limit: 8,
    page: 1,
    sort: "newest",
  });
  const { generateThumbnailMutate, isPending } = useGenerateThumbnail();
  const deleteMutation = useDeleteThumbnail();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [lastGeneratedThumbnail, setLastGeneratedThumbnail] =
    useState<Thumbnail | null>(null);
  const [lastSubmissionPayload, setLastSubmissionPayload] =
    useState<GenerateThumbnailPayload | null>(null);

  const executeGeneration = (payload: GenerateThumbnailPayload) => {
    setError(null);
    setSuccess(null);

    generateThumbnailMutate(payload, {
      onSuccess: (newThumbnail) => {
        setSuccess("Your thumbnail was generated successfully.");
        setLastGeneratedThumbnail(newThumbnail);
      },
      onError: (err) => {
        setError(getApiErrorMessage(err, "Failed to generate thumbnail."));
      },
    });
  };

  const handleSubmit = async (submission: PromptSubmission) => {
    const payload: GenerateThumbnailPayload = {
      title: buildThumbnailTitle(submission.prompt),
      prompt: submission.prompt,
      style: submission.style,
      aspect_ratio: submission.aspectRatio,
      color_scheme: submission.colorScheme,
      text_overlay: true,
      referenceImage: submission.referenceImage,
    };
    setLastSubmissionPayload(payload);
    executeGeneration(payload);
  };

  const handleRegenerate = () => {
    if (lastSubmissionPayload) {
      executeGeneration(lastSubmissionPayload);
    }
  };

  const handleNewPrompt = () => {
    setLastGeneratedThumbnail(null);
    setError(null);
    setSuccess(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    deleteMutation.mutate(deleteTarget, {
      onSuccess: () => {
        toast.success("Thumbnail moved to recycle bin.");
        if (lastGeneratedThumbnail?._id === deleteTarget) {
          setLastGeneratedThumbnail(null);
        }
        setDeleteTarget(null);
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err, "Failed to delete thumbnail."));
        setDeleteTarget(null);
      },
    });
  };

  return (
    <div className="px-6 py-10">
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
        {success && !isPending && <Alert variant="success">{success}</Alert>}

        <AnimatePresence mode="wait">
          {isPending ? (
            <GenerationSkeleton key="skeleton" />
          ) : lastGeneratedThumbnail ? (
            <GenerationResultCard
              key="result"
              thumbnail={lastGeneratedThumbnail}
              onRegenerate={handleRegenerate}
              onNewPrompt={handleNewPrompt}
              isRegenerating={isPending}
            />
          ) : (
            <PromptCard
              key="prompt-card"
              label="Your prompt"
              disabled={isPending}
              submitLabel="Generate Thumbnail"
              onSubmit={handleSubmit}
            />
          )}
        </AnimatePresence>
      </div>

      <hr className="mx-auto my-12 max-w-6xl border-border" />

      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-text-primary">
              Recently Generated Thumbnails
            </h2>
            <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-text-secondary">
              {generations.length}
            </span>
          </div>
          <Link to="/dashboard/gallery">
            <Button variant="secondary" size="sm" fullWidth={false}>
              View All
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <ThumbnailCardSkeleton count={6} />
          </div>
        ) : generations.length === 0 ? (
          <p className="mt-6 text-sm text-text-muted">
            No thumbnails yet. Generate your first one above.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {generations?.map((thumbnail, index) => (
              <ThumbnailCard
                key={thumbnail._id}
                thumbnail={thumbnail}
                index={index}
                showDelete
                source="generate"
                onDelete={(id) => setDeleteTarget(id)}
                showPublish
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
