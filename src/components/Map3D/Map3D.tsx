import { memo } from "react";
import React from 'react';
import { TileManager } from './TileManager';
import { Map3DEngine } from './Map3DEngine';
import { SensorProvider } from '@src/context/SensorProvider';
export const Map3D = memo(() => {
  return <SensorProvider>
      <Map3DEngine />
      <TileManager />
    </SensorProvider>;
});