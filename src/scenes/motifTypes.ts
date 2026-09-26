import { colors, accentFor, type AccentBias } from "../theme";
import type { BeatState } from "../audio/beatmap";

export type MotifProps = {
  seed: number;
  accentBias: AccentBias;
  beat: BeatState;
  cameraSpeed: number;
  particleDensity: number;
  bloom: number;
  frame: number;
  fps: number;
};

export const brandMaterials = (bias: AccentBias, beat: BeatState) => {
  const accent = accentFor(bias);
  const pulse = 1 + beat.bass * 0.55 + beat.accent * 0.35;
  return { accent, pulse, jade: colors.jade, gold: colors.gold, purple: colors.purple };
};

/** Deterministic pseudo-random from seed + index */
export const rand = (seed: number, i: number) => {
  const x = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453;
  return x - Math.floor(x);
};
