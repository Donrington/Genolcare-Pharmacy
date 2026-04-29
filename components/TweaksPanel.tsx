// @ts-nocheck
const { useEffect: useEffectTP, useState: useStateTP } = React;

type PillMode = "both" | "navy" | "green" | "none";
type CursiveFont = "Caveat" | "Dancing Script" | "Playfair Display";

interface Tweaks {
  primary: string;
  accent: string;
  pill: PillMode;
  cursive: CursiveFont;
  ekg: boolean;
  autoRotate: boolean;
  ctaLabel: string;
}

interface TweaksPanelProps {
  tweaks: Tweaks;
  setTweak: <K extends keyof Tweaks>(k: K, v: Tweaks[K]) => void;
}

const Row: React.FC<{ label: string; value?: string; children: React.ReactNode; inline?: boolean }> = ({
  label,
  value,
  children,
  inline,
}) => (
  <div className={inline ? "flex justify-between items-center mb-3 last:mb-0" : "mb-3 last:mb-0"}>
    <div className={["flex justify-between items-center text-[11px] uppercase tracking-[0.08em] text-white/55 font-semibold", inline ? "m-0" : "mb-1.5"].join(" ")}>
      <span>{label}</span>
      {value && <span className="text-[var(--accent)] font-mono normal-case tracking-normal">{value}</span>}
    </div>
    {children}
  </div>
);

const Seg = <T extends string>({
  options,
  value,
  onChange,
}: {
  options: { v: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) => (
  <div className="flex bg-white/[0.04] border border-white/10 rounded-lg p-0.5 gap-0.5">
    {options.map((o) => (
      <button
        key={o.v}
        onClick={() => onChange(o.v)}
        className={[
          "flex-1 px-2 py-1.5 rounded-md text-[11px] font-semibold transition",
          value === o.v ? "text-[#0a1632]" : "text-white/60 hover:text-white",
        ].join(" ")}
        style={value === o.v ? { background: "var(--accent)" } : undefined}
      >
        {o.label}
      </button>
    ))}
  </div>
);

const Toggle: React.FC<{ on: boolean; onChange: (v: boolean) => void; label: string }> = ({ on, onChange, label }) => (
  <button
    aria-label={label}
    onClick={() => onChange(!on)}
    className="w-[38px] h-[22px] rounded-full relative transition-colors p-0 border-0 cursor-pointer"
    style={{ background: on ? "var(--accent)" : "rgba(255,255,255,0.1)" }}
  >
    <span
      className="absolute top-0.5 left-0.5 w-[18px] h-[18px] rounded-full bg-white transition-transform"
      style={{ transform: on ? "translateX(16px)" : "translateX(0)" }}
    />
  </button>
);

const TweaksPanel: React.FC<TweaksPanelProps> = ({ tweaks, setTweak }) => {
  const [open, setOpen] = useStateTP(false);

  useEffectTP(() => {
    const onMsg = (e: MessageEvent) => {
      const m = (e.data ?? {}) as { type?: string };
      if (m.type === "__activate_edit_mode") setOpen(true);
      if (m.type === "__deactivate_edit_mode") setOpen(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  if (!open) return null;

  return (
    <aside
      className="fixed right-5 bottom-5 z-50 w-[300px] rounded-2xl p-3.5 text-white text-[13px] shadow-[0_24px_60px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-xl"
      style={{ background: "rgba(8,16,38,0.92)" }}
      aria-label="Tweaks"
    >
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10">
        <h5 className="m-0 text-[13px] font-bold tracking-wide">Tweaks</h5>
        <button
          aria-label="Close"
          onClick={() => {
            setOpen(false);
            window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
          }}
          className="w-6 h-6 rounded-md grid place-items-center text-white/60 hover:text-white hover:bg-white/10"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <Row label="Primary" value={tweaks.primary}>
        <input
          type="color"
          value={tweaks.primary}
          onChange={(e) => setTweak("primary", e.target.value)}
          className="w-8 h-8 rounded-lg border border-white/10 bg-transparent p-0.5 cursor-pointer"
        />
      </Row>

      <Row label="Accent" value={tweaks.accent}>
        <input
          type="color"
          value={tweaks.accent}
          onChange={(e) => setTweak("accent", e.target.value)}
          className="w-8 h-8 rounded-lg border border-white/10 bg-transparent p-0.5 cursor-pointer"
        />
      </Row>

      <Row label="Headline pill style">
        <Seg
          value={tweaks.pill}
          onChange={(v) => setTweak("pill", v)}
          options={[
            { v: "both", label: "Both" },
            { v: "navy", label: "Navy" },
            { v: "green", label: "Green" },
            { v: "none", label: "None" },
          ]}
        />
      </Row>

      <Row label="Cursive font">
        <Seg
          value={tweaks.cursive}
          onChange={(v) => setTweak("cursive", v)}
          options={[
            { v: "Caveat", label: "Caveat" },
            { v: "Dancing Script", label: "Dancing" },
            { v: "Playfair Display", label: "Playfair" },
          ]}
        />
      </Row>

      <Row label="EKG line" inline>
        <Toggle on={tweaks.ekg} onChange={(v) => setTweak("ekg", v)} label="Toggle EKG" />
      </Row>

      <Row label="Auto-rotate carousel" inline>
        <Toggle on={tweaks.autoRotate} onChange={(v) => setTweak("autoRotate", v)} label="Toggle auto" />
      </Row>

      <Row label="CTA label">
        <input
          type="text"
          value={tweaks.ctaLabel}
          onChange={(e) => setTweak("ctaLabel", e.target.value)}
          className="w-full bg-white/[0.04] border border-white/10 text-white px-2.5 py-2 rounded-lg text-[12px] focus:outline-none focus:border-[var(--accent)]"
        />
      </Row>
    </aside>
  );
};

window.TweaksPanel = TweaksPanel;
