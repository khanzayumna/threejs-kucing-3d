import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// 1. Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// 2. Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 5);

// 3. Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// 4. Lighting (Pencahayaan terang dari segala arah)
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const dirLight1 = new THREE.DirectionalLight(0xffffff, 2);
dirLight1.position.set(5, 10, 7.5);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0xffffff, 1);
dirLight2.position.set(-5, -5, -5);
scene.add(dirLight2);

// 5. Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 6. Grid Helper (Panduan bidang datar)
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

// 7. Load Model GLB (Langsung memanggil dari folder public/cat.glb)
const loader = new GLTFLoader();

loader.load(
  '/cat.glb',
  (gltf) => {
    const model = gltf.scene;

    // Hitung ukuran asli model & posisikan ke tengah (Auto-Center & Auto-Scale)
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // Geser titik pusat model ke (0,0,0)
    model.position.x += model.position.x - center.x;
    model.position.y += model.position.y - center.y;
    model.position.z += model.position.z - center.z;

    // Atur skala jika model terlalu besar atau kecil
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const scale = 2 / maxDim;
      model.scale.set(scale, scale, scale);
    }

    scene.add(model);
    console.log('Model berhasil dimuat!');
  },
  (xhr) => {
    if (xhr.total > 0) {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    }
  },
  (error) => {
    console.error('Error saat memuat model 3D:', error);
  }
);

// 8. Animation Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// 9. Handling Resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});