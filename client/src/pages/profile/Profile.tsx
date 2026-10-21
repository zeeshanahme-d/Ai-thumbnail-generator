import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
//components
import Wrapper from "../../components/Wrapper";
import Button from "../../components/Button";
import ThumbnailCard from "../../components/ThumbnailCard";
import ThumbnailCardSkeleton from "../../components/ThumbnailCardSkeleton";
import ListError from "../../components/ListError";
import Banner from "./components/Banner";
import UserNotFound from "./components/UserNotFound";
import ProfileHeader from "./components/ProfileHeader";
import ProfileHeaderSkeleton from "./components/ProfileHeaderSkeleton";
//hooks
import useInfiniteThumbnails from "../../core/thumbnails/hooks/useInfiniteThumbnails";
import { buttonClasses } from "../../lib/buttonClasses";
import { useSession } from "../../store/useSessionStore";
import { usePublicProfile } from "./core/hooks/usePublicProfile";
import type { ThumbnailFilters } from "../../types";

const PAGE_SIZE = 12;
const PROFILE_FILTERS: ThumbnailFilters = { limit: PAGE_SIZE, sort: "newest" };

export default function Profile() {
  const { username: urlUsername } = useParams<{ username?: string }>();
  const { user: currentUser, isAuthenticated } = useSession();
  const navigate = useNavigate();

  const isOwnProfile =
    Boolean(currentUser?.username) &&
    urlUsername?.toLowerCase() === currentUser?.username?.toLowerCase();

  // Public profile data. Also loaded for your own profile, for the likes total.
  const {
    data: publicProfileData,
    isPending: isPublicProfileLoading,
    isError: isPublicProfileError,
  } = usePublicProfile(urlUsername);

  const publicUser = publicProfileData?.user;

  // Results are not kept between loads, so one user's grid never shows on another's profile.
  const myThumbnails = useInfiniteThumbnails("mine", PROFILE_FILTERS, {
    enabled: isOwnProfile,
    keepResultsWhileLoading: false,
  });
  const publicThumbnails = useInfiniteThumbnails(
    "community",
    { ...PROFILE_FILTERS, userId: publicUser?._id },
    { enabled: !isOwnProfile && Boolean(publicUser?._id), keepResultsWhileLoading: false },
  );
  const list = isOwnProfile ? myThumbnails : publicThumbnails;

  useEffect(() => {
    if (!urlUsername) {
      if (isAuthenticated && currentUser?.username) {
        navigate(`/profile/${currentUser.username}`, { replace: true });
      } else if (!isAuthenticated) {
        navigate("/login", { replace: true });
      }
    }
  }, [urlUsername, isAuthenticated, currentUser?.username, navigate]);

  // Early return if no username in URL
  if (!urlUsername) {
    return null;
  }

  // Handle 404 / User Not Found for public profile
  if (!isOwnProfile && isPublicProfileError) {
    return <UserNotFound username={urlUsername} />;
  }

  // Active user data & thumbnails
  const profileUser = isOwnProfile ? currentUser : publicUser;
  const isProfileLoading = isPublicProfileLoading;
  const { thumbnails } = list;
  const totalCount = list.total;
  const likesCount = publicProfileData?.likesCount ?? 0;

  return (
    <main className="min-h-screen pb-(--section-y)">
      <Banner />

      <Wrapper className="relative -mt-12 mb-8 sm:-mt-16">
        {/* Profile Details Header / Skeleton */}
        {isProfileLoading ? (
          <ProfileHeaderSkeleton />
        ) : (
          <ProfileHeader
            user={profileUser}
            isOwnProfile={isOwnProfile}
            totalCount={totalCount}
            likesCount={likesCount}
          />
        )}

        <hr className="my-8 border-border" />

        {/* Section Title & Actions */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-baseline gap-2.5 text-xl font-medium tracking-[-0.015em] text-text-primary">
            {isOwnProfile ? "My creations" : "Published creations"}
            <span className="font-mono text-sm tabular-nums text-text-muted">{totalCount}</span>
          </h2>

          {isOwnProfile && (
            <Link
              to="/dashboard/generate"
              className={buttonClasses({ size: "sm", rounded: "lg", fullWidth: false })}
            >
              <Plus size={16} />
              New thumbnail
            </Link>
          )}
        </div>

        {/* Thumbnails Grid / Skeleton */}
        {list.isPending ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ThumbnailCardSkeleton count={6} />
          </div>
        ) : list.loadFailed ? (
          <ListError className="py-12" onRetry={list.refetch} />
        ) : thumbnails.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {thumbnails.map((thumbnail) => (
                <ThumbnailCard
                  key={thumbnail._id}
                  thumbnail={thumbnail}
                  source="profile"
                />
              ))}
            </div>

            {list.isFetchingNextPage && (
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <ThumbnailCardSkeleton count={3} />
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center text-text-secondary">
            <p className="text-sm">
              {isOwnProfile ? "You haven't made any thumbnails yet." : "No published thumbnails yet."}
            </p>
          </div>
        )}

        {/* Load More Pagination */}
        {list.hasNextPage && (
          <div className="mt-10 flex justify-center">
            <Button
              type="button"
              onClick={() => list.fetchNextPage()}
              disabled={list.isFetchingNextPage}
              fullWidth={false}
              variant="secondary"
            >
              {list.isFetchingNextPage ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </Wrapper>
    </main>
  );
}
