import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { ArtDirection } from "../data/prompts";
import type { BeatState } from "../audio/beatmap";
import { colors } from "../theme";
import { NeonCorridor } from "./motifs/NeonCorridor";
import { WeatherField } from "./motifs/WeatherField";
import { OrbHorizon } from "./motifs/OrbHorizon";
import { ClubLattice } from "./motifs/ClubLattice";
import { VoidRings } from "./motifs/VoidRings";
import { TunnelRibbon } from "./motifs/TunnelRibbon";
import type { MotifProps } from "./motifTypes";

const MotifSwitch: React.FC<MotifProps & { motif: ArtDirection["motif"] }> = ({
  motif,
  ...props
}) => {
  switch (motif) {
    case "weatherField":
      return <WeatherField {...props} />;
    case "orbHorizon":
      return <OrbHorizon {...props} />;
    case "clubLattice":
      return <ClubLattice {...props} />;
    case "voidRings":
      return <VoidRings {...props} />;
    case "tunnelRibbon":
      return <TunnelRibbon {...props} />;
    default:
      return <NeonCorridor {...props} />;
  }
};

export const ThreeScene: React.FC<{
  day: number;
  art: ArtDirection;
  beat: BeatState;
}> = ({ day, art, beat }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const camZ = 5.2 - beat.bass * 0.35 - beat.accent * 0.15;

  const motifProps: MotifProps = {
    seed: day * 97,
    accentBias: art.accentBias,
    beat,
    cameraSpeed: art.cameraSpeed,
    particleDensity: art.particleDensity,
    bloom: art.bloom,
    frame,
    fps,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: colors.black }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [0, 0.2, camZ], fov: 50, near: 0.1, far: 100 }}
        style={{ backgroundColor: colors.black }}
      >
        <color attach="background" args={[colors.black]} />
        <ambientLight intensity={0.25 + beat.bass * 0.2} />
        <pointLight
          position={[2, 3, 4]}
          intensity={1.2 + beat.accent * 1.5}
          color={colors.jadeBright}
        />
        <pointLight
          position={[-3, -1, 2]}
          intensity={0.6 + beat.bass * 0.8}
          color={
            art.accentBias === "purple"
              ? colors.purple
              : art.accentBias === "gold"
                ? colors.gold
                : colors.jade
          }
        />
        <MotifSwitch motif={art.motif} {...motifProps} />
      </ThreeCanvas>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.72) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
