import { Link } from "react-router-dom";
import type { UserId } from "../../../types";

const AVATAR_COLORS = [
  "bg-red-500",
  "bg-teal-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-blue-500",
];
const avatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

interface PreviewCreatorCardProps {
  userId: UserId | string | undefined;
}

export default function PreviewCreatorCard({ userId }: PreviewCreatorCardProps) {
  const isObject = userId && typeof userId === "object";
  const name = isObject
    ? (userId as UserId).fullName ?? (userId as UserId).name ?? "Anonymous"
    : "You";
  const avatarUrl = isObject ? (userId as UserId).avatar?.url : undefined;
  const initial = name.charAt(0).toUpperCase();
  const color = avatarColor(name);

  return (
    <div className="rounded-2xl border border-border bg-background-card p-5">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">
        Creator
      </p>

      <div className="mt-3 flex items-center gap-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="size-10 rounded-full object-cover"
          />
        ) : (
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${color}`}
          >
            {initial}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text-primary">{name}</p>
          <p className="truncate text-xs text-text-muted">@{name.toLowerCase().replace(/\s+/g, "_")}</p>
        </div>
      </div>

      <Link
        to="/profile"
        className="mt-4 flex w-full items-center justify-center rounded-xl border border-border py-2 text-sm font-medium text-text-primary transition hover:bg-background-surface-2"
      >
        View Profile
      </Link>
    </div>
  );
}
