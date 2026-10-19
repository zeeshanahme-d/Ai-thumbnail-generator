import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { PreviewSource } from "../../../types";
import { getBreadcrumb } from "../utils/breadcrumb";

interface PreviewBreadcrumbProps {
  source: PreviewSource;
  title: string;
}

export default function PreviewBreadcrumb({ source, title }: PreviewBreadcrumbProps) {
  const parent = getBreadcrumb(source);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-text-muted">
      <Link
        to={parent.href}
        className="shrink-0 font-medium text-text-secondary transition-colors hover:text-text-primary"
      >
        {parent.label}
      </Link>
      <ChevronRight size={14} className="shrink-0 text-text-muted" />
      <span className="min-w-0 max-w-[320px] truncate text-text-primary">
        {title}
      </span>
    </nav>
  );
}
