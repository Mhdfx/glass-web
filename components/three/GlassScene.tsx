"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  Lightformer,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import * as THREE from "three";

/**
 * Scène 3D du hero : prisme de verre en lévitation qui capte la lumière
 * et réagit doucement au mouvement de la souris.
 * Une seule scène, volontairement sobre — l'effet doit rester subtil.
 */

function GlassPrism() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    // eventSource=document.body : le pointeur est suivi même si le canvas
    // est en pointer-events:none
    const p = state.pointer;
    // Rotation lente continue + inclinaison vers la souris (amortie)
    group.current.rotation.y += delta * 0.25;
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      p.y * 0.25,
      2.5,
      delta,
    );
    group.current.rotation.z = THREE.MathUtils.damp(
      group.current.rotation.z,
      -p.x * 0.2,
      2.5,
      delta,
    );
  });

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.9}>
      <group ref={group}>
        {/* Prisme principal — verre taillé */}
        <mesh>
          <octahedronGeometry args={[1.35, 0]} />
          <MeshTransmissionMaterial
            transmission={1}
            thickness={0.9}
            roughness={0.06}
            ior={1.5}
            chromaticAberration={0.05}
            anisotropicBlur={0.2}
            distortion={0.12}
            distortionScale={0.3}
            temporalDistortion={0.08}
            samples={4}
            resolution={384}
            color="#f4ead8"
            attenuationColor="#c9a66b"
            attenuationDistance={2.5}
          />
        </mesh>
        {/* Arêtes laiton — écho aux cadres du catalogue */}
        <lineSegments>
          <edgesGeometry args={[new THREE.OctahedronGeometry(1.36, 0)]} />
          <lineBasicMaterial color="#c9a66b" transparent opacity={0.55} />
        </lineSegments>
      </group>
    </Float>
  );
}

export default function GlassScene({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      // Rendu stoppé net dès que le hero sort de l'écran — le reste de
      // la page garde tout le budget de frame pour le scroll
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.5], fov: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
      aria-hidden="true"
    >
      <GlassPrism />
      {/* Éclairage généré localement — aucun asset externe chargé */}
      <Environment resolution={256}>
        <Lightformer
          position={[4, 2, 3]}
          scale={[6, 3, 1]}
          intensity={2.2}
          color="#f5e9d0"
        />
        <Lightformer
          position={[-5, -1, 2]}
          scale={[5, 2, 1]}
          intensity={1.4}
          color="#c9a66b"
        />
        <Lightformer
          position={[0, 5, -4]}
          scale={[8, 3, 1]}
          intensity={0.9}
          color="#ffffff"
        />
      </Environment>
      <ambientLight intensity={0.25} />
    </Canvas>
  );
}
