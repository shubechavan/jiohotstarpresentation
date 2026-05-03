import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../store';

const PARTICLE_COUNT = 1500;

const DataFlow: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { trafficMultiplier, isPanicMode } = useStore();
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = new THREE.Color();
  
  // Define paths
  const paths = useMemo(() => {
    return [
      // Client to CDN (Cache)
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-15, 0, 0),
        new THREE.Vector3(-12, 2, 1),
        new THREE.Vector3(-10, 4, 2)
      ]),
      // Client to CDN (No Cache)
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-15, 0, 0),
        new THREE.Vector3(-12, -2, -1),
        new THREE.Vector3(-10, 0, 4)
      ]),
      // CDN to Envoy
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, 4, 2),
        new THREE.Vector3(-5, 2, 1),
        new THREE.Vector3(0, 0, 0)
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, 0, 4),
        new THREE.Vector3(-5, -1, 2),
        new THREE.Vector3(0, 0, 0)
      ]),
      // Envoy to EKS
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(6, 1, -2),
        new THREE.Vector3(12, -2, -5)
      ])
    ];
  }, []);

  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Assign particles to different paths
      const pathIndex = Math.floor(Math.random() * paths.length);
      data.push({
        t: Math.random(), // position along curve (0 to 1)
        speed: 0.002 + Math.random() * 0.002,
        pathIndex,
        offset: new THREE.Vector3(
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5
        )
      });
    }
    return data;
  }, [paths]);

  useFrame(() => {
    if (!meshRef.current) return;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];
      const isPostCDN = p.pathIndex > 1; // Paths after CDN
      
      // Update position along curve
      let activeSpeed = p.speed * trafficMultiplier;
      
      // Stop traffic past CDN in panic mode
      if (isPanicMode && isPostCDN) {
        activeSpeed = 0;
        // Optionally make them disappear
        dummy.scale.set(0, 0, 0);
      } else {
        p.t += activeSpeed;
        if (p.t > 1) {
          p.t = 0; // Loop back
        }
        
        const point = paths[p.pathIndex].getPointAt(p.t);
        dummy.position.copy(point).add(p.offset);
        
        // Scale based on traffic
        const s = (Math.sin(p.t * Math.PI) * 0.2) * (trafficMultiplier > 1 ? 1.5 : 1);
        dummy.scale.set(s, s, s);
      }
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Colors
      if (isPanicMode && isPostCDN) {
        color.set('#ff0000'); // Dead particles
      } else if (p.pathIndex === 0 || p.pathIndex === 2) {
        color.set('#0088ff'); // Cacheable (Blue)
      } else if (p.pathIndex === 1 || p.pathIndex === 3) {
        color.set('#aa00ff'); // Non-cacheable (Purple)
      } else {
        color.set(trafficMultiplier > 1 ? '#ff5500' : '#00ffaa'); // To EKS
      }
      meshRef.current.setColorAt(i, color);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
};

export default DataFlow;
