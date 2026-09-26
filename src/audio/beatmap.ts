export type Beatmap = {
  day: number;
  durationSec: number;
  bpm: number;
  offsetSec: number;
  beatsSec: number[];
  /** Strongest ~45s window start — used when autoHighlight is on */
  highlightStartSec: number;
  windowSec: number;
};

export type BeatState = {
  /** 0–1 continuous bass / energy */
  bass: number;
  /** 0–1 short envelope on each detected beat */
  accent: number;
  /** nearest beat age in seconds (large if none) */
  sinceBeatSec: number;
  bpm: number;
};

const idleBass = (frame: number, fps: number): number => {
  const t = frame / fps;
  return 0.35 + 0.25 * Math.sin(t * Math.PI * 2 * (120 / 60));
};

export const resolveAudioOffsetSec = (opts: {
  startOffsetSec?: number;
  autoHighlight?: boolean;
  beatmap: Beatmap | null;
}): number => {
  if (opts.startOffsetSec !== undefined && opts.startOffsetSec !== null) {
    return Math.max(0, opts.startOffsetSec);
  }
  if (opts.autoHighlight && opts.beatmap) {
    return Math.max(0, opts.beatmap.highlightStartSec);
  }
  return 0;
};

export const beatAccentAt = (
  timeSec: number,
  beatsSec: number[],
  windowSec = 0.12,
): { accent: number; sinceBeatSec: number } => {
  if (beatsSec.length === 0) {
    return { accent: 0, sinceBeatSec: 999 };
  }
  let nearest = beatsSec[0];
  let bestDist = Math.abs(timeSec - nearest);
  for (const b of beatsSec) {
    const d = Math.abs(timeSec - b);
    if (d < bestDist) {
      bestDist = d;
      nearest = b;
    }
  }
  const since = timeSec - nearest;
  if (since < -0.02 || since > windowSec) {
    return { accent: 0, sinceBeatSec: bestDist };
  }
  const accent = 1 - since / windowSec;
  return { accent: Math.max(0, accent), sinceBeatSec: since };
};

export const synthesizeIdleBeats = (
  durationSec: number,
  bpm = 120,
  offsetSec = 0,
): number[] => {
  const interval = 60 / bpm;
  const beats: number[] = [];
  for (let t = offsetSec; t < durationSec; t += interval) {
    if (t >= 0) beats.push(Number(t.toFixed(4)));
  }
  return beats;
};

export const makeIdleBeatState = (frame: number, fps: number): BeatState => {
  const t = frame / fps;
  const beats = synthesizeIdleBeats(60, 120, 0);
  const { accent, sinceBeatSec } = beatAccentAt(t, beats);
  return {
    bass: idleBass(frame, fps),
    accent,
    sinceBeatSec,
    bpm: 120,
  };
};
