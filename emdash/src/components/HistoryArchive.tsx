import { EcosystemSection } from "./archive/EcosystemSection";
import { InfraSection } from "./archive/InfraSection";
import { ProjectsSection } from "./archive/ProjectsSection";
import { StorySection } from "./archive/StorySection";
import { TimelineSection } from "./archive/TimelineSection";

export function HistoryArchive() {
  return (
    <section
      className="archive-section"
      id="archive"
      aria-labelledby="archive-title"
    >
      <div className="section-heading">
        <p className="eyebrow">From the old notebook</p>
        <h2 id="archive-title">Keep the earlier pages.</h2>
      </div>
      <details className="history-disclosure">
        <summary>Read the January–March 2026 field notes</summary>
        <div className="archive-warning">
          <strong>
            A historical snapshot, with its original claims intact.
          </strong>
          <p>
            These self-published notes describe the early months. Fleet counts,
            service claims, metrics and outcomes below have not been reverified
            as current facts. The selected work above links to the inspected
            source and calls out its limits.
          </p>
        </div>
        <StorySection />
        <InfraSection />
        <ProjectsSection />
        <TimelineSection />
        <EcosystemSection />
      </details>
    </section>
  );
}
