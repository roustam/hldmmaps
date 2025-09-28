import * as THREE from 'three';
import { createScene } from './sceneSetup.js';
import { createCamera } from './sceneSetup.js';
import { createRenderer } from './sceneSetup.js';
import { createControls } from './sceneSetup.js';
import { createLights } from './lights.js';

import { loadModel } from './modelLoader.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// Initialize scene, camera, renderer, and controls
const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
const orbitControls = createControls(camera, renderer);

// Create pointer lock controls
const pointerLockControls = new PointerLockControls(camera, renderer.domElement);
const pointerLockEntity = typeof pointerLockControls.getObject === 'function'
  ? pointerLockControls.getObject()
  : camera;

// Get the FPS display element and camera mode indicator
const fpsDisplay = document.getElementById('fps-display');
const cameraModeIndicator = document.getElementById('camera-mode-indicator');
const crosshair = document.getElementById('crosshair');
const bottomPlaceholder = document.getElementById('bottom-placeholder');

const updateCameraModeIndicator = () => {
  if (!cameraModeIndicator) return;
  const modeLabel = cameraMode === 'orbit' ? 'Orbit' : 'Free';
  cameraModeIndicator.textContent = `Camera Mode: ${modeLabel}`;
};

// Initialize variables for FPS calculation
const clock = new THREE.Clock();
let frameCount = 0;
let lastTime = 0;
let accumulatedTime = 0;

// Camera mode
let cameraMode = 'orbit'; // 'orbit' or 'free'
updateCameraModeIndicator();

// Movement variables
const moveState = {
  forward: false,
  backward: false,
  left: false,
  right: false
};
const velocity = new THREE.Vector3();
const moveSpeed = 10;
const forwardVector = new THREE.Vector3();
const raycaster = new THREE.Raycaster();
const rayDirection = new THREE.Vector3();
const tmpPosition = new THREE.Vector3();

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
      if (crosshair) {
        crosshair.style.display = cameraMode === 'free' ? 'block' : 'none';
      }

      updateCameraModeIndicator();

      if (cameraMode === 'free') {
        // Switch to free mode: disable orbit controls, enable pointer lock
        orbitControls.enabled = false;
        if (pointerLockControls) {
          pointerLockControls.lock();
        }
      } else {
        // Switch to orbit mode: unlock pointer and enable orbit controls
        if (pointerLockControls) {
          pointerLockControls.unlock();
        }
        orbitControls.enabled = true;
      }
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

// Set white background
scene.background = new THREE.Color(0xffffff);

// Animation loop
function animate() {
  const delta = clock.getDelta();
  accumulatedTime += delta;
  frameCount++;

  // Update FPS display every second
  if (accumulatedTime >= lastTime + 1) {
    const fps = frameCount / (accumulatedTime - lastTime);
    if (fpsDisplay) {
      fpsDisplay.textContent = `FPS: ${fps.toFixed(1)}`;
    }
    frameCount = 0;
    lastTime = accumulatedTime;
  }

  // If in free mode and pointer is locked, update camera movement
  if (cameraMode === 'free' && pointerLockControls.isLocked) {
    const moveDistance = moveSpeed * delta;
    forwardVector.set(0, 0, -1);
    forwardVector.applyQuaternion(pointerLockEntity.quaternion).normalize();

    if (moveState.forward) {
      pointerLockEntity.position.addScaledVector(forwardVector, moveDistance);
    }
    if (moveState.backward) {
      pointerLockEntity.position.addScaledVector(forwardVector, -moveDistance);
    }
  }


  // Update the controls based on the mode
  if (cameraMode === 'orbit') {
    orbitControls.update();
  } 

  const freeModeActive = cameraMode === 'free' && pointerLockControls.isLocked;
  if (crosshair) {
    crosshair.style.display = freeModeActive ? 'block' : 'none';
  }

  if (freeModeActive) {
    rayDirection.set(0, 0, -1).applyQuaternion(pointerLockEntity.quaternion).normalize();
    raycaster.set(pointerLockEntity.position, rayDirection);

    const intersections = raycaster.intersectObjects(scene.children, true);

    const firstHit = intersections.find(hit => hit.object && hit.object.visible);
    if (firstHit) {
      const objectName = firstHit.object.name || firstHit.object.parent?.name || 'Unnamed object';
      tmpPosition.copy(firstHit.point);
      if (bottomPlaceholder) {
        bottomPlaceholder.textContent = `${objectName} @ (${tmpPosition.x.toFixed(2)}, ${tmpPosition.y.toFixed(2)}, ${tmpPosition.z.toFixed(2)})`;
      }
    } else {
      if (bottomPlaceholder) {
        bottomPlaceholder.textContent = 'No target';
      }
    }
  } else {
    if (bottomPlaceholder) {
      bottomPlaceholder.textContent = 'пробел - переключение режима камеры, колесо мыши - zoom in / out.';
    }
  }

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

const defaultModelConfigs = [
  {
    name: 'bootcamp-base',
    focusCamera: true,
    cameraDistanceMultiplier: 0.6
  },
  {
    path: './assets/models/rex.glb',
    name: 'rex',
    position: { x: 6, y: 4.5, z: 7 },
    rotation: { y: Math.PI / 2 },
    scale: 20,
    focusCamera: false
  }
];

const presetModelConfigs = {
  bootcamp: defaultModelConfigs,
  bounce: [
    {
      path: './assets/models/bounce_1.glb',
      name: 'bounce-1',
      focusCamera: true,
      cameraDistanceMultiplier: 1
    }
  ],
  stalkyard: [
    {
      path: './assets/models/stalkyard.glb',
      name: 'stalkyard',
      focusCamera: true,
      cameraDistanceMultiplier: 1
    }
  ]
};

const defaultPresetKey = 'bootcamp';

let modelConfigs;
const bodyConfig = document.body?.dataset?.modelConfig;

if (bodyConfig) {
  try {
    const parsed = JSON.parse(bodyConfig);
    if (Array.isArray(parsed) && parsed.length > 0) {
      modelConfigs = parsed;
    }
  } catch (error) {
    console.warn('Failed to parse model configuration, falling back to defaults:', error);
  }
}

if (!modelConfigs) {
  const urlParams = new URLSearchParams(window.location.search);
  const requestedPreset = urlParams.get('model')?.toLowerCase();
  if (requestedPreset && presetModelConfigs[requestedPreset]) {
    modelConfigs = presetModelConfigs[requestedPreset];
  }
}

if (!modelConfigs) {
  modelConfigs = presetModelConfigs[defaultPresetKey];
}

modelConfigs.forEach((config) => {
  loadModel(scene, camera, orbitControls, config);
});