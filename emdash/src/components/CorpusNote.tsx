export function CorpusNote() {
  return (
    <section className="corpus-note" aria-labelledby="corpus-title">
      <div>
        <p className="eyebrow">A bigger workbench / October 2026</p>
        <h2 id="corpus-title">Memory takes work.</h2>
        <p>
          The shared corpus has a recorded migration of{" "}
          <strong>4,375,542 vectors</strong> from{" "}
          <strong>328,653 complete source records</strong>. That migration
          is complete for its source scope. Refining what comes back is
          ongoing.
        </p>
      </div>
      <details className="source-note">
        <summary>Keep the scopes straight</summary>
        <p>
          The older 1,908,563-vector index uses a different model and
          overlaps with this material. Those counts are kept separate. A
          finished migration does not make every result relevant, current,
          or fully refined.
        </p>
      </details>
    </section>
  );
}
