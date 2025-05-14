// engine/engine.js
import * as THREE from 'three';

let scene, camera, renderer, player;
let logicRules = [];

export function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x202020);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 5);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.HemisphereLight(0xffffff, 0x444444);
  light.position.set(0, 20, 0);
  scene.add(light);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: 0x303030 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  animate();
}

export function addPlayer() {
  const geometry = new THREE.BoxGeometry(1, 2, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ffcc });
  player = new THREE.Mesh(geometry, material);
  player.position.y = 1;
  scene.add(player);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

export function runLogic(input) {
  const lower = input.toLowerCase();
  if (lower.includes('press space') && lower.includes('jump')) {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        jumpPlayer();
      }
    });
  }
}

function jumpPlayer() {
  if (!player) return;
  let jumpHeight = 1;
  let duration = 300;

  const startY = player.position.y;
  const targetY = startY + jumpHeight;
  const startTime = performance.now();

  function jumpAnim(time) {
    const elapsed = time - startTime;
    const t = Math.min(elapsed / duration, 1);
    player.position.y = startY + jumpHeight * Math.sin(t * Math.PI);
    if (t < 1) requestAnimationFrame(jumpAnim);
  }

  requestAnimationFrame(jumpAnim);
}
// ui/commandBox.js
export function setupCommandBox(runLogicCallback) {
  const box = document.createElement('div');
  box.style.position = 'absolute';
  box.style.bottom = '20px';
  box.style.left = '50%';
  box.style.transform = 'translateX(-50%)';
  box.style.background = '#222';
  box.style.padding = '10px';
  box.style.borderRadius = '8px';
  box.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
  box.style.zIndex = '100';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Type a game instruction...';
  input.style.width = '300px';
  input.style.padding = '8px';
  input.style.border = 'none';
  input.style.borderRadius = '4px';
  input.style.fontSize = '14px';

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const command = input.value.trim();
      if (command) {
        runLogicCallback(command);
        input.value = '';
      }
    }
  });

  box.appendChild(input);
  document.body.appendChild(box);
}
