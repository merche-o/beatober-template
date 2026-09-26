import React, { useEffect, useRef } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { ArtDirection, MotifId } from "../data/prompts";
import type { BeatState } from "../audio/beatmap";
import { accentFor, colors } from "../theme";
import { rand } from "./motifTypes";

const drawMotif = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  motif: MotifId,
  day: number,
  art: ArtDirection,
  beat: BeatState,
  t: number,
) => {
  const accent = accentFor(art.accentBias);
  const cx = w / 2;
  const cy = h * 0.42;
  const pulse = 1 + beat.bass * 0.5 + beat.accent * 0.35;

  ctx.fillStyle = colors.black;
  ctx.fillRect(0, 0, w, h);

  // atmospheric wash
  const grad = ctx.createRadialGradient(cx, cy, 40, cx, cy, h * 0.55);
  grad.addColorStop(0, `${accent}33`);
  grad.addColorStop(0.45, `${colors.jade}18`);
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(cx, cy);

  switch (motif) {
    case "weatherField": {
      const n = Math.floor(60 + art.particleDensity * 90);
      for (let i = 0; i < n; i++) {
        const x = (rand(day, i) - 0.5) * w * 0.9;
        const speed = 120 + rand(day, i + 2) * 280;
        const y =
          ((rand(day, i + 5) * h + t * speed * (1 + beat.bass)) % (h * 0.9)) -
          h * 0.35;
        ctx.strokeStyle = i % 3 === 0 ? accent : colors.jadeBright;
        ctx.globalAlpha = 0.35 + beat.bass * 0.4;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 18 * pulse);
        ctx.stroke();
      }
      break;
    }
    case "orbHorizon": {
      const r = 110 * pulse;
      const sun = ctx.createRadialGradient(0, 0, 10, 0, 0, r * 1.6);
      sun.addColorStop(0, colors.goldBright);
      sun.addColorStop(0.5, accent);
      sun.addColorStop(1, "transparent");
      ctx.fillStyle = sun;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = colors.jade;
      ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(0, 40, 160 + i * 70, 40 + i * 12, t * (0.2 + i * 0.05) * art.cameraSpeed, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    }
    case "clubLattice": {
      const n = 6;
      const cell = 70;
      for (let x = -n; x <= n; x++) {
        for (let y = -n; y <= n; y++) {
          if ((x + y) % 2 === 0) continue;
          const hgt = 20 + beat.bass * 120 * (0.4 + rand(day, x * 17 + y));
          const col =
            rand(day, x + y) > 0.66
              ? accent
              : rand(day, x + y + 1) > 0.5
                ? colors.purple
                : colors.jade;
          ctx.fillStyle = col;
          ctx.globalAlpha = 0.55 + beat.accent * 0.35;
          ctx.fillRect(
            x * cell - 18,
            y * cell - hgt / 2,
            36,
            hgt * pulse,
          );
        }
      }
      break;
    }
    case "voidRings": {
      ctx.rotate(t * 0.15 * art.cameraSpeed);
      for (let i = 0; i < 8; i++) {
        ctx.strokeStyle = i % 2 === 0 ? colors.jade : accent;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.45 + beat.bass * 0.4;
        ctx.beginPath();
        ctx.ellipse(0, 0, (70 + i * 42) * pulse, (40 + i * 28) * pulse, i * 0.3, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    }
    case "tunnelRibbon": {
      const segs = 36;
      for (let i = 0; i < segs; i++) {
        const a = (i / segs) * Math.PI * 6 + t * art.cameraSpeed;
        const z = 1 - ((i / segs + t * 0.15) % 1);
        const rad = 40 + z * 280;
        const x = Math.cos(a) * rad;
        const y = Math.sin(a * 0.5) * rad * 0.45;
        ctx.fillStyle = i % 3 === 0 ? colors.gold : i % 3 === 1 ? accent : colors.jade;
        ctx.globalAlpha = 0.3 + z * 0.6;
        ctx.beginPath();
        ctx.arc(x, y, (6 + (1 - z) * 14) * pulse, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    default: {
      // neonCorridor
      for (let i = 0; i < 12; i++) {
        const z = ((i / 12 + t * 0.12 * art.cameraSpeed) % 1);
        const scale = 0.25 + z * 1.4;
        ctx.strokeStyle = i % 2 === 0 ? colors.jadeBright : accent;
        ctx.lineWidth = 4;
        ctx.globalAlpha = 0.25 + (1 - z) * 0.65;
        ctx.beginPath();
        ctx.ellipse(0, 0, 220 * scale * pulse, 320 * scale * pulse, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.strokeStyle = accent;
      ctx.globalAlpha = 0.7;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.2);
      ctx.lineTo(0, h * 0.25);
      ctx.stroke();
      break;
    }
  }

  ctx.restore();

  // vignette
  const vig = ctx.createRadialGradient(cx, cy, h * 0.15, cx, cy, h * 0.7);
  vig.addColorStop(0, "transparent");
  vig.addColorStop(1, "rgba(0,0,0,0.75)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);
};

export const CanvasProceduralScene: React.FC<{
  day: number;
  art: ArtDirection;
  beat: BeatState;
}> = ({ day, art, beat }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawMotif(ctx, width, height, art.motif, day, art, beat, frame / fps);
  }, [art, beat, day, frame, fps, height, width]);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.black }}>
      <canvas
        ref={ref}
        width={width}
        height={height}
        style={{ width: "100%", height: "100%" }}
      />
    </AbsoluteFill>
  );
};
