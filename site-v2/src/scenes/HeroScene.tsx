import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function OceanGrid() {
  const gridRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!gridRef.current) return;
    gridRef.current.position.z = Math.sin(clock.elapsedTime * 0.35) * 0.08;
  });

  const lines = useMemo(() => {
    const items = [];
    for (let i = -12; i <= 12; i += 1) {
      items.push(
        <line key={`x-${i}`}>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([-12, 0, i, 12, 0, i])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial attach="material" color="#25d9f2" transparent opacity={0.16} />
        </line>
      );
      items.push(
        <line key={`z-${i}`}>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([i, 0, -12, i, 0, 12])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial attach="material" color="#7c3cff" transparent opacity={0.09} />
        </line>
      );
    }
    return items;
  }, []);

  return (
    <group ref={gridRef} rotation={[-Math.PI / 2.55, 0, 0]} position={[0, -1.65, -0.5]}>
      {lines}
      <mesh position={[0, -0.03, 0]}>
        <planeGeometry args={[28, 28, 24, 24]} />
        <meshStandardMaterial color="#06152b" roughness={0.9} metalness={0.15} transparent opacity={0.44} />
      </mesh>
    </group>
  );
}

function ResortSilhouette() {
  const groupRef = useRef<THREE.Group>(null);
  const buildings = [
    [-2.2, -0.45, -3.5, 0.42, 1.35, 0.48],
    [-1.55, -0.2, -3.65, 0.5, 1.85, 0.55],
    [-0.82, 0.1, -3.85, 0.56, 2.45, 0.6],
    [0.04, -0.05, -3.7, 0.72, 2.15, 0.64],
    [0.95, -0.38, -3.45, 0.54, 1.48, 0.5]
  ] as const;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.04;
    groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.45) * 0.006;
  });

  return (
      <group ref={groupRef} position={[2.1, -0.55, -1.4]} rotation={[0, -0.27, 0]}>
        {buildings.map(([x, y, z, w, h, d], index) => (
          <mesh key={index} position={[x, y + h / 2, z]}>
            <boxGeometry args={[w, h, d]} />
            <meshPhysicalMaterial
              color="#bdefff"
              roughness={0.22}
              metalness={0.1}
              transmission={0.28}
              thickness={0.7}
              emissive={index % 2 ? "#5a2cff" : "#09d4ff"}
              emissiveIntensity={0.18}
              transparent
              opacity={0.52}
            />
          </mesh>
        ))}
        <mesh position={[-0.45, 2.52, -3.82]}>
          <torusGeometry args={[0.5, 0.018, 8, 56, Math.PI * 1.35]} />
          <meshBasicMaterial color="#25d9f2" transparent opacity={0.7} />
        </mesh>
      </group>
  );
}

function StarField() {
  const positions = useMemo(() => {
    const values = new Float32Array(420 * 3);
    for (let i = 0; i < 420; i += 1) {
      values[i * 3] = (Math.random() - 0.5) * 22;
      values[i * 3 + 1] = Math.random() * 8;
      values[i * 3 + 2] = -4 - Math.random() * 16;
    }
    return values;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={420} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#d8f8ff" size={0.018} transparent opacity={0.72} sizeAttenuation />
    </points>
  );
}

function BlockchainNodes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.18) * 0.08;
  });

  const points = [
    [-2.5, 1.35, -2.2],
    [-1.4, 1.75, -2.8],
    [-0.2, 1.35, -2.15],
    [1.1, 1.85, -2.7],
    [2.3, 1.2, -2.3],
    [3.1, 1.72, -3.05]
  ] as const;

  return (
    <group ref={groupRef}>
      {points.map(([x, y, z], index) => (
        <mesh key={index} position={[x, y, z]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshBasicMaterial color={index % 2 ? "#b55cff" : "#25d9f2"} />
        </mesh>
      ))}
      {points.slice(0, -1).map((point, index) => {
        const next = points[index + 1];
        const start = new THREE.Vector3(...point);
        const end = new THREE.Vector3(...next);
        const mid = start.clone().lerp(end, 0.5);
        const length = start.distanceTo(end);
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().sub(start).normalize());
        return (
          <mesh key={`link-${index}`} position={mid} quaternion={quat}>
            <cylinderGeometry args={[0.008, 0.008, length, 8]} />
            <meshBasicMaterial color="#25d9f2" transparent opacity={0.24} />
          </mesh>
        );
      })}
    </group>
  );
}

function NeonSign() {
  return (
    <group position={[-2.7, 0.55, -1.7]} rotation={[0, 0.2, 0]}>
      <mesh>
        <boxGeometry args={[2.3, 0.62, 0.04]} />
        <meshBasicMaterial color="#07101f" transparent opacity={0.72} />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[2.12, 0.045, 0.02]} />
        <meshBasicMaterial color="#25d9f2" />
      </mesh>
      <mesh position={[0.18, -0.16, 0.05]}>
        <boxGeometry args={[1.4, 0.04, 0.02]} />
        <meshBasicMaterial color="#b55cff" />
      </mesh>
    </group>
  );
}

function SceneObjects() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[-3, 3, 1]} color="#25d9f2" intensity={3.2} distance={8} />
      <pointLight position={[3, 2, -1]} color="#b55cff" intensity={2.4} distance={7} />
      <StarField />
      <OceanGrid />
      <ResortSilhouette />
      <BlockchainNodes />
      <NeonSign />
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 5.2], fov: 46 }}
      dpr={[1, 1.45]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
    >
      <fog attach="fog" args={["#050914", 5.5, 15]} />
      <SceneObjects />
    </Canvas>
  );
}
