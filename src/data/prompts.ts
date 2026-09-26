import type { AccentBias } from "../theme";

export type MotifId =
  | "neonCorridor"
  | "weatherField"
  | "orbHorizon"
  | "clubLattice"
  | "voidRings"
  | "tunnelRibbon";

export type ArtDirection = {
  motif: MotifId;
  accentBias: AccentBias;
  cameraSpeed: number;
  particleDensity: number;
  bloom: number;
};

export type BeatoberDay = {
  day: number;
  prompt: string;
  artDirection: ArtDirection;
};

const motifFromPrompt = (prompt: string): MotifId => {
  const p = prompt.toLowerCase();
  if (
    /rain|storm|snow|heatwave|power outage/.test(p)
  ) {
    return "weatherField";
  }
  if (
    /sunrise|first light|golden hour|sunday morning|slow morning|daydream/.test(
      p,
    )
  ) {
    return "orbHorizon";
  }
  if (
    /party|dance|rooftop|after hours|midnight|3am|house party|last dance/.test(
      p,
    )
  ) {
    return "clubLattice";
  }
  if (
    /empty|waiting|missed|déjà|deja|closing|wrong turn/.test(p)
  ) {
    return "voidRings";
  }
  if (
    /train|road|checkout|drive|open road|the end|red eye|long walk/.test(p)
  ) {
    return "tunnelRibbon";
  }
  return "neonCorridor";
};

const biasFromDay = (day: number): AccentBias => {
  const cycle = day % 3;
  if (cycle === 1) return "jade";
  if (cycle === 2) return "purple";
  return "gold";
};

const artFor = (day: number, prompt: string): ArtDirection => {
  const motif = motifFromPrompt(prompt);
  const accentBias = biasFromDay(day);
  const cameraSpeed = 0.55 + (day % 5) * 0.08;
  const particleDensity = 0.45 + (day % 7) * 0.07;
  const bloom = 0.35 + (day % 4) * 0.1;
  return { motif, accentBias, cameraSpeed, particleDensity, bloom };
};

const PROMPT_NAMES = [
  "Night Drive",
  "Last Train",
  "Empty Streets",
  "Sunrise",
  "After Hours",
  "Rainy Day",
  "First Light",
  "Late Checkout",
  "Long Walk Home",
  "Wrong Turn",
  "Rooftop",
  "Power Outage",
  "Sunday Morning",
  "Waiting Room",
  "Golden Hour",
  "Midnight Snack",
  "Heatwave",
  "Snow Day",
  "Closing Time",
  "Open Road",
  "City Lights",
  "Daydream",
  "Storm Coming",
  "Missed Call",
  "Red Eye",
  "Slow Morning",
  "House Party",
  "Last Dance",
  "3AM",
  "Déjà Vu",
  "The End",
] as const;

export const BEATOBER_DAYS: BeatoberDay[] = PROMPT_NAMES.map((prompt, i) => {
  const day = i + 1;
  return {
    day,
    prompt,
    artDirection: artFor(day, prompt),
  };
});

export const getDay = (day: number): BeatoberDay => {
  const entry = BEATOBER_DAYS.find((d) => d.day === day);
  if (!entry) {
    throw new Error(`Invalid Beatober day: ${day}. Expected 1–31.`);
  }
  return entry;
};

export const padDay = (day: number): string =>
  String(day).padStart(2, "0");
