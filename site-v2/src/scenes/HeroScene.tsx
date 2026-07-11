import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function DigitalHorizon() {
  const horizonRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (horizonRef.current) horizonRef.current.position.z = -2.8 + Math.sin(clock.elapsedTime * 0.25) * 0.04;
  });

  const towers = [
    [-3.8, 0.7, 0.48, 1.4],
    [-3.1, 0.9, 0.58, 1.8],
    [-2.25, 1.2, 0.68, 2.4],
    [-1.25, 0.8, 0.62, 1.6],
    [0.1, 1.05, 0.78, 2.1],
    [1.2, 0.72, 0.62, 1.44]
  ] as const;

  return (
    <group ref={horizonRef} position={[0.6, -1.58, -2.8]}>
      <gridHelper args={[22, 28, "#1f8ca7", "#17233b"]} position={[0, 0, 0]} scale={[1, 1, 1.5]} />
      <group position={[-0.2, 0.02, -2.2]}>
        {towers.map(([x, y, width, height], index) => (
          <mesh key={x} position={[x, y, 0]}>
            <boxGeometry args={[width, height, 0.34]} />
            <meshStandardMaterial
              color="#111b30"
              roughness={0.48}
              metalness={0.28}
              emissive={index % 2 ? "#193252" : "#132c42"}
              emissiveIntensity={0.28}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function SignalNodes() {
  const points = useMemo(
    () => [
      new THREE.Vector3(-3.6, 1.55, -3.2),
      new THREE.Vector3(-2.1, 2.1, -3.7),
      new THREE.Vector3(-0.45, 1.72, -3.35),
      new THREE.Vector3(1.05, 2.25, -3.9)
    ],
    []
  );

  return (
    <group>
      {points.map((point, index) => (
        <mesh key={index} position={point}>
          <sphereGeometry args={[0.045, 14, 14]} />
          <meshBasicMaterial color={index % 2 ? "#b76cff" : "#44e7f5"} />
        </mesh>
      ))}
      {points.slice(0, -1).map((point, index) => {
        const next = points[index + 1];
        const midpoint = point.clone().lerp(next, 0.5);
        const direction = next.clone().sub(point);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          direction.clone().normalize()
        );
        return (
          <mesh key={`line-${index}`} position={midpoint} quaternion={quaternion}>
            <cylinderGeometry args={[0.006, 0.006, direction.length(), 6]} />
            <meshBasicMaterial color="#44e7f5" transparent opacity={0.2} />
          </mesh>
        );
      })}
    </group>
  );
}

function TideCoin() {
  const coinRef = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, "/assets/tide-logo.webp");
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  useFrame(({ clock, pointer }) => {
    if (!coinRef.current) return;
    const intro = easeOutCubic(Math.min(clock.elapsedTime / 2.4, 1));
    const idle = clock.elapsedTime - 2.4;
    coinRef.current.position.x = THREE.MathUtils.lerp(3.65, 2.35, intro) + pointer.x * 0.08;
    coinRef.current.position.y = THREE.MathUtils.lerp(-0.15, 0.1, intro) + Math.sin(idle * 0.42) * 0.035;
    coinRef.current.rotation.x = THREE.MathUtils.lerp(-0.22, -0.08, intro) - pointer.y * 0.035;
    coinRef.current.rotation.y = THREE.MathUtils.lerp(-1.3, -0.16, intro) + Math.sin(idle * 0.3) * 0.09 + pointer.x * 0.1;
    coinRef.current.rotation.z = THREE.MathUtils.lerp(0.34, -0.04, intro) + Math.sin(idle * 0.22) * 0.015;
  });

  return (
    <group ref={coinRef} scale={1.38}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.24, 96, 1, false]} />
        <meshPhysicalMaterial
          color="#8ea4b7"
          metalness={0.92}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.12}
          envMapIntensity={1.2}
        />
      </mesh>
      <mesh position={[0, 0, 0.126]}>
        <circleGeometry args={[0.91, 96]} />
        <meshPhysicalMaterial
          map={texture}
          color="#ffffff"
          metalness={0.18}
          roughness={0.28}
          clearcoat={0.75}
          clearcoatRoughness={0.18}
        />
      </mesh>
      <mesh position={[0, 0, -0.126]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.91, 96]} />
        <meshPhysicalMaterial map={texture} metalness={0.18} roughness={0.3} clearcoat={0.7} />
      </mesh>
      {[0.95, 0.985, 1.015].map((radius, index) => (
        <mesh key={radius} position={[0, 0, 0.132 + index * 0.003]}>
          <torusGeometry args={[radius, index === 1 ? 0.012 : 0.006, 10, 96]} />
          <meshStandardMaterial
            color={index === 1 ? "#d4faff" : "#6a7d90"}
            metalness={0.95}
            roughness={0.16}
            emissive={index === 1 ? "#178ea8" : "#000000"}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

function CoinHalo() {
  const haloRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (haloRef.current) haloRef.current.rotation.z = clock.elapsedTime * 0.025;
  });

  return (
    <group ref={haloRef} position={[2.35, 0.1, -0.65]} rotation={[0.02, -0.1, 0]}>
      <mesh>
        <torusGeometry args={[1.82, 0.008, 6, 120]} />
        <meshBasicMaterial color="#44e7f5" transparent opacity={0.18} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 3]}>
        <torusGeometry args={[2.08, 0.006, 6, 120, Math.PI * 1.45]} />
        <meshBasicMaterial color="#b76cff" transparent opacity={0.14} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.32} />
      <hemisphereLight args={["#bfefff", "#05070d", 1.1]} />
      <spotLight position={[1.6, 4.5, 4.4]} color="#d6f8ff" intensity={28} angle={0.5} penumbra={0.9} distance={11} />
      <pointLight position={[4.6, 0.6, 2.4]} color="#aa49ff" intensity={9} distance={8} />
      <pointLight position={[0.6, -1.2, 2.2]} color="#27dbea" intensity={7} distance={7} />
      <DigitalHorizon />
      <SignalNodes />
      <CoinHalo />
      <TideCoin />
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.65, 6.6], fov: 43 }}
      dpr={[1, 1.4]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
    >
      <fog attach="fog" args={["#050914", 7, 16]} />
      <Scene />
    </Canvas>
  );
}
