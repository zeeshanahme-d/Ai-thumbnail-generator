import type { YtAvatarProps } from "../../../types";

export default function YtAvatar({ name, imageUrl, className = "size-9" }: YtAvatarProps) {
  if (imageUrl) {
    return <img src={imageUrl} alt={name} className={`shrink-0 rounded-full object-cover ${className}`} />;
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-semibold text-white ${className}`}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
