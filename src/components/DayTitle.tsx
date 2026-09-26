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
import { ChatonMark } from "./ChatonMark";
import { BrandWordmark } from "./BrandWordmark";

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

  const brandEnter = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 70 },
  });
  const brandOpacity = interpolate(frame, [0, 16], [0, 1], {
    extrapolateRight: "clamp",
  });
  const brandY = interpolate(brandEnter, [0, 1], [-28, 0]);
  const brandPulse = 1 + beat.bass * 0.04 + beat.accent * 0.06;
  const nameGlow = beat.accent * 0.55 + beat.bass * 0.25;
  const glowRgb =
    accentBias === "purple"
      ? "123, 77, 255"
      : accentBias === "gold"
        ? "212, 168, 75"
        : "47, 212, 168";

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 64,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
          opacity: brandOpacity,
          transform: `translateY(${brandY}px) scale(${brandPulse})`,
          transformOrigin: "left center",
          filter: `drop-shadow(0 0 ${10 + nameGlow * 20}px rgba(${glowRgb}, ${0.2 + nameGlow * 0.4}))`,
        }}
      >
        <ChatonMark size={76} accentBias={accentBias} />
        <BrandWordmark
          accentBias={accentBias}
          fontSize={34}
          letterSpacing="0.12em"
        />
      </div>

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
            fontSize: 52,
            letterSpacing: "-0.02em",
            color: colors.cream,
            lineHeight: 1,
            whiteSpace: "nowrap",
            textShadow: `0 0 40px ${accent}55`,
          }}
        >
          #BEATOBER : DAY {padDay(day)}
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
    </AbsoluteFill>
  );
};
