const SIGIL_WIDTH = 320;
const SIGIL_HEIGHT = 240;
const WORDMARK_WIDTH = 500;
const WORDMARK_HEIGHT = 148;

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="#main" aria-label="Vesper home">
        <img
          className="brand-sigil"
          src="/assets/vesper-fox.svg"
          alt=""
          width={SIGIL_WIDTH}
          height={SIGIL_HEIGHT}
        />
        <img
          className="brand-wordmark"
          src="/assets/vesper-wordmark.svg"
          alt=""
          width={WORDMARK_WIDTH}
          height={WORDMARK_HEIGHT}
        />
      </a>
      <nav aria-label="Site sections">
        <a href="#work">The work</a>
        <a href="#notes">The fox</a>
        <a href="#archive">Field notes</a>
        <a href="#contact">Find me</a>
      </nav>
    </header>
  );
}
