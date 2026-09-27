import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import dayjs from "dayjs";
import { STYLE_DOTS } from "../../data/community";
import { getThumbnailImageUrl, getThumbnailAuthorName } from "../../lib/thumbnail";
import useGetCommunityThumbnails from "../../core/thumbnails/hooks/useGetCommunityThumbnails";
import useLikeThumbnail from "../../core/thumbnails/hooks/useLikeThumbnail";
import useThumbnail from "../../core/thumbnails/hooks/use-thumbnail";
import { recordThumbnailView } from "../../core/thumbnails/_requests";
import { useSession } from "../../store/useSessionStore";
import PageLoader from "../../components/PageLoader";

import PreviewBreadcrumb from "./components/PreviewBreadcrumb";
import PreviewStats from "./components/PreviewStats";
import PreviewGenerateCTA from "./components/PreviewGenerateCTA";
import PreviewCreatorCard from "./components/PreviewCreatorCard";
import PreviewStyleCard from "./components/PreviewStyleCard";
import PreviewPromptCard from "./components/PreviewPromptCard";
import PreviewActions from "./components/PreviewActions";
import PreviewMoreThumbnails from "./components/PreviewMoreThumbnails";

import type { ThumbnailPreviewState } from "../../types";
import toast from "react-hot-toast";

export default function ThumbnailPreview() {
  const location = useLocation();
  const navigate = useNavigate();

  const { id = "" } = useParams();
  const state = location.state as ThumbnailPreviewState | null;
  const isAuthenticated = useSession((s) => s.isAuthenticated);

  // Shared links arrive without router state, so the thumbnail is always fetched by id.
  const { data: thumbnail, isPending } = useThumbnail(
    id,
    state?.thumbnail?._id === id ? state.thumbnail : undefined,
  );
  const { data: communityThumbnails } = useGetCommunityThumbnails(
    { style: thumbnail?.style, limit: 5, page: 1 },
    { enabled: Boolean(thumbnail) },
  );
  const { mutate: likeMutate, isPending: isLiking } = useLikeThumbnail();

  useEffect(() => {
    recordThumbnailView(id).catch(() => {});
  }, [id]);

  if (isPending) {
    return <PageLoader />;
  }

  if (!thumbnail) {
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

  const source = state?.source ?? "community";
  const imageUrl = getThumbnailImageUrl(thumbnail);
  const authorName = getThumbnailAuthorName(thumbnail);
  const dot = (thumbnail.style && STYLE_DOTS[thumbnail.style]) || "bg-gray-400";

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
      <div className="border-b border-border bg-background-card">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <PreviewBreadcrumb source={source} title={thumbnail.title} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* ─── Left column ─── */}
          <div className="flex-1 min-w-0">
            {/* Thumbnail image */}
            <div className="overflow-hidden rounded-2xl border border-border bg-background-card shadow-lg">
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
            </div>

            {/* Stats row */}
            <div className="mt-5">
              <PreviewStats
                thumbnail={thumbnail}
                isLiked={thumbnail.isLiked}
              />
            </div>

            {/* Title */}
            <h1 className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-text-primary sm:text-3xl">
              {thumbnail.title}
            </h1>

            {/* Prompt card */}
            <div className="mt-6">
              <PreviewPromptCard thumbnail={thumbnail} />
            </div>

            {/* Actions */}
            <div className="mt-6">
              <PreviewActions thumbnail={thumbnail} />
            </div>

            {/* More thumbnails */}
            {communityThumbnails.length > 0 && (
              <div className="mt-10">
                <PreviewMoreThumbnails
                  thumbnails={communityThumbnails}
                  style={thumbnail.style ?? ""}
                  source={source}
                />
              </div>
            )}

            {/* About this thumbnail */}
            <div className="mt-10 rounded-2xl border border-border bg-background-card p-5">
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
            </div>
          </div>

          {/* ─── Right sidebar ─── */}
          <aside className="w-full lg:w-72 xl:w-80 flex flex-col gap-4 shrink-0">
            {/* Generate CTA */}
            <div
            >
              <PreviewGenerateCTA style={thumbnail.style} />
            </div>

            {/* Creator card */}
            <div
            >
              <PreviewCreatorCard userId={thumbnail.userId} />
            </div>

            {/* Style card */}
            {thumbnail.style && (
              <div
              >
                <PreviewStyleCard style={thumbnail.style} />
              </div>
            )}

            {/* Like button (sidebar). Only published thumbnails can be liked. */}
            {isAuthenticated && thumbnail.published && (
              <button
                type="button"
                onClick={handleLike}
                disabled={isLiking}
                className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-background-card py-3 text-sm font-medium text-text-primary transition hover:bg-background-surface-2 disabled:opacity-60"
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
              </button>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
