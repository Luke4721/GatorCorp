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
window.solidMaterials = [];
window.wireMaterials = [];

// -- RED PARTICLE TRUCK SETUP --
window.particleUniforms = {
    uTime: { value: 0 },
    uVibration: { value: 0 }, 
    uOpacity: { value: 1 }
};

const truckParticleMaterial = new THREE.ShaderMaterial({
    uniforms: window.particleUniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
        void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = 3.0 * (10.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        uniform float uOpacity;
        void main() {
            vec2 c = gl_PointCoord - vec2(0.5);
            float dist = length(c);
            if (dist > 0.5) discard;
            float strength = pow(1.0 - (dist * 2.0), 1.5);
            // Aggressive Red chaotic color
            gl_FragColor = vec4(1.0, 0.2, 0.1, strength * uOpacity * 0.6);
        }
    `
});

window.noiseClouds = [];

// -- BLUE STABLE SEAT SETUP --
window.stableSeat = new THREE.Group();
window.seatMaterials = [];
window.seatOpacity = { value: 0 };

// ----------------------------

gltfLoader.loadAsync('/assets/Truck_draco.glb').then((truckGltf) => {
    truckModel = truckGltf.scene;
  
    truckModel.traverse((child) => {
        if (child.isMesh) {
            child.visible = false;
            const points = new THREE.Points(child.geometry, truckParticleMaterial);
            window.noiseClouds.push(points);
            child.parent.add(points);
            const edges = new THREE.EdgesGeometry(child.geometry, 45);
            const lineMat = new THREE.LineBasicMaterial({ color: 0xff1111, transparent: true, opacity: 0.2 });
            const line = new THREE.LineSegments(edges, lineMat);
            window.solidMaterials.push(lineMat);
            child.parent.add(line);
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
  
  // Add the perfectly stable blue seat inside the cab (it avoids the shakeGroup!)
  pivotGroup.add(window.stableSeat);

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

  const s = 7;
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

  // Fluid Particle Vibration Simulation (Red Truck is violently shaking)
  masterTl.to(window.particleUniforms.uVibration, { value: 1.5, duration: 0.15, ease: "power2.inOut" }, 0.0);
  masterTl.to(window.particleUniforms.uVibration, { value: 3.5, duration: 0.20, ease: "none" }, 0.15);
  
  // Phase 2: The Core Isolation (0.30 - 0.40)
  // The camera zooms in on the violently shaking truck
  masterTl.to(truckGroup.scale, { x: 12, y: 12, z: 12, duration: 0.10, ease: "power2.in" }, 0.30);
  masterTl.to(truckGroup.rotation, { z: 0.1, duration: 0.10, ease: "power1.inOut" }, 0.30); 
  
  // The red chaotic truck fades completely away
  masterTl.to(window.particleUniforms.uOpacity, { value: 0, duration: 0.10, ease: "power2.out" }, 0.30);
  masterTl.to(window.solidMaterials, { opacity: 0, duration: 0.10, ease: "power2.out" }, 0.30);
  
  // ... Revealing the perfectly stable, pristine blue seat inside
  masterTl.to(window.seatOpacity, { value: 1, duration: 0.10, ease: "power2.in" }, 0.30);
  
  masterTl.to("#hero-text-left", { x: -300, opacity: 0, duration: 0.10 }, 0.35);
  masterTl.to("#hero-text-right", { x: 300, opacity: 0, duration: 0.10 }, 0.35);
  masterTl.to(["#hero-sub-left", "#hero-sub-right"], { opacity: 0, y: 50, duration: 0.10 }, 0.35);
  
  // Phase 3: Isolating Vibration
  masterTl.to("#section-1", { opacity: 0, pointerEvents: "none", duration: 0.05, ease: "power1.inOut" }, 0.45);
  masterTl.to("#section-2", { opacity: 1, duration: 0.05, ease: "power1.inOut" }, 0.45);
  masterTl.to("#tease-text-1", { y: "0%", duration: 0.2, ease: "power3.out" }, 0.45);
  masterTl.to("#tease-text-2", { y: "0%", duration: 0.2, ease: "power3.out" }, 0.48);
  masterTl.to("#tease-sub", { y: "0%", opacity: 1, duration: 0.2, ease: "power3.out" }, 0.52);

  // Fade out the 3D canvas smoothly after the text is fully revealed
  masterTl.to("#plane-container", { opacity: 0, duration: 0.10, ease: "power2.inOut" }, 0.52);
  
  // Phase 4: Product Tease Reveal
  masterTl.to("#section-2", { opacity: 0, duration: 0.05, ease: "power1.inOut" }, 0.85);
  masterTl.to("#section-3", { opacity: 1, duration: 0.05, ease: "power1.inOut" }, 0.85);
  
  // Phase 5: Catalogue Reveal
  masterTl.to("#section-3", { opacity: 0, duration: 0.1 }, 0.90);
  masterTl.to("#catalogue-ui", { y: "0vh", scale: 1, opacity: 1, filter: "blur(0px)", pointerEvents: "auto", duration: 0.1, ease: "power3.out" }, 0.90);
}

// --- SCROLL VELOCITY PHYSICS ---
// (Reverted to basic linear GSAP scroll as requested)

function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const t = now / 1000;
  
  if (window.particleUniforms) {
      window.particleUniforms.uTime.value = t;
  }
  
  // Apply async GSAP opacity to the seat
  if (window.seatMaterials && window.seatOpacity) {
      window.seatMaterials.forEach(m => m.opacity = window.seatOpacity.value);
  }
  
  // Apply realistic heavy machinery physics to the truck (but NOT the seat)
  if (typeof shakeGroup !== 'undefined' && shakeGroup && window.particleUniforms) {
      const activeVib = window.particleUniforms.uVibration.value;
      
      // 1. Low frequency suspension heave
      const heave = Math.sin(t * 8) * 0.15;
      // 2. Mid frequency frame bounce
      const bounce = Math.sin(t * 18) * Math.cos(t * 12) * 0.1;
      // 3. High frequency engine/road rattle
      const rattle = Math.sin(t * 50) * 0.05;
      
      shakeGroup.position.x = (heave + rattle) * activeVib;
      shakeGroup.position.y = (bounce + rattle) * activeVib;
      shakeGroup.rotation.z = (Math.sin(t * 14) * 0.03) * activeVib; // Slight chassis roll
  }
  
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
  
  // Change the 3D seat colors to match the selected model!
  const seatColors = [
    { pt: 0x00ffff }, // Supremo (Blue)
    { pt: 0xffaa00 }, // Excavator (Orange)
    { pt: 0x00ff44 }, // Tractor (Green)
    { pt: 0xff2222 }  // Forklift (Red)
  ];
  if (window.seatMaterials && window.seatMaterials.length >= 1) {
    window.seatMaterials.forEach(m => m.color.setHex(seatColors[index].pt));
  }
  
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
