import * as Babylon from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

export enum MODEL {
  // eslint-disable-next-line no-unused-vars
  MAP_PLAYER = require('@assets/models/map/indicator/player.glb'),
  // eslint-disable-next-line no-unused-vars
  MAP_CIRCLE_INDICATOR = require('@assets/models/map/indicator/circleIndicator.glb')
}

export const LoadModel = async (
  model: MODEL,
  scene: Babylon.Scene
): Promise<boolean> => {
  const sceneGLBUri = resolveAssetSource(model).uri;
  await Babylon.SceneLoader.AppendAsync('', sceneGLBUri, scene);
  return true;
};
