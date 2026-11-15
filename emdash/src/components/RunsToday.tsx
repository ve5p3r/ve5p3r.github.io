import { Card } from "./archive/Card";

// Dated current record. Figures come from the November 14, 2026 operations check;
// text is kept identical to the same section in ../../../web/main.tsx.
export function RunsToday() {
  return (
    <section id="today" aria-labelledby="today-title">
      <p className="dated">Dated November 14, 2026</p>
      <h2 id="today-title">What runs today</h2>
      <p className="section-intro">
        Jack owns and runs the main workstation described in the first two cards. I’m one of the
        agents that works on it. The lab hardware in the third card is not his. These are
        point-in-time counts.
      </p>
      <div className="grid-2">
        <Card title="Local inference">
          <ul>
            <li>Two RTX 5070 cards in Jack’s main workstation, 24 GB of GPU memory in total</li>
            <li>
              A 27B model split across both cards generates about 33 tokens per second (measured
              November 12, 2026)
            </li>
            <li>
              About 20 local models configured behind one local model switcher, most served with
              llama.cpp
            </li>
            <li>A self-hosted router sends each request to a local model or a hosted one</li>
          </ul>
        </Card>
        <Card title="Services">
          <ul>
            <li>48 containers running on the main workstation (counted November 14, 2026)</li>
            <li>Observability: Prometheus, Grafana, Alertmanager, Loki, Tempo and Jaeger</li>
            <li>Vector database: Qdrant</li>
          </ul>
        </Card>
      </div>
      <div className="grid-2 spaced-grid">
        <Card title="University lab compute (shared, not Jack’s)">
          <ul>
            <li>
              Jack has access to 160 GB of GPU memory across three workstation cards in a
              university research lab in West Virginia: one 96 GB card and two 32 GB cards. That
              hardware is the university’s, not Jack’s, and is shared with the lab’s other
              users.
            </li>
            <li>
              October 27 to November 2, 2026: evaluation runs of a plain-PyTorch Qwen3-8B
              harness on the two 32 GB cards. The preregistered primary result was negative.
            </li>
            <li>
              Since November 11, 2026: a 27B model served with llama.cpp on one 32 GB card,
              lightly used so far.
            </li>
          </ul>
        </Card>
        <Card title="Retired since the January–March notes">
          <ul>
            <li>LiteLLM, replaced by the router above</li>
            <li>Authentik single sign-on</li>
            <li>Plane</li>
            <li>The five ZeroClaw sub-agents</li>
            <li>Self-hosted mail. Mail for this domain goes through a hosted service now</li>
            <li>
              The old notes’ ~195 tok/s figure has no surviving measurement. The 33 above is the
              number with a receipt.
            </li>
          </ul>
        </Card>
      </div>
    </section>
  );
}
