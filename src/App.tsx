import React, { Suspense } from 'react';
import Scene from './components/Scene';
import UIOverlay from './components/UIOverlay';
import { Loader } from '@react-three/drei';

function App() {
  return (
    <>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
      <UIOverlay />
      <Loader />
    </>
  );
}

export default App;
