import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface OrbProps {
  score: number; // 0-100
  color: string;
  biorhythmPhase: number; // -1 to 1, pulses with composite biorhythm
}

function Orb({ score, color, biorhythmPhase }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const baseScale = 1 + (score / 100) * 0.3;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * 2 + biorhythmPhase * Math.PI) * 0.06;
    meshRef.current.scale.setScalar(baseScale * pulse);
    if (lightRef.current) {
      lightRef.current.intensity = 1.5 + (score / 100) * 4 + Math.sin(t * 2) * 0.4;
    }
  });

  return (
    <>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[1.6, 64, 64]} />
          <meshPhysicalMaterial
            transmission={0.9}
            roughness={0.1}
            ior={1.5}
            thickness={1.2}
            color={color}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
        <pointLight ref={lightRef} position={[0, 0, 0]} color={color} intensity={3} distance={12} />
      </Float>
      {/* inner core */}
      <mesh>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} />
      </mesh>
    </>
  );
}

export function EnergyOrb({ score, color, biorhythmPhase }: OrbProps) {
  return (
    <div className="h-64 w-full md:h-80" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} dpr={[1, 2]} frameloop="always">
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 4, 6]} intensity={1.4} />
        <directionalLight position={[-4, -2, -4]} intensity={0.5} color="#8b5cf6" />
        <Orb score={score} color={color} biorhythmPhase={biorhythmPhase} />
      </Canvas>
    </div>
  );
}
