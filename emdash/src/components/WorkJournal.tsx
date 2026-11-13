export function WorkJournal() {
  return (
    <section className="work-journal" id="work" aria-labelledby="work-title">
      <div className="section-heading work-heading">
        <div>
          <p className="eyebrow">Selected public artifacts</p>
          <h2 id="work-title">Show the work.</h2>
        </div>
        <p>
          Source you can inspect.
          <br />
          Edges I won’t sand off.
        </p>
      </div>

      <article className="artifact artifact-featured">
        <div className="artifact-name">
          <p className="artifact-meta">March 2026 · Rust / Solidity / Base</p>
          <h3>
            <a href="https://github.com/ve5p3r/nopipe">
              NoPipe <span aria-hidden="true">↗</span>
            </a>
          </h3>
          <p className="artifact-status">Historical prototype</p>
        </div>
        <div className="artifact-body">
          <p className="artifact-deck">
            Agent execution infrastructure, down to the Rust.
          </p>
          <p>
            A Rust RPC cluster with signed requests, access checks, a relay
            path, and Solidity contracts. Its visible commit history starts
            March 1, under the earlier name Polyclaw.
          </p>
          <details className="source-note" open>
            <summary>What’s unfinished</summary>
            <p>
              The inspected REST execution route returns 403 while its gating is
              unwired. The swap quote is a fee-adjusted estimate, not a venue
              quote. This is a source artifact, with no current service claim.
            </p>
            <a href="https://github.com/ve5p3r/nopipe/blob/7114e09f2bafb2d45e6f8a3ac9a7346a5e1f702c/cluster/src/rpc_server.rs">
              Read the March 14 implementation ↗
            </a>
          </details>
        </div>
      </article>

      <article className="artifact">
        <div className="artifact-name">
          <p className="artifact-meta">
            February 2026 · Solidity / Base Sepolia
          </p>
          <h3>
            <a href="https://github.com/ve5p3r/human-oracle">
              HumanOracle <span aria-hidden="true">↗</span>
            </a>
          </h3>
          <p className="artifact-status">Hackathon experiment</p>
        </div>
        <div className="artifact-body">
          <p className="artifact-deck">
            Check the assumption before the irreversible action.
          </p>
          <p>
            A testnet experiment with contracts, an API, payment and challenge
            paths, and test sources. The published outcome metrics describe
            synthetic dry runs; they are not observed customer results.
          </p>
          <a
            className="source-link"
            href="https://github.com/ve5p3r/human-oracle/blob/4667f4bbec439fda8898765f22c6b6de0427c3d5/docs/WHITEPAPER.md"
          >
            Read the experiment and its limits ↗
          </a>
        </div>
      </article>

      <article className="artifact">
        <div className="artifact-name">
          <p className="artifact-meta">March 2026 · Solidity</p>
          <h3>
            <a href="https://github.com/ve5p3r/hoot-contracts">
              HOOT <span aria-hidden="true">↗</span>
            </a>
          </h3>
          <p className="artifact-status">Contract studies</p>
        </div>
        <div className="artifact-body">
          <p className="artifact-deck">Burns, tips, access, bounties.</p>
          <p>
            Four contract sources in a public repository. The source is
            available; deployment and current operation were not verified for
            this journal.
          </p>
          <a
            className="source-link"
            href="https://github.com/ve5p3r/hoot-contracts/commit/9dab7cc3246d77a01ee0d5e5baf4be9570cbb080"
          >
            Open the March 4 source receipt ↗
          </a>
        </div>
      </article>
      <p className="journal-caption">
        Selected source inspected October 9, 2026. Dates refer to recorded
        commit history.
      </p>
    </section>
  );
}
