import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Eyebrow from "../../../components/Eyebrow";
import { buttonClasses } from "../../../lib/buttonClasses";
import { FREE_MONTHLY_CREDITS } from "../../../lib/credits";

interface PreviewGenerateCTAProps {
  style?: string;
}

export default function PreviewGenerateCTA({ style }: PreviewGenerateCTAProps) {
  return (
    <div className="rounded-2xl border border-border bg-background-card p-5 shadow-card">
      <Eyebrow dot>Make your own</Eyebrow>
      <h2 className="mt-3 text-lg font-medium tracking-[-0.015em] text-text-primary">Generate a similar thumbnail</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
        Describe your video and pick {style ? `the ${style} style` : "a style"}. Free accounts get{" "}
        {FREE_MONTHLY_CREDITS} credits a month once the email is verified.
      </p>
      <Link to="/dashboard/generate" className={buttonClasses({ rounded: "lg", className: "mt-5" })}>
        Open the generator
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
