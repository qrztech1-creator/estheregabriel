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
      const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
      arr[ix] += velocities[ix]; arr[iy] += velocities[iy]; arr[iz] += velocities[iz];
      const dx = arr[ix] - mx, dy = arr[iy] - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 3) { const force = (3 - dist) * 0.008; arr[ix] += dx * force; arr[iy] += dy * force; }
      if (arr[ix] > 15) arr[ix] = -15; if (arr[ix] < -15) arr[ix] = 15;
      if (arr[iy] > 15) arr[iy] = -15; if (arr[iy] < -15) arr[iy] = 15;
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

/* ─── Musical notation symbols ─── */

function FloatingSymbol({ position, speed, offset, children }: {
  position: [number, number, number]; speed: number; offset: number; children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * speed + offset) * 2;
    ref.current.position.x = position[0] + Math.cos(t * speed * 0.6 + offset) * 0.8;
    ref.current.rotation.z = Math.sin(t * speed * 0.3 + offset) * 0.3;
    ref.current.rotation.y = t * 0.15 + offset;
  });
  return <group ref={ref} position={position}>{children}</group>;
}

/* Quarter note: filled oval head + vertical stem */
function QuarterNote({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      {/* Note head - oval tilted */}
      <mesh rotation={[0, 0, -0.3]} scale={[1, 0.75, 0.4]}>
        <sphereGeometry args={[0.22, 12, 8]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.15} />
      </mesh>
      {/* Stem */}
      <mesh position={[0.18, 0.75, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.4, 6]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

/* Eighth note: quarter note + flag */
function EighthNote({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      <mesh rotation={[0, 0, -0.3]} scale={[1, 0.75, 0.4]}>
        <sphereGeometry args={[0.22, 12, 8]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.15} />
      </mesh>
      <mesh position={[0.18, 0.75, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.4, 6]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.12} />
      </mesh>
      {/* Flag - curved line */}
      <mesh position={[0.32, 1.2, 0]} rotation={[0.2, 0, -0.8]} scale={[0.6, 1, 0.3]}>
        <torusGeometry args={[0.25, 0.015, 6, 12, Math.PI * 0.7]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

/* Double beamed notes */
function BeamedNotes({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      {/* Two note heads */}
      <mesh position={[-0.2, 0, 0]} rotation={[0, 0, -0.3]} scale={[1, 0.75, 0.4]}>
        <sphereGeometry args={[0.18, 12, 8]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.14} />
      </mesh>
      <mesh position={[0.25, 0.05, 0]} rotation={[0, 0, -0.3]} scale={[1, 0.75, 0.4]}>
        <sphereGeometry args={[0.18, 12, 8]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.14} />
      </mesh>
      {/* Two stems */}
      <mesh position={[-0.05, 0.7, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 1.2, 6]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.1} />
      </mesh>
      <mesh position={[0.4, 0.75, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 1.3, 6]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.1} />
      </mesh>
      {/* Beam connecting tops */}
      <mesh position={[0.175, 1.3, 0]} rotation={[0, 0, 0.06]}>
        <boxGeometry args={[0.5, 0.06, 0.03]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

/* Treble Clef - simplified recognizable shape */
function TrebleClef({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      {/* Main curl */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.28, 0.025, 8, 20, Math.PI * 1.5]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.13} />
      </mesh>
      {/* Upper vertical line */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.2, 6]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.11} />
      </mesh>
      {/* Bottom small circle */}
      <mesh position={[0.05, -0.4, 0]}>
        <torusGeometry args={[0.1, 0.02, 6, 12]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.09} />
      </mesh>
      {/* Dot at bottom */}
      <mesh position={[0.05, -0.55, 0]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

/* Sharp symbol: # */
function SharpSymbol({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      {/* Two vertical lines */}
      <mesh position={[-0.12, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.9, 6]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.12} />
      </mesh>
      <mesh position={[0.12, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.9, 6]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.12} />
      </mesh>
      {/* Two horizontal lines (slightly angled) */}
      <mesh position={[0, 0.15, 0]} rotation={[0, 0, Math.PI / 2 + 0.15]}>
        <cylinderGeometry args={[0.014, 0.014, 0.55, 6]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.1} />
      </mesh>
      <mesh position={[0, -0.15, 0]} rotation={[0, 0, Math.PI / 2 + 0.15]}>
        <cylinderGeometry args={[0.014, 0.014, 0.55, 6]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

/* Flat symbol: b shape */
function FlatSymbol({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      {/* Vertical line */}
      <mesh position={[-0.1, 0.25, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 1, 6]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.12} />
      </mesh>
      {/* Rounded bump */}
      <mesh position={[0.05, -0.15, 0]} rotation={[0, 0, -0.2]}>
        <torusGeometry args={[0.18, 0.02, 6, 12, Math.PI]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

/* Quarter rest: zigzag */
function QuarterRest({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0.6]}>
        <cylinderGeometry args={[0.018, 0.018, 0.35, 6]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.12} />
      </mesh>
      <mesh position={[0.08, 0.05, 0]} rotation={[0, 0, -0.6]}>
        <cylinderGeometry args={[0.018, 0.018, 0.35, 6]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.11} />
      </mesh>
      <mesh position={[0, -0.2, 0]} rotation={[0, 0, 0.6]}>
        <cylinderGeometry args={[0.018, 0.018, 0.35, 6]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.1} />
      </mesh>
      {/* Small curved ending */}
      <mesh position={[-0.08, -0.42, 0]}>
        <torusGeometry args={[0.08, 0.015, 6, 8, Math.PI]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.09} />
      </mesh>
    </group>
  );
}

function FloatingMusicSymbols() {
  const symbols = useMemo(() => {
    const defs: { component: React.FC<{ scale?: number }>; scale: number }[] = [
      { component: QuarterNote, scale: 0.7 },
      { component: EighthNote, scale: 0.8 },
      { component: BeamedNotes, scale: 0.6 },
      { component: TrebleClef, scale: 0.9 },
      { component: SharpSymbol, scale: 0.7 },
      { component: FlatSymbol, scale: 0.75 },
      { component: QuarterRest, scale: 0.65 },
      { component: QuarterNote, scale: 0.5 },
      { component: EighthNote, scale: 0.6 },
      { component: TrebleClef, scale: 0.7 },
      { component: SharpSymbol, scale: 0.55 },
      { component: BeamedNotes, scale: 0.5 },
      { component: FlatSymbol, scale: 0.6 },
      { component: QuarterRest, scale: 0.5 },
      { component: QuarterNote, scale: 0.65 },
      { component: EighthNote, scale: 0.7 },
    ];
    return defs.map((d) => ({
      ...d,
      position: [
        (Math.random() - 0.5) * 24,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 14,
      ] as [number, number, number],
      speed: 0.12 + Math.random() * 0.25,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  return (
    <>
      {symbols.map((s, i) => (
        <FloatingSymbol key={i} position={s.position} speed={s.speed} offset={s.offset}>
          <s.component scale={s.scale} />
        </FloatingSymbol>
      ))}
    </>
  );
}

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
      <Canvas camera={{ position: [0, 0, 10], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: false, alpha: true }} style={{ background: "transparent" }}>
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
