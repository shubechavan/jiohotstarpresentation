import React, { useRef, useMemo} from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../../store';

const MAX_NODES = 500;

const EksCluster: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { eksNodeCount, trafficMultiplier, isPanicMode } = useStore();
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = new THREE.Color();
  
  // Pre-calculate positions for grid
  const nodeData = useMemo(() => {
    const data = [];
    const columns = 20;
    const spacing = 1.5;
    for (let i = 0; i < MAX_NODES; i++) {
      const row = Math.floor(i / columns);
      const col = i % columns;
      // Hexagonal offset
      const xOffset = row % 2 === 0 ? 0 : spacing / 2;
      const x = col * spacing + xOffset - (columns * spacing) / 2;
      const z = row * spacing * 0.866 - (MAX_NODES / columns * spacing) / 2;
      
      data.push({ x, z, scaleY: 0 });
    }
    return data;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    for (let i = 0; i < MAX_NODES; i++) {
      const data = nodeData[i];
      const isActive = i < eksNodeCount && !isPanicMode;
      
      // Animate scale (grow when active, shrink when inactive)
      const targetScale = isActive ? 1 + Math.sin(t * 2 + i) * 0.1 : 0;
      data.scaleY += (targetScale - data.scaleY) * 0.1;

      if (data.scaleY > 0.01) {
        dummy.position.set(data.x, data.scaleY * 0.5, data.z);
        dummy.scale.set(1, data.scaleY, 1);
        dummy.rotation.y = Math.PI / 6; // align hexagons
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);

        // Colors
        if (trafficMultiplier > 1) {
          // Orange/Red for heavy load
          color.setHSL(0.05 + Math.sin(t * 10 + i) * 0.05, 1, 0.5);
        } else {
          // Normal Green
          color.setHSL(0.3 + Math.sin(t + i) * 0.05, 0.8, 0.4);
        }
        meshRef.current.setColorAt(i, color);
      } else {
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group>
      <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_NODES]}>
        <cylinderGeometry args={[0.6, 0.6, 1, 6]} />
        <meshStandardMaterial 
          toneMapped={false} 
          emissiveIntensity={trafficMultiplier > 1 ? 2 : 1} 
        />
      </instancedMesh>
      
      {/* Platform */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[32, 0.2, 25]} />
        <meshStandardMaterial color="#111" wireframe />
      </mesh>
    </group>
  );
};

export default EksCluster;
