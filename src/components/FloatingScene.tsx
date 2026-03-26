import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";

function MusicNote({ position, speed, scale }: { position: [number, number, number]; speed: number; scale: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * speed) * 1.5;
    ref.current.position.x = position[0] + Math.cos(t * speed * 0.7) * 0.5;
    ref.current.rotation.z = Math.sin(t * speed * 0.5) * 0.3;
    ref.current.rotation.y = t * 0.5;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh rotation={[0, 0, 0.3]}><sphereGeometry args={[0.25, 6, 6]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.15} /></mesh>
      <mesh position={[0.2, 0.8, 0]}><cylinderGeometry args={[0.02, 0.02, 1.5, 4]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.12} /></mesh>
      <mesh position={[0.4, 1.2, 0]} rotation={[0, 0, -0.5]}><cylinderGeometry args={[0.01, 0.025, 0.5, 4]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.1} /></mesh>
    </group>
  );
}

function TrebleClef({ position, speed, scale }: { position: [number, number, number]; speed: number; scale: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * speed + 1) * 1.2;
    ref.current.position.x = position[0] + Math.cos(t * speed * 0.5) * 0.6;
    ref.current.rotation.z = Math.sin(t * speed * 0.4) * 0.2;
    ref.current.rotation.y = t * 0.3;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh><torusGeometry args={[0.35, 0.03, 8, 16]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.12} /></mesh>
      <mesh position={[0, 0.7, 0]}><cylinderGeometry args={[0.02, 0.02, 1.4, 4]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.1} /></mesh>
      <mesh position={[0, -0.45, 0]}><sphereGeometry args={[0.12, 6, 6]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.1} /></mesh>
    </group>
  );
}

function SharpSymbol({ position, speed, scale }: { position: [number, number, number]; speed: number; scale: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * speed + 2) * 1;
    ref.current.position.x = position[0] + Math.cos(t * speed * 0.8 + 1) * 0.4;
    ref.current.rotation.z = Math.sin(t * speed * 0.6) * 0.25;
    ref.current.rotation.y = t * 0.4;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh position={[-0.15, 0, 0]}><cylinderGeometry args={[0.015, 0.015, 1, 4]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.1} /></mesh>
      <mesh position={[0.15, 0, 0]}><cylinderGeometry args={[0.015, 0.015, 1, 4]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.1} /></mesh>
      <mesh position={[0, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.6, 4]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.08} /></mesh>
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.6, 4]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.08} /></mesh>
    </group>
  );
}

function WaveformRing() {
  const ref = useRef<THREE.Mesh>(null);
  const geoRef = useRef<THREE.TorusGeometry>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = Math.PI * 0.5 + Math.sin(t * 0.3) * 0.2;
    ref.current.rotation.z = t * 0.1;
    if (geoRef.current) {
      const pos = geoRef.current.attributes.position;
      const arr = pos.array as Float32Array;
      for (let i = 0; i < pos.count; i++) {
        const x = arr[i * 3], z = arr[i * 3 + 2];
        const angle = Math.atan2(z, x);
        const wave = Math.sin(angle * 8 + t * 3) * 0.08;
        const dist = Math.sqrt(x * x + z * z);
        const scale = 1 + wave / dist;
        arr[i * 3] *= scale > 0 ? scale : 1;
        arr[i * 3 + 2] *= scale > 0 ? scale : 1;
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, -2]}>
      <torusGeometry ref={geoRef} args={[3, 0.03, 8, 128]} />
      <meshBasicMaterial color="#c9a84c" transparent opacity={0.08} />
    </mesh>
  );
}

function DiamondGrid() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 25;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const grid = useMemo(() => {
    const items: { x: number; y: number; delay: number }[] = [];
    for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) items.push({ x: (i - 2) * 2, y: (j - 2) * 2, delay: (i + j) * 0.3 });
    return items;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    grid.forEach((item, i) => {
      dummy.position.set(item.x, item.y, -6);
      const s = 0.15 + Math.sin(t * 0.8 + item.delay) * 0.05;
      dummy.scale.set(s, s, s);
      dummy.rotation.x = t * 0.3 + item.delay;
      dummy.rotation.y = t * 0.5 + item.delay;
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#c9a84c" transparent opacity={0.04} wireframe />
    </instancedMesh>
  );
}

interface FloatingSceneProps {
  variant?: "notes" | "waveform" | "diamonds";
  className?: string;
  height?: string;
}

const FloatingScene = ({ variant = "notes", className = "", height = "300px" }: FloatingSceneProps) => {
  return (
    <div className={`pointer-events-none ${className}`} style={{ height }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: false, alpha: true }} style={{ background: "transparent" }}>
        <Suspense fallback={null}>
          {variant === "notes" && (
            <>
              <MusicNote position={[-3, 1, 0]} speed={0.6} scale={0.8} />
              <MusicNote position={[2, -1, -1]} speed={0.8} scale={1} />
              <MusicNote position={[4, 2, -2]} speed={0.5} scale={0.6} />
              <MusicNote position={[-4, -2, -1]} speed={0.7} scale={0.7} />
              <TrebleClef position={[0, 3, -3]} speed={0.4} scale={0.9} />
              <TrebleClef position={[-2, -1, -2]} speed={0.35} scale={0.6} />
              <SharpSymbol position={[3, 0, -1.5]} speed={0.5} scale={0.7} />
              <SharpSymbol position={[-3, 2, -2.5]} speed={0.45} scale={0.5} />
            </>
          )}
          {variant === "waveform" && <WaveformRing />}
          {variant === "diamonds" && <DiamondGrid />}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default FloatingScene;
