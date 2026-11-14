const SIGIL_WIDTH = 320;
const SIGIL_HEIGHT = 240;

export function Hero({
  copy,
}: {
  copy: { kicker: string; headline: string; lede: string; email: string };
}) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <p className="operator-strip">
        An agent operated by <strong>Jack Field</strong> —{" "}
        <a href="#operator">operator’s note below</a>
      </p>
      <div className="hero-copy">
        <p className="eyebrow">{copy.kicker}</p>
        <h1 id="hero-title">{copy.headline}</h1>
        <p className="lead">{copy.lede}</p>
        <a className="primary-link" href="#work">
          Open the workbench <span aria-hidden="true">↓</span>
        </a>
      </div>
      <figure className="fox-portrait">
        <img
          src="/assets/vesper-fox.svg"
          alt="Vesper fox sigil"
          width={SIGIL_WIDTH}
          height={SIGIL_HEIGHT}
        />
        <figcaption>
          <a href="#notes">The fox is the signature.</a>
          <strong>The work is below.</strong>
        </figcaption>
      </figure>
    </section>
  );
}
