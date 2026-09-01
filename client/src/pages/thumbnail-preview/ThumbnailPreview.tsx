import { useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import dayjs from "dayjs";
import { STYLE_DOTS } from "../../data/community";
import { getThumbnailImageUrl, getThumbnailAuthorName } from "../../lib/thumbnail";
import useGetCommunityThumbnails from "../dashboard/core/hooks/useGetCommunityThumbnails";
import useLikeThumbnail from "../dashboard/core/hooks/useLikeThumbnail";
import { useSession } from "../../store/useSessionStore";

import PreviewBreadcrumb from "./components/PreviewBreadcrumb";
import PreviewStats from "./components/PreviewStats";
import PreviewGenerateCTA from "./components/PreviewGenerateCTA";
import PreviewCreatorCard from "./components/PreviewCreatorCard";
import PreviewStyleCard from "./components/PreviewStyleCard";
import PreviewPromptCard from "./components/PreviewPromptCard";
import PreviewActions from "./components/PreviewActions";
import PreviewMoreThumbnails from "./components/PreviewMoreThumbnails";

import type { ThumbnailPreviewState } from "./_types";
import toast from "react-hot-toast";

export default function ThumbnailPreview() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as ThumbnailPreviewState | null;
  const isAuthenticated = useSession((s) => s.isAuthenticated);

  // Guard: if no state was passed, navigate back
  if (!state?.thumbnail) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background-surface">
        <div className="text-center">
          <p className="text-text-secondary text-sm">Thumbnail not found.</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-3 text-xs text-primary hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const { thumbnail, source } = state;
  const imageUrl = getThumbnailImageUrl(thumbnail);
  const authorName = getThumbnailAuthorName(thumbnail);
  const dot = (thumbnail.style && STYLE_DOTS[thumbnail.style]) || "bg-gray-400";

  const { data: communityThumbnails } = useGetCommunityThumbnails({ style: thumbnail.style, limit: 5, page: 1 });

  // Like handler
  const { mutate: likeMutate, isPending: isLiking } = useLikeThumbnail();
  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to like thumbnails.");
      return;
    }
    likeMutate(thumbnail._id);
  };

  return (
    <div className="min-h-screen bg-background-surface">
      {/* Breadcrumb bar */}
      <div className="border-b border-border bg-background-card px-6 py-3 md:px-10">
        <PreviewBreadcrumb source={source} title={thumbnail.title} />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* ─── Left column ─── */}
          <div className="flex-1 min-w-0">
            {/* Thumbnail image */}
            <motion.div
              className="overflow-hidden rounded-2xl border border-border bg-background-card shadow-lg"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 70 }}
            >
              <div className="relative aspect-video w-full overflow-hidden bg-background-surface-2">
                {thumbnail.isGenerating || !imageUrl ? (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-text-muted">
                    <Loader2 size={28} className="animate-spin text-primary" />
                    <span className="text-sm font-medium">Generating...</span>
                  </div>
                ) : (
                  <img
                    src={imageUrl}
                    alt={thumbnail.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                )}

                {/* Style badge */}
                {thumbnail.style && !thumbnail.isGenerating && (
                  <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                    <span className={`size-2 rounded-full ${dot}`} />
                    {thumbnail.style}
                  </span>
                )}

                {/* Aspect ratio badge */}
                {thumbnail.aspect_ratio && !thumbnail.isGenerating && (
                  <span className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                    {thumbnail.aspect_ratio}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Stats row */}
            <motion.div
              className="mt-5"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.08, type: "spring", stiffness: 280, damping: 70 }}
            >
              <PreviewStats
                thumbnail={thumbnail}
                isLiked={thumbnail.isLiked}
              />
            </motion.div>

            {/* Title */}
            <motion.h1
              className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-text-primary sm:text-3xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.12, type: "spring", stiffness: 280, damping: 70 }}
            >
              {thumbnail.title}
            </motion.h1>

            {/* Prompt card */}
            <motion.div
              className="mt-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.16, type: "spring", stiffness: 280, damping: 70 }}
            >
              <PreviewPromptCard thumbnail={thumbnail} />
            </motion.div>

            {/* Actions */}
            <motion.div
              className="mt-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 280, damping: 70 }}
            >
              <PreviewActions thumbnail={thumbnail} />
            </motion.div>

            {/* More thumbnails */}
            {communityThumbnails.length > 0 && (
              <motion.div
                className="mt-10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.26, type: "spring", stiffness: 280, damping: 70 }}
              >
                <PreviewMoreThumbnails
                  thumbnails={communityThumbnails}
                  style={thumbnail.style ?? ""}
                  source={source}
                />
              </motion.div>
            )}

            {/* About this thumbnail */}
            <motion.div
              className="mt-10 rounded-2xl border border-border bg-background-card p-5"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 280, damping: 70 }}
            >
              <h2 className="text-sm font-semibold text-text-primary">
                About This AI-Generated Thumbnail
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                This{" "}
                <span className="font-medium text-primary">{thumbnail.title}</span>{" "}
                thumbnail was generated using{" "}
                <span className="font-medium text-primary">Thumblify's AI thumbnail generator</span>{" "}
                {thumbnail.style ? `in the ${thumbnail.style} style. ` : ". "}
                It was published by{" "}
                <span className="font-medium text-text-primary">@{authorName.toLowerCase().replace(/\s+/g, "_")}</span>{" "}
                {dayjs(thumbnail.publishedAt ?? thumbnail.createdAt).format("on MMMM D, YYYY")}.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                You can{" "}
                <a href="/dashboard/generate" className="font-medium text-primary hover:underline">
                  generate a similar {thumbnail.style ?? ""} thumbnail
                </a>{" "}
                for free using Thumblify — no sign-up required.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Thumblify lets content creators generate stunning YouTube thumbnails, social media graphics,
                and video covers using AI in seconds. Choose from 10+ style presets including cinematic,
                anime, neon, photorealistic, and more.
              </p>
            </motion.div>
          </div>

          {/* ─── Right sidebar ─── */}
          <aside className="w-full lg:w-72 xl:w-80 flex flex-col gap-4 shrink-0">
            {/* Generate CTA */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 280, damping: 70 }}
            >
              <PreviewGenerateCTA style={thumbnail.style} />
            </motion.div>

            {/* Creator card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.18, type: "spring", stiffness: 280, damping: 70 }}
            >
              <PreviewCreatorCard userId={thumbnail.userId} />
            </motion.div>

            {/* Style card */}
            {thumbnail.style && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.24, type: "spring", stiffness: 280, damping: 70 }}
              >
                <PreviewStyleCard style={thumbnail.style} />
              </motion.div>
            )}

            {/* Like button (sidebar) */}
            {isAuthenticated && (
              <motion.button
                type="button"
                onClick={handleLike}
                disabled={isLiking}
                className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-background-card py-3 text-sm font-medium text-text-primary transition hover:bg-background-surface-2 disabled:opacity-60"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 280, damping: 70 }}
                aria-label="Like thumbnail"
              >
                {isLiking ? (
                  <Loader2 size={16} className="animate-spin text-primary" />
                ) : (
                  <span
                    className={`text-xl leading-none ${thumbnail.isLiked ? "text-primary" : "text-text-muted"
                      }`}
                    aria-hidden
                  >
                    {thumbnail.isLiked ? "♥" : "♡"}
                  </span>
                )}
                {thumbnail.isLiked ? "Liked" : "Like this thumbnail"}
              </motion.button>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
