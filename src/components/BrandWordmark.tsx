import React from "react";
import { loadFont as loadBodoni } from "@remotion/google-fonts/BodoniModa";
import { accentFor, type AccentBias } from "../theme";

const { fontFamily: bodoni } = loadBodoni("normal", {
  weights: ["500", "600", "700"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true,
});

/** Didone wordmark — color tracks the day's visualizer accent. */
export const BrandWordmark: React.FC<{
  accentBias: AccentBias;
  fontSize?: number;
  opacity?: number;
  letterSpacing?: string;
}> = ({
  accentBias,
  fontSize = 56,
  opacity = 1,
  letterSpacing = "0.14em",
}) => {
  return (
    <div
      style={{
        fontFamily: bodoni,
        fontWeight: 600,
        fontSize,
        letterSpacing,
        textTransform: "uppercase",
        color: accentFor(accentBias),
        lineHeight: 1,
        opacity,
      }}
    >
      Mechant Chaton
    </div>
  );
};

export const brandFontFamily = bodoni;
