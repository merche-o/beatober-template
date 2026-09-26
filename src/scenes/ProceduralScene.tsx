import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
} from "remotion";
import type { ArtDirection } from "../data/prompts";
import type { BeatState } from "../audio/beatmap";
import { colors } from "../theme";
import { ThreeScene } from "./ThreeScene";
import { CanvasProceduralScene } from "./CanvasProceduralScene";

const canCreateWebGL = (): boolean => {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
};

export type RendererMode = "auto" | "three" | "canvas";

/**
 * Prefer Three.js when WebGL works; otherwise Canvas 2D (same motifs + beat sync).
 * `renderer` prop forces a mode.
 */
export const ProceduralScene: React.FC<{
  day: number;
  art: ArtDirection;
  beat: BeatState;
  renderer?: RendererMode;
}> = ({ day, art, beat, renderer = "auto" }) => {
  const [handle] = useState(() => delayRender("Detect WebGL for visualizer"));
  const [mode, setMode] = useState<"three" | "canvas" | null>(null);

  useEffect(() => {
    if (renderer === "canvas") {
      setMode("canvas");
    } else if (renderer === "three") {
      setMode("three");
    } else {
      setMode(canCreateWebGL() ? "three" : "canvas");
    }
    continueRender(handle);
  }, [handle, renderer]);

  if (!mode) {
    return <AbsoluteFill style={{ backgroundColor: colors.black }} />;
  }

  if (mode === "three") {
    return <ThreeScene day={day} art={art} beat={beat} />;
  }

  return <CanvasProceduralScene day={day} art={art} beat={beat} />;
};
