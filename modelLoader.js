import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function loadModel(scene, camera, controls, options = {}) {
  const {
    path = './assets/models/bootcamp_1.glb',
    name,
    position = {},
    rotation = {},
    scale = 1,
    center = true,
    placeOnGround = true,
    focusCamera = false,
    cameraDistanceMultiplier = 0.5,
    onLoad
  } = options;

  const loader = new GLTFLoader();
  const modelUrl = new URL(path, import.meta.url).href;

  loader.load(
    modelUrl,
    (gltf) => {
      console.log(`Model loaded successfully from ${path}`);

      const root = gltf.scene;
      if (name) {
        root.name = name;
      }

      const modelGroup = new THREE.Group();
      modelGroup.add(root);

      // Center model around origin if requested
      if (center) {
        const initialBox = new THREE.Box3().setFromObject(root);
        const initialCenter = initialBox.getCenter(new THREE.Vector3());
        root.position.sub(initialCenter);
      }

      // Optionally drop lowest point to ground plane (y = 0)
      if (placeOnGround) {
        const centeredBox = new THREE.Box3().setFromObject(root);
        const minY = centeredBox.min.y;
        root.position.y -= minY;
      }

      // Apply scaling (scalar or vector)
      if (typeof scale === 'number') {
        modelGroup.scale.setScalar(scale);
      } else if (scale && typeof scale === 'object') {
        modelGroup.scale.set(
          scale.x ?? 1,
          scale.y ?? 1,
          scale.z ?? 1
        );
      }

      // Apply rotation (in radians)
      modelGroup.rotation.set(
        rotation.x ?? 0,
        rotation.y ?? 0,
        rotation.z ?? 0
      );

      // Apply position
      modelGroup.position.set(
        position.x ?? 0,
        position.y ?? 0,
        position.z ?? 0
      );

      scene.add(modelGroup);
      modelGroup.updateWorldMatrix(true, true);

      if (focusCamera) {
        const worldBox = new THREE.Box3().setFromObject(modelGroup);
        const size = worldBox.getSize(new THREE.Vector3());
        const centerPoint = worldBox.getCenter(new THREE.Vector3());

        const sizeLength = size.length() || 1;
        const baseDistance = sizeLength / Math.tan((Math.PI * camera.fov) / 360);
        const targetDistance = baseDistance * cameraDistanceMultiplier;

        camera.position.set(
          centerPoint.x,
          centerPoint.y + size.y * 0.5,
          centerPoint.z + targetDistance
        );
        camera.lookAt(centerPoint);

        if (controls && controls.target) {
          controls.target.copy(centerPoint);
        }
      }

      if (controls) {
        controls.update();
      }

      if (typeof onLoad === 'function') {
        onLoad(modelGroup, gltf);
      }
    },
    undefined,
    (error) => {
      console.error(`Error loading model from ${path}:`, error);
    }
  );
}
