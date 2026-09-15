import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

type WaveKind = 'absorb' | 'diffuse' | 'attenuate' | 'block';

const bands: Array<{ y: number; kind: WaveKind; delay: number }> = [
  { y: 1.18, kind: 'absorb', delay: 0 },
  { y: 0.4, kind: 'diffuse', delay: 0.55 },
  { y: -0.4, kind: 'attenuate', delay: 1.1 },
  { y: -1.18, kind: 'block', delay: 1.65 },
];

function WaveBand({ y, kind, delay, active }: { y: number; kind: WaveKind; delay: number; active: boolean }) {
  const geometry = useRef<THREE.BufferGeometry>(null);
  const count = 140;
  const positions = useMemo(() => new Float32Array(count * 3), []);

  useFrame(({ clock }) => {
    const attribute = geometry.current?.getAttribute('position') as THREE.BufferAttribute | undefined;
    if (!attribute) return;
    const time = active ? clock.getElapsedTime() : 0;
    for (let index = 0; index < count; index += 1) {
      const progress = index / (count - 1);
      const x = -3.6 + progress * 7.2;
      const phase = progress * 13 + time * 2.15 + delay;
      const isAfterProduct = progress > 0.54;
      const baseAmplitude = 0.12;
      const amplitude = kind === 'absorb' && isAfterProduct ? baseAmplitude * 0.2
        : kind === 'attenuate' && isAfterProduct ? baseAmplitude * 0.38
          : kind === 'block' && isAfterProduct ? 0
            : baseAmplitude;
      const spread = kind === 'diffuse' && isAfterProduct ? (progress - 0.54) * 1.08 : 0;
      const direction = Math.sin(delay * 5) > 0 ? 1 : -1;
      attribute.setXYZ(index, x, y + Math.sin(phase) * amplitude + spread * direction, 0);
    }
    attribute.needsUpdate = true;
  });

  return <line>
    <bufferGeometry ref={geometry}><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
    <lineBasicMaterial color="#56a6ff" transparent opacity={kind === 'block' ? 0.33 : 0.54} blending={THREE.AdditiveBlending} />
  </line>;
}

function WaveField({ active }: { active: boolean }) {
  return <group>{bands.flatMap((band) => [-0.07, 0, 0.07].map((offset, index) => <WaveBand key={`${band.kind}-${offset}`} {...band} y={band.y + offset} delay={band.delay + index * 0.16} active={active} />))}</group>;
}

export default function HeroAcousticWaveField({ active }: { active: boolean }) {
  return <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
    <Canvas dpr={[1, 1.2]} gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }} camera={{ position: [0, 0, 5], fov: 42 }}>
      <WaveField active={active} />
    </Canvas>
  </div>;
}
