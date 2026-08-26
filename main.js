import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

gsap.registerPlugin(ScrollTrigger);

// 1. SMOOTH SCROLLING (Lenis)
const lenis = new Lenis({ lerp: 0.05, smoothWheel: true, wheelMultiplier: 1.0 });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// 2. PRELOADER
const loader = document.querySelector("[data-preloader]");
const bar = document.querySelector("[data-preloader-bar]");

// 3. THREE.JS SETUP (For Truck Only)
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x030303, 0.015); // Cinematic dark fog

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#webgl-canvas'), antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

// Premium Lighting Setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 3.5);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

const truckGroup = new THREE.Group();
scene.add(truckGroup);

// Top-Down Camera
camera.position.set(0, 40, 0); 
camera.lookAt(0, 0, 0); 

let truckModel, spinGroup, shakeGroup;
window.solidMaterials = []; // Collect materials for diagram fade

gltfLoader.loadAsync('/assets/Meshy_AI_truck_cab_front_untex_0826175627_generate.glb').then((truckGltf) => {
  truckModel = truckGltf.scene;

  truckModel.traverse((child) => {
      if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
              color: 0xe5e0d8, 
              roughness: 1.0,
              metalness: 0.0,
              polygonOffset: true,
              polygonOffsetFactor: 1, 
              polygonOffsetUnits: 1,
              transparent: true,
              opacity: 1
          });
          window.solidMaterials.push(child.material);
          
          const edges = new THREE.EdgesGeometry(child.geometry, 45);
          const line = new THREE.LineSegments(
              edges, 
              new THREE.LineBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.4 })
          );
          child.add(line);
      }
  });

  // Remove the previous Z rotation so the windshield points UP
  truckModel.rotation.set(0, 0, 0);
  
  const truckBox = new THREE.Box3().setFromObject(truckModel);
  const truckSize = truckBox.getSize(new THREE.Vector3());
  const truckCenter = truckBox.getCenter(new THREE.Vector3());
  
  const truckScale = 9 / Math.max(truckSize.x, truckSize.y, truckSize.z); 
  truckModel.scale.set(truckScale, truckScale, truckScale);
  
  shakeGroup = new THREE.Group();
  shakeGroup.add(truckModel);

  // Center the pivot
  const pivotGroup = new THREE.Group();
  pivotGroup.add(shakeGroup);

  // 1. Point the roof at the camera, and windshield to the LEFT (User dialed)
  pivotGroup.rotation.set(-0.02, -0.02, 0.28);

  // 2. Wrap in a spin group to turn it 90 degrees CLOCKWISE so it points UP
  spinGroup = new THREE.Group();
  spinGroup.rotation.y = -1.57;
  spinGroup.add(pivotGroup);
  
  // -- ADD CINEMATIC HEADLIGHTS --
  const headlightColor = 0xfff5e6;
  const leftLight = new THREE.SpotLight(headlightColor, 200, 150, Math.PI / 6, 0.8, 1.5);
  leftLight.position.set(-1.5, 0, -3); 
  const leftTarget = new THREE.Object3D();
  leftTarget.position.set(-1.5, -5, -40); // Point slightly down onto the text/ground
  leftLight.target = leftTarget;
  spinGroup.add(leftLight);
  spinGroup.add(leftTarget);

  const rightLight = new THREE.SpotLight(headlightColor, 200, 150, Math.PI / 6, 0.8, 1.5);
  rightLight.position.set(1.5, 0, -3);
  const rightTarget = new THREE.Object3D();
  rightTarget.position.set(1.5, -5, -40);
  rightLight.target = rightTarget;
  spinGroup.add(rightLight);
  spinGroup.add(rightTarget);
  // ------------------------------
  
  // 3. Add to the GSAP-controlled truckGroup
  // This keeps truckGroup rotation at (0,0,0) so GSAP translates it perfectly in world space
  truckGroup.rotation.set(0, 0, 0);
  truckGroup.add(spinGroup);
  
  // Start at the bottom of the hero section
  truckGroup.position.set(0, 0, 14.5); 

  const s = 5;
  const stretchX = 1.0, stretchY = 1.0, stretchZ = 1.2; // Slightly elongated length
  truckModel.scale.set(s * stretchX, s * stretchY, s * stretchZ);
  truckModel.position.set(
      -truckCenter.x * s * stretchX, 
      -truckCenter.y * s * stretchY, 
      -truckCenter.z * s * stretchZ
  );

  const tlPreload = gsap.timeline({ onComplete: () => { if(loader) loader.remove(); } });
  if(bar) tlPreload.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: "power3.inOut" });
  if(loader) tlPreload.to(loader, { yPercent: -100, duration: 1, ease: "power4.inOut" }, "+=0.2");

  initMasterTimeline();
});

function initMasterTimeline() {
  gsap.set("#section-2", { opacity: 0 });
  gsap.set("#section-3", { opacity: 0 });
  gsap.set("#catalogue-ui", { y: "20vh", scale: 0.9, filter: "blur(20px)", opacity: 0, pointerEvents: "none" });

  const masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#scroll-container",
      start: "top top",
      end: "bottom bottom", 
      scrub: 1.5,
    }
  });

  // Phase 1: Drive to the top (center) from the bottom
  masterTl.to(truckGroup.position, { z: 0, duration: 0.15, ease: "power2.out" }, 0.0);
  
  // Acceleration Pitch & Bank: The truck leans back and tilts slightly as it drives, simulating suspension momentum
  masterTl.to(truckGroup.rotation, { x: -0.05, z: 0.03, duration: 0.07, ease: "power2.out" }, 0.07);
  masterTl.to(truckGroup.rotation, { x: 0, z: 0, duration: 0.08, ease: "power2.inOut" }, 0.07);

  // Treadmill Road Effect (Starts immediately, lasts until phase 2)
  masterTl.to("#road-lines", { opacity: 0.12, duration: 0.05 }, 0.0);
  masterTl.to("#road-lines-strip", { y: "0%", ease: "none", duration: 0.35 }, 0.0); 

  // Violent Vibration (X and Z axis for screen shake + Suspension Rotation)
  const shakeFrames = [];
  const rotFrames = [];
  for(let i=0; i<45; i++) {
      shakeFrames.push({
          x: (Math.random() - 0.5) * 0.4, // Reduced XY a bit so it doesn't look like a toy
          z: (Math.random() - 0.5) * 0.4,
          duration: 0.35 / 45
      });
      rotFrames.push({
          x: (Math.random() - 0.5) * 0.08, // Pitch bounce
          z: (Math.random() - 0.5) * 0.08, // Roll bounce
          duration: 0.35 / 45
      });
  }
  shakeFrames.push({ x: 0, z: 0, duration: 0.01 }); // Reset
  rotFrames.push({ x: 0, z: 0, duration: 0.01 });

  masterTl.to(spinGroup.position, {
      keyframes: shakeFrames,
      ease: "none",
      duration: 0.35
  }, 0.0);

  masterTl.to(shakeGroup.rotation, {
      keyframes: rotFrames,
      ease: "none",
      duration: 0.35
  }, 0.0);

  // --- GHOST SECTION --- 
  // Between 0.15 and 0.35, the truck just sits in the gap, vibrating violently.

  // Phase 2: Massive Zoom In + Diagram dissolve
  masterTl.to(truckGroup.scale, { x: 8, y: 8, z: 8, duration: 0.10, ease: "power2.inIn" }, 0.35);
  // Optional: Add a slight rotation during zoom in to give it 3D depth
  masterTl.to(truckGroup.rotation, { z: 0.2, duration: 0.10, ease: "power1.inOut" }, 0.35); 
  masterTl.to(window.solidMaterials, { opacity: 0.05, duration: 0.10, ease: "power2.out" }, 0.35);

  masterTl.to("#hero-text-left", { x: -300, opacity: 0, duration: 0.10 }, 0.35);
  masterTl.to("#hero-text-right", { x: 300, opacity: 0, duration: 0.10 }, 0.35);
  masterTl.to(["#hero-sub-left", "#hero-sub-right"], { opacity: 0, y: 50, duration: 0.10 }, 0.35);
  
  // Fade out the 3D canvas so we transition smoothly into Section 2
  masterTl.to("#plane-container", { opacity: 0, duration: 0.05, ease: "power2.inOut" }, 0.42);

  // Phase 3: Isolating Vibration
  masterTl.to("#section-1", { opacity: 0, duration: 0.05, ease: "power1.inOut" }, 0.45);
  masterTl.to("#section-2", { opacity: 1, duration: 0.05, ease: "power1.inOut" }, 0.45);
  masterTl.to("#tease-text-1", { y: "0%", duration: 0.1, ease: "power3.out" }, 0.46);
  masterTl.to("#tease-text-2", { y: "0%", duration: 0.1, ease: "power3.out" }, 0.48);
  masterTl.to("#tease-sub", { y: "0%", opacity: 1, duration: 0.1, ease: "power3.out" }, 0.50);

  // Phase 4: Environments
  masterTl.to("#section-2", { opacity: 0, duration: 0.1 }, 0.65);
  masterTl.to("#section-3", { opacity: 1, duration: 0.1 }, 0.65);
  masterTl.to("#env-panel-1", { y: "0%", duration: 0.15, ease: "power3.out" }, 0.70);
  masterTl.to("#env-panel-2", { y: "0%", duration: 0.15, ease: "power3.out" }, 0.73);
  masterTl.to("#env-panel-3", { y: "0%", duration: 0.15, ease: "power3.out" }, 0.76);
  masterTl.to("#env-heading", { opacity: 1, scale: 1, duration: 0.15, ease: "power2.out" }, 0.80);

  // Phase 5: Catalogue Reveal
  masterTl.to("#section-3", { opacity: 0, duration: 0.1 }, 0.90);
  masterTl.to("#catalogue-ui", { y: "0vh", scale: 1, opacity: 1, filter: "blur(0px)", pointerEvents: "auto", duration: 0.1, ease: "power3.out" }, 0.90);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const seatData = [
  { id: 1, title: 'SUPREMO', img: '/assets/seats/Supremo.png', desc: 'Supremo is a premium offering with top-of-the-line air suspension. It guarantees the absolute ultimate in long-haul comfort and vibration isolation for highway driving.', badges: ['AIR SUSPENSION', 'VENTILATED', 'LUMBAR SUPPORT'] },
  { id: 2, title: 'EXCAVATOR PRO', img: '/assets/seats/Excavator.png', desc: 'Built specifically for earth-moving equipment, this seat features mechanical suspension tuned for extreme vertical shocks.', badges: ['MECHANICAL', 'HEAVY DUTY'] },
  { id: 3, title: 'TRACTOR COMMAND', img: '/assets/seats/Tractor.png', desc: 'Designed for agricultural machinery, offering robust weather resistance and constant damping over uneven terrain.', badges: ['WEATHERPROOF', 'SHOCK DAMPING'] },
  { id: 4, title: 'COMPACT LIFT', img: '/assets/seats/Forklift.png', desc: 'A compact, highly maneuverable seat for forklifts with active lateral support.', badges: ['COMPACT', 'LATERAL SUPPORT'] }
];

let currentSeatIndex = 0;

function updateCatalogueUI(index) {
  const data = seatData[index];
  const titleEl = document.getElementById('cat-title');
  if(!titleEl) return;
  titleEl.textContent = data.title;
  document.getElementById('cat-desc').textContent = data.desc;
  document.getElementById('cat-img').src = data.img;
  
  const badgesContainer = document.getElementById('cat-badges');
  badgesContainer.innerHTML = '';
  data.badges.forEach(badge => {
      const span = document.createElement('span');
      span.className = 'px-2 py-1 bg-white/10 rounded text-[8px] font-bold tracking-widest text-white/60';
      span.textContent = badge;
      badgesContainer.appendChild(span);
  });
  
  document.querySelectorAll('.carousel-thumb').forEach((thumb, i) => {
      if(i === index) {
          thumb.classList.add('border-white', 'opacity-100');
          thumb.classList.remove('border-transparent', 'opacity-40');
      } else {
          thumb.classList.remove('border-white', 'opacity-100');
          thumb.classList.add('border-transparent', 'opacity-40');
      }
  });
}

function initCarousel() {
  const container = document.getElementById('carousel-container');
  if(!container) return;
  
  seatData.forEach((data, index) => {
      const btn = document.createElement('button');
      btn.className = 'carousel-thumb w-12 h-12 rounded-lg border-2 overflow-hidden transition-all duration-300 bg-white cursor-pointer';
      if(index === 0) btn.classList.add('border-white', 'opacity-100');
      else btn.classList.add('border-transparent', 'opacity-40');
      
      const img = document.createElement('img');
      img.src = data.img;
      img.className = 'w-full h-full object-contain p-1';
      btn.appendChild(img);
      
      btn.onclick = () => {
          currentSeatIndex = index;
          updateCatalogueUI(index);
      };
      
      container.appendChild(btn);
  });
  
  updateCatalogueUI(0);
}
initCarousel();
