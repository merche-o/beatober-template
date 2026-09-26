import React from "react";
import { Img, staticFile } from "remotion";
import type { AccentBias } from "../theme";

const openFileFor = (bias: AccentBias): string => {
  switch (bias) {
    case "purple":
      return "brand/mark-2b-purple.png";
    case "gold":
      return "brand/mark-2b-gold.png";
    default:
      return "brand/mark-2b-jade.png";
  }
};

const winkFileFor = (bias: AccentBias): string => {
  switch (bias) {
    case "purple":
      return "brand/mark-2b-purple-wink.png";
    case "gold":
      return "brand/mark-2b-gold-wink.png";
    default:
      return "brand/mark-2b-jade-wink.png";
  }
};

/**
 * Logo 2b — transparent PNG. Crossfades to wink asset when winkProgress > 0.
 */
export const ChatonMark: React.FC<{
  size?: number;
  accentBias?: AccentBias;
  winkProgress?: number;
}> = ({ size = 88, accentBias = "jade", winkProgress = 0 }) => {
  const wink = Math.min(1, Math.max(0, winkProgress));
  const openOpacity = 1 - wink;
  const winkOpacity = wink;

  const imgStyle: React.CSSProperties = {
    width: size,
    height: size,
    objectFit: "contain",
    display: "block",
    background: "transparent",
  };

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        background: "transparent",
      }}
    >
      <Img
        src={staticFile(openFileFor(accentBias))}
        style={{ ...imgStyle, opacity: openOpacity }}
      />
      {wink > 0.001 ? (
        <Img
          src={staticFile(winkFileFor(accentBias))}
          style={{
            ...imgStyle,
            position: "absolute",
            left: 0,
            top: 0,
            opacity: winkOpacity,
          }}
        />
      ) : null}
    </div>
  );
};
