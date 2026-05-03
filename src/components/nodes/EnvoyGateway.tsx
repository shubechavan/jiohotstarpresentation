import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../../store';

const EnvoyGateway: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const { isPanicMode, trafficMultiplier } = useStore();

  useFrame(({ clock }) => {
    if (!meshRef.current || !ringRef.current) return;
    const t = clock.getElapsedTime();
    
    // Rotate the gateway
    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.rotation.x = Math.PI / 2;
    
    ringRef.current.rotation.z = -t * 0.5 * (trafficMultiplier > 1 ? 2 : 1);
    
    // In panic mode, gateway turns dim red and stops spinning
    if (isPanicMode) {
      meshRef.current.rotation.y *= 0.1;
      ringRef.current.rotation.z *= 0.1;
    }
  });

  const color = isPanicMode ? '#550000' : '#00ffaa';
  const emissive = isPanicMode ? '#ff0000' : '#00ffaa';
  const intensity = isPanicMode ? 0.5 : 1 + (trafficMultiplier > 1 ? 1 : 0);

  return (
    <group>
      <mesh ref={meshRef}>
        <torusGeometry args={[3, 0.5, 16, 100]} />
        <meshStandardMaterial 
          color={color}
          emissive={emissive}
          emissiveIntensity={intensity}
          toneMapped={false}
          wireframe={true}
        />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4, 0.05, 16, 100]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Central portal effect */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={isPanicMode ? 0.1 : 0.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export default EnvoyGateway;
