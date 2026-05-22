import { ELITLOPPET_DATE_LABEL, ELITLOPPET_HORSES } from "../../data/elitloppetOdds";

const COUNTRY_FLAG: Record<string, string> = {
  SE: "🇸🇪",
  FR: "🇫🇷",
  IT: "🇮🇹",
  NO: "🇳🇴",
  NL: "🇳🇱",
  FI: "🇫🇮",
};

function TrendIcon({ trend }: { trend?: "up" | "down" | "flat" }) {
  if (trend === "up") return <span className="text-[#22c55e] text-xs font-black">▲</span>;
  if (trend === "down") return <span className="text-[#ef4444] text-xs font-black">▼</span>;
  return null;
}

function TickerItem({
  number,
  name,
  odds,
  country,
  trend,
}: (typeof ELITLOPPET_HORSES)[0]) {
  return (
    <span className="inline-flex items-center gap-2 px-5 shrink-0">
      <span className="elit-badge w-7 h-7 text-xs">{number}</span>
      <span className="text-base" aria-hidden>
        {COUNTRY_FLAG[country] ?? "🏇"}
      </span>
      <span
        className="text-bulky text-ink text-sm uppercase tracking-wide whitespace-nowrap"
      >
        {name}
      </span>
      <span className="text-bulky text-elit-pink text-lg tabular-nums whitespace-nowrap">
        {odds.toFixed(2)}
      </span>
      <TrendIcon trend={trend} />
      <span className="text-elit-pink/40 text-lg select-none" aria-hidden>
        •
      </span>
    </span>
  );
}

export function OddsTicker() {
  const track = [...ELITLOPPET_HORSES, ...ELITLOPPET_HORSES];

  return (
    <div className="ticker-bar relative flex items-center gap-3 overflow-hidden py-2.5 pl-4 pr-4 bg-white border-b-2 border-elit-pink/20">
      <span className="live-pill shrink-0 z-10">LIVE</span>
      <span
        className="hidden sm:inline text-[10px] font-black uppercase tracking-widest text-ink shrink-0 z-10 bg-white pr-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {ELITLOPPET_DATE_LABEL}
      </span>

      <div className="odds-ticker-viewport flex-1 min-w-0 overflow-hidden">
        <div className="odds-ticker-track flex w-max items-center">
          {track.map((horse, i) => (
            <TickerItem key={`${horse.name}-${i}`} {...horse} />
          ))}
        </div>
      </div>

      <span
        className="hidden md:inline text-[10px] font-bold text-elit-pink/70 uppercase tracking-wider shrink-0 z-10 bg-white pl-2"
      >
        Vinnarodds
      </span>
    </div>
  );
}
