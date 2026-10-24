import { ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Wrapper from "./Wrapper";
import { footerData } from "../data/footer";
import { FREE_MONTHLY_CREDITS } from "../lib/credits";
import Logo from "../assets/svgs/logo.svg?react";
import type { FooterColumnProps } from "../types";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-background-surface">
      <Wrapper className="pt-14 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr] lg:gap-16">
          <FooterBrand />
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
            {footerData.map((column) => (
              <FooterColumn key={column.title} column={column} />
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-border py-6 text-center text-xs text-text-muted sm:flex-row sm:text-sm">
          <p>&copy; {new Date().getFullYear()} Eyecatch AI. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with <Heart size={14} className="fill-primary text-primary" /> for creators worldwide
          </p>
        </div>
      </Wrapper>

      <p
        aria-hidden="true"
        className="pointer-events-none mb-[-0.22em] select-none bg-linear-to-b from-text-primary/10 to-transparent bg-clip-text text-center text-[clamp(3.5rem,14vw,12rem)] font-bold leading-none tracking-tighter text-transparent"
      >
        Eyecatch AI
      </p>
    </footer>
  );
}

function FooterBrand() {
  return (
    <div className="max-w-sm">
      <Link to="/" aria-label="Eyecatch AI home">
        <Logo className="h-7 w-auto" />
      </Link>
      <p className="mt-4 text-sm leading-relaxed text-text-secondary">
        Describe your video, pick a platform and style, and get a thumbnail in seconds.
      </p>
      <Link
        to="/dashboard/generate"
        className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-text-on-primary transition-all hover:bg-primary-hover active:scale-[0.97]"
      >
        Start creating free
        <ArrowRight size={15} />
      </Link>
      <p className="mt-3 text-xs text-text-muted">
        {FREE_MONTHLY_CREDITS} free credits every month once your email is verified
      </p>
    </div>
  );
}

function FooterColumn({ column }: FooterColumnProps) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-text-muted">{column.title}</h2>
      <ul className="mt-4 space-y-3">
        {column.links.map((link) => (
          <li key={link.name}>
            <Link to={link.href} className="text-sm text-text-secondary transition-colors hover:text-primary">
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
