import React, { useMemo } from "react";
import { brandMaterials, rand, type MotifProps } from "../motifTypes";

export const ClubLattice: React.FC<MotifProps> = ({
  seed,
  accentBias,
  beat,
  cameraSpeed,
  particleDensity,
  frame,
  fps,
}) => {
  const { accent, pulse, jade, purple } = brandMaterials(accentBias, beat);
  const t = frame / fps;
  const n = Math.floor(5 + particleDensity * 4);
  const cells = useMemo(() => {
    const list: { x: number; y: number; z: number; hue: number }[] = [];
    for (let x = -n; x <= n; x++) {
      for (let y = -n; y <= n; y++) {
        if ((x + y) % 2 === 0) continue;
        list.push({
          x: x * 0.85,
          y: y * 0.85,
          z: (rand(seed, x * 31 + y) - 0.5) * 2,
          hue: rand(seed, x + y * 17),
        });
      }
    }
    return list;
  }, [n, seed]);

  return (
    <group
      rotation={[
        0.25 + Math.sin(t * 0.4) * 0.1,
        t * 0.25 * cameraSpeed,
        Math.sin(t * 0.3) * 0.08,
      ]}
      scale={0.95 + beat.accent * 0.08}
    >
      {cells.map((c, i) => (
        <mesh
          key={i}
          position={[c.x, c.y, c.z]}
          scale={[
            0.35,
            0.35,
            0.35 + beat.bass * 1.2 * (0.5 + c.hue) * pulse * 0.5,
          ]}
        >
          <boxGeometry args={[0.55, 0.55, 0.55]} />
          <meshStandardMaterial
            color={c.hue > 0.66 ? accent : c.hue > 0.33 ? purple : jade}
            emissive={c.hue > 0.66 ? accent : c.hue > 0.33 ? purple : jade}
            emissiveIntensity={0.5 + beat.bass * 1.2 + beat.accent}
            metalness={0.6}
            roughness={0.25}
          />
        </mesh>
      ))}
    </group>
  );
};
