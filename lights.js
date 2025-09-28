import * as THREE from 'three';

export function createLights(scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 100);
  scene.add(directionalLight);
}
