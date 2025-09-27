import * as THREE from 'three';

export function createGround(scene) {
  const textureLoader = new THREE.TextureLoader();
  const groundTexture = textureLoader.load('textures/smooth-sand.jpg');
  groundTexture.wrapS = THREE.RepeatWrapping;
  groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set(16, 16);

  const groundGeometry = new THREE.PlaneGeometry(20, 20);
  const groundMaterial = new THREE.MeshStandardMaterial({
    map: groundTexture,
    roughness: 0.8,
    metalness: 0.2
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
  ground.position.y = 0; // Adjust the ground level
  scene.add(ground);

  // Add sprite
  textureLoader.load('textures/Overview_crossfire.png', function(spriteTexture) {
    spriteTexture.wrapS = THREE.ClampToEdgeWrapping;
    spriteTexture.wrapT = THREE.ClampToEdgeWrapping;
    
    const aspectRatio = spriteTexture.image.width / spriteTexture.image.height;
    const spriteWidth = 10; // Desired width
    const spriteHeight = spriteWidth / aspectRatio;

    const spriteMaterial = new THREE.MeshBasicMaterial({
      map: spriteTexture,
      transparent: true,
      depthWrite: false
    });

    const spriteGeometry = new THREE.PlaneGeometry(spriteWidth, spriteHeight);
    const sprite = new THREE.Mesh(spriteGeometry, spriteMaterial);
    sprite.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    sprite.position.y = 0.01; // Slightly above the ground to avoid z-fighting
    scene.add(sprite);
  });
}
