import type { ComponentType } from "react";
import Wrapper from "../components/Wrapper";
import SectionTitle from "../components/SectionTitle";
import CapabilityTile from "./components/capabilities/CapabilityTile";
import FormatDemo from "./components/capabilities/FormatDemo";
import StyleDemo from "./components/capabilities/StyleDemo";
import ColorSchemeDemo from "./components/capabilities/ColorSchemeDemo";
import ImproveDemo from "./components/capabilities/ImproveDemo";
import ReferenceDemo from "./components/capabilities/ReferenceDemo";
import CategoryDemo from "./components/capabilities/CategoryDemo";
import { capabilities } from "../data/capabilities";
import type { CapabilityDemoProps, CapabilityId } from "../types";

const DEMOS: Record<CapabilityId, ComponentType<CapabilityDemoProps>> = {
  format: FormatDemo,
  style: StyleDemo,
  "color-scheme": ColorSchemeDemo,
  improve: ImproveDemo,
  reference: ReferenceDemo,
  category: CategoryDemo,
};

// Bento on a 12-column grid: platform runs down the left two rows, style and color stack beside it,
// improve and reference share the next row the other way round, and category closes it full width.
const LAYOUT: Record<CapabilityId, string> = {
  format: "md:col-span-2 lg:col-span-7 lg:row-span-2",
  style: "lg:col-span-5",
  "color-scheme": "lg:col-span-5",
  improve: "lg:col-span-5",
  reference: "lg:col-span-7",
  category: "md:col-span-2 lg:col-span-12",
};

export default function CapabilitiesSection() {
  return (
    <section className="py-(--section-y)">
      <Wrapper>
        <SectionTitle
          align="split"
          text1="The controls"
          text2={["Direct the thumbnail,", "not the software."]}
          text3="Six controls, each shown here the way it works in the generator. Set them, describe the video, and the thumbnail follows."
        />

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-12 lg:gap-5">
          {capabilities.map((capability, index) => (
            <CapabilityTile
              key={capability.id}
              capability={capability}
              demo={DEMOS[capability.id]}
              index={index}
              className={LAYOUT[capability.id]}
            />
          ))}
        </div>
      </Wrapper>
    </section>
  );
}
