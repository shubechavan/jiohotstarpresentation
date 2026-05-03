import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../../store';

const DBTower: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { isPanicMode, trafficMultiplier } = useStore();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    // Slow rotation
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
  });

  const isActive = !isPanicMode;
  const glowColor = isActive ? (trafficMultiplier > 1 ? '#ff5500' : '#00ffaa') : '#333333';

  return (
    <group ref={groupRef} position={position}>
      {/* 3 Disks to make a stack */}
      {[0, 1.2, 2.4].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 1, 32]} />
          <meshStandardMaterial 
            color="#222" 
            metalness={0.8}
            roughness={0.2}
          />
          {/* Glowing rim */}
          <mesh position={[0, 0, 0]} scale={[1.05, 0.2, 1.05]}>
            <cylinderGeometry args={[1.5, 1.5, 1, 32]} />
            <meshBasicMaterial color={glowColor} />
          </mesh>
        </mesh>
      ))}
    </group>
  );
};

const Databases: React.FC = () => {
  return (
    <group>
      <DBTower position={[0, 0, -4]} />
      <DBTower position={[0, 0, 4]} />
      <DBTower position={[-4, 0, 0]} />
    </group>
  );
};

export default Databases;
