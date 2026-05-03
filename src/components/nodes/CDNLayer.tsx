import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../../store';

const CDNNode: React.FC<{ position: [number, number, number], type: 'cache' | 'nocache' }> = ({ position, type }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { isPanicMode } = useStore();

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.5;
    meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 2 + position[0]) * 0.5;

    // Pulse when panic mode
    if (isPanicMode && type === 'cache') {
      const s = 1 + Math.abs(Math.sin(clock.getElapsedTime() * 5)) * 0.3;
      meshRef.current.scale.set(s, s, s);
    } else {
      meshRef.current.scale.set(1, 1, 1);
    }
  });

  const baseColor = type === 'cache' ? '#0088ff' : '#aa00ff';
  const emissiveColor = type === 'cache' && isPanicMode ? '#00ffff' : baseColor;
  const intensity = type === 'cache' && isPanicMode ? 2 : 0.8;

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[1.5, 0]} />
      <meshStandardMaterial 
        color={baseColor}
        emissive={emissiveColor}
        emissiveIntensity={intensity}
        toneMapped={false}
        wireframe={true}
      />
      {/* Solid inner core */}
      <mesh>
        <octahedronGeometry args={[1.4, 0]} />
        <meshBasicMaterial color={baseColor} transparent opacity={0.3} />
      </mesh>
    </mesh>
  );
};

const CDNLayer: React.FC = () => {
  return (
    <group>
      <CDNNode position={[0, 4, 2]} type="cache" />
      <CDNNode position={[0, -4, -2]} type="cache" />
      <CDNNode position={[0, 0, 4]} type="nocache" />
      <CDNNode position={[0, 0, -4]} type="nocache" />
    </group>
  );
};

export default CDNLayer;
