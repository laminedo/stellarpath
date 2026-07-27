import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CanvasLabel } from './CanvasLabel';
import type { ZodiacSign } from '../../engines/stellarpath-engines';
import { ZODIAC_SYMBOLS } from '../../utils/helpers';

const SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const ELEMENT_COLORS: Record<ZodiacSign, string> = {
  Aries: '#f97316', Leo: '#f97316', Sagittarius: '#f97316',
  Taurus: '#84cc16', Virgo: '#84cc16', Capricorn: '#84cc16',
  Gemini: '#fbbf24', Libra: '#fbbf24', Aquarius: '#fbbf24',
  Cancer: '#3b82f6', Scorpio: '#3b82f6', Pisces: '#8b5cf6',
};

interface WheelProps {
  selectedSign?: ZodiacSign;
}

function Wheel({ selectedSign }: WheelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useMemo(() => {
    if (!selectedSign) return null;
    const idx = SIGNS.indexOf(selectedSign);
    return -(idx / 12) * Math.PI * 2;
  }, [selectedSign]);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    if (targetRotation === null) {
      groupRef.current.rotation.y += delta * 0.15;
    } else {
      // spin to highlight selected sign (front = angle 0)
      const current = groupRef.current.rotation.y;
      const diff = ((targetRotation - current + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      groupRef.current.rotation.y += diff * delta * 2.5;
    }
    groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.12 + 0.35;
  });

  return (
    <group ref={groupRef}>
      {/* main ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.6, 0.045, 16, 128]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.5} metalness={0.8} roughness={0.3} />
      </mesh>
      {SIGNS.map((sign, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const x = Math.cos(angle) * 2.6;
        const z = -Math.sin(angle) * 2.6;
        const selected = sign === selectedSign;
        const color = ELEMENT_COLORS[sign];
        return (
          <group key={sign} position={[x, 0, z]}>
            <mesh>
              <sphereGeometry args={[selected ? 0.32 : 0.2, 24, 24]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={selected ? 2.2 : 0.7}
                metalness={0.4}
                roughness={0.3}
              />
            </mesh>
            {selected && (
              <pointLight color={color} intensity={4} distance={5} />
            )}
            <CanvasLabel
              text={ZODIAC_SYMBOLS[sign]}
              position={[0, 0.55, 0]}
              size={selected ? 0.42 : 0.3}
              color={selected ? '#ffffff' : color}
            />
          </group>
        );
      })}
    </group>
  );
}

export function ZodiacWheel({ selectedSign }: WheelProps) {
  return (
    <div className="h-72 w-full md:h-96" aria-hidden="true">
      <Canvas camera={{ position: [0, 3, 6.5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <Wheel selectedSign={selectedSign} />
      </Canvas>
    </div>
  );
}
