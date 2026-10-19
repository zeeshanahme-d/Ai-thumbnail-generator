import Wrapper from "./Wrapper";
import SectionTitle from "./SectionTitle";
import type { PageHeaderProps } from "../types";

// The top of a public page: label, heading and intro over the fading grid, as on the homepage hero.
export default function PageHeader({ eyebrow, title, description, children, animate = false }: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden">
      <div aria-hidden="true" className="backdrop-grid pointer-events-none absolute inset-x-0 top-0 h-128" />
      <div aria-hidden="true" className="backdrop-grain pointer-events-none absolute inset-0" />

      <Wrapper className="relative pb-12 pt-12 sm:pt-16 lg:pb-16 lg:pt-20">
        <SectionTitle as="h1" align="split" animate={animate} text1={eyebrow} text2={title} text3={description}>
          {children}
        </SectionTitle>
      </Wrapper>
    </header>
  );
}
