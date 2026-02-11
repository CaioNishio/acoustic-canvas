import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, RoundedBox, Environment } from "@react-three/drei";
import * as THREE from "three";

interface ProductPlacement {
  name: string;
  placement: string;
  qty: number;
  slug: string;
}

interface Room3DViewerProps {
  width: number;
  length: number;
  height: number;
  products?: ProductPlacement[];
  showProducts: boolean;
}

function WallPanel({ position, rotation, size, color }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number, number];
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef} position={position} rotation={rotation || [0, 0, 0]}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} transparent opacity={0.85} />
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(...size)]} />
        <lineBasicMaterial color="#4a9eff" transparent opacity={0.5} />
      </lineSegments>
    </mesh>
  );
}

function BassTrap({ position, height }: { position: [number, number, number]; height: number }) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[0.15, 0.15, height * 0.7, 8]} />
      <meshStandardMaterial color="#e8733a" transparent opacity={0.8} />
    </mesh>
  );
}

function CeilingCloud({ position, size }: { position: [number, number, number]; size: [number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[size[0], 0.05, size[1]]} />
      <meshStandardMaterial color="#3b82f6" transparent opacity={0.7} />
      {/* suspension wires */}
      {[[-size[0] / 3, 0, -size[1] / 3], [size[0] / 3, 0, size[1] / 3]].map((offset, i) => (
        <mesh key={i} position={[offset[0], 0.15, offset[2]]}>
          <cylinderGeometry args={[0.005, 0.005, 0.3, 4]} />
          <meshStandardMaterial color="#888" />
        </mesh>
      ))}
    </mesh>
  );
}

function DiffuserPanel({ position, rotation, width }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  width: number;
}) {
  const blocks = useMemo(() => {
    const result: { x: number; h: number }[] = [];
    const count = Math.floor(width / 0.06);
    for (let i = 0; i < count; i++) {
      result.push({ x: (i - count / 2) * 0.06, h: 0.03 + Math.random() * 0.07 });
    }
    return result;
  }, [width]);

  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      {blocks.map((b, i) => (
        <mesh key={i} position={[b.x, 0, 0]}>
          <boxGeometry args={[0.05, 0.5, b.h]} />
          <meshStandardMaterial color="#b8860b" />
        </mesh>
      ))}
    </group>
  );
}

function BafflePanel({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} rotation={[0, 0, Math.PI / 2]}>
      <boxGeometry args={[0.05, 0.6, 1.2]} />
      <meshStandardMaterial color="#2563eb" transparent opacity={0.7} />
    </mesh>
  );
}

function RoomScene({ width, length, height, products, showProducts }: Room3DViewerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const w = width;
  const l = length;
  const h = height;

  // Floor grid
  const gridHelper = useMemo(() => {
    const grid = new THREE.GridHelper(Math.max(w, l) * 1.2, Math.max(w, l) * 2, "#1e4a6e", "#0d2a3f");
    grid.position.y = -0.01;
    return grid;
  }, [w, l]);

  // Product placements
  const panels = useMemo(() => {
    if (!showProducts || !products) return [];
    const elements: JSX.Element[] = [];

    products.forEach((p) => {
      if (p.name.includes("Painel") && !p.name.includes("Slim") && p.placement.includes("Parede")) {
        // Wall panels on side walls
        const count = Math.min(p.qty, 12);
        for (let i = 0; i < count; i++) {
          const side = i % 2 === 0 ? -1 : 1;
          const along = ((Math.floor(i / 2) + 1) / (Math.floor(count / 2) + 1)) * l - l / 2;
          elements.push(
            <WallPanel
              key={`panel-${i}`}
              position={[side * w / 2, h * 0.45, along]}
              rotation={[0, side > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}
              size={[0.05, h * 0.35, 0.6]}
              color="#1d6fb8"
            />
          );
        }
      }

      if (p.name.includes("Bass Trap")) {
        const corners: [number, number][] = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
        for (let i = 0; i < Math.min(p.qty, 4); i++) {
          const [cx, cz] = corners[i];
          elements.push(
            <BassTrap
              key={`bass-${i}`}
              position={[cx * (w / 2 - 0.1), h * 0.35, cz * (l / 2 - 0.1)]}
              height={h}
            />
          );
        }
      }

      if (p.name.includes("Nuvem")) {
        const count = Math.min(p.qty, 4);
        for (let i = 0; i < count; i++) {
          const x = ((i + 1) / (count + 1)) * w - w / 2;
          elements.push(
            <CeilingCloud
              key={`cloud-${i}`}
              position={[x, h - 0.1, 0]}
              size={[0.8, 1.0]}
            />
          );
        }
      }

      if (p.name.includes("Difusor")) {
        elements.push(
          <DiffuserPanel
            key="diffuser"
            position={[0, h * 0.45, -l / 2 + 0.05]}
            width={w * 0.8}
          />
        );
      }

      if (p.name.includes("Baffles")) {
        const count = Math.min(p.qty, 8);
        for (let i = 0; i < count; i++) {
          const x = ((i + 1) / (count + 1)) * w - w / 2;
          elements.push(
            <BafflePanel
              key={`baffle-${i}`}
              position={[x, h - 0.15, 0]}
            />
          );
        }
      }

      if (p.name.includes("Slim")) {
        const count = Math.min(p.qty, 4);
        for (let i = 0; i < count; i++) {
          const z = ((i + 1) / (count + 1)) * l - l / 2;
          elements.push(
            <WallPanel
              key={`slim-${i}`}
              position={[0, h * 0.4, z]}
              size={[0.03, h * 0.3, 0.6]}
              color="#60a5fa"
            />
          );
        }
      }
    });

    return elements;
  }, [products, showProducts, w, l, h]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={0.6} castShadow />
      <pointLight position={[0, h, 0]} intensity={0.3} color="#60a5fa" />

      <group ref={groupRef}>
        {/* Floor */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[w, l]} />
          <meshStandardMaterial color="#0a1628" transparent opacity={0.9} side={THREE.DoubleSide} />
        </mesh>

        {/* Floor edge glow */}
        <lineSegments position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(w, l)]} />
          <lineBasicMaterial color="#1d6fb8" transparent opacity={0.6} />
        </lineSegments>

        {/* Walls - semi transparent */}
        {/* Back wall */}
        <mesh position={[0, h / 2, -l / 2]}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial color="#0d1f33" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
        <lineSegments position={[0, h / 2, -l / 2]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(w, h)]} />
          <lineBasicMaterial color="#1d6fb8" transparent opacity={0.4} />
        </lineSegments>

        {/* Left wall */}
        <mesh position={[-w / 2, h / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[l, h]} />
          <meshStandardMaterial color="#0d1f33" transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
        <lineSegments position={[-w / 2, h / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(l, h)]} />
          <lineBasicMaterial color="#1d6fb8" transparent opacity={0.3} />
        </lineSegments>

        {/* Right wall */}
        <mesh position={[w / 2, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[l, h]} />
          <meshStandardMaterial color="#0d1f33" transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
        <lineSegments position={[w / 2, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(l, h)]} />
          <lineBasicMaterial color="#1d6fb8" transparent opacity={0.3} />
        </lineSegments>

        {/* Front wall (partially visible) */}
        <mesh position={[0, h / 2, l / 2]}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial color="#0d1f33" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
        <lineSegments position={[0, h / 2, l / 2]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(w, h)]} />
          <lineBasicMaterial color="#1d6fb8" transparent opacity={0.2} />
        </lineSegments>

        {/* Ceiling wireframe */}
        <lineSegments position={[0, h, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(w, l)]} />
          <lineBasicMaterial color="#1d6fb8" transparent opacity={0.25} />
        </lineSegments>

        {/* Vertical corner edges */}
        {[[-w/2, -l/2], [w/2, -l/2], [-w/2, l/2], [w/2, l/2]].map(([x, z], i) => (
          <line key={`edge-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([x, 0, z, x, h, z])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#1d6fb8" transparent opacity={0.4} />
          </line>
        ))}

        {/* Dimension labels */}
        <Text position={[0, -0.15, l / 2 + 0.3]} fontSize={0.15} color="#60a5fa" anchorX="center">
          {w.toFixed(1)}m
        </Text>
        <Text position={[w / 2 + 0.3, -0.15, 0]} fontSize={0.15} color="#60a5fa" anchorX="center" rotation={[0, -Math.PI / 2, 0]}>
          {l.toFixed(1)}m
        </Text>
        <Text position={[w / 2 + 0.3, h / 2, -l / 2]} fontSize={0.15} color="#60a5fa" anchorX="center" rotation={[0, -Math.PI / 4, 0]}>
          {h.toFixed(1)}m
        </Text>

        {/* Products */}
        {panels}

        <primitive object={gridHelper} />
      </group>

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={1}
        maxDistance={Math.max(w, l, h) * 4}
        autoRotate
        autoRotateSpeed={0.5}
        target={[0, h / 2, 0]}
      />
    </>
  );
}

export default function Room3DViewer({ width, length, height, products, showProducts }: Room3DViewerProps) {
  const maxDim = Math.max(width, length, height);
  const camDist = maxDim * 2;

  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #050d1a 0%, #0a1628 50%, #0d1f33 100%)" }}>
      <Canvas
        camera={{ position: [camDist * 0.7, camDist * 0.5, camDist * 0.7], fov: 50, near: 0.1, far: 100 }}
        shadows
      >
        <RoomScene width={width} length={length} height={height} products={products} showProducts={showProducts} />
      </Canvas>

      {/* Overlay legend */}
      <div className="absolute bottom-3 left-3 flex gap-3 text-[10px]">
        {showProducts && products && products.length > 0 && (
          <>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm" style={{ background: "#1d6fb8" }} />
              <span className="text-blue-300/70">Painéis</span>
            </div>
            {products.some(p => p.name.includes("Bass")) && (
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: "#e8733a" }} />
                <span className="text-blue-300/70">Bass Traps</span>
              </div>
            )}
            {products.some(p => p.name.includes("Difusor")) && (
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm" style={{ background: "#b8860b" }} />
                <span className="text-blue-300/70">Difusores</span>
              </div>
            )}
            {products.some(p => p.name.includes("Nuvem") || p.name.includes("Baffles")) && (
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm" style={{ background: "#3b82f6" }} />
                <span className="text-blue-300/70">Teto</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Corner label */}
      <div className="absolute top-3 right-3 text-[10px] text-blue-400/50 font-mono">
        3D • Arraste para girar
      </div>
    </div>
  );
}
