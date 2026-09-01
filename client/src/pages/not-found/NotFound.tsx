import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Home, ArrowLeft, Sparkles, LayoutDashboard } from "lucide-react";
import Button from "../../components/Button";
import Wrapper from "../../components/Wrapper";
import { useSession } from "../../store/useSessionStore";

export default function NotFound() {
  const navigate = useNavigate();
  const isAuthenticated = useSession((state) => state.isAuthenticated);

  return (
    <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-background px-6 py-20">
      {/* Background decorative glowing orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-125 w-125 -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/3 -z-10 h-100 w-100 rounded-full bg-primary/10 blur-[100px]"
      />

      <Wrapper className="flex flex-col items-center text-center">
        {/* Animated 404 badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary backdrop-blur"
        >
          <Sparkles size={14} className="animate-spin" />
          Page Not Found
        </motion.div>

        {/* Animated 404 Large Glitch/Floating text */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 240,
            damping: 24,
            delay: 0.1,
          }}
          className="mt-6 text-7xl font-extrabold tracking-tight text-text-primary sm:text-9xl md:text-[11rem]"
        >
          <span className="bg-linear-to-b from-text-primary via-text-primary to-text-muted bg-clip-text text-transparent">
            404
          </span>
        </motion.h1>

        {/* Message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 240,
            damping: 24,
            delay: 0.2,
          }}
          className="max-w-md"
        >
          <h2 className="text-xl font-semibold text-text-primary sm:text-2xl">
            Lost in the AI generation space?
          </h2>
          <p className="mt-3 text-sm text-text-secondary">
            The page you are looking for might have been moved, deleted, or never existed in the first place.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 240,
            damping: 24,
            delay: 0.3,
          }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
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
                variant="primary"
                size="md"
                fullWidth={false}
                className="gap-2"
              >
                <LayoutDashboard size={16} />
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/">
              <Button
                variant="primary"
                size="md"
                fullWidth={false}
                className="gap-2"
              >
                <Home size={16} />
                Back to Home
              </Button>
            </Link>
          )}
        </motion.div>
      </Wrapper>
    </main>
  );
}
