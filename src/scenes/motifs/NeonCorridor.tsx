import React, { useMemo } from "react";
import { brandMaterials, rand, type MotifProps } from "../motifTypes";

export const NeonCorridor: React.FC<MotifProps> = ({
  seed,
  accentBias,
  beat,
  cameraSpeed,
  frame,
  fps,
}) => {
  const { accent, pulse, jade } = brandMaterials(accentBias, beat);
  const t = frame / fps;
  const rings = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        z: -i * 2.2,
        scale: 0.7 + rand(seed, i) * 0.5,
        rot: rand(seed, i + 40) * Math.PI,
      })),
    [seed],
  );

  return (
    <group rotation={[0.15, t * 0.15 * cameraSpeed, 0]}>
      {rings.map((r, i) => (
        <mesh
          key={i}
          position={[0, 0, r.z + ((t * 4 * cameraSpeed) % 2.2)]}
          rotation={[0, 0, r.rot + t * 0.2]}
          scale={[r.scale * pulse, r.scale * pulse, 1]}
        >
          <torusGeometry args={[1.6, 0.045, 12, 48]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? jade : accent}
            emissive={i % 2 === 0 ? jade : accent}
            emissiveIntensity={0.8 + beat.accent * 1.4}
            metalness={0.4}
            roughness={0.35}
          />
        </mesh>
      ))}
      <mesh position={[0, 0, -8]} scale={[1, 1, 1 + beat.bass * 0.5]}>
        <boxGeometry args={[0.2, 0.2, 18]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1.2 + beat.accent}
        />
      </mesh>
    </group>
  );
};
