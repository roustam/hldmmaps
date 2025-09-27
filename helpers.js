import * as THREE from 'three';

export function createHelpers(scene) {
  const gridHelper = new THREE.GridHelper(25, 25);
  scene.add(gridHelper);

  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
}
