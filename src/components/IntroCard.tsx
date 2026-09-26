import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { colors, INTRO_FRAMES } from "../theme";
import type { AccentBias } from "../theme";
import { ChatonMark } from "./ChatonMark";
import { BrandWordmark } from "./BrandWordmark";

const { fontFamily: space } = loadSpaceGrotesk();

/**
 * Intro timeline (@30fps, 75 frames / 2.5s):
 * 0–12   mark fades in
 * 10–22  name fades in
 * 18–30  “Beatober Challenge” fades in
 * 24–34  wink (close then open)
 * 34–58  hold
 * 58–75  fade to black
 */
export const IntroCard: React.FC<{ accentBias: AccentBias }> = ({
  accentBias,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const winkPeak = Math.round(0.12 * fps);

  const markOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const nameOpacity = interpolate(frame, [10, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const challengeOpacity = interpolate(frame, [18, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const winkProgress = interpolate(
    frame,
    [24, 24 + winkPeak, 24 + winkPeak * 2],
    [0, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const exitOpacity = interpolate(frame, [58, INTRO_FRAMES - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.black,
        justifyContent: "center",
        alignItems: "center",
        opacity: exitOpacity,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          opacity: markOpacity,
        }}
      >
        <ChatonMark
          size={240}
          accentBias={accentBias}
          winkProgress={winkProgress}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <BrandWordmark
            accentBias={accentBias}
            fontSize={58}
            opacity={nameOpacity}
          />
          <div
            style={{
              fontFamily: space,
              fontWeight: 500,
              fontSize: 28,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: colors.cream,
              lineHeight: 1,
              opacity: challengeOpacity,
            }}
          >
            Beatober Challenge
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
