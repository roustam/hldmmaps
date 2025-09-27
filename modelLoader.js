import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

export function loadModel(scene, camera, controls) {
  const loader = new GLTFLoader();
  loader.load('models/bootcamp_1.glb', 
    function (gltf) {
      console.log('Model loaded successfully');
      scene.add(gltf.scene);
      
      // Center and scale model
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      gltf.scene.position.sub(center);
      
      // Place model on the ground
      gltf.scene.position.y = 0;
      
      const size = box.getSize(new THREE.Vector3()).length();
      const cameraDistance = size / (Math.tan((Math.PI * camera.fov) / 360));
      camera.position.z = cameraDistance * 1.5;
      
      // Debug log model position
      console.log('Model position:', gltf.scene.position);
      console.log('Camera position:', camera.position);
      
      // Make camera look at the model
      camera.lookAt(gltf.scene.position);
      
      controls.update();
    }, 
    undefined, 
    function (error) {
      console.error('Error loading model:', error);
    }
  );
}
