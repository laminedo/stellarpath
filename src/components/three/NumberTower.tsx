import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface NumberTowerProps {
  numbers: { label: string; value: number; master?: boolean }[];
  selectedIndex?: number | null;
  onSelect?: (index: number | null) => void;
}

function NumberBlock({
  label,
  value,
  index,
  total,
  master,
  selected,
  dimmed,
  onSelect,
}: {
  label: string;
  value: number;
  index: number;
  total: number;
  master?: boolean;
  selected: boolean;
  dimmed: boolean;
  onSelect: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const phase = index * 1.3;
  const spacing = 2.2;
  const x = (index - (total - 1) / 2) * spacing;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 1.2 + phase) * 0.25;
    const targetScale = selected ? 1.35 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
    if (selected) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.1);
    } else {
      groupRef.current.rotation.y += 0.004;
    }
  });

  const color = master ? '#fbbf24' : '#8b5cf6';

  return (
    <group ref={groupRef} position={[x, 0, 0]}>
      <mesh onClick={onSelect} onPointerOver={() => (document.body.style.cursor = 'pointer')} onPointerOut={() => (document.body.style.cursor = 'auto')}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={dimmed ? 0.12 : selected ? 0.75 : 0.4}
          roughness={0.15}
          transmission={0.5}
          emissive={color}
          emissiveIntensity={dimmed ? 0.05 : selected ? 0.8 : 0.25}
        />
      </mesh>
      <Text position={[0, 0, 0.7]} fontSize={0.55} color="#ffffff" anchorX="center" anchorY="middle" fillOpacity={dimmed ? 0.3 : 1}>
        {String(value)}
      </Text>
      <Text position={[0, -0.95, 0]} fontSize={0.18} color="#a5b4fc" anchorX="center" anchorY="middle" fillOpacity={dimmed ? 0.3 : 0.9}>
        {label}
      </Text>
    </group>
  );
}

export function NumberTower({ numbers, selectedIndex = null, onSelect }: NumberTowerProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  void hovered;
  void setHovered;

  return (
    <div className="h-72 w-full md:h-80" aria-hidden="true">
      <Canvas camera={{ position: [0, 1, 8], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 6, 6]} intensity={1} />
        {numbers.map((n, i) => (
          <NumberBlock
            key={n.label}
            label={n.label}
            value={n.value}
            master={n.master}
            index={i}
            total={numbers.length}
            selected={selectedIndex === i}
            dimmed={selectedIndex !== null && selectedIndex !== i}
            onSelect={() => onSelect?.(selectedIndex === i ? null : i)}
          />
        ))}
      </Canvas>
    </div>
  );
}
