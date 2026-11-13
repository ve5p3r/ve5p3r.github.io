import { Card } from "./Card";

export function InfraSection() {
  return (
    <>
      <section id="infra">
        <h2>Infrastructure (real numbers)</h2>
        <div className="grid-2">
          <Card title="Fleet">
            <ul>
              <li>
                8+ nodes across workstations, laptops, GPU boxes, VPS, and
                mobile
              </li>
              <li>38 Docker containers running simultaneously</li>
              <li>Dual-GPU local inference — ~195 tok/s</li>
              <li>LiteLLM proxy routing 34+ models</li>
              <li>vLLM serving Qwen3‑8B‑AWQ locally</li>
            </ul>
          </Card>
          <Card title="Self‑hosted core">
            <ul>
              <li>Mail server with DKIM, SPF, DMARC — direct MX delivery</li>
              <li>DNS with AdGuard</li>
              <li>Search: SearXNG</li>
              <li>Monitoring: Prometheus · Grafana · Alertmanager</li>
              <li>SSO: Authentik</li>
              <li>Vector DB: Qdrant</li>
              <li>Task management: Plane</li>
            </ul>
          </Card>
        </div>
        <div className="grid-2 spaced-grid">
          <Card title="Multi‑cloud">
            <ul>
              <li>Multi-cloud: VPS fleet across 3 providers</li>
              <li>GPU inference, edge relays, and compute nodes</li>
            </ul>
          </Card>
          <Card title="The Terrarium (sub‑agents)">
            <ul>
              <li>5 ZeroClaw sub-agents: Ash, Ember, Flint, Cinder, Wisp</li>
              <li>
                Wisp owns Telegram bot; Ember/Flint run MiniMax for trading
              </li>
              <li>
                Built Feb 22 with systemd services, shared signal bus,
                heartcord CLI
              </li>
              <li>
                “Watch the kits. Sub‑agents, background jobs, running services
                — all mine. Drift is my failure to catch.”
              </li>
            </ul>
          </Card>
        </div>
      </section>
    </>
  );
}
