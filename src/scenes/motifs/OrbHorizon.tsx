import React from "react";
import { DoubleSide } from "three";
import { brandMaterials, type MotifProps } from "../motifTypes";

export const OrbHorizon: React.FC<MotifProps> = ({
  accentBias,
  beat,
  cameraSpeed,
  bloom,
  frame,
  fps,
}) => {
  const { accent, pulse, jade, gold } = brandMaterials(accentBias, beat);
  const t = frame / fps;
  const sunScale = (1.2 + beat.bass * 0.6 + beat.accent * 0.3) * pulse * 0.85;

  return (
    <group rotation={[0.05, t * 0.12 * cameraSpeed, 0]}>
      <mesh position={[0, 0.4, -1]} scale={sunScale}>
        <sphereGeometry args={[1.1, 48, 48]} />
        <meshStandardMaterial
          color={gold}
          emissive={accentBias === "gold" ? gold : accent}
          emissiveIntensity={1.1 + bloom + beat.accent}
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>
      {[1.6, 2.2, 2.9].map((r, i) => (
        <mesh
          key={r}
          rotation={[Math.PI / 2.2, 0, t * (0.2 + i * 0.1) * cameraSpeed]}
          scale={1 + beat.bass * 0.08 * (i + 1)}
        >
          <torusGeometry args={[r, 0.03, 8, 64]} />
          <meshStandardMaterial
            color={i === 1 ? accent : jade}
            emissive={i === 1 ? accent : jade}
            emissiveIntensity={0.7 + beat.accent}
          />
        </mesh>
      ))}
      <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 3.8, 64]} />
        <meshStandardMaterial
          color="#0a1210"
          emissive={jade}
          emissiveIntensity={0.25 + beat.bass * 0.5}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
};
