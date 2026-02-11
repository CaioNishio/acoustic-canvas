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

export type LayoutPreset = "simetrico" | "reflexao" | "hibrido";

interface Room3DViewerProps {
  width: number;
  length: number;
  height: number;
  products?: ProductPlacement[];
  showProducts: boolean;
  layout?: LayoutPreset;
  hasMonitors?: boolean;
  hasSub?: boolean;
}

// ── Acoustic Panel (flush against wall) ──
function AcousticPanel({ position, wall, color = "#5a8fbf", w = 0.6, h = 1.0 }: {
  position: [number, number, number];
  wall: "left" | "right" | "back" | "front";
  color?: string;
  w?: number;
  h?: number;
}) {
  const t = 0.05;
  const geo: [number, number, number] =
    wall === "left" || wall === "right"
      ? [t, h, w] : [w, h, t];

  return (
    <mesh position={position}>
      <boxGeometry args={geo} />
      <meshStandardMaterial color={color} />
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(...geo)]} />
        <lineBasicMaterial color="#8ac4ff" transparent opacity={0.35} />
      </lineSegments>
    </mesh>
  );
}

// ── Bass Trap (triangular prism in corner) ──
function BassTrap({ position, height, cornerX, cornerZ }: {
  position: [number, number, number]; height: number; cornerX: number; cornerZ: number;
}) {
  const trapH = height * 0.75;
  const side = 0.25;
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(cornerX > 0 ? -side : side, 0);
    s.lineTo(0, cornerZ > 0 ? -side : side);
    s.closePath();
    return s;
  }, [cornerX, cornerZ, side]);

  return (
    <mesh position={[position[0], position[1] - trapH / 2, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <extrudeGeometry args={[shape, { depth: trapH, bevelEnabled: false }]} />
      <meshStandardMaterial color="#c76d2e" />
    </mesh>
  );
}

// ── Ceiling Cloud ──
function CeilingCloud({ position }: { position: [number, number, number] }) {
  const cW = 1.2, cD = 0.8, cT = 0.05, gap = 0.25;
  return (
    <group position={position}>
      <mesh><boxGeometry args={[cW, cT, cD]} /><meshStandardMaterial color="#3b82f6" transparent opacity={0.8} />
        <lineSegments><edgesGeometry args={[new THREE.BoxGeometry(cW, cT, cD)]} /><lineBasicMaterial color="#93c5fd" transparent opacity={0.4} /></lineSegments>
      </mesh>
      {[[-cW * 0.35, -cD * 0.3], [cW * 0.35, -cD * 0.3], [-cW * 0.35, cD * 0.3], [cW * 0.35, cD * 0.3]].map(([wx, wz], i) => (
        <mesh key={i} position={[wx, gap / 2 + cT / 2, wz]}>
          <cylinderGeometry args={[0.004, 0.004, gap, 4]} /><meshStandardMaterial color="#94a3b8" />
        </mesh>
      ))}
    </group>
  );
}

// ── Diffuser Skyline ──
function DiffuserSkyline({ position, panelCount }: { position: [number, number, number]; panelCount: number }) {
  const unitSize = 0.5, maxD = 0.1;
  const blocks = useMemo(() => {
    const r: { x: number; y: number; d: number }[] = [];
    const g = 7, bs = unitSize / g;
    for (let u = 0; u < panelCount; u++) {
      const ox = (u - (panelCount - 1) / 2) * unitSize;
      for (let gx = 0; gx < g; gx++) for (let gy = 0; gy < g; gy++) {
        r.push({ x: ox + (gx - g / 2) * bs, y: (gy - g / 2) * bs, d: 0.02 + Math.abs(Math.sin(gx * 1.7 + gy * 2.3 + u * 0.5)) * (maxD - 0.02) });
      }
    }
    return r;
  }, [panelCount]);

  return (
    <group position={position}>
      {blocks.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, b.d / 2]}>
          <boxGeometry args={[0.065, 0.065, b.d]} /><meshStandardMaterial color="#8B6914" />
        </mesh>
      ))}
    </group>
  );
}

// ── Baffle ──
function Baffle({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1.2, 0.6, 0.05]} /><meshStandardMaterial color="#2563eb" transparent opacity={0.75} />
      <lineSegments><edgesGeometry args={[new THREE.BoxGeometry(1.2, 0.6, 0.05)]} /><lineBasicMaterial color="#93c5fd" transparent opacity={0.4} /></lineSegments>
    </mesh>
  );
}

// ── Monitor Speaker (decorative) ──
function MonitorSpeaker({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      <mesh><boxGeometry args={[0.2, 0.3, 0.25]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
      <mesh position={[0, 0.03, 0.126]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.01, 16]} /><meshStandardMaterial color="#333" /></mesh>
      <mesh position={[0, -0.06, 0.126]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.01, 16]} /><meshStandardMaterial color="#555" /></mesh>
    </group>
  );
}

// ── Subwoofer (decorative) ──
function Subwoofer({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh><boxGeometry args={[0.35, 0.35, 0.4]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[0, 0, 0.201]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.12, 0.12, 0.02, 16]} /><meshStandardMaterial color="#222" /></mesh>
    </group>
  );
}

// ── LAYOUT STRATEGIES ────────────────────────────────────
function getProductElements(
  products: ProductPlacement[], w: number, l: number, h: number,
  layout: LayoutPreset, hasMonitors: boolean, hasSub: boolean
): JSX.Element[] {
  const els: JSX.Element[] = [];
  const t = 0.05; // panel thickness
  const earH = h * 0.45; // ear level

  // ── Decorative monitors & sub ──
  if (hasMonitors) {
    const deskZ = l * 0.15; // listening position ~1/3 from front
    els.push(
      <MonitorSpeaker key="mon-l" position={[-0.5, earH - 0.15, deskZ]} rotation={[0, 0.3, 0]} />,
      <MonitorSpeaker key="mon-r" position={[0.5, earH - 0.15, deskZ]} rotation={[0, -0.3, 0]} />
    );
    if (hasSub) {
      els.push(<Subwoofer key="sub" position={[0, 0.175, deskZ + 0.3]} />);
    }
  }

  products.forEach((p) => {
    // ════════════════════════════════════════════════════════
    // WALL PANELS
    // ════════════════════════════════════════════════════════
    if (p.name.includes("Painel") && !p.name.includes("Slim")) {
      const count = Math.min(p.qty, 20);

      if (layout === "simetrico") {
        // Symmetric: evenly distributed, left=right mirror
        const perSide = Math.ceil(count / 2);
        const backCount = Math.max(0, count - perSide * 2);
        for (let i = 0; i < perSide; i++) {
          const z = ((i + 1) / (perSide + 1)) * l - l / 2;
          // Alternate heights for decorative staggering
          const yOff = (i % 3 === 1) ? 0.15 : (i % 3 === 2) ? -0.1 : 0;
          els.push(
            <AcousticPanel key={`lp-${i}`} position={[-w / 2 + t / 2, earH + yOff, z]} wall="left" color="#5a8fbf" />,
            <AcousticPanel key={`rp-${i}`} position={[w / 2 - t / 2, earH + yOff, z]} wall="right" color="#5a8fbf" />
          );
        }
        // Back wall decorative pair
        for (let i = 0; i < Math.min(backCount, 4); i++) {
          const x = ((i + 1) / (Math.min(backCount, 4) + 1)) * w - w / 2;
          els.push(<AcousticPanel key={`bp-${i}`} position={[x, earH, -l / 2 + t / 2]} wall="back" color="#4a7faa" />);
        }
      }

      else if (layout === "reflexao") {
        // First-reflection based: panels at mirror points + front wall
        // Listener at ~38% from front wall (golden ratio)
        const listenZ = l * 0.38 - l / 2;
        // First reflection points on side walls
        const frp1 = listenZ - l * 0.1;
        const frp2 = listenZ + l * 0.1;
        // Place 2 panels at each first reflection point
        els.push(
          <AcousticPanel key="frp-l1" position={[-w / 2 + t / 2, earH, frp1]} wall="left" />,
          <AcousticPanel key="frp-l2" position={[-w / 2 + t / 2, earH, frp2]} wall="left" />,
          <AcousticPanel key="frp-r1" position={[w / 2 - t / 2, earH, frp1]} wall="right" />,
          <AcousticPanel key="frp-r2" position={[w / 2 - t / 2, earH, frp2]} wall="right" />
        );
        // Additional panels behind listener
        const remaining = count - 4;
        const behindCount = Math.ceil(remaining * 0.4);
        for (let i = 0; i < Math.min(behindCount, 4); i++) {
          const z = ((i + 1) / (Math.min(behindCount, 4) + 1)) * (l * 0.4) + listenZ;
          const side = i % 2 === 0 ? -1 : 1;
          els.push(
            <AcousticPanel key={`behind-${i}`} position={[side * (w / 2 - t / 2), earH, Math.min(z, l / 2 - 0.5)]} wall={side < 0 ? "left" : "right"} color="#4a90b8" />
          );
        }
        // Front wall panels (around monitors)
        const frontCount = Math.min(remaining - behindCount, 4);
        for (let i = 0; i < frontCount; i++) {
          const x = ((i + 1) / (frontCount + 1)) * w - w / 2;
          els.push(<AcousticPanel key={`front-${i}`} position={[x, earH, l / 2 - t / 2]} wall="front" color="#6aaed4" />);
        }
      }

      else if (layout === "hibrido") {
        // Hybrid: checkerboard + varying sizes for decorative effect
        const perSide = Math.ceil(count * 0.35);
        const backPanels = Math.ceil(count * 0.15);
        const frontPanels = Math.ceil(count * 0.15);
        // Side walls — offset checkerboard pattern
        for (let i = 0; i < perSide; i++) {
          const z = ((i + 1) / (perSide + 1)) * l - l / 2;
          const isUpper = i % 2 === 0;
          const y = isUpper ? earH + 0.3 : earH - 0.2;
          const panelSize = isUpper ? 0.6 : 0.5;
          els.push(
            <AcousticPanel key={`hl-${i}`} position={[-w / 2 + t / 2, y, z]} wall="left" color={isUpper ? "#5a8fbf" : "#4a7faa"} w={panelSize} />,
            <AcousticPanel key={`hr-${i}`} position={[w / 2 - t / 2, y, z]} wall="right" color={isUpper ? "#5a8fbf" : "#4a7faa"} w={panelSize} />
          );
        }
        for (let i = 0; i < backPanels; i++) {
          const x = ((i + 1) / (backPanels + 1)) * w - w / 2;
          els.push(<AcousticPanel key={`hb-${i}`} position={[x, earH + (i % 2 ? 0.2 : -0.1), -l / 2 + t / 2]} wall="back" color="#4a7faa" />);
        }
        for (let i = 0; i < frontPanels; i++) {
          const x = ((i + 1) / (frontPanels + 1)) * w - w / 2;
          els.push(<AcousticPanel key={`hf-${i}`} position={[x, earH, l / 2 - t / 2]} wall="front" color="#6aaed4" />);
        }
      }
    }

    // ── SLIM PANELS ──
    if (p.name.includes("Slim")) {
      const count = Math.min(p.qty, 6);
      for (let i = 0; i < count; i++) {
        const x = ((i + 1) / (count + 1)) * w - w / 2;
        els.push(<AcousticPanel key={`slim-${i}`} position={[x, h * 0.4, l / 2 - 0.02]} wall="front" color="#7eb8e0" w={0.5} h={0.8} />);
      }
    }

    // ── BASS TRAPS ──
    if (p.name.includes("Bass Trap")) {
      const corners: [number, number][] = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
      for (let i = 0; i < Math.min(p.qty, 4); i++) {
        const [cx, cz] = corners[i];
        els.push(<BassTrap key={`bass-${i}`} position={[cx * w / 2, h / 2, cz * l / 2]} height={h} cornerX={cx} cornerZ={cz} />);
      }
    }

    // ── CEILING CLOUDS ──
    if (p.name.includes("Nuvem")) {
      const count = Math.min(p.qty, 6);
      for (let i = 0; i < count; i++) {
        const z = ((i + 1) / (count + 1)) * l - l / 2;
        els.push(<CeilingCloud key={`cloud-${i}`} position={[0, h - 0.25, z]} />);
      }
    }

    // ── DIFFUSERS ──
    if (p.name.includes("Difusor")) {
      const unitCount = Math.min(p.qty, Math.floor(w / 0.5));
      els.push(<DiffuserSkyline key="diff" position={[0, h * 0.5, -l / 2 + 0.01]} panelCount={unitCount} />);
    }

    // ── BAFFLES ──
    if (p.name.includes("Baffles")) {
      const count = Math.min(p.qty, 10);
      for (let i = 0; i < count; i++) {
        const z = ((i + 1) / (count + 1)) * l - l / 2;
        els.push(<Baffle key={`baf-${i}`} position={[0, h - 0.5, z]} />);
      }
    }
  });

  return els;
}

// ── Room Scene ──
function RoomScene({ width, length, height, products, showProducts, layout = "simetrico", hasMonitors = false, hasSub = false }: Room3DViewerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const w = width, l = length, h = height;

  const gridHelper = useMemo(() => {
    const grid = new THREE.GridHelper(Math.max(w, l) * 1.2, Math.max(w, l) * 2, "#1e4a6e", "#0d2a3f");
    grid.position.y = -0.01;
    return grid;
  }, [w, l]);

  const productElements = useMemo(() => {
    if (!showProducts || !products) return [];
    return getProductElements(products, w, l, h, layout, hasMonitors, hasSub);
  }, [products, showProducts, w, l, h, layout, hasMonitors, hasSub]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={0.7} castShadow />
      <pointLight position={[0, h, 0]} intensity={0.3} color="#60a5fa" />
      <hemisphereLight args={["#b1e1ff", "#0a1628", 0.3]} />

      <group ref={groupRef}>
        {/* Floor */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[w, l]} /><meshStandardMaterial color="#0f1d2f" side={THREE.DoubleSide} />
        </mesh>
        <lineSegments position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(w, l)]} /><lineBasicMaterial color="#1d6fb8" transparent opacity={0.6} />
        </lineSegments>

        {/* Back wall */}
        <mesh position={[0, h / 2, -l / 2]}><planeGeometry args={[w, h]} /><meshStandardMaterial color="#141f30" transparent opacity={0.35} side={THREE.DoubleSide} /></mesh>
        <lineSegments position={[0, h / 2, -l / 2]}><edgesGeometry args={[new THREE.PlaneGeometry(w, h)]} /><lineBasicMaterial color="#1d6fb8" transparent opacity={0.4} /></lineSegments>

        {/* Left wall */}
        <mesh position={[-w / 2, h / 2, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[l, h]} /><meshStandardMaterial color="#141f30" transparent opacity={0.25} side={THREE.DoubleSide} /></mesh>
        <lineSegments position={[-w / 2, h / 2, 0]} rotation={[0, Math.PI / 2, 0]}><edgesGeometry args={[new THREE.PlaneGeometry(l, h)]} /><lineBasicMaterial color="#1d6fb8" transparent opacity={0.3} /></lineSegments>

        {/* Right wall */}
        <mesh position={[w / 2, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[l, h]} /><meshStandardMaterial color="#141f30" transparent opacity={0.25} side={THREE.DoubleSide} /></mesh>
        <lineSegments position={[w / 2, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]}><edgesGeometry args={[new THREE.PlaneGeometry(l, h)]} /><lineBasicMaterial color="#1d6fb8" transparent opacity={0.3} /></lineSegments>

        {/* Front wall */}
        <mesh position={[0, h / 2, l / 2]}><planeGeometry args={[w, h]} /><meshStandardMaterial color="#141f30" transparent opacity={0.1} side={THREE.DoubleSide} /></mesh>
        <lineSegments position={[0, h / 2, l / 2]}><edgesGeometry args={[new THREE.PlaneGeometry(w, h)]} /><lineBasicMaterial color="#1d6fb8" transparent opacity={0.15} /></lineSegments>

        {/* Ceiling wireframe */}
        <lineSegments position={[0, h, 0]} rotation={[-Math.PI / 2, 0, 0]}><edgesGeometry args={[new THREE.PlaneGeometry(w, l)]} /><lineBasicMaterial color="#1d6fb8" transparent opacity={0.2} /></lineSegments>

        {/* Vertical edges */}
        {[[-w / 2, -l / 2], [w / 2, -l / 2], [-w / 2, l / 2], [w / 2, l / 2]].map(([x, z], i) => (
          <line key={`e-${i}`}>
            <bufferGeometry><bufferAttribute attach="attributes-position" count={2} array={new Float32Array([x, 0, z, x, h, z])} itemSize={3} /></bufferGeometry>
            <lineBasicMaterial color="#1d6fb8" transparent opacity={0.4} />
          </line>
        ))}

        {/* Dimensions */}
        <Text position={[0, -0.15, l / 2 + 0.3]} fontSize={0.15} color="#60a5fa" anchorX="center">{w.toFixed(1)}m</Text>
        <Text position={[w / 2 + 0.3, -0.15, 0]} fontSize={0.15} color="#60a5fa" anchorX="center" rotation={[0, -Math.PI / 2, 0]}>{l.toFixed(1)}m</Text>
        <Text position={[w / 2 + 0.3, h / 2, -l / 2]} fontSize={0.15} color="#60a5fa" anchorX="center" rotation={[0, -Math.PI / 4, 0]}>{h.toFixed(1)}m</Text>

        {productElements}
        <primitive object={gridHelper} />
      </group>

      <OrbitControls enablePan enableZoom enableRotate minDistance={1} maxDistance={Math.max(w, l, h) * 4} autoRotate autoRotateSpeed={0.5} target={[0, h / 2, 0]} />
    </>
  );
}

export default function Room3DViewer({ width, length, height, products, showProducts, layout = "simetrico", hasMonitors = false, hasSub = false }: Room3DViewerProps) {
  const maxDim = Math.max(width, length, height);
  const camDist = maxDim * 2;

  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #050d1a 0%, #0a1628 50%, #0d1f33 100%)" }}>
      <Canvas camera={{ position: [camDist * 0.7, camDist * 0.5, camDist * 0.7], fov: 50, near: 0.1, far: 100 }} shadows>
        <RoomScene width={width} length={length} height={height} products={products} showProducts={showProducts} layout={layout} hasMonitors={hasMonitors} hasSub={hasSub} />
      </Canvas>

      <div className="absolute bottom-3 left-3 flex flex-wrap gap-3 text-[10px]">
        {showProducts && products && products.length > 0 && (
          <>
            {products.some(p => p.name.includes("Painel")) && (
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: "#5a8fbf" }} /><span className="text-blue-300/70">Painéis</span></div>
            )}
            {products.some(p => p.name.includes("Bass")) && (
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: "#c76d2e" }} /><span className="text-blue-300/70">Bass Traps</span></div>
            )}
            {products.some(p => p.name.includes("Difusor")) && (
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: "#8B6914" }} /><span className="text-blue-300/70">Difusores</span></div>
            )}
            {products.some(p => p.name.includes("Nuvem")) && (
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: "#3b82f6" }} /><span className="text-blue-300/70">Nuvens</span></div>
            )}
            {products.some(p => p.name.includes("Baffles")) && (
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: "#2563eb" }} /><span className="text-blue-300/70">Baffles</span></div>
            )}
            {hasMonitors && (
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: "#333" }} /><span className="text-blue-300/70">Monitores</span></div>
            )}
          </>
        )}
      </div>

      <div className="absolute top-3 right-3 text-[10px] text-blue-400/50 font-mono">3D • Arraste para girar</div>
    </div>
  );
}
