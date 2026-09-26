import React, { useMemo } from "react";
import { brandMaterials, rand, type MotifProps } from "../motifTypes";

export const TunnelRibbon: React.FC<MotifProps> = ({
  seed,
  accentBias,
  beat,
  cameraSpeed,
  particleDensity,
  frame,
  fps,
}) => {
  const { accent, pulse, jade, gold } = brandMaterials(accentBias, beat);
  const t = frame / fps;
  const segments = Math.floor(24 + particleDensity * 20);
  const points = useMemo(
    () =>
      Array.from({ length: segments }, (_, i) => {
        const a = (i / segments) * Math.PI * 6;
        return {
          x: Math.cos(a) * (1.2 + rand(seed, i) * 0.3),
          y: Math.sin(a * 0.5) * 0.8,
          z: -i * 0.35,
        };
      }),
    [seed, segments],
  );

  return (
    <group rotation={[0.2, 0, t * 0.2 * cameraSpeed]}>
      {points.map((p, i) => (
        <mesh
          key={i}
          position={[
            p.x,
            p.y,
            p.z + ((t * 3 * cameraSpeed) % 0.35),
          ]}
          scale={0.7 + beat.bass * 0.5 * pulse}
        >
          <sphereGeometry args={[0.12 + (i % 5) * 0.02, 12, 12]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? gold : i % 3 === 1 ? accent : jade}
            emissive={i % 3 === 0 ? gold : i % 3 === 1 ? accent : jade}
            emissiveIntensity={0.7 + beat.accent * 1.2}
          />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.4, 0.04, 8, 80]} />
        <meshStandardMaterial
          color={jade}
          emissive={jade}
          emissiveIntensity={0.5 + beat.bass}
        />
      </mesh>
    </group>
  );
};
