import React from "react";
import { Ball, Curve, Rod, V3 } from "./Pelican";

const wrap = (n: number, length: number) => ((n % length) + length) % length;
const Cloud: React.FC<{ at: V3; size?: number }> = ({ at, size = 1 }) => (
  <group position={at} scale={size}>
    <Ball at={[0, 0, 0]} scale={[0.95, 0.28, 0.45]} color="#f6f8ee" />
    <Ball at={[-0.39, 0.14, 0]} scale={[0.44, 0.34, 0.36]} color="#f6f8ee" />
    <Ball at={[0.26, 0.21, -0.04]} scale={[0.52, 0.41, 0.36]} color="#f6f8ee" />
  </group>
);

const Shrub: React.FC<{ x: number; z: number; size: number }> = ({
  x,
  z,
  size,
}) => (
  <group position={[x, 0, z]} scale={size}>
    <Ball at={[0, 0.14, 0]} scale={[0.57, 0.23, 0.38]} color="#8caa88" />
    <Ball at={[-0.23, 0.2, 0.04]} scale={[0.27, 0.31, 0.28]} color="#a0b799" />
    <Ball at={[0.17, 0.32, -0.1]} scale={[0.29, 0.41, 0.27]} color="#799a78" />
    <Ball at={[0.44, 0.1, 0.2]} scale={[0.24, 0.17, 0.22]} color="#b4ba99" />
  </group>
);

export const Coast: React.FC<{ seconds: number; phase: number }> = ({
  seconds,
  phase,
}) => {
  // 0.75 crank turns/second × 2 gear ratio × tire circumference.
  const travel = seconds * Math.PI * 3 * 0.674;
  return (
    <group>
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[160, 0.25, 50]} />
        <meshStandardMaterial color="#e5d6b5" roughness={1} />
      </mesh>
      <mesh position={[0, -0.008, 0.15]} receiveShadow>
        <boxGeometry args={[160, 0.035, 2.8]} />
        <meshStandardMaterial color="#d8c6a6" roughness={1} />
      </mesh>
      {[-1.27, 1.57].map((z) => (
        <mesh key={z} position={[0, 0.012, z]} receiveShadow>
          <boxGeometry args={[160, 0.025, 0.12]} />
          <meshStandardMaterial color="#f5e6c7" />
        </mesh>
      ))}
      <mesh position={[0, -0.024, -15]} receiveShadow>
        <boxGeometry args={[160, 0.02, 22]} />
        <meshStandardMaterial color="#88bdb7" roughness={0.48} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => (
        <group key={i} position={[wrap(i * 4.2 - travel, 50.4) - 25.2, 0, 0]}>
          <mesh position={[0, 0.013, 0.15]}>
            <boxGeometry args={[0.75, 0.012, 0.047]} />
            <meshStandardMaterial color="#eee0c1" />
          </mesh>
          <Shrub x={0.4} z={-2.8 - (i % 3) * 0.4} size={0.7 + (i % 3) * 0.22} />
          <Ball
            at={[1.1, 0.07, 2.2 + (i % 2) * 0.45]}
            scale={[0.23, 0.11, 0.17]}
            color="#bdbba5"
          />
          <Ball
            at={[1.5, 0.05, -2.1]}
            scale={[0.15, 0.065, 0.1]}
            color="#bdbba5"
          />
          {[0, 1, 2].map((j) => (
            <Curve
              key={j}
              points={[
                [2.5 + j * 0.1, 0, 2.3],
                [2.5 + j * 0.1, 0.19 + j * 0.06, 2.3],
                [2.56 + j * 0.14, 0.34 + j * 0.04, 2.3],
              ]}
              radius={0.015}
              color="#839974"
            />
          ))}
          {i % 2 === 0 ? (
            <group>
              <Rod
                from={[-1, 0, -1.96]}
                to={[-1, 0.56, -1.96]}
                radius={0.05}
                color="#eee7d2"
              />
              <Ball
                at={[-1, 0.55, -1.96]}
                scale={[0.055, 0.05, 0.055]}
                color="#efe6d1"
              />
              <Rod
                from={[-1, 0.43, -1.96]}
                to={[3.2, 0.43, -1.96]}
                radius={0.025}
                color="#eee7d2"
              />
            </group>
          ) : null}
        </group>
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <mesh
          key={i}
          position={[
            wrap(i * 3.7 - travel * 0.35, 51.8) - 25.9,
            -0.008,
            -4.1 - (i % 4) * 1.6,
          ]}
        >
          <boxGeometry args={[1.4 + (i % 3) * 0.5, 0.009, 0.038]} />
          <meshStandardMaterial color="#c6e0d4" roughness={0.8} />
        </mesh>
      ))}
      <Ball at={[-8, 0.08, -21]} scale={[7, 1.3, 2.0]} color="#b7cbc0" />
      <Ball at={[8, 0.06, -24]} scale={[9, 1.8, 3.0]} color="#c2d2c3" />
      <Cloud at={[-5.3 + Math.sin(phase) * 0.2, 5.3, -11]} size={1.1} />
      <Cloud at={[4.9 + Math.sin(phase + 1) * 0.3, 4.5, -13]} size={0.85} />
      <Cloud at={[12, 5.7, -19]} size={1.3} />
      {[0, 1, 2].map((i) => (
        <group
          key={i}
          position={[
            wrap(i * 5 - seconds * 0.6, 18) - 9,
            4.0 + i * 0.36,
            -12 - i,
          ]}
        >
          <Curve
            points={[
              [-0.26, 0.04, 0],
              [-0.12, 0.09 + 0.07 * Math.sin(phase * 4 + i), 0],
              [0, 0, 0],
              [0.12, 0.09 + 0.07 * Math.sin(phase * 4 + i), 0],
              [0.26, 0.04, 0],
            ]}
            radius={0.018}
            color="#77978d"
          />
        </group>
      ))}
    </group>
  );
};
