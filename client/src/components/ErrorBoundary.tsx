import { Component, useState, type ErrorInfo, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
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
import Wrapper from "./Wrapper";
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
    <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-background px-6 py-20">
      {/* Background decorative glowing orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-125 w-125 -translate-x-1/2 rounded-full bg-red-500/10 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/3 -z-10 h-100 w-100 rounded-full bg-primary/10 blur-[100px]"
      />

      <Wrapper className="flex max-w-xl flex-col items-center text-center">
        {/* Error Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-500 backdrop-blur">
          <AlertTriangle size={14} className="text-red-500" />
          Application Error
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-text-primary sm:text-5xl">
          Something went wrong
        </h1>

        {/* Message */}
        <p className="mt-3 max-w-md text-sm text-text-secondary">
          An unexpected error occurred while rendering this page. Your data is safe,
          and you can reload the page or navigate back to safety.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="primary"
            size="md"
            fullWidth={false}
            onClick={reset}
            className="gap-2"
          >
            <RotateCcw size={16} />
            Try Again
          </Button>

          <Button
            variant="secondary"
            size="md"
            fullWidth={false}
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft size={16} />
            Go Back
          </Button>

          {isAuthenticated ? (
            <Link to="/dashboard/generate">
              <Button
                variant="secondary"
                size="md"
                fullWidth={false}
                className="gap-2"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/">
              <Button
                variant="secondary"
                size="md"
                fullWidth={false}
                className="gap-2"
              >
                <Home size={16} />
                Home
              </Button>
            </Link>
          )}
        </div>

        {/* Collapsible Error Details */}
        <div className="mt-8 w-full text-left">
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-lg border border-border bg-background-surface px-4 py-2.5 text-xs font-medium text-text-secondary transition-colors hover:bg-background-surface-2 hover:text-text-primary"
          >
            <span>Technical details</span>
            {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showDetails && (
            <div className="mt-2 rounded-lg border border-border bg-background-card p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-red-500">
                  {error.name}: {error.message}
                </span>
                <Button
                  variant="ghost"
                  size="xs"
                  fullWidth={false}
                  onClick={handleCopy}
                  className="gap-1.5 text-xs text-text-muted hover:text-text-primary"
                >
                  {copied ? (
                    <>
                      <Check size={12} className="text-green-500" />
                      <span className="text-green-500">Copied</span>
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
