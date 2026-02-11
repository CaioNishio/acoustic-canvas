import { useRef, useMemo, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import type { Product, ProductColor } from "@/data/products";
import { Palette, RotateCcw, Maximize2 } from "lucide-react";
import { motion } from "framer-motion";

// ─── 3D Product Geometries ──────────────────────────────────

function PanelMesh({ w, h, d, color }: { w: number; h: number; d: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  return (
    <mesh ref={ref} castShadow position={[0, 0, 0]}>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
}

function BassTrapMesh({ h, color }: { h: number; color: string }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.6);
    shape.lineTo(0.4, 0);
    shape.lineTo(-0.4, 0);
    shape.closePath();
    const extrudeSettings = { steps: 1, depth: h, bevelEnabled: false };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, [h]);

  return (
    <mesh geometry={geometry} castShadow>
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
}

function SkylineMesh({ w, h, color }: { w: number; h: number; color: string }) {
  const { matrices, count } = useMemo(() => {
    const blockSize = 0.1;
    const cols = Math.floor(w / blockSize);
    const rows = Math.floor(h / blockSize);
    const total = cols * rows;
    const mats: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();
    // Use seeded random for consistency
    let seed = 42;
    const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const z = rand() * 0.25 + 0.02;
        dummy.position.set(
          i * blockSize - w / 2 + blockSize / 2,
          j * blockSize - h / 2 + blockSize / 2,
          z / 2
        );
        dummy.scale.set(1, 1, z / 0.098);
        dummy.updateMatrix();
        mats.push(dummy.matrix.clone());
      }
    }
    return { matrices: mats, count: total };
  }, [w, h]);

  const meshRef = useRef<THREE.InstancedMesh>(null);

  useMemo(() => {
    if (!meshRef.current) return;
    matrices.forEach((m, i) => meshRef.current!.setMatrixAt(i, m));
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [matrices]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
      <boxGeometry args={[0.09, 0.09, 0.098]} />
      <meshStandardMaterial color={color} roughness={0.55} />
    </instancedMesh>
  );
}

function HexMesh({ w, d, color }: { w: number; d: number; color: string }) {
  const geo = useMemo(() => {
    const radius = w / 1.732;
    const g = new THREE.CylinderGeometry(radius, radius, d, 6);
    g.rotateX(Math.PI / 2);
    g.rotateZ(Math.PI / 6);
    return g;
  }, [w, d]);
  return (
    <mesh geometry={geo} castShadow>
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
}

function CloudMesh({ w, h, d, color }: { w: number; h: number; d: number; color: string }) {
  return (
    <mesh castShadow position={[0, 0.5, 0]}>
      <boxGeometry args={[w, d, h]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
}

function BaffleMesh({ w, h, d, color }: { w: number; h: number; d: number; color: string }) {
  return (
    <group>
      {[0, 1, 2].map((i) => (
        <mesh key={i} castShadow position={[i * (w + 0.1) - (w + 0.1), 0, 0]}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function DifusorBidimMesh({ w, h, color }: { w: number; h: number; color: string }) {
  const { matrices, count } = useMemo(() => {
    const step = w / 6;
    const mats: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();
    const ds = [0.04, 0.1, 0.16, 0.06, 0.2, 0.08, 0.14, 0.04, 0.18, 0.1, 0.06, 0.16];
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        const z = ds[(i + j) % ds.length] + 0.04;
        dummy.position.set(i * step - w / 2 + step / 2, j * step - h / 2 + step / 2, z / 2);
        dummy.scale.set(1, 1, z / 0.02);
        dummy.updateMatrix();
        mats.push(dummy.matrix.clone());
      }
    }
    return { matrices: mats, count: 36 };
  }, [w, h]);

  const meshRef = useRef<THREE.InstancedMesh>(null);
  useMemo(() => {
    if (!meshRef.current) return;
    matrices.forEach((m, i) => meshRef.current!.setMatrixAt(i, m));
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [matrices]);

  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[w, h, 0.02]} />
        <meshStandardMaterial color={color} roughness={0.55} />
      </mesh>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
        <boxGeometry args={[w / 6 - 0.01, h / 6 - 0.01, 0.02]} />
        <meshStandardMaterial color={color} roughness={0.55} />
      </instancedMesh>
    </group>
  );
}

// ─── Auto-rotate wrapper ────────────────────────────────────
function AutoRotate({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.15;
  });
  return <group ref={ref}>{children}</group>;
}

// ─── Geometry Resolver ──────────────────────────────────────
function ProductGeometry({ product, color }: { product: Product; color: string }) {
  const cat = product.category.toLowerCase();
  const slug = product.slug;

  if (cat.includes("bass trap")) {
    return <BassTrapMesh h={1.2} color={color} />;
  }
  if (slug.includes("skyline")) {
    return <SkylineMesh w={1} h={1} color={color} />;
  }
  if (slug.includes("wavefuser") || slug.includes("difusor-2d") || slug.includes("bidimensional")) {
    return <DifusorBidimMesh w={1} h={1} color={color} />;
  }
  if (cat.includes("difusor")) {
    return <SkylineMesh w={1} h={1} color={color} />;
  }
  if (cat.includes("nuvem") || cat.includes("cloud")) {
    return <CloudMesh w={1.6} h={1} d={0.1} color={color} />;
  }
  if (cat.includes("baffle") || cat.includes("forro")) {
    return <BaffleMesh w={0.4} h={1.2} d={0.08} color={color} />;
  }
  if (slug.includes("hexagon")) {
    return <HexMesh w={1} d={0.1} color={color} />;
  }
  // Default: panel/painel
  const aspect = slug.includes("slim") || slug.includes("3225") ? 0.05 : 0.1;
  return <PanelMesh w={1.2} h={1.2} d={aspect} color={color} />;
}

// ─── Scene ──────────────────────────────────────────────────
function Scene({ product, color }: { product: Product; color: string }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[3, 5, 4]} intensity={1.2} castShadow shadow-mapSize={1024} />
      <spotLight position={[-2, 3, -3]} intensity={0.4} />
      <AutoRotate>
        <ProductGeometry product={product} color={color} />
      </AutoRotate>
      <ContactShadows position={[0, -0.8, 0]} opacity={0.4} scale={4} blur={2.5} />
      <OrbitControls
        enablePan={false}
        minDistance={1.5}
        maxDistance={5}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.8}
      />
      <Environment preset="studio" />
    </>
  );
}

// ─── Main Component ─────────────────────────────────────────
interface Product3DViewerProps {
  product: Product;
  selectedColor?: ProductColor | null;
}

export default function Product3DViewer({ product, selectedColor }: Product3DViewerProps) {
  const [viewerColor, setViewerColor] = useState<string>(
    selectedColor?.hex || product.colors?.[0]?.hex || "#5B7C8C"
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync color from parent
  const activeColor = selectedColor?.hex || viewerColor;

  const quickColors = useMemo(() => {
    if (!product.colors || product.colors.length === 0) return [];
    return product.colors.slice(0, 12);
  }, [product.colors]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card rounded-2xl overflow-hidden relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h3 className="font-display font-bold text-foreground text-lg flex items-center gap-2">
            <RotateCcw size={18} className="text-primary" />
            Visualização 3D — 360°
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Gire, amplie e explore o produto em tempo real</p>
        </div>
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          title="Tela cheia"
        >
          <Maximize2 size={18} className="text-muted-foreground" />
        </button>
      </div>

      {/* 3D Canvas */}
      <div className="relative" style={{ height: 420 }}>
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center bg-card">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-muted-foreground">Carregando modelo 3D…</span>
              </div>
            </div>
          }
        >
          <Canvas
            camera={{ position: [2.5, 1.8, 2.5], fov: 35 }}
            shadows
            dpr={[1, 2]}
            style={{ background: "hsl(var(--card))" }}
          >
            <Scene product={product} color={activeColor} />
          </Canvas>
        </Suspense>
      </div>

      {/* Quick Color Picker */}
      {quickColors.length > 0 && (
        <div className="px-6 py-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Palette size={16} className="text-primary flex-shrink-0" />
            <span className="text-xs font-semibold text-foreground">Cores:</span>
            <div className="flex flex-wrap gap-1.5">
              {quickColors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setViewerColor(c.hex)}
                  className="relative group/dot"
                  title={c.code ? `${c.code} — ${c.name}` : c.name}
                >
                  <span
                    className="block w-7 h-7 rounded-full border-2 transition-all hover:scale-110"
                    style={{
                      backgroundColor: c.hex,
                      borderColor: activeColor === c.hex ? "hsl(var(--primary))" : "hsl(var(--border))",
                    }}
                  />
                </button>
              ))}
              {product.colors && product.colors.length > 12 && (
                <span className="text-xs text-muted-foreground self-center ml-1">
                  +{product.colors.length - 12}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
