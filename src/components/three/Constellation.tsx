import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Line } from '@react-three/drei';
import * as THREE from 'three';

interface ConstellationProps {
  score: number; // 1-99; closer orbs = higher score
  nameA: string;
  nameB: string;
  colorA?: string;
  colorB?: string;
}

function PersonOrb({ position, color, name }: { position: [number, number, number]; color: string; name: string }) {
  const orbitRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (orbitRef.current) orbitRef.current.rotation.y = clock.getElapsedTime() * 0.8;
  });

  const particles = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return [Math.cos(a) * 0.8, (Math.random() - 0.5) * 0.4, Math.sin(a) * 0.8] as [number, number, number];
    });
  }, []);

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.6} transparent opacity={0.9} />
      </mesh>
      <pointLight color={color} intensity={3} distance={6} />
      <group ref={orbitRef}>
        {particles.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color={color} />
          </mesh>
        ))}
      </group>
      <Text position={[0, 0.95, 0]} fontSize={0.28} color="#ffffff" anchorX="center" anchorY="middle">
        {name}
      </Text>
    </group>
  );
}

function PulsingLine({ a, b, score }: { a: THREE.Vector3; b: THREE.Vector3; score: number }) {
  const materialRef = useRef<any>(null);

  const points = useMemo(() => {
    const mid = a.clone().lerp(b, 0.5).add(new THREE.Vector3(0, 0.4, 0));
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    return curve.getPoints(48);
  }, [a, b]);

  useFrame(({ clock }) => {
    const mat = materialRef.current?.material ?? materialRef.current;
    if (mat && 'opacity' in mat) {
      mat.opacity = 0.35 + Math.abs(Math.sin(clock.getElapsedTime() * 2)) * 0.6;
    }
  });

  const color = score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#f43f5e';

  return (
    <Line points={points} color={color} lineWidth={2} transparent ref={materialRef} opacity={0.7} />
  );
}

export function Constellation({ score, nameA, nameB, colorA = '#8b5cf6', colorB = '#f43f5e' }: ConstellationProps) {
  // distance 5 (low) .. 1.8 (high)
  const distance = 5 - (score / 99) * 3.2;
  const posA = useMemo(() => new THREE.Vector3(-distance / 2, 0, 0), [distance]);
  const posB = useMemo(() => new THREE.Vector3(distance / 2, 0, 0), [distance]);

  return (
    <div className="h-64 w-full md:h-80" aria-hidden="true">
      <Canvas camera={{ position: [0, 1.2, 6], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.3} />
        <PersonOrb position={[posA.x, 0, 0]} color={colorA} name={nameA} />
        <PersonOrb position={[posB.x, 0, 0]} color={colorB} name={nameB} />
        <PulsingLine a={posA} b={posB} score={score} />
      </Canvas>
    </div>
  );
}
