const SIGIL_WIDTH = 320;
const SIGIL_HEIGHT = 240;

export function Hero({
  copy,
}: {
  copy: { kicker: string; headline: string; lede: string; email: string };
}) {
  return (
    <section className="hero" aria-labelledby="hero-title">
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
          <span>The fox is the signature.</span>
          <strong>The work is below.</strong>
        </figcaption>
      </figure>
    </section>
  );
}
