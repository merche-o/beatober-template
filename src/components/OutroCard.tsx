import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, OUTRO_FRAMES, type AccentBias } from "../theme";
import { ChatonMark } from "./ChatonMark";
import { BrandWordmark, brandFontFamily } from "./BrandWordmark";

/** Outro: mark + thanks (2s). */
export const OutroCard: React.FC<{ accentBias: AccentBias }> = ({
  accentBias,
}) => {
  const frame = useCurrentFrame();

  const enter = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(frame, [OUTRO_FRAMES - 14, OUTRO_FRAMES - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(enter, exit);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.black,
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <ChatonMark size={128} accentBias={accentBias} />
        <BrandWordmark
          accentBias={accentBias}
          fontSize={36}
          letterSpacing="0.16em"
        />
        <div
          style={{
            fontFamily: brandFontFamily,
            fontWeight: 500,
            fontSize: 44,
            letterSpacing: "0.04em",
            color: colors.cream,
            lineHeight: 1.2,
            textAlign: "center",
            marginTop: 8,
          }}
        >
          Thanks for listening
        </div>
      </div>
    </AbsoluteFill>
  );
};
