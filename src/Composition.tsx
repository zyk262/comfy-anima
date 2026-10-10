import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Bicycle, Pelican } from "./Pelican";
import { Coast } from "./Scenery";

export type PelicanRideProps = {
  bicycleColor: string;
  scarfColor: string;
  showTitle: boolean;
};

const CameraRig: React.FC<{ phase: number }> = ({ phase }) => {
  const { camera } = useThree();
  React.useLayoutEffect(() => {
    camera.position.set(
      5.7 + 0.45 * Math.sin(phase),
      4.2 + 0.15 * Math.sin(phase),
      9.5,
    );
    camera.lookAt(0, 1.65, 0);
    camera.updateProjectionMatrix();
  }, [camera, phase]);
  return null;
};

export const PelicanRide: React.FC<PelicanRideProps> = ({
  bicycleColor,
  scarfColor,
  showTitle,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const seconds = frame / fps;
  const phase = (frame / durationInFrames) * Math.PI * 2;
  const pedal = -seconds * Math.PI * 1.5;
  const bounce = Math.sin(pedal * 2) * 0.023;
  return (
    <AbsoluteFill style={{ background: "#e7efe9" }}>
      <ThreeCanvas
        width={width}
        height={height}
        shadows
        dpr={1}
        camera={{ fov: 35, near: 0.1, far: 100, position: [5.7, 4.2, 9.5] }}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        style={{ width, height }}
      >
        <color attach="background" args={["#e7efe9"]} />
        <fog attach="fog" args={["#e7efe9", 19, 42]} />
        <CameraRig phase={phase} />
        <ambientLight intensity={1.2} />
        <hemisphereLight args={["#fff6df", "#89a59a", 1.4]} />
        <directionalLight
          position={[-3, 8, 6]}
          intensity={3.1}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-9}
          shadow-camera-right={9}
          shadow-camera-top={8}
          shadow-camera-bottom={-8}
          shadow-bias={-0.0003}
          shadow-normalBias={0.035}
        />
        <directionalLight
          position={[5, 4, -5]}
          intensity={1.8}
          color="#fff0c5"
        />
        <Coast seconds={seconds} phase={phase} />
        <group
          position={[0, bounce, 0]}
          rotation={[0.012 * Math.sin(pedal), 0, 0.01 * Math.sin(pedal)]}
        >
          <Bicycle pedal={pedal} color={bicycleColor} />
          <Pelican pedal={pedal} phase={phase} scarfColor={scarfColor} />
        </group>
      </ThreeCanvas>
      {showTitle ? (
        <>
          <div
            style={{
              position: "absolute",
              top: 76,
              left: 92,
              color: "#28544d",
            }}
          >
            <div
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 74,
                lineHeight: 1.06,
                letterSpacing: -3,
              }}
            >
              A little ride.
            </div>
            <div
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: 19,
                letterSpacing: 5,
                marginTop: 20,
              }}
            >
              THE PELICAN PEDAL CLUB
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 57,
              left: 94,
              color: "#53736a",
              fontFamily: "Arial, sans-serif",
              fontSize: 17,
              letterSpacing: 4,
            }}
          >
            SEA BREEZE. TWO WHEELS. NO HURRY.
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 55,
              right: 94,
              color: "#53736a",
              fontFamily: "Georgia, serif",
              fontSize: 25,
              fontStyle: "italic",
            }}
          >
            coastal days
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
