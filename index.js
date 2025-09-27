import * as THREE from 'three';
import { createScene } from './sceneSetup.js';
import { createCamera } from './sceneSetup.js';
import { createRenderer } from './sceneSetup.js';
import { createControls } from './sceneSetup.js';
import { createLights } from './lights.js';
import { createHelpers } from './helpers.js';
import { createGround } from './ground.js';
import { loadModel } from './modelLoader.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// Initialize scene, camera, renderer, and controls
const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
const orbitControls = createControls(camera, renderer);

// Create pointer lock controls
const pointerLockControls = new PointerLockControls(camera, renderer.domElement);

// Get the FPS display element and camera mode indicator
const fpsDisplay = document.getElementById('fps-display');
const cameraModeIndicator = document.getElementById('camera-mode-indicator');

// Initialize variables for FPS calculation
const clock = new THREE.Clock();
let frameCount = 0;
let lastTime = 0;

// Camera mode
let cameraMode = 'orbit'; // 'orbit' or 'free'

// Movement variables
const moveState = {
  forward: false,
  backward: false,
  left: false,
  right: false
};
const velocity = new THREE.Vector3();
const moveSpeed = 10;

// Add event listeners for keydown and keyup
const onKeyDown = (event) => {
  switch (event.code) {
    case 'KeyW':
      moveState.forward = true;
      break;
    case 'KeyS':
      moveState.backward = true;
      break;
    case 'KeyA':
      moveState.left = true;
      break;
    case 'KeyD':
      moveState.right = true;
      break;
    case 'Space':
      // Toggle camera mode
      cameraMode = cameraMode === 'orbit' ? 'free' : 'orbit';
      cameraModeIndicator.textContent = `Camera Mode: ${cameraMode === 'orbit' ? 'Orbit' : 'Free'}`;
      
      if (cameraMode === 'free') {
        // Switch to free mode: disable orbit controls, enable pointer lock
        orbitControls.enabled = false;
        pointerLockControls.lock();
      } else {
        // Switch to orbit mode: unlock pointer and enable orbit controls
        pointerLockControls.unlock();
        orbitControls.enabled = true;
      }
      break;
  }
};

const onKeyUp = (event) => {
  switch (event.code) {
    
    case 'KeyW':
      console.log('KeyW up');
      
      moveState.forward = false;
      break;
    case 'KeyS':
      moveState.backward = false;
      break;
    case 'KeyA':
      moveState.left = false;
      break;
    case 'KeyD':
      moveState.right = false;
      break;
  }
};

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

// Add lights
createLights(scene);

// Add helpers
createHelpers(scene);

// Add ground
createGround(scene);

// Load model
loadModel(scene, camera, orbitControls); // Note: we pass orbitControls to the model loader, but in free mode we don't use it

// Set white background
scene.background = new THREE.Color(0xffffff);

// Animation loop
function animate() {
  const time = clock.getElapsedTime();
  frameCount++;
  
  // Update FPS display every second
  if (time >= lastTime + 1) {
    const fps = frameCount / (time - lastTime);
    fpsDisplay.textContent = `FPS: ${fps.toFixed(1)}`;
    frameCount = 0;
    lastTime = time;
  }
  
  // If in free mode and pointer is locked, update camera movement
  if (cameraMode === 'free' && pointerLockControls.isLocked) {
    const delta = clock.getDelta(); // Time since last frame
    
    // Simple axis-based movement
    if (moveState.forward) {
      camera.position.x += moveSpeed * delta; // W: move right
    }
    if (moveState.backward) {
      camera.position.x -= moveSpeed * delta; // S: move left
    }
    if (moveState.left) {
      camera.position.z += moveSpeed * delta; // A: move forward
    }
    if (moveState.right) {
      camera.position.z -= moveSpeed * delta; // D: move backward
    }
  }
  
  
  
  // Update the controls based on the mode
  if (cameraMode === 'orbit') {
    orbitControls.update();
  } 
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();