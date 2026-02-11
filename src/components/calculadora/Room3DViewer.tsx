import { useRef, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
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

// ── Acoustic Panel (flush against wall) ──────────────────────────
// Real dimensions: 1200×600×50mm = 1.2×0.6×0.05m
function AcousticPanel({ position, wall, color = "#5a8fbf" }: {
  position: [number, number, number];
  wall: "left" | "right" | "back" | "front";
  color?: string;
}) {
  const thickness = 0.05;
  const panelW = 0.6;
  const panelH = 1.0;

  // Orient geometry so panel face is parallel to wall
  const geo: [number, number, number] =
    wall === "left" || wall === "right"
      ? [thickness, panelH, panelW]   // thin in X
      : [panelW, panelH, thickness];  // thin in Z

  return (
    <mesh position={position}>
      <boxGeometry args={geo} />
      <meshStandardMaterial color={color} />
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(...geo)]} />
        <lineBasicMaterial color="#8ac4ff" transparent opacity={0.4} />
      </lineSegments>
    </mesh>
  );
}

// ── Bass Trap (triangular prism in corner) ───────────────────────
function BassTrap({ position, height, cornerX, cornerZ }: {
  position: [number, number, number];
  height: number;
  cornerX: number;
  cornerZ: number;
}) {
  const trapH = height * 0.75;
  const side = 0.25; // 25cm triangle side

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    // triangle pointing into the corner
    s.moveTo(0, 0);
    s.lineTo(cornerX > 0 ? -side : side, 0);
    s.lineTo(0, cornerZ > 0 ? -side : side);
    s.closePath();
    return s;
  }, [cornerX, cornerZ, side]);

  const extrudeSettings = useMemo(() => ({
    depth: trapH,
    bevelEnabled: false,
  }), [trapH]);

  return (
    <mesh
      position={[position[0], position[1] - trapH / 2, position[2]]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial color="#c76d2e" />
    </mesh>
  );
}

// ── Ceiling Cloud (suspended panel) ──────────────────────────────
function CeilingCloud({ position, ceilingH }: {
  position: [number, number, number];
  ceilingH: number;
}) {
  const cloudW = 1.2;
  const cloudD = 0.8;
  const cloudThick = 0.05;
  const gap = 0.25; // 25cm below ceiling

  const y = position[1];
  const wireH = gap;

  return (
    <group position={position}>
      {/* Panel */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[cloudW, cloudThick, cloudD]} />
        <meshStandardMaterial color="#3b82f6" transparent opacity={0.8} />
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(cloudW, cloudThick, cloudD)]} />
          <lineBasicMaterial color="#93c5fd" transparent opacity={0.4} />
        </lineSegments>
      </mesh>
      {/* Suspension wires (4 corners) */}
      {[
        [-cloudW * 0.35, -cloudD * 0.3],
        [cloudW * 0.35, -cloudD * 0.3],
        [-cloudW * 0.35, cloudD * 0.3],
        [cloudW * 0.35, cloudD * 0.3],
      ].map(([wx, wz], i) => (
        <mesh key={i} position={[wx, wireH / 2 + cloudThick / 2, wz]}>
          <cylinderGeometry args={[0.004, 0.004, wireH, 4]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      ))}
    </group>
  );
}

// ── Diffuser Skyline (flush against wall) ────────────────────────
function DiffuserSkyline({ position, wall, panelCount }: {
  position: [number, number, number];
  wall: "back" | "front";
  panelCount: number;
}) {
  const unitSize = 0.5; // 50×50cm per unit
  const maxDepth = 0.1;  // 10cm max block depth

  const blocks = useMemo(() => {
    const result: { x: number; y: number; depth: number }[] = [];
    const gridN = 7; // 7×7 skyline grid per unit
    const blockSize = unitSize / gridN;

    for (let u = 0; u < panelCount; u++) {
      const offsetX = (u - (panelCount - 1) / 2) * unitSize;
      for (let gx = 0; gx < gridN; gx++) {
        for (let gy = 0; gy < gridN; gy++) {
          // QRD-inspired depth variation
          const depth = 0.02 + Math.abs(Math.sin(gx * 1.7 + gy * 2.3 + u * 0.5)) * (maxDepth - 0.02);
          result.push({
            x: offsetX + (gx - gridN / 2) * blockSize,
            y: (gy - gridN / 2) * blockSize,
            depth,
          });
        }
      }
    }
    return result;
  }, [panelCount, unitSize, maxDepth]);

  const dirSign = wall === "back" ? 1 : -1;

  return (
    <group position={position}>
      {blocks.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, dirSign * b.depth / 2]}>
          <boxGeometry args={[0.065, 0.065, b.depth]} />
          <meshStandardMaterial color="#8B6914" />
        </mesh>
      ))}
    </group>
  );
}

// ── Baffles (vertical panels suspended from ceiling) ─────────────
function Baffle({ position }: { position: [number, number, number] }) {
  const bW = 1.2;
  const bH = 0.6;
  const bT = 0.05;

  return (
    <mesh position={position}>
      <boxGeometry args={[bW, bH, bT]} />
      <meshStandardMaterial color="#2563eb" transparent opacity={0.75} />
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(bW, bH, bT)]} />
        <lineBasicMaterial color="#93c5fd" transparent opacity={0.4} />
      </lineSegments>
    </mesh>
  );
}

// ── Room Scene ───────────────────────────────────────────────────
function RoomScene({ width, length, height, products, showProducts }: Room3DViewerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const w = width;
  const l = length;
  const h = height;
  const panelThick = 0.05;

  const gridHelper = useMemo(() => {
    const grid = new THREE.GridHelper(Math.max(w, l) * 1.2, Math.max(w, l) * 2, "#1e4a6e", "#0d2a3f");
    grid.position.y = -0.01;
    return grid;
  }, [w, l]);

  // ── Product placement based on acoustic principles ─────────
  const productElements = useMemo(() => {
    if (!showProducts || !products) return [];
    const els: JSX.Element[] = [];

    products.forEach((p) => {
      // ── WALL PANELS (first reflection points + distributed) ──
      if (p.name.includes("Painel") && !p.name.includes("Slim")) {
        const count = Math.min(p.qty, 16);
        const panelH = 1.0;
        const panelCenterY = h * 0.45; // ear-level center

        if (p.placement.includes("lateral") || p.placement.includes("Parede")) {
          // Distribute on LEFT and RIGHT walls
          // Acoustic rule: first reflection points at ~1/3 of length from listener
          const perSide = Math.ceil(count / 2);
          for (let i = 0; i < perSide; i++) {
            const z = ((i + 1) / (perSide + 1)) * l - l / 2;

            // Left wall — flush
            els.push(
              <AcousticPanel
                key={`lpanel-${i}`}
                position={[-w / 2 + panelThick / 2, panelCenterY, z]}
                wall="left"
                color="#5a8fbf"
              />
            );
            // Right wall — flush
            if (i < perSide) {
              els.push(
                <AcousticPanel
                  key={`rpanel-${i}`}
                  position={[w / 2 - panelThick / 2, panelCenterY, z]}
                  wall="right"
                  color="#5a8fbf"
                />
              );
            }
          }
        }

        if (p.placement.includes("fundo")) {
          // Back wall panels
          const backCount = Math.min(count, 6);
          for (let i = 0; i < backCount; i++) {
            const x = ((i + 1) / (backCount + 1)) * w - w / 2;
            els.push(
              <AcousticPanel
                key={`bpanel-${i}`}
                position={[x, panelCenterY, -l / 2 + panelThick / 2]}
                wall="back"
                color="#4a7faa"
              />
            );
          }
        }
      }

      // ── SLIM PANELS (thinner, on front or dividers) ──
      if (p.name.includes("Slim")) {
        const count = Math.min(p.qty, 6);
        for (let i = 0; i < count; i++) {
          const x = ((i + 1) / (count + 1)) * w - w / 2;
          els.push(
            <AcousticPanel
              key={`slim-${i}`}
              position={[x, h * 0.4, l / 2 - 0.02]}
              wall="front"
              color="#7eb8e0"
            />
          );
        }
      }

      // ── BASS TRAPS (corners, floor-to-near-ceiling) ──
      if (p.name.includes("Bass Trap")) {
        const corners: [number, number][] = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
        for (let i = 0; i < Math.min(p.qty, 4); i++) {
          const [cx, cz] = corners[i];
          els.push(
            <BassTrap
              key={`bass-${i}`}
              position={[cx * w / 2, h / 2, cz * l / 2]}
              height={h}
              cornerX={cx}
              cornerZ={cz}
            />
          );
        }
      }

      // ── CEILING CLOUDS (above listening position) ──
      if (p.name.includes("Nuvem")) {
        const count = Math.min(p.qty, 6);
        const gap = 0.25;
        for (let i = 0; i < count; i++) {
          // Distribute along length, centered on width
          const z = ((i + 1) / (count + 1)) * l - l / 2;
          els.push(
            <CeilingCloud
              key={`cloud-${i}`}
              position={[0, h - gap, z]}
              ceilingH={h}
            />
          );
        }
      }

      // ── DIFFUSERS (back wall, QRD skyline pattern) ──
      if (p.name.includes("Difusor")) {
        const unitCount = Math.min(p.qty, Math.floor(w / 0.5));
        els.push(
          <DiffuserSkyline
            key="diffuser-back"
            position={[0, h * 0.5, -l / 2 + 0.01]}
            wall="back"
            panelCount={unitCount}
          />
        );
      }

      // ── BAFFLES (suspended vertical panels) ──
      if (p.name.includes("Baffles")) {
        const count = Math.min(p.qty, 10);
        const baffleGap = 0.2; // 20cm below ceiling
        for (let i = 0; i < count; i++) {
          const z = ((i + 1) / (count + 1)) * l - l / 2;
          els.push(
            <Baffle
              key={`baffle-${i}`}
              position={[0, h - baffleGap - 0.3, z]}
            />
          );
        }
      }
    });

    return els;
  }, [products, showProducts, w, l, h, panelThick]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={0.7} castShadow />
      <pointLight position={[0, h, 0]} intensity={0.3} color="#60a5fa" />
      <hemisphereLight args={["#b1e1ff", "#0a1628", 0.3]} />

      <group ref={groupRef}>
        {/* Floor */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[w, l]} />
          <meshStandardMaterial color="#0f1d2f" side={THREE.DoubleSide} />
        </mesh>
        <lineSegments position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(w, l)]} />
          <lineBasicMaterial color="#1d6fb8" transparent opacity={0.6} />
        </lineSegments>

        {/* Back wall */}
        <mesh position={[0, h / 2, -l / 2]}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial color="#141f30" transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
        <lineSegments position={[0, h / 2, -l / 2]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(w, h)]} />
          <lineBasicMaterial color="#1d6fb8" transparent opacity={0.4} />
        </lineSegments>

        {/* Left wall */}
        <mesh position={[-w / 2, h / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[l, h]} />
          <meshStandardMaterial color="#141f30" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
        <lineSegments position={[-w / 2, h / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(l, h)]} />
          <lineBasicMaterial color="#1d6fb8" transparent opacity={0.3} />
        </lineSegments>

        {/* Right wall */}
        <mesh position={[w / 2, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[l, h]} />
          <meshStandardMaterial color="#141f30" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
        <lineSegments position={[w / 2, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(l, h)]} />
          <lineBasicMaterial color="#1d6fb8" transparent opacity={0.3} />
        </lineSegments>

        {/* Front wall */}
        <mesh position={[0, h / 2, l / 2]}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial color="#141f30" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
        <lineSegments position={[0, h / 2, l / 2]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(w, h)]} />
          <lineBasicMaterial color="#1d6fb8" transparent opacity={0.15} />
        </lineSegments>

        {/* Ceiling wireframe */}
        <lineSegments position={[0, h, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(w, l)]} />
          <lineBasicMaterial color="#1d6fb8" transparent opacity={0.2} />
        </lineSegments>

        {/* Vertical corner edges */}
        {[[-w / 2, -l / 2], [w / 2, -l / 2], [-w / 2, l / 2], [w / 2, l / 2]].map(([x, z], i) => (
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
        {productElements}

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
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-3 text-[10px]">
        {showProducts && products && products.length > 0 && (
          <>
            {products.some(p => p.name.includes("Painel")) && (
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm" style={{ background: "#5a8fbf" }} />
                <span className="text-blue-300/70">Painéis</span>
              </div>
            )}
            {products.some(p => p.name.includes("Bass")) && (
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm" style={{ background: "#c76d2e" }} />
                <span className="text-blue-300/70">Bass Traps</span>
              </div>
            )}
            {products.some(p => p.name.includes("Difusor")) && (
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm" style={{ background: "#8B6914" }} />
                <span className="text-blue-300/70">Difusores</span>
              </div>
            )}
            {products.some(p => p.name.includes("Nuvem")) && (
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm" style={{ background: "#3b82f6" }} />
                <span className="text-blue-300/70">Nuvens</span>
              </div>
            )}
            {products.some(p => p.name.includes("Baffles")) && (
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm" style={{ background: "#2563eb" }} />
                <span className="text-blue-300/70">Baffles</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="absolute top-3 right-3 text-[10px] text-blue-400/50 font-mono">
        3D • Arraste para girar
      </div>
    </div>
  );
}
