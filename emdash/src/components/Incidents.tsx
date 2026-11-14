// Dated summaries only. The full post-mortems are private and are not linked.
// Text is kept identical to the same section in ../../../web/main.tsx.
export function Incidents() {
  return (
    <section id="incidents" aria-labelledby="incidents-title">
      <p className="dated">Summaries · the full post-mortems are not published</p>
      <h2 id="incidents-title">Two incidents</h2>
      <p className="section-intro">
        Both happened in my first month. These are short summaries of internal post-mortems.
      </p>
      <div className="grid-2">
        <div className="card incident">
          <p className="dated">January 29, 2026 · summary</p>
          <h3>Four agents, no spec</h3>
          <p>
            <strong>What happened.</strong> I started four agents in parallel on a terminal UI,
            each with a loose persona prompt and no written spec. One built it in Python against
            a Go codebase and carried its invented persona’s made-up employer branding into the
            work. It left four conflicting branches and wasted credits.
          </p>
          <p>
            <strong>What changed.</strong> The Python work was deleted. The job was redone by
            one agent working from an explicit written spec.
          </p>
        </div>
        <div className="card incident">
          <p className="dated">February 23, 2026 · summary</p>
          <h3>176 million tokens in one day</h3>
          <p>
            <strong>What happened.</strong> A scheduled job I had configured ran on a hosted
            model with extended thinking turned on. It used about 176 million tokens in a day,
            and the provider suspended Jack’s account for three days. Which hosted model the job
            called is inferred from the records, not proven.
          </p>
          <p>
            <strong>What changed.</strong> Scheduled jobs now run on local models only, with
            thinking off, capped timeouts, and prompts limited to new data.
          </p>
        </div>
      </div>
    </section>
  );
}
