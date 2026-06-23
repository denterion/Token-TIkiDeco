import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function easeInOutCubic(value: number) {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

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

function TikiCoin() {
  const coinRef = useRef<THREE.Group>(null);
  const faceTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext("2d");
    if (!context) return null;

    const gradient = context.createLinearGradient(80, 80, 432, 432);
    gradient.addColorStop(0, "#25d9f2");
    gradient.addColorStop(0.46, "#315bff");
    gradient.addColorStop(1, "#e442ff");
    context.fillStyle = "#061120";
    context.fillRect(0, 0, 512, 512);
    context.beginPath();
    context.arc(256, 256, 226, 0, Math.PI * 2);
    context.fillStyle = gradient;
    context.fill();
    context.beginPath();
    context.arc(256, 256, 196, 0, Math.PI * 2);
    context.fillStyle = "#07101f";
    context.fill();
    context.lineWidth = 12;
    context.strokeStyle = "#25d9f2";
    context.stroke();
    context.font = "900 145px Georgia, serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#f8f3e7";
    context.fillText("T", 256, 234);
    context.font = "800 54px Arial, sans-serif";
    context.fillStyle = "#9af7ff";
    context.fillText("TIDE", 256, 344);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
  }, []);

  useFrame(({ clock }) => {
    if (!coinRef.current) return;
    const cycle = (clock.elapsedTime * 0.19) % 1;
    const drop = easeInOutCubic(cycle);
    const arc = Math.sin(cycle * Math.PI) * 0.7;
    coinRef.current.position.set(-1.25 + drop * 2.75, 1.65 - drop * 2.34 + arc, -1.08 + drop * 0.32);
    coinRef.current.rotation.y = clock.elapsedTime * 2.55;
    coinRef.current.rotation.x = 0.34 + Math.sin(clock.elapsedTime * 1.6) * 0.22;
    const scale = cycle > 0.88 ? 1 - (cycle - 0.88) * 2.2 : 1;
    coinRef.current.scale.setScalar(Math.max(0.72, scale));
  });

  return (
    <group ref={coinRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.48, 0.48, 0.12, 72]} />
        <meshStandardMaterial color="#d9fbff" metalness={0.58} roughness={0.22} emissive="#1155ff" emissiveIntensity={0.16} />
      </mesh>
      <mesh position={[0, 0, 0.064]}>
        <circleGeometry args={[0.43, 72]} />
        <meshBasicMaterial map={faceTexture ?? undefined} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.064]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.43, 72]} />
        <meshBasicMaterial map={faceTexture ?? undefined} toneMapped={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.49, 0.018, 10, 96]} />
        <meshBasicMaterial color="#25d9f2" />
      </mesh>
    </group>
  );
}

function CryptoWallet() {
  const walletRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!walletRef.current) return;
    walletRef.current.rotation.y = -0.28 + Math.sin(clock.elapsedTime * 0.35) * 0.05;
    walletRef.current.position.y = -1.05 + Math.sin(clock.elapsedTime * 0.9) * 0.025;
  });

  return (
    <group ref={walletRef} position={[1.55, -1.05, -1.15]} rotation={[0.08, -0.28, 0]}>
      <mesh>
        <boxGeometry args={[1.95, 0.82, 0.34]} />
        <meshPhysicalMaterial color="#081424" roughness={0.28} metalness={0.18} transmission={0.08} thickness={0.5} />
      </mesh>
      <mesh position={[0, 0.34, 0.02]} rotation={[0.18, 0, 0]}>
        <boxGeometry args={[1.78, 0.18, 0.39]} />
        <meshStandardMaterial color="#142437" roughness={0.32} metalness={0.2} emissive="#071a25" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.68, 0.02, 0.2]}>
        <boxGeometry args={[0.32, 0.28, 0.04]} />
        <meshBasicMaterial color="#25d9f2" transparent opacity={0.9} />
      </mesh>
      <mesh position={[-0.18, 0.43, 0.24]}>
        <boxGeometry args={[1.05, 0.035, 0.035]} />
        <meshBasicMaterial color="#b55cff" transparent opacity={0.86} />
      </mesh>
      <mesh position={[0, -0.5, 0.14]}>
        <torusGeometry args={[0.64, 0.014, 8, 80, Math.PI]} />
        <meshBasicMaterial color="#25d9f2" transparent opacity={0.38} />
      </mesh>
    </group>
  );
}

function DigitalPalms() {
  const groupRef = useRef<THREE.Group>(null);
  const palmData = [
    [-4.45, -1.08, -2.2, 1.08],
    [4.28, -1.02, -2.5, 0.9]
  ] as const;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.22) * 0.012;
  });

  return (
    <group ref={groupRef}>
      {palmData.map(([x, y, z, scale], palmIndex) => (
        <group key={palmIndex} position={[x, y, z]} scale={scale}>
          <mesh position={[0, 0.58, 0]} rotation={[0, 0, -0.08]}>
            <cylinderGeometry args={[0.014, 0.028, 1.5, 7]} />
            <meshBasicMaterial color="#25d9f2" transparent opacity={0.46} />
          </mesh>
          {[-0.9, -0.48, 0, 0.48, 0.9].map((angle, index) => (
            <mesh key={angle} position={[0.02, 1.28, 0]} rotation={[0, 0, angle + (palmIndex ? -0.18 : 0.18)]}>
              <boxGeometry args={[0.72 - index * 0.035, 0.022, 0.018]} />
              <meshBasicMaterial color={index % 2 ? "#7c3cff" : "#25d9f2"} transparent opacity={0.44} />
            </mesh>
          ))}
          <mesh position={[0.02, 1.28, 0]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshBasicMaterial color="#f8f3e7" transparent opacity={0.78} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function NeonSign() {
  return (
    <group position={[-2.88, 0.1, -1.7]} rotation={[0, 0.2, 0]}>
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
      <DigitalPalms />
      <BlockchainNodes />
      <CryptoWallet />
      <TikiCoin />
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
