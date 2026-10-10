import React, { useMemo } from "react";
import * as THREE from "three";

export type V3 = [number, number, number];
const cream = "#fff8e8";
const metal = "#d9e5d8";
const orange = "#e6a34e";

export const Ball: React.FC<{
  at: V3;
  scale: V3;
  color: string;
  rotation?: V3;
  roughness?: number;
}> = ({ at, scale, color, rotation, roughness = 0.7 }) => (
  <mesh
    position={at}
    scale={scale}
    rotation={rotation}
    castShadow
    receiveShadow
  >
    <sphereGeometry args={[1, 32, 24]} />
    <meshStandardMaterial color={color} roughness={roughness} />
  </mesh>
);

export const Rod: React.FC<{
  from: V3;
  to: V3;
  radius?: number;
  color: string;
}> = ({ from, to, radius = 0.045, color }) => {
  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const vector = end.clone().sub(start);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    vector.clone().normalize(),
  );
  return (
    <mesh
      position={start.clone().add(end).multiplyScalar(0.5)}
      quaternion={quaternion}
      castShadow
    >
      <cylinderGeometry args={[radius, radius, vector.length(), 16]} />
      <meshStandardMaterial color={color} roughness={0.42} metalness={0.18} />
    </mesh>
  );
};

export const Curve: React.FC<{
  points: V3[];
  radius: number;
  color: string;
}> = ({ points, radius, color }) => {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))),
    [points],
  );
  return (
    <mesh castShadow>
      <tubeGeometry args={[curve, 32, radius, 10, false]} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  );
};

const Wheel: React.FC<{ x: number; angle: number }> = ({ x, angle }) => (
  <group position={[x, 0.68, 0]} rotation={[0, 0, angle]}>
    <mesh castShadow>
      <torusGeometry args={[0.6, 0.074, 20, 64]} />
      <meshStandardMaterial color="#354842" roughness={0.87} />
    </mesh>
    <mesh>
      <torusGeometry args={[0.545, 0.023, 12, 64]} />
      <meshStandardMaterial color={metal} metalness={0.55} roughness={0.32} />
    </mesh>
    {Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2;
      return (
        <Rod
          key={i}
          from={[0, 0, 0]}
          to={[Math.cos(a) * 0.535, Math.sin(a) * 0.535, 0]}
          radius={0.009}
          color={metal}
        />
      );
    })}
    <Rod from={[0, 0, -0.14]} to={[0, 0, 0.14]} radius={0.065} color={metal} />
    <Ball
      at={[0.42, 0.23, 0.018]}
      scale={[0.06, 0.025, 0.023]}
      color="#ebad57"
    />
  </group>
);

export const pedalPoint = (angle: number, side: number): V3 => [
  -0.2 + Math.cos(angle) * 0.235,
  0.75 + Math.sin(angle) * 0.235,
  side * 0.27,
];

export const Bicycle: React.FC<{ pedal: number; color: string }> = ({
  pedal,
  color,
}) => {
  const rear: V3 = [-1.15, 0.68, 0];
  const crank: V3 = [-0.2, 0.75, 0];
  const seat: V3 = [-0.6, 1.6, 0];
  const head: V3 = [0.78, 1.58, 0];
  return (
    <group>
      <Wheel x={-1.15} angle={pedal * 2} />
      <Wheel x={1.15} angle={pedal * 2} />
      <Rod from={rear} to={seat} color={color} />
      <Rod from={rear} to={crank} color={color} />
      <Rod from={seat} to={crank} color={color} radius={0.055} />
      <Rod from={seat} to={head} color={color} radius={0.055} />
      <Rod from={crank} to={[0.86, 1.35, 0]} color={color} radius={0.065} />
      <Rod from={[0.86, 1.35, 0]} to={head} color={color} radius={0.066} />
      {[-1, 1].map((side) => (
        <group key={side}>
          <Curve
            points={[
              [0.83, 1.45, side * 0.085],
              [0.93, 1.05, side * 0.11],
              [1.15, 0.68, side * 0.11],
            ]}
            radius={0.036}
            color={color}
          />
          <Rod
            from={[-0.6, 1.47, side * 0.05]}
            to={[-1.15, 0.68, side * 0.1]}
            color={color}
            radius={0.023}
          />
        </group>
      ))}
      <Rod from={seat} to={[-0.64, 1.77, 0]} color={metal} radius={0.038} />
      <Ball at={[-0.65, 1.78, 0]} scale={[0.29, 0.08, 0.19]} color="#764f37" />
      <Rod from={head} to={[0.72, 1.87, 0]} color={metal} radius={0.035} />
      <Curve
        points={[
          [0.72, 1.87, 0],
          [0.88, 1.93, 0],
          [0.9, 1.92, 0.3],
          [0.72, 1.94, 0.4],
        ]}
        radius={0.03}
        color={metal}
      />
      <Curve
        points={[
          [0.88, 1.93, 0],
          [0.9, 1.92, -0.3],
          [0.72, 1.94, -0.4],
        ]}
        radius={0.03}
        color={metal}
      />
      <Rod
        from={[0.73, 1.94, 0.31]}
        to={[0.73, 1.94, 0.47]}
        radius={0.047}
        color="#764f37"
      />
      <Rod
        from={[0.73, 1.94, -0.31]}
        to={[0.73, 1.94, -0.47]}
        radius={0.047}
        color="#764f37"
      />
      <Ball
        at={[0.84, 1.98, 0.2]}
        scale={[0.066, 0.037, 0.066]}
        color="#e8bf72"
        roughness={0.25}
      />
      <mesh
        position={[-0.2, 0.75, 0.16]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.18, 0.18, 0.055, 32]} />
        <meshStandardMaterial color="#425a50" metalness={0.6} roughness={0.3} />
      </mesh>
      <Curve
        points={[
          [-1.15, 0.77, 0.18],
          [-0.2, 0.92, 0.18],
          [-0.04, 0.75, 0.18],
          [-0.2, 0.59, 0.18],
          [-1.15, 0.6, 0.18],
          [-1.15, 0.77, 0.18],
        ]}
        radius={0.012}
        color="#546355"
      />
      {[1, -1].map((side) => {
        const p = pedalPoint(pedal + (side === -1 ? Math.PI : 0), side);
        return (
          <group key={side}>
            <Rod
              from={[-0.2, 0.75, side * 0.2]}
              to={p}
              color={metal}
              radius={0.026}
            />
            <mesh position={p} castShadow>
              <boxGeometry args={[0.2, 0.044, 0.17]} />
              <meshStandardMaterial color="#4b5142" />
            </mesh>
          </group>
        );
      })}
      {[-1.15, 1.15].map((x) => (
        <Curve
          key={x}
          points={Array.from({ length: 17 }, (_, i) => {
            const a = Math.PI * (0.12 + (i / 16) * 0.76);
            return [x + Math.cos(a) * 0.71, 0.68 + Math.sin(a) * 0.71, 0] as V3;
          })}
          radius={0.046}
          color={color}
        />
      ))}
      <Rod
        from={[-1.46, 1.36, 0]}
        to={[-0.9, 1.36, 0]}
        color={metal}
        radius={0.022}
      />
      <Ball
        at={[-1.68, 1.22, 0.015]}
        scale={[0.055, 0.044, 0.06]}
        color="#d36c4a"
      />
      <Ball at={[1.21, 1.41, 0]} scale={[0.07, 0.07, 0.08]} color="#f8e4a9" />
    </group>
  );
};

const Beak = () => {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.03, 0.04);
    s.quadraticCurveTo(0.45, 0.13, 1.14, -0.025);
    s.quadraticCurveTo(1.3, -0.04, 1.25, -0.12);
    s.quadraticCurveTo(0.62, -0.18, 0.03, -0.18);
    s.quadraticCurveTo(-0.07, -0.14, -0.03, 0.04);
    return s;
  }, []);
  return (
    <group position={[0.55, 3.16, 0]}>
      <Ball
        at={[0.47, -0.21, 0]}
        scale={[0.6, 0.23, 0.16]}
        color="#efbd68"
        rotation={[0, 0, 0.06]}
      />
      <mesh position={[0, 0, -0.12]} castShadow>
        <extrudeGeometry
          args={[
            shape,
            {
              depth: 0.24,
              bevelEnabled: true,
              bevelSize: 0.035,
              bevelThickness: 0.035,
              bevelSegments: 3,
              steps: 1,
              curveSegments: 24,
            },
          ]}
        />
        <meshStandardMaterial color="#f4bc54" roughness={0.6} />
      </mesh>
      <Curve
        points={[
          [0.04, -0.095, 0.168],
          [0.57, -0.102, 0.144],
          [1.15, -0.103, 0.119],
        ]}
        radius={0.009}
        color="#be803d"
      />
      <Ball
        at={[0.11, 0.004, 0.149]}
        scale={[0.024, 0.014, 0.009]}
        color="#b8803b"
      />
    </group>
  );
};

const Leg: React.FC<{ pedal: number; side: number }> = ({ pedal, side }) => {
  const hip: V3 = [-0.56, 1.73, side * 0.25];
  const foot = pedalPoint(pedal, side);
  foot[1] += 0.065;
  const dx = foot[0] - hip[0],
    dy = foot[1] - hip[1];
  const distance = Math.hypot(dx, dy);
  const offset = Math.sqrt(Math.max(0, 0.64 ** 2 - (distance / 2) ** 2));
  const knee: V3 = [
    (hip[0] + foot[0]) / 2 - (dy / distance) * offset,
    (hip[1] + foot[1]) / 2 + (dx / distance) * offset,
    side * 0.32,
  ];
  return (
    <group>
      <Rod from={hip} to={knee} radius={0.052} color={orange} />
      <Ball at={knee} scale={[0.064, 0.067, 0.064]} color={orange} />
      <Rod from={knee} to={foot} radius={0.042} color={orange} />
      <Ball
        at={[foot[0] + 0.06, foot[1], foot[2]]}
        scale={[0.19, 0.055, 0.11]}
        color={orange}
      />
      {[-1, 0, 1].map((i) => (
        <Ball
          key={i}
          at={[foot[0] + 0.18, foot[1] - 0.006, foot[2] + i * 0.065]}
          scale={[0.08, 0.035, 0.044]}
          color={orange}
        />
      ))}
    </group>
  );
};

export const Pelican: React.FC<{
  pedal: number;
  phase: number;
  scarfColor: string;
}> = ({ pedal, phase, scarfColor }) => {
  const nod = Math.sin(pedal) * 0.018;
  const blink = Math.min(Math.abs(Math.sin(phase * 3 + 0.7)) * 14, 1);
  return (
    <group>
      <Leg pedal={pedal + Math.PI} side={-1} />
      <Ball
        at={[-0.64, 2.14, 0]}
        scale={[0.65, 0.72, 0.45]}
        color={cream}
        rotation={[0, 0, -0.19]}
      />
      <Ball
        at={[-1.2, 1.96, 0]}
        scale={[0.43, 0.23, 0.3]}
        color={cream}
        rotation={[0, 0, -0.28]}
      />
      {[-1, 0, 1].map((i) => (
        <Ball
          key={i}
          at={[-1.47 - Math.abs(i) * 0.03, 2.05, i * 0.15]}
          scale={[0.31, 0.073, 0.085]}
          color={i === 0 ? "#e7e8db" : "#f8f4e4"}
          rotation={[0, i * 0.12, -0.23]}
        />
      ))}
      <Curve
        points={[
          [-0.37, 2.37, 0],
          [-0.11, 2.7, 0],
          [-0.13, 3.03, 0],
          [0.18, 3.18, 0],
        ]}
        radius={0.23}
        color={cream}
      />
      <group position={[0, nod, 0]}>
        <Ball at={[0.25, 3.24, 0]} scale={[0.41, 0.36, 0.32]} color={cream} />
        <Beak />
        {[-1, 1].map((side) => (
          <group key={side}>
            <Ball
              at={[0.37, 3.3, side * 0.272]}
              scale={[0.14, 0.145, 0.065]}
              color="#fffdf5"
            />
            <Ball
              at={[0.42, 3.31, side * 0.322]}
              scale={[0.054, 0.072 * Math.max(0.08, blink), 0.029]}
              color="#263a36"
            />
            <Ball
              at={[0.43, 3.334, side * 0.346]}
              scale={[0.015, 0.017 * blink, 0.01]}
              color="#ffffff"
            />
            <Ball
              at={[0.26, 3.12, side * 0.295]}
              scale={[0.087, 0.041, 0.013]}
              color="#edc6ab"
            />
            <Curve
              points={[
                [0.29, 3.45, side * 0.29],
                [0.36, 3.47, side * 0.29],
                [0.46, 3.45, side * 0.27],
              ]}
              radius={0.015}
              color="#c6c1a9"
            />
          </group>
        ))}
        <mesh position={[0.21, 3.41, 0]} castShadow>
          <sphereGeometry
            args={[0.405, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2]}
          />
          <meshStandardMaterial color="#438879" roughness={0.72} />
        </mesh>
        <mesh
          position={[0.21, 3.43, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <torusGeometry args={[0.398, 0.024, 12, 48]} />
          <meshStandardMaterial color="#286959" />
        </mesh>
        <Ball
          at={[0.21, 3.8, 0]}
          scale={[0.047, 0.027, 0.047]}
          color="#e6b975"
        />
        <Curve
          points={[
            [0.23, 3.44, 0.324],
            [0.11, 3.0, 0.2],
            [0.27, 2.97, -0.16],
            [0.23, 3.44, -0.324],
          ]}
          radius={0.016}
          color="#826c4a"
        />
      </group>
      {[-1, 1].map((side) => (
        <group key={side}>
          <Ball
            at={[-0.7, 2.31, side * 0.4]}
            scale={[0.47, 0.34, 0.13]}
            color="#ececde"
            rotation={[0, 0, -0.34]}
          />
          <Curve
            points={[
              [-0.5, 2.4, side * 0.42],
              [-0.12, 2.25, side * 0.48],
              [0.3, 2.06, side * 0.43],
              [0.72, 1.99, side * 0.4],
            ]}
            radius={0.105}
            color={cream}
          />
          {[0, 1, 2].map((i) => (
            <Ball
              key={i}
              at={[-0.85 - i * 0.11, 2.24 + i * 0.04, side * 0.482]}
              scale={[0.25, 0.076, 0.035]}
              color="#d6dacb"
              rotation={[0, 0, -0.5]}
            />
          ))}
          <Ball
            at={[0.73, 1.99, side * 0.4]}
            scale={[0.12, 0.09, 0.12]}
            color={cream}
          />
        </group>
      ))}
      <mesh
        position={[-0.17, 2.75, 0]}
        rotation={[Math.PI / 2, 0, -0.15]}
        castShadow
      >
        <torusGeometry args={[0.24, 0.09, 16, 48]} />
        <meshStandardMaterial color={scarfColor} roughness={0.85} />
      </mesh>
      <Ball
        at={[-0.32, 2.76, 0.24]}
        scale={[0.12, 0.12, 0.11]}
        color={scarfColor}
      />
      {[0, 1].map((i) => (
        <Curve
          key={i}
          points={[
            [-0.31, 2.78, 0.25],
            [-0.69, 2.8 + 0.04 * i, 0.29],
            [-1.06, 2.92 + 0.09 * Math.sin(pedal + i), 0.28],
            [-1.46 - 0.1 * i, 2.83 + 0.08 * Math.sin(pedal + i + 1), 0.31],
          ]}
          radius={0.075 - i * 0.01}
          color={scarfColor}
        />
      ))}
      <Leg pedal={pedal} side={1} />
    </group>
  );
};
