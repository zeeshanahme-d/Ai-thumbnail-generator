import type { PreviewSource } from "../_types";

interface BreadcrumbItem {
  label: string;
  href: string;
}

const BREADCRUMB_MAP: Record<PreviewSource, BreadcrumbItem> = {
  community: { label: "Community", href: "/community" },
  gallery: { label: "My Gallery", href: "/dashboard/gallery" },
  generate: { label: "Generate", href: "/dashboard/generate" },
  profile: { label: "Profile", href: "/profile" },
  "recycle-bin": { label: "Recycle Bin", href: "/dashboard/recycle-bin" },
};

export function getBreadcrumb(source: PreviewSource): BreadcrumbItem {
  return BREADCRUMB_MAP[source] ?? { label: "Back", href: "/" };
}
