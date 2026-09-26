import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadSyne } from "@remotion/google-fonts/Syne";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { colors, accentFor, type AccentBias } from "../theme";
import type { BeatState } from "../audio/beatmap";
import { padDay } from "../data/prompts";

const { fontFamily: syne } = loadSyne();
const { fontFamily: space } = loadSpaceGrotesk();

export const DayTitle: React.FC<{
  day: number;
  prompt: string;
  accentBias: AccentBias;
  beat: BeatState;
}> = ({ day, prompt, accentBias, beat }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = accentFor(accentBias);

  const enter = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 80 },
  });
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });
  const y = interpolate(enter, [0, 1], [36, 0]);
  const scale = 1 + beat.accent * 0.045 + beat.bass * 0.02;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          bottom: 220,
          opacity,
          transform: `translateY(${y}px) scale(${scale})`,
          transformOrigin: "left bottom",
        }}
      >
        <div
          style={{
            fontFamily: syne,
            fontWeight: 800,
            fontSize: 92,
            letterSpacing: "-0.04em",
            color: colors.cream,
            lineHeight: 1,
            textShadow: `0 0 40px ${accent}55`,
          }}
        >
          DAY {padDay(day)}
        </div>
        <div
          style={{
            marginTop: 18,
            fontFamily: space,
            fontWeight: 500,
            fontSize: 42,
            letterSpacing: "0.02em",
            color: accent,
            textTransform: "uppercase",
          }}
        >
          {prompt}
        </div>
        <div
          style={{
            marginTop: 28,
            width: 72,
            height: 3,
            background: `linear-gradient(90deg, ${colors.jade}, ${accent})`,
            opacity: 0.9,
            transform: `scaleX(${0.6 + beat.bass * 0.8})`,
            transformOrigin: "left center",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: 72,
          left: 64,
          fontFamily: space,
          fontWeight: 600,
          fontSize: 22,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: colors.cream,
          opacity: 0.55,
        }}
      >
        Mechant Chaton
      </div>
      <div
        style={{
          position: "absolute",
          top: 72,
          right: 64,
          fontFamily: space,
          fontWeight: 500,
          fontSize: 18,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: colors.jadeBright,
          opacity: 0.5,
        }}
      >
        Beatober
      </div>
    </AbsoluteFill>
  );
};
