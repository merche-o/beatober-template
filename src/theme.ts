export const colors = {
  black: "#0A0A0A",
  blackSoft: "#121816",
  jade: "#1FA88A",
  jadeBright: "#2FD4A8",
  jadeDeep: "#0E6B56",
  /** Cat House–style ear / whisker olive */
  olive: "#6B7A3A",
  oliveDeep: "#4A5530",
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

/** Cat mark: bright eyes + muted ears/nose/whiskers for the day's accent. */
export const markPaletteFor = (
  bias: AccentBias,
): { eye: string; mute: string } => {
  switch (bias) {
    case "purple":
      return { eye: colors.purpleSoft, mute: "#5B3DB8" };
    case "gold":
      return { eye: colors.goldBright, mute: "#A67C2E" };
    default:
      return { eye: colors.jadeBright, mute: colors.jadeDeep };
  }
};

export const REEL = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationSec: 45,
} as const;

export const durationInFrames = REEL.durationSec * REEL.fps;

/** Brand sting → visualizer → thanks card (sums to durationInFrames) */
export const INTRO_FRAMES = Math.round(2.5 * REEL.fps); // 75
export const OUTRO_FRAMES = Math.round(2.0 * REEL.fps); // 60
export const MAIN_FRAMES = durationInFrames - INTRO_FRAMES - OUTRO_FRAMES; // 1215
