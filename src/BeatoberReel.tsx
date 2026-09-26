import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  staticFile,
  useVideoConfig,
} from "remotion";
import type { BeatoberProps } from "./schema";
import { getDay, padDay } from "./data/prompts";
import { ProceduralScene } from "./scenes/ProceduralScene";
import { DayTitle } from "./components/DayTitle";
import { useBeatState } from "./audio/useBeatState";
import {
  resolveAudioOffsetSec,
  type Beatmap,
} from "./audio/beatmap";
import { colors } from "./theme";

const loadBeatmap = async (path: string): Promise<Beatmap | null> => {
  try {
    const res = await fetch(staticFile(path));
    if (!res.ok) return null;
    return (await res.json()) as Beatmap;
  } catch {
    return null;
  }
};

const probeAudio = async (path: string): Promise<boolean> => {
  try {
    const res = await fetch(staticFile(path));
    return res.ok;
  } catch {
    return false;
  }
};

export const BeatoberReel: React.FC<BeatoberProps> = ({
  day,
  audioFile,
  beatmapFile,
  startOffsetSec,
  autoHighlight = false,
  renderer = "auto",
}) => {
  const entry = getDay(day);
  const { fps } = useVideoConfig();
  const audioPath = audioFile ?? `audio/day-${padDay(day)}.mp3`;
  const beatmapPath = beatmapFile ?? `beatmaps/day-${padDay(day)}.json`;

  const [handle] = useState(() =>
    delayRender(`Load assets for day ${day}`),
  );
  const [beatmap, setBeatmap] = useState<Beatmap | null>(null);
  const [hasAudio, setHasAudio] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [bm, audioOk] = await Promise.all([
        loadBeatmap(beatmapPath),
        probeAudio(audioPath),
      ]);
      if (cancelled) return;
      setBeatmap(bm);
      setHasAudio(audioOk);
      setReady(true);
      continueRender(handle);
    })();
    return () => {
      cancelled = true;
    };
  }, [audioPath, beatmapPath, handle]);

  const audioOffsetSec = resolveAudioOffsetSec({
    startOffsetSec,
    autoHighlight,
    beatmap,
  });

  const audioSrc = hasAudio ? staticFile(audioPath) : null;
  const beat = useBeatState({
    audioSrc,
    beatmap,
    audioOffsetSec,
    hasAudioFile: hasAudio,
  });

  if (!ready) {
    return <AbsoluteFill style={{ backgroundColor: colors.black }} />;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: colors.black }}>
      <ProceduralScene
        day={day}
        art={entry.artDirection}
        beat={beat}
        renderer={renderer}
      />
      <DayTitle
        day={day}
        prompt={entry.prompt}
        accentBias={entry.artDirection.accentBias}
        beat={beat}
      />
      {hasAudio && audioSrc ? (
        <Audio
          src={audioSrc}
          startFrom={Math.round(audioOffsetSec * fps)}
        />
      ) : null}
    </AbsoluteFill>
  );
};
