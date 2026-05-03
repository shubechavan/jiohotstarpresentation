import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

import ClientLayer from './nodes/ClientLayer';
import CDNLayer from './nodes/CDNLayer';
import EnvoyGateway from './nodes/EnvoyGateway';
import EksCluster from './nodes/EksCluster';
import Databases from './nodes/Databases';
import DataFlow from './DataFlow';
import { useStore } from '../store';
import { SLIDES } from '../slides';

const CameraRig = () => {
  const { currentSlide } = useStore();
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_state, delta) => {

    const slide = SLIDES[currentSlide];
    if (!slide) return;

    // Smoothly interpolate camera position
    targetPosition.current.set(...(slide.cameraPos as [number, number, number]));
    camera.position.lerp(targetPosition.current, 1.5 * delta);

    // Smoothly interpolate look target
    targetLookAt.current.set(...(slide.cameraTarget as [number, number, number]));
    currentLookAt.current.lerp(targetLookAt.current, 1.5 * delta);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};

const Scene: React.FC = () => {
  return (
    <Canvas style={{ background: '#04060f' }}>
      <PerspectiveCamera makeDefault position={[0, 20, 35]} fov={50} />
      <CameraRig />
      
      <ambientLight intensity={0.4} />
      <pointLight position={[-20, 20, 10]} intensity={1.5} color="#00bfff" />
      <pointLight position={[20, 10, -10]} intensity={1.5} color="#ff00ff" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Background Teal Particles like the HTML demo */}
      <points>
        <bufferGeometry>
       + <bufferAttribute 
   attach="attributes-position" 
   args={[new Float32Array(300 * 3).map(() => (Math.random() - 0.5) * 60), 3]}
/>
        </bufferGeometry>
        <pointsMaterial color="#00C2CB" size={0.15} transparent opacity={0.38} />
      </points>
      
      {/* Network Nodes */}
      <group position={[-20, 0, 0]}>
        <ClientLayer />
      </group>

      <group position={[-10, 0, 0]}>
        <CDNLayer />
      </group>

      <group position={[0, 0, 0]}>
        <EnvoyGateway />
      </group>

      <group position={[12, -2, -5]}>
        <EksCluster />
      </group>

      <group position={[25, 0, -10]}>
        <Databases />
      </group>

      {/* Particle Flows */}
      <DataFlow />

      {/* Post Processing for Neon Glow */}
     <EffectComposer enableNormalPass>
        <Bloom 
          luminanceThreshold={0.1} 
          mipmapBlur 
          intensity={1.0} 
        />
      </EffectComposer>
    </Canvas>
  );
};

export default Scene;
