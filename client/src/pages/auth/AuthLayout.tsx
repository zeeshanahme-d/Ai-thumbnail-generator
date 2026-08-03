import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import Logo from "../../assets/svgs/logo.svg?react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  topSlot?: ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  topSlot,
}: AuthLayoutProps) {
  return (
    <main className="relative flex min-h-dvh overflow-hidden flex-col overflow-x-hidden bg-background-surface bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-size-[48px_48px]">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-primary/12 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/12 blur-[120px] pointer-events-none z-0"></div>

      <header className="relative z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <Link to="/">
            <Logo className="h-8 w-auto" />
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm font-medium text-text-secondary transition hover:text-text-primary"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </header>

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-lg"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
        >
          <div className="rounded-2xl border border-border bg-background-card p-10 shadow-xl">
            {topSlot && <div className="mb-6">{topSlot}</div>}
            <h1 className="text-2xl font-semibold text-text-primary">{title}</h1>
            <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
