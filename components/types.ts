// Shared types for the Genolcare hero

export type PillMode = "both" | "navy" | "green" | "none";
export type CursiveFont = "Caveat" | "Dancing Script" | "Playfair Display";

export interface Tweaks {
  primary: string;
  accent: string;
  pill: PillMode;
  cursive: CursiveFont;
  ekg: boolean;
  autoRotate: boolean;
  ctaLabel: string;
}

export interface TrustCard {
  img: string;
  subtitle: string;
  title: string;
  meta: string;
}

// Host protocol messages
export type HostMessage =
  | { type: "__activate_edit_mode" }
  | { type: "__deactivate_edit_mode" };

// Expose component scope across babel <script> islands
declare global {
  interface Window {
    Carousel: React.FC<{ cards: TrustCard[]; autoRotate: boolean; accent: string }>;
    TweaksPanel: React.FC<{ tweaks: Tweaks; setTweak: <K extends keyof Tweaks>(k: K, v: Tweaks[K]) => void }>;
    Hero: React.FC;
    TWEAK_DEFAULTS: Tweaks;
  }
}

export {};
