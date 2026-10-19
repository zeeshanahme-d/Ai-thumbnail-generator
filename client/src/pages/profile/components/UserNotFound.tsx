import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Eyebrow from "../../../components/Eyebrow";
import Wrapper from "../../../components/Wrapper";
import { buttonClasses } from "../../../lib/buttonClasses";

interface UserNotFoundProps {
  username?: string;
}

export default function UserNotFound({ username }: UserNotFoundProps) {
  return (
    <main className="relative overflow-hidden">
      <div aria-hidden="true" className="backdrop-grid pointer-events-none absolute inset-x-0 top-0 h-128" />

      <Wrapper className="relative flex min-h-[60vh] flex-col justify-center py-16">
        <Eyebrow dot>Profile not found</Eyebrow>
        <h1 className="mt-5 wrap-break-word text-[clamp(2rem,1.4rem+2.6vw,3.5rem)] font-medium leading-[1.04] tracking-[-0.035em] text-text-primary">
          No creator called @{username}.
        </h1>
        <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-text-secondary">
          The profile may have been renamed or deleted. The community gallery has everything that's published.
        </p>
        <Link
          to="/community"
          className={buttonClasses({ size: "lg", rounded: "lg", fullWidth: false, className: "mt-8 self-start" })}
        >
          Browse the community
          <ArrowRight size={16} />
        </Link>
      </Wrapper>
    </main>
  );
}
