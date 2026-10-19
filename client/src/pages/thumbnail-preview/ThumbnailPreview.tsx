import { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Heart, Loader2 } from "lucide-react";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { STYLE_DOTS } from "../../data/community";
import { getThumbnailImageUrl, getThumbnailAuthorName } from "../../lib/thumbnail";
import { buttonClasses } from "../../lib/buttonClasses";
import { FREE_MONTHLY_CREDITS, GENERATION_CREDIT_COST } from "../../lib/credits";
import useGetCommunityThumbnails from "../../core/thumbnails/hooks/useGetCommunityThumbnails";
import useLikeThumbnail from "../../core/thumbnails/hooks/useLikeThumbnail";
import useThumbnail from "../../core/thumbnails/hooks/use-thumbnail";
import { recordThumbnailView } from "../../core/thumbnails/_requests";
import { useSession } from "../../store/useSessionStore";
import Button from "../../components/Button";
import Eyebrow from "../../components/Eyebrow";
import PageLoader from "../../components/PageLoader";
import Wrapper from "../../components/Wrapper";

import PreviewBreadcrumb from "./components/PreviewBreadcrumb";
import PreviewStats from "./components/PreviewStats";
import PreviewGenerateCTA from "./components/PreviewGenerateCTA";
import PreviewCreatorCard from "./components/PreviewCreatorCard";
import PreviewStyleCard from "./components/PreviewStyleCard";
import PreviewPromptCard from "./components/PreviewPromptCard";
import PreviewActions from "./components/PreviewActions";
import PreviewMoreThumbnails from "./components/PreviewMoreThumbnails";

import type { ThumbnailPreviewState } from "../../types";

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
      <main className="relative overflow-hidden">
        <div aria-hidden="true" className="public-grid-bg pointer-events-none absolute inset-x-0 top-0 h-128" />
        <Wrapper className="relative flex min-h-[60vh] flex-col justify-center py-16">
          <Eyebrow dot>Thumbnail not found</Eyebrow>
          <h1 className="mt-5 text-[clamp(2rem,1.4rem+2.6vw,3.5rem)] font-medium leading-[1.04] tracking-[-0.035em] text-text-primary">
            This thumbnail isn't available.
          </h1>
          <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-text-secondary">
            It may have been unpublished or deleted. The community gallery has everything that's published.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button type="button" variant="secondary" size="lg" rounded="lg" fullWidth={false} onClick={() => navigate(-1)}>
              <ArrowLeft size={16} />
              Go back
            </Button>
            <Link to="/community" className={buttonClasses({ size: "lg", rounded: "lg", fullWidth: false })}>
              Browse the community
              <ArrowRight size={16} />
            </Link>
          </div>
        </Wrapper>
      </main>
    );
  }

  const source = state?.source ?? "community";
  const imageUrl = getThumbnailImageUrl(thumbnail);
  const authorName = getThumbnailAuthorName(thumbnail);
  const dot = (thumbnail.style && STYLE_DOTS[thumbnail.style]) || "bg-gray-400";
  const date = dayjs(thumbnail.publishedAt ?? thumbnail.createdAt).format("MMMM D, YYYY");

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to like thumbnails.");
      return;
    }
    likeMutate(thumbnail._id);
  };

  return (
    <main className="pb-(--section-y)">
      <Wrapper className="pt-8 lg:pt-10">
        <PreviewBreadcrumb source={source} title={thumbnail.title} />

        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* ─── Main column ─── */}
          <div className="min-w-0 lg:col-span-8">
            {/* Thumbnail image */}
            <div className="overflow-hidden rounded-2xl border border-border bg-background-card shadow-card">
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
                  <span className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 font-mono text-xs text-white backdrop-blur">
                    {thumbnail.aspect_ratio}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5">
              <PreviewStats thumbnail={thumbnail} isLiked={thumbnail.isLiked} />
            </div>

            <h1 className="mt-4 wrap-break-word text-[clamp(1.375rem,1.15rem+0.9vw,1.875rem)] font-medium leading-snug tracking-[-0.02em] text-text-primary">
              {thumbnail.title}
            </h1>

            <div className="mt-6">
              <PreviewPromptCard thumbnail={thumbnail} />
            </div>

            <div className="mt-6">
              <PreviewActions thumbnail={thumbnail} />
            </div>

            {communityThumbnails.length > 0 && (
              <div className="mt-12">
                <PreviewMoreThumbnails
                  thumbnails={communityThumbnails}
                  style={thumbnail.style ?? ""}
                  source={source}
                />
              </div>
            )}

            {/* About this thumbnail */}
            <section className="mt-12 border-t border-border pt-8">
              <Eyebrow>About this thumbnail</Eyebrow>
              <p className="mt-3 max-w-[68ch] text-[0.9375rem] leading-relaxed text-text-secondary">
                <span className="text-text-primary">{thumbnail.title}</span> was generated with Thumblify
                {thumbnail.style ? ` in the ${thumbnail.style} style` : ""} and{" "}
                {thumbnail.published ? "published" : "created"} by {authorName} on {date}.
              </p>
              <p className="mt-2 max-w-[68ch] text-[0.9375rem] leading-relaxed text-text-secondary">
                To make one like it,{" "}
                <Link to="/dashboard/generate" className="font-medium text-text-primary underline underline-offset-4">
                  open the generator
                </Link>
                , describe your video and pick {thumbnail.style ? `the ${thumbnail.style} style` : "a style"}. Each
                thumbnail costs {GENERATION_CREDIT_COST} credits, and free accounts get {FREE_MONTHLY_CREDITS} a month
                once the email is verified.
              </p>
            </section>
          </div>

          {/* ─── Sidebar ─── */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
            <PreviewGenerateCTA style={thumbnail.style} />
            <PreviewCreatorCard userId={thumbnail.userId} />
            {thumbnail.style && <PreviewStyleCard style={thumbnail.style} />}

            {/* Only published thumbnails can be liked. */}
            {isAuthenticated && thumbnail.published && (
              <Button
                type="button"
                variant="secondary"
                size="lg"
                rounded="lg"
                onClick={handleLike}
                disabled={isLiking}
                aria-pressed={Boolean(thumbnail.isLiked)}
              >
                {isLiking ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Heart size={16} className={thumbnail.isLiked ? "fill-primary text-primary" : ""} />
                )}
                {thumbnail.isLiked ? "Liked" : "Like this thumbnail"}
              </Button>
            )}
          </aside>
        </div>
      </Wrapper>
    </main>
  );
}
