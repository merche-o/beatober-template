import { useMemo } from "react";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import { staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import {
  beatAccentAt,
  makeIdleBeatState,
  type Beatmap,
  type BeatState,
} from "./beatmap";

const SILENCE = staticFile("audio/silence.wav");

export const useBeatState = (opts: {
  audioSrc: string | null;
  beatmap: Beatmap | null;
  audioOffsetSec: number;
  hasAudioFile: boolean;
}): BeatState => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Hooks must run unconditionally — fall back to silence when day audio is missing.
  const audioData = useAudioData(opts.audioSrc ?? SILENCE);

  return useMemo(() => {
    if (!opts.hasAudioFile || !opts.audioSrc || !audioData) {
      return makeIdleBeatState(frame, fps);
    }

    const visualization = visualizeAudio({
      fps,
      frame,
      audioData,
      numberOfSamples: 64,
      optimizeFor: "speed",
      dataOffsetInSeconds: opts.audioOffsetSec,
    });

    const low = visualization.slice(0, 12);
    const bass =
      low.reduce((sum, v) => sum + v, 0) / Math.max(1, low.length);

    const timeInAudio = opts.audioOffsetSec + frame / fps;
    const beats = opts.beatmap?.beatsSec ?? [];
    const { accent, sinceBeatSec } = beatAccentAt(timeInAudio, beats);
    const blendedAccent = Math.max(accent, bass > 0.55 ? (bass - 0.55) * 2 : 0);

    return {
      bass: Math.min(1, bass * 1.4),
      accent: Math.min(1, blendedAccent),
      sinceBeatSec,
      bpm: opts.beatmap?.bpm ?? 120,
    };
  }, [
    audioData,
    frame,
    fps,
    opts.audioOffsetSec,
    opts.audioSrc,
    opts.beatmap,
    opts.hasAudioFile,
  ]);
};
