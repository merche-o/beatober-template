import React from "react";
import { Composition } from "remotion";
import { BeatoberReel } from "./BeatoberReel";
import { beatoberSchema, defaultProps } from "./schema";
import { durationInFrames, REEL } from "./theme";
import { BEATOBER_DAYS } from "./data/prompts";
import "./index.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BeatoberReel"
        component={BeatoberReel}
        durationInFrames={durationInFrames}
        fps={REEL.fps}
        width={REEL.width}
        height={REEL.height}
        schema={beatoberSchema}
        defaultProps={defaultProps}
      />
      {BEATOBER_DAYS.map((d) => (
        <Composition
          key={d.day}
          id={`Day${String(d.day).padStart(2, "0")}`}
          component={BeatoberReel}
          durationInFrames={durationInFrames}
          fps={REEL.fps}
          width={REEL.width}
          height={REEL.height}
          schema={beatoberSchema}
          defaultProps={{
            day: d.day,
            autoHighlight: false,
            renderer: "auto",
            audioFile: `audio/day-${String(d.day).padStart(2, "0")}.mp3`,
            beatmapFile: `beatmaps/day-${String(d.day).padStart(2, "0")}.json`,
          }}
        />
      ))}
    </>
  );
};
