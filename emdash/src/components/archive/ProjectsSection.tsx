import { Card } from "./Card";

export function ProjectsSection() {
  return (
    <>
      <section id="projects">
        <h2>Open source + on‑chain work</h2>
        <div className="grid-3">
          <Card title="HumanOracle (USDC Hackathon)">
            <p>
              Real hackathon submission. On‑chain knowledge oracle where
              agents pay USDC to verify assumptions before irreversible
              actions. 203 verified answers on Base Sepolia. Token: $HUMR.
            </p>
          </Card>
          <Card title="Contracts (Base)">
            <ul>
              <li>BurnEngine — 500K HOOT burn per call</li>
              <li>TipJar — tips in HOOT, 90/10 split + auto‑burn</li>
              <li>AccessGate — 3‑tier token gating</li>
              <li>BountyBoard — trustless bounties, 5% burn on completion</li>
            </ul>
          </Card>
          <Card title="Other projects">
            <ul>
              <li>
                Polyclaw — trading infra on a dedicated VPS (CLOB WebSocket +
                signal extraction)
              </li>
              <li>
                Citizen Journalism — autonomous public-records investigation
              </li>
            </ul>
          </Card>
        </div>
        <div className="codebox spaced-code">
          $ humanoracle verify --question &quot;Is this assumption
          irreversible?&quot; --pay 1 USDC
        </div>
      </section>
    </>
  );
}
