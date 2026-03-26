import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useRef, useMemo, Suspense, useEffect } from "react";
import * as THREE from "three";

function MouseReactiveParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 2500;
  const mouse = useRef(new THREE.Vector2(0, 0));
  const { viewport } = useThree();

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      vel[i * 3] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }
    return [pos, vel];
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const posAttr = ref.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;
    const mx = mouse.current.x * viewport.width * 0.5;
    const my = mouse.current.y * viewport.height * 0.5;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;
      arr[ix] += velocities[ix];
      arr[iy] += velocities[iy];
      arr[iz] += velocities[iz];
      const dx = arr[ix] - mx;
      const dy = arr[iy] - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 3) {
        const force = (3 - dist) * 0.008;
        arr[ix] += dx * force;
        arr[iy] += dy * force;
      }
      if (arr[ix] > 15) arr[ix] = -15;
      if (arr[ix] < -15) arr[ix] = 15;
      if (arr[iy] > 15) arr[iy] = -15;
      if (arr[iy] < -15) arr[iy] = 15;
    }
    posAttr.needsUpdate = true;
    ref.current.rotation.y = state.clock.elapsedTime * 0.01;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color="#c9a84c" size={0.04} sizeAttenuation depthWrite={false} opacity={0.6} blending={THREE.AdditiveBlending} />
    </Points>
  );
}

function GoldDust() {
  const ref = useRef<THREE.Points>(null);
  const count = 800;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const posAttr = ref.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t * 0.5 + i) * 0.003;
      arr[i * 3] += Math.cos(t * 0.3 + i * 0.5) * 0.001;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color="#e8d48b" size={0.02} sizeAttenuation depthWrite={false} opacity={0.35} blending={THREE.AdditiveBlending} />
    </Points>
  );
}

/* ─── Musical notation symbols rendered as 3D geometry ─── */

function MusicSymbol({ position, symbolType, scale, speed, offset }: {
  position: [number, number, number];
  symbolType: string;
  scale: number;
  speed: number;
  offset: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * speed + offset) * 2;
    ref.current.position.x = position[0] + Math.cos(t * speed * 0.6 + offset) * 0.8;
    ref.current.rotation.z = Math.sin(t * speed * 0.3 + offset) * 0.4;
    ref.current.rotation.y = t * 0.15 + offset;
  });

  if (symbolType === "trebleClef") {
    return (
      <group ref={ref} position={position} scale={scale}>
        <mesh><torusGeometry args={[0.3, 0.03, 8, 16]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.12} /></mesh>
        <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.02, 0.02, 1.2, 4]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.1} /></mesh>
        <mesh position={[0, -0.4, 0]}><sphereGeometry args={[0.12, 6, 6]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.1} /></mesh>
      </group>
    );
  }

  if (symbolType === "quarterNote" || symbolType === "eighthNote") {
    return (
      <group ref={ref} position={position} scale={scale}>
        <mesh rotation={[0, 0, 0.4]}><sphereGeometry args={[0.2, 6, 6]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.13} /></mesh>
        <mesh position={[0.15, 0.7, 0]}><cylinderGeometry args={[0.015, 0.015, 1.3, 4]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.1} /></mesh>
        {symbolType === "eighthNote" && (
          <mesh position={[0.3, 1.1, 0]} rotation={[0, 0, -0.6]}><cylinderGeometry args={[0.01, 0.03, 0.5, 4]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.08} /></mesh>
        )}
      </group>
    );
  }

  if (symbolType === "sharp") {
    return (
      <group ref={ref} position={position} scale={scale}>
        <mesh position={[-0.15, 0, 0]}><cylinderGeometry args={[0.015, 0.015, 1, 4]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.1} /></mesh>
        <mesh position={[0.15, 0, 0]}><cylinderGeometry args={[0.015, 0.015, 1, 4]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.1} /></mesh>
        <mesh position={[0, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.6, 4]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.08} /></mesh>
        <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.6, 4]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.08} /></mesh>
      </group>
    );
  }

  if (symbolType === "rest") {
    return (
      <group ref={ref} position={position} scale={scale}>
        <mesh><cylinderGeometry args={[0.02, 0.02, 0.8, 4]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.1} /></mesh>
        <mesh position={[0.15, 0.2, 0]} rotation={[0, 0, 0.8]}><cylinderGeometry args={[0.015, 0.015, 0.4, 4]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.08} /></mesh>
        <mesh position={[-0.1, -0.2, 0]} rotation={[0, 0, -0.6]}><cylinderGeometry args={[0.015, 0.015, 0.35, 4]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.08} /></mesh>
      </group>
    );
  }

  if (symbolType === "doubleNote") {
    return (
      <group ref={ref} position={position} scale={scale}>
        <mesh position={[-0.2, 0, 0]} rotation={[0, 0, 0.3]}><sphereGeometry args={[0.18, 6, 6]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.12} /></mesh>
        <mesh position={[0.2, 0.1, 0]} rotation={[0, 0, 0.3]}><sphereGeometry args={[0.18, 6, 6]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.12} /></mesh>
        <mesh position={[-0.05, 0.7, 0]}><cylinderGeometry args={[0.012, 0.012, 1.2, 4]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.09} /></mesh>
        <mesh position={[0.35, 0.8, 0]}><cylinderGeometry args={[0.012, 0.012, 1.2, 4]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.09} /></mesh>
        <mesh position={[0.15, 1.3, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.5, 4]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.08} /></mesh>
      </group>
    );
  }

  // flat
  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.015, 0.015, 1, 4]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.1} /></mesh>
      <mesh position={[0.12, -0.15, 0]}><sphereGeometry args={[0.15, 6, 6]} /><meshBasicMaterial color="#c9a84c" transparent opacity={0.08} wireframe /></mesh>
    </group>
  );
}

function FloatingMusicSymbols() {
  const symbols = useMemo(() => {
    const types = ["trebleClef", "quarterNote", "eighthNote", "sharp", "flat", "rest", "doubleNote", "quarterNote", "eighthNote", "trebleClef", "sharp", "rest", "flat", "eighthNote", "doubleNote", "quarterNote", "trebleClef", "rest"];
    return types.map((type) => ({
      type,
      position: [
        (Math.random() - 0.5) * 24,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 14,
      ] as [number, number, number],
      scale: 0.4 + Math.random() * 1,
      speed: 0.12 + Math.random() * 0.3,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  return (
    <>
      {symbols.map((s, i) => (
        <MusicSymbol key={i} position={s.position} symbolType={s.type} scale={s.scale} speed={s.speed} offset={s.offset} />
      ))}
    </>
  );
}

/* ─── Background staff lines (pentagrama) ─── */

function StaffLines() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t * 0.05) * 0.08;
    ref.current.position.y = Math.sin(t * 0.12) * 0.3;
  });

  return (
    <group ref={ref} position={[0, 0, -10]} rotation={[0.05, 0, 0]}>
      {[-0.8, -0.4, 0, 0.4, 0.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <boxGeometry args={[24, 0.006, 0.006]} />
          <meshBasicMaterial color="#c9a84c" transparent opacity={0.03} />
        </mesh>
      ))}
    </group>
  );
}

function FloatingOrbs() {
  const ref = useRef<THREE.Group>(null);
  const count = 6;
  const orbs = useMemo(() => Array.from({ length: count }, () => ({
    position: [(Math.random() - 0.5) * 18, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 10] as [number, number, number],
    scale: 0.08 + Math.random() * 0.18,
    speed: 0.2 + Math.random() * 0.4,
    offset: Math.random() * Math.PI * 2,
  })), []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.children.forEach((child, i) => {
      const orb = orbs[i];
      const t = state.clock.elapsedTime;
      child.position.y = orb.position[1] + Math.sin(t * orb.speed + orb.offset) * 2;
      child.position.x = orb.position[0] + Math.cos(t * orb.speed * 0.5 + orb.offset) * 1;
      child.rotation.x = t * 0.3;
      child.rotation.z = t * 0.2;
    });
  });

  return (
    <group ref={ref}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.position} scale={orb.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#c9a84c" transparent opacity={0.1} wireframe />
        </mesh>
      ))}
    </group>
  );
}

function WireframeRings() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.children.forEach((child, i) => {
      child.rotation.x = t * 0.1 * (i + 1);
      child.rotation.y = t * 0.15 * (i + 1);
    });
  });

  return (
    <group ref={ref} position={[0, 0, -5]}>
      {[3, 4.5, 6].map((radius, i) => (
        <mesh key={i}>
          <torusGeometry args={[radius, 0.01, 8, 64]} />
          <meshBasicMaterial color="#c9a84c" transparent opacity={0.06 - i * 0.015} />
        </mesh>
      ))}
    </group>
  );
}

const ParticleField = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <MouseReactiveParticles />
          <GoldDust />
          <FloatingMusicSymbols />
          <StaffLines />
          <FloatingOrbs />
          <WireframeRings />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ParticleField;
