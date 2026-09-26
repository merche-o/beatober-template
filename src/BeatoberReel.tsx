import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  Series,
  staticFile,
  useVideoConfig,
} from "remotion";
import type { BeatoberProps } from "./schema";
import { getDay, padDay } from "./data/prompts";
import { ProceduralScene } from "./scenes/ProceduralScene";
import { DayTitle } from "./components/DayTitle";
import { IntroCard } from "./components/IntroCard";
import { OutroCard } from "./components/OutroCard";
import { useBeatState } from "./audio/useBeatState";
import {
  resolveAudioOffsetSec,
  type Beatmap,
} from "./audio/beatmap";
import {
  colors,
  INTRO_FRAMES,
  MAIN_FRAMES,
  OUTRO_FRAMES,
} from "./theme";

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

const MainReel: React.FC<{
  day: number;
  audioPath: string;
  beatmapPath: string;
  startOffsetSec?: number;
  autoHighlight?: boolean;
  renderer: BeatoberProps["renderer"];
}> = ({
  day,
  audioPath,
  beatmapPath,
  startOffsetSec,
  autoHighlight = false,
  renderer = "auto",
}) => {
  const entry = getDay(day);
  const { fps } = useVideoConfig();

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

export const BeatoberReel: React.FC<BeatoberProps> = ({
  day,
  audioFile,
  beatmapFile,
  startOffsetSec,
  autoHighlight = false,
  renderer = "auto",
}) => {
  const entry = getDay(day);
  const audioPath = audioFile ?? `audio/day-${padDay(day)}.mp3`;
  const beatmapPath = beatmapFile ?? `beatmaps/day-${padDay(day)}.json`;
  const accentBias = entry.artDirection.accentBias;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.black }}>
      <Series>
        <Series.Sequence durationInFrames={INTRO_FRAMES}>
          <IntroCard accentBias={accentBias} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={MAIN_FRAMES}>
          <MainReel
            day={day}
            audioPath={audioPath}
            beatmapPath={beatmapPath}
            startOffsetSec={startOffsetSec}
            autoHighlight={autoHighlight}
            renderer={renderer}
          />
        </Series.Sequence>
        <Series.Sequence durationInFrames={OUTRO_FRAMES}>
          <OutroCard accentBias={accentBias} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
