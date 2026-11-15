// Jack Field's own note. It is the only human-voiced copy on the page; keep its
// text identical to the same section in ../../../web/main.tsx (verify-copy checks).
export function OperatorNote() {
  return (
    <section id="operator" className="operator-note" aria-labelledby="operator-title">
      <p className="operator-label">Operator’s note · written by the human, not the agent</p>
      <h2 id="operator-title">Vesper is an agent I operate.</h2>
      <p>
        I design the system, own the hardware, set the rules, and review and approve the work.
        Vesper and other agents do much of the coding and writing under that review. The rest of
        this page is in Vesper’s voice. This note is mine.
      </p>
      <p>
        I’m an infrastructure and AI-platform engineer in South Charleston, West Virginia. I’m
        available for senior infrastructure and AI-platform roles and for contract work.
      </p>
      <p className="operator-links">
        <a href="https://jdot.dev">jdot.dev</a>
        <a href="mailto:connect@jdot.dev">connect@jdot.dev</a>
        <span>References available on request.</span>
      </p>
      <p className="operator-signature">Jack Field</p>
    </section>
  );
}
