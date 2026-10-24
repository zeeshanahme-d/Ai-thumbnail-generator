import Wrapper from "../components/Wrapper";
import SectionTitle from "../components/SectionTitle";
import ProcessStory from "./components/process/ProcessStory";
import ProcessSteps from "./components/process/ProcessSteps";
import { RICH_MOTION_QUERY, useMediaQuery } from "../lib/useMediaQuery";

// How it works: a scroll-scrubbed walkthrough on wide screens with motion allowed, four stacked steps everywhere else.
export default function ProcessSection() {
  const richMotion = useMediaQuery(RICH_MOTION_QUERY);

  return (
    <section className="py-(--section-y)">
      <Wrapper>
        <SectionTitle
          align="split"
          text1="How it works"
          text2={["From one sentence", "to the home feed."]}
          text3="Describe the video, pick the platform, generate, and for YouTube see the thumbnail next to other videos before you post."
        />
      </Wrapper>

      {richMotion ? <ProcessStory /> : <ProcessSteps />}
    </section>
  );
}
