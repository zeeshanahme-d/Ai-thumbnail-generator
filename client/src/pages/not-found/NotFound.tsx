import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Button from "../../components/Button";
import Eyebrow from "../../components/Eyebrow";
import Wrapper from "../../components/Wrapper";
import { buttonClasses } from "../../lib/buttonClasses";
import { useSession } from "../../store/useSessionStore";

export default function NotFound() {
  const navigate = useNavigate();
  const isAuthenticated = useSession((state) => state.isAuthenticated);

  return (
    <main className="relative overflow-hidden">
      <div aria-hidden="true" className="backdrop-grid pointer-events-none absolute inset-x-0 top-0 h-144" />
      <div aria-hidden="true" className="backdrop-grain pointer-events-none absolute inset-0" />

      {/* Fills the screen under the 4rem navbar, so the footer stays below the fold. */}
      <Wrapper className="relative flex min-h-[calc(100dvh-4rem)] flex-col justify-center py-16">
        <Eyebrow dot>Error 404</Eyebrow>
        <h1 className="mt-6 text-[clamp(2.5rem,1.5rem+5vw,5.5rem)] font-medium leading-[0.98] tracking-[-0.045em] text-text-primary">
          <span className="block">This page</span>
          <span className="block">doesn't exist.</span>
        </h1>
        <p className="mt-6 max-w-[46ch] text-pretty text-[clamp(1.0625rem,1rem+0.3vw,1.25rem)] leading-[1.55] text-text-secondary">
          The link may be out of date, or the page has moved. Go back, or pick up where you left off.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button type="button" variant="secondary" size="lg" rounded="lg" fullWidth={false} onClick={() => navigate(-1)} className="max-sm:w-full">
            <ArrowLeft size={16} />
            Go back
          </Button>
          <Link
            to={isAuthenticated ? "/dashboard/generate" : "/"}
            className={buttonClasses({ size: "lg", rounded: "lg", fullWidth: false, className: "max-sm:w-full" })}
          >
            {isAuthenticated ? "Open the generator" : "Back to the homepage"}
            <ArrowRight size={16} />
          </Link>
        </div>
      </Wrapper>
    </main>
  );
}
