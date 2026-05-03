import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../../store';

const ClientLayer: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { trafficMultiplier } = useStore();
  const count = 1000;
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      // Cloud roughly bounded in a 15x15x15 area
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 15;
      temp.push({ t, speed, x, y, z });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    
    particles.forEach((particle, i) => {
      particle.t += particle.speed * (trafficMultiplier > 1 ? 5 : 1);
      
      dummy.position.set(
        particle.x + Math.sin(particle.t) * 0.5,
        particle.y + Math.cos(particle.t) * 0.5,
        particle.z + Math.sin(particle.t * 0.5) * 0.5
      );
      
      const s = Math.max(0.1, Math.sin(particle.t * 2) * 0.5 + 0.5);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#00f0ff" toneMapped={false} />
      </instancedMesh>
    </group>
  );
};

export default ClientLayer;
