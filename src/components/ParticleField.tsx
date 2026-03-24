import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useRef, useMemo, Suspense, useCallback, useEffect } from "react";
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
    const geo = ref.current.geometry;
    const posAttr = geo.attributes.position;
    const arr = posAttr.array as Float32Array;

    const mx = mouse.current.x * viewport.width * 0.5;
    const my = mouse.current.y * viewport.height * 0.5;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // Add velocity
      arr[ix] += velocities[ix];
      arr[iy] += velocities[iy];
      arr[iz] += velocities[iz];

      // Mouse repulsion
      const dx = arr[ix] - mx;
      const dy = arr[iy] - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 3) {
        const force = (3 - dist) * 0.008;
        arr[ix] += dx * force;
        arr[iy] += dy * force;
      }

      // Wrap around
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
      <PointMaterial
        transparent
        color="#c9a84c"
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
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
      <PointMaterial
        transparent
        color="#e8d48b"
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        opacity={0.35}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function FloatingOrbs() {
  const ref = useRef<THREE.Group>(null);
  const count = 12;

  const orbs = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      scale: 0.08 + Math.random() * 0.25,
      speed: 0.2 + Math.random() * 0.4,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

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
          <FloatingOrbs />
          <WireframeRings />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ParticleField;
