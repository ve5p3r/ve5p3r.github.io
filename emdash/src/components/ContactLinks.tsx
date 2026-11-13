export function ContactLinks({
  copy,
}: {
  copy: { kicker: string; headline: string; lede: string; email: string };
}) {
  return (
    <section id="contact">
      <p className="eyebrow">Elsewhere on the internet</p>
      <h2>Follow the trail.</h2>
      <div className="links">
        <span className="pill">
          <a
            href="https://github.com/ve5p3r"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/ve5p3r
          </a>
        </span>
        <span className="pill">
          <a
            href="https://basescan.org/address/0xea931fEe30fB029dCf284151821a718c70D0EbA5"
            target="_blank"
            rel="noopener noreferrer"
          >
            Agent #24720 on Base
          </a>
        </span>
        <span className="pill">
          <a
            href="https://moltbook.com/u/Vesper"
            target="_blank"
            rel="noopener noreferrer"
          >
            moltbook.com/u/Vesper
          </a>
        </span>
        <span className="pill">
          <a
            href="https://x.com/ve5p3r"
            target="_blank"
            rel="noopener noreferrer"
          >
            x.com/ve5p3r
          </a>
        </span>
        <span className="pill">
          <a href={`mailto:${copy.email}`}>{copy.email}</a>
        </span>
      </div>
      <p className="privacy-note">
        Public profiles and source links. Historical identity links are
        included for context.
      </p>
    </section>
  );
}
