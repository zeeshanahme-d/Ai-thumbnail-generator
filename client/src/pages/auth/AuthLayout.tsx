import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ThemeButton from "../../components/ThemeButton";
import AuthShowcase from "./components/AuthShowcase";
import Logo from "../../assets/svgs/logo.svg?react";
import type { AuthLayoutProps } from "../../types";

// The sign-in, sign-up and code screens: the form on the left, sample thumbnails on the right from lg up.
export default function AuthLayout({ title, subtitle, children, topSlot }: AuthLayoutProps) {
  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative flex flex-col px-4 sm:px-6 lg:px-12">
        <div aria-hidden="true" className="backdrop-grid pointer-events-none absolute inset-x-0 top-0 h-128" />

        <header className="relative flex h-16 items-center justify-between gap-4">
          <Link to="/" aria-label="Thumblify home">
            <Logo className="h-7 w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              <ArrowLeft size={16} />
              Back to home
            </Link>
            <ThemeButton />
          </div>
        </header>

        <div className="relative flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            {topSlot && <div className="mb-8">{topSlot}</div>}
            <h1 className="text-[clamp(1.75rem,1.4rem+1.5vw,2.25rem)] font-medium leading-tight tracking-[-0.03em] text-text-primary">
              {title}
            </h1>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-text-secondary">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>

        <footer className="relative flex flex-wrap items-center justify-between gap-2 py-6 text-xs text-text-muted">
          <span>&copy; {new Date().getFullYear()} Thumblify</span>
          <nav aria-label="Legal" className="flex gap-4">
            <Link to="/privacy-policy" className="transition-colors hover:text-text-primary">
              Privacy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-text-primary">
              Terms
            </Link>
          </nav>
        </footer>
      </div>

      <AuthShowcase />
    </main>
  );
}
