import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { PreviewSource } from "../_types";
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
        className="font-medium text-text-secondary hover:text-primary transition-colors"
      >
        {parent.label}
      </Link>
      <ChevronRight size={14} className="shrink-0 text-text-muted" />
      <span className="max-w-[320px] truncate text-text-primary font-medium">
        {title}
      </span>
    </nav>
  );
}
