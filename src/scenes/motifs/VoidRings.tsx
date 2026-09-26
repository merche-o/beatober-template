import React from "react";
import { brandMaterials, type MotifProps } from "../motifTypes";

export const VoidRings: React.FC<MotifProps> = ({
  accentBias,
  beat,
  cameraSpeed,
  bloom,
  frame,
  fps,
}) => {
  const { accent, pulse, jade } = brandMaterials(accentBias, beat);
  const t = frame / fps;

  return (
    <group rotation={[t * 0.1 * cameraSpeed, t * 0.18 * cameraSpeed, 0]}>
      {Array.from({ length: 8 }, (_, i) => {
        const r = 0.6 + i * 0.45;
        return (
          <mesh
            key={i}
            rotation={[
              Math.PI / 2 + i * 0.12,
              i * 0.4,
              t * (0.15 + i * 0.02) * cameraSpeed,
            ]}
            scale={pulse * (1 + beat.accent * 0.05 * i)}
          >
            <torusGeometry args={[r, 0.028, 10, 64]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? jade : accent}
              emissive={i % 2 === 0 ? jade : accent}
              emissiveIntensity={0.55 + bloom * 0.5 + beat.bass * 0.8}
              transparent
              opacity={0.85}
            />
          </mesh>
        );
      })}
      <mesh scale={0.35 + beat.bass * 0.25}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1 + beat.accent * 1.5}
          wireframe
        />
      </mesh>
    </group>
  );
};
