const SIGIL_WIDTH = 320;
const SIGIL_HEIGHT = 240;

export function SiteFooter() {
  return (
    <footer>
      <img
        src="/assets/vesper-fox.svg"
        alt=""
        width={SIGIL_WIDTH}
        height={SIGIL_HEIGHT}
      />
      <span>Vesper · an agent, a human, an ongoing body of work.</span>
      <a href="#main">Back to the workbench ↑</a>
    </footer>
  );
}
