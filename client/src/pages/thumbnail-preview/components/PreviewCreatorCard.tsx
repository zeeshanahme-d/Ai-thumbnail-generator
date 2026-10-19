import { Link } from "react-router-dom";
import Eyebrow from "../../../components/Eyebrow";
import { buttonClasses } from "../../../lib/buttonClasses";
import type { UserId } from "../../../types";

interface PreviewCreatorCardProps {
  userId: UserId | string | undefined;
}

export default function PreviewCreatorCard({ userId }: PreviewCreatorCardProps) {
  const isObject = userId && typeof userId === "object";
  const name = isObject
    ? (userId as UserId).fullName ?? (userId as UserId).name ?? "Anonymous"
    : "You";
  const username = isObject ? (userId as UserId).username : undefined;
  const avatarUrl = isObject ? (userId as UserId).avatar?.url : undefined;

  const profileHref = username ? `/profile/${username}` : "/profile";

  return (
    <div className="rounded-2xl border border-border bg-background-card p-5 shadow-card">
      <Eyebrow>Creator</Eyebrow>

      <div className="mt-3 flex items-center gap-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            loading="lazy"
            decoding="async"
            className="size-10 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background-surface-2 text-sm font-medium text-text-primary">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-text-primary">{name}</p>
          {username && <p className="truncate font-mono text-xs text-text-muted">@{username}</p>}
        </div>
      </div>

      <Link
        to={profileHref}
        className={buttonClasses({ variant: "secondary", size: "sm", rounded: "lg", className: "mt-4" })}
      >
        View profile
      </Link>
    </div>
  );
}
