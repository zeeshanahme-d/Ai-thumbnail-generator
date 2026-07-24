import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import Wrapper from "./Wrapper";
import { footerData } from "../data/footer";
import Logo from "../assets/svgs/logo.svg?react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background-surface">
      <Wrapper className="py-16">
        <motion.div
          className="grid grid-cols-2 gap-10 md:grid-cols-6"
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
        >
          <div className="col-span-2">
            <Link to="/">
              <Logo className="h-7 w-auto" />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-text-muted">
              AI-powered thumbnail generation for creators who want to stand
              out. Beautiful. Fast. Effortless.
            </p>
          </div>

          {footerData.map((column) => (
            <div key={column.title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                {column.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-text-secondary transition hover:text-primary"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      </Wrapper>

      <div className="border-t border-border">
        <Wrapper className="flex flex-col items-center justify-between gap-2 py-6 text-sm text-text-muted sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Thumblify. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            Made with <Heart size={14} className="fill-primary text-primary" />{" "}
            for creators worldwide
          </p>
        </Wrapper>
      </div>
    </footer>
  );
}
