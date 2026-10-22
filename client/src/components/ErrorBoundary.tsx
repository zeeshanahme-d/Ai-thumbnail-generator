import { Component, useState, type ErrorInfo, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Home,
  LayoutDashboard,
  RotateCcw,
} from "lucide-react";
import Button from "./Button";
import Eyebrow from "./Eyebrow";
import Wrapper from "./Wrapper";
import { buttonClasses } from "../lib/buttonClasses";
import { useSession } from "../store/useSessionStore";
import type { ErrorBoundaryProps } from "../types";

interface FallbackProps {
  error: Error;
  reset: () => void;
}

function DefaultErrorFallback({ error, reset }: FallbackProps) {
  const navigate = useNavigate();
  const isAuthenticated = useSession((state) => state.isAuthenticated);
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const errorText = `${error.name}: ${error.message}\n\n${error.stack ?? ""}`;
    void navigator.clipboard.writeText(errorText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="relative overflow-hidden">
      <div aria-hidden="true" className="backdrop-grid pointer-events-none absolute inset-x-0 top-0 h-128" />

      <Wrapper className="relative flex min-h-dvh flex-col justify-center py-16">
        <Eyebrow dot>Application error</Eyebrow>
        <h1 className="mt-6 text-[clamp(2.25rem,1.5rem+3.5vw,4rem)] font-medium leading-[1.02] tracking-[-0.04em] text-text-primary">
          Something went wrong.
        </h1>
        <p className="mt-5 max-w-[52ch] text-pretty text-base leading-relaxed text-text-secondary">
          This page hit an unexpected error. Your data is safe. Try again, or go back to where you were.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button variant="primary" size="lg" rounded="lg" fullWidth={false} onClick={reset}>
            <RotateCcw size={16} />
            Try again
          </Button>
          <Button variant="secondary" size="lg" rounded="lg" fullWidth={false} onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Go back
          </Button>
          <Link
            to={isAuthenticated ? "/dashboard/generate" : "/"}
            className={buttonClasses({ variant: "secondary", size: "lg", rounded: "lg", fullWidth: false })}
          >
            {isAuthenticated ? <LayoutDashboard size={16} /> : <Home size={16} />}
            {isAuthenticated ? "Dashboard" : "Home"}
          </Link>
        </div>

        {/* Collapsible error details */}
        <div className="mt-10 w-full max-w-3xl text-left">
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            aria-expanded={showDetails}
            className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-border bg-background-card px-4 py-2.5 text-xs font-medium text-text-secondary transition-colors hover:bg-background-surface-2 hover:text-text-primary"
          >
            <span>Technical details</span>
            {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showDetails && (
            <div className="mt-2 rounded-lg border border-border bg-background-card p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-primary">
                  {error.name}: {error.message}
                </span>
                <Button
                  variant="secondary"
                  size="xs"
                  rounded="lg"
                  fullWidth={false}
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <Check size={12} className="text-success" />
                      <span className="text-success">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>
              {error.stack && (
                <pre className="max-h-48 overflow-x-auto overflow-y-auto rounded bg-background-surface p-3 font-mono text-[11px] leading-relaxed text-text-secondary">
                  {error.stack}
                </pre>
              )}
            </div>
          )}
        </div>
      </Wrapper>
    </main>
  );
}

interface InnerProps extends ErrorBoundaryProps {
  resetKey?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryInner extends Component<InnerProps, State> {
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  componentDidUpdate(prevProps: InnerProps): void {
    if (this.state.hasError && this.props.resetKey !== prevProps.resetKey) {
      this.handleReset();
    }
  }

  handleReset = (): void => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      if (typeof fallback === "function") {
        return fallback({ error, reset: this.handleReset });
      }
      if (fallback) {
        return fallback;
      }
      return <DefaultErrorFallback error={error} reset={this.handleReset} />;
    }

    return children;
  }
}

function ErrorBoundaryRouterAware(props: ErrorBoundaryProps) {
  let locationKey = "";
  try {
    const location = useLocation();
    locationKey = location.pathname;
  } catch {
    // Graceful fallback if rendered outside a React Router context
    locationKey = "";
  }

  return <ErrorBoundaryInner {...props} resetKey={locationKey} />;
}

export default function ErrorBoundary(props: ErrorBoundaryProps) {
  return <ErrorBoundaryRouterAware {...props} />;
}
