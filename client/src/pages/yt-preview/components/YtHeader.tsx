import { Bell, Menu, Mic, Play, Search, Video } from "lucide-react";
import { ytTheme } from "../theme";
import type { YtHeaderProps } from "../../../types";

export default function YtHeader({ theme, query = "" }: YtHeaderProps) {
  const colors = ytTheme[theme];

  return (
    <header className={`flex items-center gap-4 px-4 py-2 ${colors.title}`}>
      <Menu size={22} className="shrink-0" />
      <span className="flex shrink-0 items-center gap-1 font-semibold tracking-tight">
        <span className="flex h-5 w-7 items-center justify-center rounded-md bg-red-600">
          <Play size={11} className="fill-white text-white" />
        </span>
        YouTube
      </span>

      <div className="mx-auto hidden w-full max-w-xl items-center gap-3 sm:flex">
        <div className="flex min-w-0 flex-1 items-center">
          <div className={`flex h-10 min-w-0 flex-1 items-center rounded-l-full border px-4 text-sm ${colors.border}`}>
            <span className={`truncate ${query ? "" : colors.meta}`}>{query || "Search"}</span>
          </div>
          <div
            className={`flex h-10 w-16 shrink-0 items-center justify-center rounded-r-full border border-l-0 ${colors.border} ${colors.surface}`}
          >
            <Search size={18} />
          </div>
        </div>
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${colors.surface}`}>
          <Mic size={18} />
        </span>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-4 sm:ml-0">
        <Video size={22} />
        <Bell size={22} />
        <span className="size-8 rounded-full bg-violet-500" />
      </div>
    </header>
  );
}
