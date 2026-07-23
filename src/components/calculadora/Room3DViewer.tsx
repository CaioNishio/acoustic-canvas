import { useRef, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import {
  computeLayout,
  type LayoutPreset,
  type Placement,
  type ProductPlacement,
} from "./layoutEngine";

// Reexportado para não quebrar quem já importa daqui (Calculadora.tsx).
export type { LayoutPreset, ProductPlacement };

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

// ─────────────────────────────────────────────────────────────
// RENDERIZADORES — puramente visuais, sem decisão de posição
// ─────────────────────────────────────────────────────────────

/** Converte o tamanho da face + superfície na geometria de caixa correta. */
function boxArgsFor(p: Placement): [number, number, number] {
  const [fw, fh] = p.size;
  switch (p.surface) {
    case "left":
    case "right":
      return [p.depth, fh, fw];
    case "ceiling":
      return [fw, p.depth, fh];
    default:
      return [fw, fh, p.depth];
  }
}

function FlatPiece({ p }: { p: Placement }) {
  const args = useMemo(() => boxArgsFor(p), [p]);
  const edges = useMemo(() => new THREE.BoxGeometry(...args), [args]);
  return (
    <mesh position={p.position} rotation={p.tilt ? [p.tilt, 0, 0] : undefined} castShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={p.color} roughness={0.85} metalness={0.05} />
      <lineSegments>
        <edgesGeometry args={[edges]} />
        <lineBasicMaterial color="#8AC4FF" transparent opacity={0.3} />
      </lineSegments>
    </mesh>
  );
}

/** Nuvem: peça inclinada + tirantes até o teto. */
function Cloud({ p, ceilingY }: { p: Placement; ceilingY: number }) {
  const [cw, cd] = p.size;
  const gap = ceilingY - p.position[1];
  return (
    <group>
      <FlatPiece p={p} />
      {[
        [-cw * 0.35, -cd * 0.3],
        [cw * 0.35, -cd * 0.3],
        [-cw * 0.35, cd * 0.3],
        [cw * 0.35, cd * 0.3],
      ].map(([ox, oz], i) => (
        <mesh
          key={i}
          position={[p.position[0] + ox, p.position[1] + gap / 2, p.position[2] + oz]}
        >
          <cylinderGeometry args={[0.005, 0.005, gap, 6]} />
          <meshStandardMaterial color="#94A3B8" />
        </mesh>
      ))}
    </group>
  );
}

/** Bass trap: coluna triangular de canto, do PISO ao TETO. */
function BassTrapColumn({ p, room }: { p: Placement; room: { w: number; l: number; h: number } }) {
  const side = p.size[0];
  const height = p.size[1];
  const cx = p.position[0] > 0 ? 1 : -1;
  const cz = p.position[2] > 0 ? 1 : -1;

  // No plano da Shape, X→X do mundo e Y→ -Z do mundo (rotação -90° em X).
  // As pernas do triângulo apontam para DENTRO da sala a partir do canto.
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(-cx * side, 0);
    s.lineTo(0, cz * side);
    s.closePath();
    return s;
  }, [cx, cz, side]);

  return (
    <mesh
      position={[(cx * room.w) / 2, 0, (cz * room.l) / 2]}
      rotation={[-Math.PI / 2, 0, 0]}
      castShadow
    >
      <extrudeGeometry args={[shape, { depth: height, bevelEnabled: false }]} />
      <meshStandardMaterial color={p.color} roughness={0.9} />
    </mesh>
  );
}

/** Difusor Skyline: matriz de blocos com profundidades derivadas de sequência. */
function DiffuserArray({ p }: { p: Placement }) {
  const units = p.units ?? 1;
  const unitSize = 0.6;
  const maxD = p.depth;

  const blocks = useMemo(() => {
    const out: { x: number; y: number; d: number }[] = [];
    const g = 7;
    const cell = unitSize / g;
    // Sequência de raízes primitivas (Cox & D'Antonio) — determinística,
    // não aleatória: é isso que dá o espalhamento uniforme.
    const N = 7;
    const root = 3;
    for (let u = 0; u < units; u++) {
      const ox = (u - (units - 1) / 2) * unitSize;
      for (let gx = 0; gx < g; gx++) {
        for (let gy = 0; gy < g; gy++) {
          const seq = (Math.pow(root, (gx + gy * g) % (N - 1)) % N) / (N - 1);
          out.push({
            x: ox + (gx - (g - 1) / 2) * cell,
            y: (gy - (g - 1) / 2) * cell,
            d: 0.02 + seq * (maxD - 0.02),
          });
        }
      }
    }
    return out;
  }, [units, maxD]);

  return (
    <group position={p.position}>
      {blocks.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, b.d / 2]} castShadow>
          <boxGeometry args={[unitSize / 7 - 0.008, unitSize / 7 - 0.008, b.d]} />
          <meshStandardMaterial color={p.color} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function MonitorSpeaker({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      <mesh><boxGeometry args={[0.2, 0.3, 0.25]} /><meshStandardMaterial color="#1A1A1A" /></mesh>
      <mesh position={[0, 0.03, 0.126]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.01, 16]} /><meshStandardMaterial color="#333" /></mesh>
      <mesh position={[0, -0.06, 0.126]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.01, 16]} /><meshStandardMaterial color="#555" /></mesh>
    </group>
  );
}

function Subwoofer({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh><boxGeometry args={[0.35, 0.35, 0.4]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[0, 0, 0.201]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.12, 0.12, 0.02, 16]} /><meshStandardMaterial color="#222" /></mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────

function RoomScene({
  width, length, height, products, showProducts,
  layout = "simetrico", hasMonitors = false, hasSub = false,
}: Room3DViewerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const w = width, l = length, h = height;

  const gridHelper = useMemo(() => {
    const grid = new THREE.GridHelper(Math.max(w, l) * 1.2, Math.max(w, l) * 2, "#1E4A6E", "#0D2A3F");
    grid.position.y = -0.01;
    return grid;
  }, [w, l]);

  const result = useMemo(() => {
    if (!showProducts || !products) return null;
    return computeLayout(products, { w, l, h }, layout, { hasMonitors, hasSub });
  }, [products, showProducts, w, l, h, layout, hasMonitors, hasSub]);

  const listenZ = -l / 2 + l * 0.38;
  const speakerZ = -l / 2 + l * 0.15;
  const speakerX = Math.min(w * 0.25, 1.1);
  const earH = Math.min(1.2, h * 0.5);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={0.7} castShadow />
      <pointLight position={[0, h, 0]} intensity={0.3} color="#60A5FA" />
      <hemisphereLight args={["#B1E1FF", "#0A1628", 0.3]} />

      <group ref={groupRef}>
        {/* Piso */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[w, l]} /><meshStandardMaterial color="#0F1D2F" side={THREE.DoubleSide} />
        </mesh>
        <lineSegments position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(w, l)]} /><lineBasicMaterial color="#1D6FB8" transparent opacity={0.6} />
        </lineSegments>

        {/* Paredes */}
        <mesh position={[0, h / 2, -l / 2]}><planeGeometry args={[w, h]} /><meshStandardMaterial color="#141F30" transparent opacity={0.35} side={THREE.DoubleSide} /></mesh>
        <lineSegments position={[0, h / 2, -l / 2]}><edgesGeometry args={[new THREE.PlaneGeometry(w, h)]} /><lineBasicMaterial color="#1D6FB8" transparent opacity={0.4} /></lineSegments>

        <mesh position={[-w / 2, h / 2, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[l, h]} /><meshStandardMaterial color="#141F30" transparent opacity={0.25} side={THREE.DoubleSide} /></mesh>
        <lineSegments position={[-w / 2, h / 2, 0]} rotation={[0, Math.PI / 2, 0]}><edgesGeometry args={[new THREE.PlaneGeometry(l, h)]} /><lineBasicMaterial color="#1D6FB8" transparent opacity={0.3} /></lineSegments>

        <mesh position={[w / 2, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[l, h]} /><meshStandardMaterial color="#141F30" transparent opacity={0.25} side={THREE.DoubleSide} /></mesh>
        <lineSegments position={[w / 2, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]}><edgesGeometry args={[new THREE.PlaneGeometry(l, h)]} /><lineBasicMaterial color="#1D6FB8" transparent opacity={0.3} /></lineSegments>

        <mesh position={[0, h / 2, l / 2]}><planeGeometry args={[w, h]} /><meshStandardMaterial color="#141F30" transparent opacity={0.1} side={THREE.DoubleSide} /></mesh>
        <lineSegments position={[0, h / 2, l / 2]}><edgesGeometry args={[new THREE.PlaneGeometry(w, h)]} /><lineBasicMaterial color="#1D6FB8" transparent opacity={0.15} /></lineSegments>

        <lineSegments position={[0, h, 0]} rotation={[-Math.PI / 2, 0, 0]}><edgesGeometry args={[new THREE.PlaneGeometry(w, l)]} /><lineBasicMaterial color="#1D6FB8" transparent opacity={0.2} /></lineSegments>

        {[[-w / 2, -l / 2], [w / 2, -l / 2], [-w / 2, l / 2], [w / 2, l / 2]].map(([x, z], i) => (
          <line key={`e-${i}`}>
            <bufferGeometry><bufferAttribute attach="attributes-position" count={2} array={new Float32Array([x, 0, z, x, h, z])} itemSize={3} /></bufferGeometry>
            <lineBasicMaterial color="#1D6FB8" transparent opacity={0.4} />
          </line>
        ))}

        {/* Cotas */}
        <Text position={[0, -0.15, l / 2 + 0.3]} fontSize={0.15} color="#60A5FA" anchorX="center">{w.toFixed(1)}m</Text>
        <Text position={[w / 2 + 0.3, -0.15, 0]} fontSize={0.15} color="#60A5FA" anchorX="center" rotation={[0, -Math.PI / 2, 0]}>{l.toFixed(1)}m</Text>
        <Text position={[w / 2 + 0.3, h / 2, -l / 2]} fontSize={0.15} color="#60A5FA" anchorX="center" rotation={[0, -Math.PI / 4, 0]}>{h.toFixed(1)}m</Text>

        {/* Equipamento decorativo */}
        {showProducts && hasMonitors && (
          <>
            <MonitorSpeaker position={[-speakerX, earH, speakerZ]} rotation={[0, -0.3, 0]} />
            <MonitorSpeaker position={[speakerX, earH, speakerZ]} rotation={[0, 0.3, 0]} />
            {hasSub && <Subwoofer position={[speakerX * 0.5, 0.175, speakerZ + 0.35]} />}
          </>
        )}

        {/* Materiais posicionados pelo motor */}
        {result?.placements.map((p) => {
          if (p.kind === "bassTrap") return <BassTrapColumn key={p.id} p={p} room={{ w, l, h }} />;
          if (p.kind === "cloud") return <Cloud key={p.id} p={p} ceilingY={h} />;
          if (p.kind === "diffuser") return <DiffuserArray key={p.id} p={p} />;
          return <FlatPiece key={p.id} p={p} />;
        })}

        {/* Posição de escuta de referência */}
        {showProducts && hasMonitors && (
          <mesh position={[0, 0.01, listenZ]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.28, 0.34, 32]} />
            <meshBasicMaterial color="#60A5FA" transparent opacity={0.45} side={THREE.DoubleSide} />
          </mesh>
        )}

        <primitive object={gridHelper} />
      </group>

      <OrbitControls
        enablePan enableZoom enableRotate
        minDistance={1}
        maxDistance={Math.max(w, l, h) * 4}
        autoRotate autoRotateSpeed={0.5}
        target={[0, h / 2, 0]}
      />
    </>
  );
}

const LEGEND: { kind: string; color: string; label: string }[] = [
  { kind: "panel", color: "#5A8FBF", label: "Painéis" },
  { kind: "slim", color: "#7EB8E0", label: "Slim" },
  { kind: "bassTrap", color: "#C76D2E", label: "Bass Traps" },
  { kind: "cloud", color: "#3B82F6", label: "Nuvens" },
  { kind: "baffle", color: "#2563EB", label: "Baffles" },
  { kind: "diffuser", color: "#8B6914", label: "Difusores" },
];

export default function Room3DViewer({
  width, length, height, products, showProducts,
  layout = "simetrico", hasMonitors = false, hasSub = false,
}: Room3DViewerProps) {
  const maxDim = Math.max(width, length, height);
  const camDist = maxDim * 2;

  const summary = useMemo(() => {
    if (!showProducts || !products) return null;
    return computeLayout(products, { w: width, l: length, h: height }, layout, { hasMonitors, hasSub });
  }, [products, showProducts, width, length, height, layout, hasMonitors, hasSub]);

  const activeKinds = new Set(summary?.placements.map((p) => p.kind));

  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #050D1A 0%, #0A1628 50%, #0D1F33 100%)" }}>
      <Canvas camera={{ position: [camDist * 0.7, camDist * 0.5, camDist * 0.7], fov: 50, near: 0.1, far: 100 }} shadows>
        <RoomScene
          width={width} length={length} height={height}
          products={products} showProducts={showProducts}
          layout={layout} hasMonitors={hasMonitors} hasSub={hasSub}
        />
      </Canvas>

      <div className="absolute bottom-3 left-3 flex flex-wrap gap-3 text-[10px]">
        {LEGEND.filter((e) => activeKinds.has(e.kind as never)).map((e) => (
          <div key={e.kind} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm" style={{ background: e.color }} />
            <span className="text-blue-300/70">{e.label}</span>
          </div>
        ))}
        {hasMonitors && (
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm" style={{ background: "#333" }} />
            <span className="text-blue-300/70">Monitores</span>
          </div>
        )}
      </div>

      {summary && summary.warnings.length > 0 && (
        <div className="absolute top-3 left-3 max-w-[60%] space-y-1">
          {summary.warnings.slice(0, 2).map((wn, i) => (
            <p key={i} className="text-[10px] leading-snug text-amber-300/80 bg-amber-950/40 border border-amber-500/20 rounded px-2 py-1">
              {wn}
            </p>
          ))}
        </div>
      )}

      <div className="absolute top-3 right-3 text-[10px] text-blue-400/50 font-mono">3D • Arraste para girar</div>
    </div>
  );
}
