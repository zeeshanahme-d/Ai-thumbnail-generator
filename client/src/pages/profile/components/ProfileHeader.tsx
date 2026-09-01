import { Link } from "react-router-dom";
import { Settings, Heart, LayoutGrid, Globe } from "lucide-react";
import Button from "../../../components/Button";
import { getUserInitial } from "../../../lib/herlper-fuctions";
import type { IUser } from "../../../types";
import type { PublicUserProfile } from "../core/_models";

interface ProfileHeaderProps {
  user?: IUser | PublicUserProfile | null;
  isOwnProfile: boolean;
  totalCount: number;
  likesCount: number;
}

export default function ProfileHeader({ user, isOwnProfile, totalCount, likesCount, }: ProfileHeaderProps) {
  return (
    <>
      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <div className="size-24 shrink-0 overflow-hidden rounded-full border-4 border-background-surface bg-[#00897b] flex items-center justify-center text-4xl font-medium text-white sm:size-32 sm:text-5xl">
            {user?.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt={user.fullName}
                loading="lazy"
                decoding="async"
                className="size-full object-cover"
              />
            ) : (
              getUserInitial(user?.fullName)
            )}
          </div>
        </div>

        {isOwnProfile && (
          <div className="mb-2 sm:mb-4">
            <Link to="/dashboard/settings">
              <Button
                variant="secondary"
                size="sm"
                fullWidth={false}
                className="gap-2 text-xs"
              >
                <Settings size={14} />
                Edit Profile
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="mt-4">
        <h1 className="text-2xl font-bold text-text-primary">{user?.fullName}</h1>
        <p className="text-sm font-medium text-primary">@{user?.username}</p>

        {user?.bio && (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">
            {user.bio}
          </p>
        )}

        {user?.website && (
          <a
            href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <Globe size={13} />
            {user.website.replace(/^https?:\/\//, "")}
          </a>
        )}

        <div className="mt-6 flex gap-6">
          <div className="flex flex-col items-start">
            <span className="text-lg font-semibold text-text-primary">
              {totalCount}
            </span>
            <span className="flex items-center gap-1 text-xs text-text-secondary">
              <LayoutGrid size={12} /> Creations
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-lg font-semibold text-text-primary">
              {likesCount}
            </span>
            <span className="flex items-center gap-1 text-xs text-text-secondary">
              <Heart size={12} /> Likes
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
