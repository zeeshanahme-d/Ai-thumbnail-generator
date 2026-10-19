import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
//Components
import Alert from "../../../components/Alert";
import Button from "../../../components/Button";
import DashboardPage from "../../../components/DashboardPage";
import Eyebrow from "../../../components/Eyebrow";
import PromptCard from "../../../components/image-generate-components/PromptCard";
import ThumbnailCard from "../../../components/ThumbnailCard";
import ThumbnailCardSkeleton from "../../../components/ThumbnailCardSkeleton";
import ConfirmDialog from "../../../components/modals/confirmation-dialog/ConfirmDialog";
import GenerationSkeleton from "./components/GenerationSkeleton";
import GenerationResultCard from "./components/GenerationResultCard";
//Libs
import { getApiErrorMessage } from "../../../lib/axios";
import { buttonClasses } from "../../../lib/buttonClasses";
import { buildThumbnailTitle } from "../../../lib/thumbnail";
import { clearPendingPrompt, readPendingPrompt } from "../../../lib/pendingPrompt";
import { GENERATION_CREDIT_COST, getRemainingCredits } from "../../../lib/credits";
//Types
import type { PromptSubmission, Thumbnail } from "../../../types";
import type { GenerateThumbnailPayload } from "../../../core/thumbnails/_models";
//Hooks
import useGenerateThumbnail from "../../../core/thumbnails/hooks/use-generate-thumbnail";
import { useDeleteThumbnail } from "../../../core/thumbnails/hooks/use-delete-thumbnail";
import useGetMyThumbnails from "../../../core/thumbnails/hooks/useGetMyThumbnails";
import { useResendVerification } from "../../../core/auth/hooks";
import { useSession } from "../../../store/useSessionStore";

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
  const [homepagePrompt, setHomepagePrompt] = useState(readPendingPrompt);
  useEffect(() => {
    clearPendingPrompt();
  }, []);

  const [lastGeneratedThumbnail, setLastGeneratedThumbnail] =
    useState<Thumbnail | null>(null);
  const [lastSubmissionPayload, setLastSubmissionPayload] =
    useState<GenerateThumbnailPayload | null>(null);

  const navigate = useNavigate();
  const user = useSession((state) => state.user);
  const { mutate: sendVerificationCode, isPending: isSendingCode } =
    useResendVerification();
  // New accounts start with no credits until the email is verified.
  // Free credits and their monthly refill need a verified email, also for older accounts.
  const needsVerification = Boolean(user && !user.isVerified);
  const remainingCredits = getRemainingCredits(user);
  const hasEnoughCredits = remainingCredits >= GENERATION_CREDIT_COST;

  const handleVerifyEmail = () => {
    if (!user?.email) return;
    sendVerificationCode(
      { email: user.email },
      {
        onSuccess: () => {
          sessionStorage.setItem("tg_verify_email", user.email);
          navigate("/verify-email");
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, "Couldn't send the code. Try again shortly."));
        },
      },
    );
  };

  const executeGeneration = (payload: GenerateThumbnailPayload) => {
    setError(null);
    setSuccess(null);

    generateThumbnailMutate(payload, {
      onSuccess: ({ thumbnail }) => {
        setSuccess("Your thumbnail was generated successfully.");
        setLastGeneratedThumbnail(thumbnail);
      },
      onError: (err) => {
        setError(getApiErrorMessage(err, "Failed to generate thumbnail."));
      },
    });
  };

  const handleSubmit = async (submission: PromptSubmission) => {
    setHomepagePrompt("");
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
    <DashboardPage
      eyebrow="Generate"
      title="Make a thumbnail"
      description={`Describe the video, then set the style, size and colors. Each thumbnail costs ${GENERATION_CREDIT_COST} credits.`}
      actions={<Eyebrow className="tabular-nums">{remainingCredits} credits left</Eyebrow>}
    >
      <div className="max-w-4xl space-y-4">
        {needsVerification && (
          <Alert variant="warning">
            <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
              Verify your email to get your free credits, refilled every 30 days.
              <Button
                type="button"
                variant="secondary"
                size="xs"
                fullWidth={false}
                onClick={handleVerifyEmail}
                disabled={isSendingCode}
              >
                {isSendingCode ? "Sending code..." : "Verify email"}
              </Button>
            </span>
          </Alert>
        )}
        {!needsVerification && !hasEnoughCredits && (
          <Alert variant="warning">
            You don't have enough credits for another thumbnail.
          </Alert>
        )}
        {error && <Alert variant="error">{error}</Alert>}
        {success && !isPending && <Alert variant="success">{success}</Alert>}

        {isPending ? (
          <GenerationSkeleton />
        ) : lastGeneratedThumbnail ? (
          <GenerationResultCard
            thumbnail={lastGeneratedThumbnail}
            onRegenerate={handleRegenerate}
            onNewPrompt={handleNewPrompt}
            isRegenerating={isPending}
          />
        ) : (
          <PromptCard
            label="Your prompt"
            defaultValue={homepagePrompt}
            disabled={isPending || !hasEnoughCredits}
            submitLabel="Generate thumbnail"
            onSubmit={handleSubmit}
          />
        )}
      </div>

      <section className="mt-14 border-t border-border pt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-baseline gap-2.5 text-xl font-medium tracking-[-0.015em] text-text-primary">
            Recent thumbnails
            <span className="font-mono text-sm tabular-nums text-text-muted">{generations.length}</span>
          </h2>
          <Link
            to="/dashboard/gallery"
            className={buttonClasses({ variant: "secondary", size: "sm", fullWidth: false })}
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
            <ThumbnailCardSkeleton count={8} />
          </div>
        ) : generations.length === 0 ? (
          <p className="mt-6 text-sm text-text-muted">
            No thumbnails yet. Generate your first one above.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
            {generations?.map((thumbnail) => (
              <ThumbnailCard
                key={thumbnail._id}
                thumbnail={thumbnail}
                showDelete
                source="generate"
                onDelete={(id) => setDeleteTarget(id)}
                showPublish
              />
            ))}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete this thumbnail?"
        description="This thumbnail will be moved to the recycle bin. You can restore it later."
        confirmLabel="Move to bin"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </DashboardPage>
  );
}
