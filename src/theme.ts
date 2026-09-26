export const colors = {
  black: "#0A0A0A",
  blackSoft: "#121816",
  jade: "#1FA88A",
  jadeBright: "#2FD4A8",
  jadeDeep: "#0E6B56",
  purple: "#7B4DFF",
  purpleSoft: "#A78BFF",
  gold: "#D4A84B",
  goldBright: "#F0C96A",
  cream: "#E8F2ED",
} as const;

export type AccentBias = "jade" | "purple" | "gold";

export const accentFor = (bias: AccentBias): string => {
  switch (bias) {
    case "purple":
      return colors.purple;
    case "gold":
      return colors.gold;
    default:
      return colors.jadeBright;
  }
};

export const REEL = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationSec: 45,
} as const;

export const durationInFrames = REEL.durationSec * REEL.fps;
