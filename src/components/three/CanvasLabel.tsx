import { useMemo } from 'react';
import * as THREE from 'three';

interface CanvasLabelProps {
  text: string;
  position?: [number, number, number];
  /** world height of the label */
  size?: number;
  color?: string;
  opacity?: number;
}

/**
 * Lightweight text label rendered to a canvas texture on a camera-facing sprite.
 * No external font downloads (unlike troika/drei Text) — fully offline.
 */
export function CanvasLabel({ text, position = [0, 0, 0], size = 0.3, color = '#ffffff', opacity = 1 }: CanvasLabelProps) {
  const { texture, aspect } = useMemo(() => {
    const fontSize = 96;
    const font = `600 ${fontSize}px Georgia, 'Times New Roman', serif`;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    ctx.font = font;
    const w = Math.max(2, Math.ceil(ctx.measureText(text).width) + fontSize * 0.3);
    const h = Math.ceil(fontSize * 1.35);
    canvas.width = w;
    canvas.height = h;
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = color;
    ctx.shadowBlur = fontSize * 0.18;
    ctx.fillText(text, w / 2, h / 2);
    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 4;
    return { texture, aspect: w / h };
  }, [text, color]);

  return (
    <sprite position={position} scale={[size * aspect, size, 1]}>
      <spriteMaterial map={texture} transparent opacity={opacity} depthWrite={false} />
    </sprite>
  );
}
