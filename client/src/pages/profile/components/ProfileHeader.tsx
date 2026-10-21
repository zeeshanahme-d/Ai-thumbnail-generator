import { Link } from "react-router-dom";
import { Settings, Globe } from "lucide-react";
import { buttonClasses } from "../../../lib/buttonClasses";
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
  const stats = [
    { label: "Creations", value: totalCount },
    { label: "Likes", value: likesCount },
  ];

  return (
    <>
      <div className="flex items-end justify-between">
        <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-background-surface-2 text-4xl font-medium text-text-primary shadow-card sm:size-32 sm:text-5xl">
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

        {isOwnProfile && (
          <Link
            to="/dashboard/settings"
            className={buttonClasses({ variant: "secondary", size: "sm", rounded: "lg", fullWidth: false, className: "mb-2 sm:mb-4" })}
          >
            <Settings size={14} />
            Edit profile
          </Link>
        )}
      </div>

      <div className="mt-5">
        <h1 className="wrap-break-word text-[clamp(1.75rem,1.4rem+1.5vw,2.5rem)] font-medium leading-tight tracking-[-0.03em] text-text-primary">
          {user?.fullName}
        </h1>
        <p className="mt-1 font-mono text-sm text-text-muted">@{user?.username}</p>

        {user?.bio && (
          <p className="mt-4 max-w-[60ch] text-[0.9375rem] leading-relaxed text-text-secondary">
            {user.bio}
          </p>
        )}

        {user?.website && (
          <a
            href={/^https?:\/\//i.test(user.website) ? user.website : `https://${user.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-text-secondary underline-offset-4 transition-colors hover:text-text-primary hover:underline"
          >
            <Globe size={14} />
            {user.website.replace(/^https?:\/\//i, "")}
          </a>
        )}

        <dl className="mt-6 flex gap-8">
          {stats.map(({ label, value }) => (
            <div key={label}>
              <dt className="font-mono text-xs uppercase tracking-[0.06em] text-text-muted">{label}</dt>
              <dd className="mt-1 text-2xl font-medium tabular-nums text-text-primary">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
