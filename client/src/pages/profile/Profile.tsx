import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
//components
import Wrapper from "../../components/Wrapper";
import Button from "../../components/Button";
import ThumbnailCard from "../../components/ThumbnailCard";
import ThumbnailCardSkeleton from "../../components/ThumbnailCardSkeleton";
import Banner from "./components/Banner";
import UserNotFound from "./components/UserNotFound";
import ProfileHeader from "./components/ProfileHeader";
import ProfileHeaderSkeleton from "./components/ProfileHeaderSkeleton";
//hooks
import useGetMyThumbnails from "../dashboard/core/hooks/useGetMyThumbnails";
import useGetCommunityThumbnails from "../dashboard/core/hooks/useGetCommunityThumbnails";
import { useSession } from "../../store/useSessionStore";
import { usePublicProfile } from "./core/hooks/usePublicProfile";

export default function Profile() {
  const { username: urlUsername } = useParams<{ username?: string }>();
  const { user: currentUser, isAuthenticated } = useSession();
  const navigate = useNavigate();

  const isOwnProfile =
    Boolean(currentUser?.username) &&
    urlUsername?.toLowerCase() === currentUser?.username?.toLowerCase();

  const [params, setParams] = useState<Record<string, any>>({
    page: 1,
    limit: 12,
    sort: "newest",
  });

  // Query for logged in user's own profile
  const {
    data: myGenerations = [],
    pagination: myPagination,
    isPending: isMyLoading,
  } = useGetMyThumbnails(isOwnProfile ? params : { page: 1, limit: 0 });

  // Query for another user's public profile data
  const {
    data: publicProfileData,
    isPending: isPublicProfileLoading,
    isError: isPublicProfileError,
  } = usePublicProfile(!isOwnProfile ? urlUsername : undefined);

  const publicUser = publicProfileData?.user;

  // Query for another user's public thumbnails
  const {
    data: publicThumbnails = [],
    pagination: publicPagination,
    isPending: isPublicThumbnailsLoading,
  } = useGetCommunityThumbnails(
    !isOwnProfile && publicUser?._id
      ? { ...params, userId: publicUser._id }
      : undefined,
  );

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
  const thumbnails = isOwnProfile ? myGenerations : publicThumbnails;
  const isProfileLoading = isOwnProfile ? false : isPublicProfileLoading;
  const isThumbnailsLoading = isOwnProfile
    ? isMyLoading
    : isPublicProfileLoading || (Boolean(publicUser?._id) && isPublicThumbnailsLoading);

  const paginationMeta = isOwnProfile ? myPagination : publicPagination;
  const totalCount = paginationMeta?.total ?? thumbnails.length;
  const likesCount = thumbnails.reduce((acc, curr) => acc + (curr.likesCount || 0), 0);

  return (
    <main className="min-h-screen bg-background-surface pb-20">
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
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
            {isOwnProfile ? "My Creations" : "Published Creations"}{" "}
            <span className="text-sm font-normal text-text-muted">
              ({totalCount})
            </span>
          </h2>

          {isOwnProfile && (
            <div className="flex items-center gap-3">
              <Link to="/dashboard/generate">
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth={false}
                  className="gap-2"
                >
                  <Plus size={16} />
                  New Thumbnail
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Thumbnails Grid / Skeleton */}
        {isThumbnailsLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ThumbnailCardSkeleton count={6} />
          </div>
        ) : thumbnails.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {thumbnails.map((thumbnail, index) => (
              <ThumbnailCard
                key={thumbnail._id}
                thumbnail={thumbnail}
                index={index}
                source="profile"
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-text-muted">
            <p className="text-sm">No public creations yet.</p>
          </div>
        )}

        {/* Load More Pagination */}
        {paginationMeta?.total && paginationMeta.total > thumbnails.length ? (
          <div className="mt-10 flex justify-center">
            <Button
              type="button"
              onClick={() =>
                setParams((prev) => ({
                  ...prev,
                  limit: (prev.limit || 12) + 12,
                }))
              }
              fullWidth={false}
              variant="secondary"
            >
              Load More
            </Button>
          </div>
        ) : null}
      </Wrapper>
    </main>
  );
}
