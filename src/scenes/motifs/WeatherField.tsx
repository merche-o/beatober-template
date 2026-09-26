import React, { useMemo } from "react";
import { brandMaterials, rand, type MotifProps } from "../motifTypes";

export const WeatherField: React.FC<MotifProps> = ({
  seed,
  accentBias,
  beat,
  cameraSpeed,
  particleDensity,
  frame,
  fps,
}) => {
  const { accent, pulse, jade } = brandMaterials(accentBias, beat);
  const t = frame / fps;
  const count = Math.floor(80 + particleDensity * 120);
  const drops = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (rand(seed, i) - 0.5) * 10,
        y: (rand(seed, i + 3) - 0.5) * 14,
        z: (rand(seed, i + 7) - 0.5) * 8,
        speed: 1.5 + rand(seed, i + 11) * 3,
        len: 0.15 + rand(seed, i + 13) * 0.35,
      })),
    [count, seed],
  );

  return (
    <group rotation={[0.1, t * 0.08 * cameraSpeed, 0]}>
      {drops.map((d, i) => {
        const y = ((d.y - t * d.speed * (1 + beat.bass)) % 14) + 7;
        return (
          <mesh key={i} position={[d.x, y, d.z]} scale={[1, d.len * pulse, 1]}>
            <capsuleGeometry args={[0.02, d.len, 4, 8]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? accent : jade}
              emissive={i % 3 === 0 ? accent : jade}
              emissiveIntensity={0.6 + beat.accent}
            />
          </mesh>
        );
      })}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4.5, 48]} />
        <meshStandardMaterial
          color="#0c1a16"
          emissive={jade}
          emissiveIntensity={0.15 + beat.bass * 0.4}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
};
