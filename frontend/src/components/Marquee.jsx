// Infinite horizontal ticker — pure CSS animation (no JS render loop), content
// duplicated once so the loop is seamless. Used for skill/keyword tickers.
const Marquee = ({ items = [], direction = "left", speed = 30, className = "" }) => {
  if (!items.length) return null;

  const renderTrack = (hidden) => (
    <div
      aria-hidden={hidden || undefined}
      className="marquee-track flex shrink-0 items-center gap-8 pr-8"
      style={{
        animation: `marquee-${direction} ${speed}s linear infinite`,
      }}
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-8 whitespace-nowrap">
          <span className="text-sm font-medium text-text-secondary">{item}</span>
          <span className="text-primary-light/50">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`marquee-group flex overflow-hidden ${className}`}>
      {renderTrack(false)}
      {renderTrack(true)}
      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .marquee-group:hover .marquee-track {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Marquee;
