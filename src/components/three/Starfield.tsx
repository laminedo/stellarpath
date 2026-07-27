import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Stars({ count = 3000 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse } = useThree();

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#c4b5fd'),
      new THREE.Color('#fbbf24'),
      new THREE.Color('#93c5fd'),
    ];
    for (let i = 0; i < count; i++) {
      const r = 40 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.01;
    pointsRef.current.rotation.x += delta * 0.004;
    // subtle mouse parallax
    pointsRef.current.rotation.y += mouse.x * delta * 0.05;
    pointsRef.current.rotation.x += mouse.y * delta * 0.03;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.35} vertexColors transparent opacity={0.9} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function ShootingStar() {
  const ref = useRef<THREE.Mesh>(null);
  const state = useRef({ t: 0, active: false, delay: Math.random() * 6 });

  const { start, dir } = useMemo(() => {
    const start = new THREE.Vector3(
      (Math.random() - 0.5) * 60,
      20 + Math.random() * 20,
      -20 - Math.random() * 20
    );
    const dir = new THREE.Vector3(-0.6 + Math.random() * 0.3, -0.4, 0).normalize();
    return { start, dir };
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const s = state.current;
    s.t += delta;
    if (!s.active && s.t > s.delay) {
      s.active = true;
      s.t = 0;
    }
    if (s.active) {
      const progress = s.t / 1.2;
      if (progress >= 1) {
        s.active = false;
        s.t = 0;
        s.delay = 4 + Math.random() * 8;
        ref.current.visible = false;
        return;
      }
      ref.current.visible = true;
      const pos = start.clone().addScaledVector(dir, progress * 50);
      ref.current.position.copy(pos);
      ref.current.lookAt(pos.clone().add(dir));
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 1 - progress;
    } else {
      ref.current.visible = false;
    }
  });

  return (
    <mesh ref={ref} visible={false}>
      <cylinderGeometry args={[0.03, 0.03, 4, 4]} />
      <meshBasicMaterial color="#e0e7ff" transparent opacity={0} />
    </mesh>
  );
}

export function Starfield() {
  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #1a0a2e 100%)' }}
      >
        <Stars />
        <ShootingStar />
        <ShootingStar />
      </Canvas>
    </div>
  );
}
