import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import PixelSwap from './PixelSwap.js';

gsap.registerPlugin(ScrollTrigger);

// Initialize PixelSwap
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('pixel-swap-container');
    if (container) {
        new PixelSwap(container, {
            firstContent: '<div style="font-size: 14px; font-weight: bold; padding: 10px 20px;">EXPLORE SEAT ↗</div>',
            secondContent: '<div style="font-size: 14px; font-weight: bold; color: black; background: #00ffff; padding: 10px 20px;">INSPECT MODE</div>',
            pixelSize: 24,
            pixelDuration: 450,
            duration: 1000,
            trigger: 'hover'
        });
    }
});

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
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.localClippingEnabled = true; // REZ-IN CLIPPING
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
    uOpacity: { value: 1 },
    uMouse: { value: new THREE.Vector3(0,0,0) },
    uGlitch: { value: 0.0 }
};


// -- CLIPPING PLANE (REZ-IN) --
window.clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 10);
const clipPlanes = [window.clipPlane];

const truckWireMaterial = new THREE.ShaderMaterial({
    uniforms: window.particleUniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    clippingPlanes: clipPlanes,
    wireframe: true,
    vertexShader: `
        uniform float uTime;
        uniform vec3 uMouse;
        uniform float uGlitch;
        uniform float uVibration;
        
        void main() {
            vec3 pos = position;
            float dist = distance(pos, uMouse);
            if(dist < 3.0) pos += normalize(pos - uMouse) * (3.0 - dist) * 0.5;
            if(uGlitch > 0.0) pos.x += sin(pos.y * 50.0 + uTime * 10.0) * uGlitch;
            if(uVibration > 0.0) {
                pos.x += sin(uTime * 50.0 + pos.y) * 0.02 * uVibration;
                pos.y += cos(uTime * 40.0 + pos.x) * 0.02 * uVibration;
            }
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uOpacity;
        void main() { gl_FragColor = vec4(1.0, 0.2, 0.1, uOpacity * 0.5); }
    `
});

window.noiseClouds = [];

// -- BLUE STABLE SEAT SETUP --
window.stableSeat = new THREE.Group();
window.seatMaterials = [];
window.seatOpacity = { value: 0 };
  // Seat loading restored with 0-memory GPU wireframe!
  gltfLoader.loadAsync('/assets/Seat_draco.glb').then((seatGltf) => {
      const seatModel = seatGltf.scene;
      
      seatModel.traverse((child) => {
          if (child.isMesh) {
              child.visible = false;
              const wireMat = new THREE.MeshBasicMaterial({ 
                  color: 0x00ffff, 
                  wireframe: true, clippingPlanes: clipPlanes, 
                  transparent: true, 
                  opacity: 0,
                  blending: THREE.AdditiveBlending,
                  depthWrite: false
              });
              const wireMesh = new THREE.Mesh(child.geometry, wireMat);
              child.parent.add(wireMesh);
              window.seatMaterials.push(wireMat);
          }
      });
      
      // Scale and position to fit exactly inside the truck cab
      const seatBox = new THREE.Box3().setFromObject(seatModel);
      const seatSize = seatBox.getSize(new THREE.Vector3());
      const seatCenter = seatBox.getCenter(new THREE.Vector3());
      
      const seatScale = 5 / Math.max(seatSize.x, seatSize.y, seatSize.z); 
      seatModel.scale.set(seatScale, seatScale, seatScale);
      
      seatModel.position.set(
          -seatCenter.x * seatScale,
          -seatCenter.y * seatScale,
          -seatCenter.z * seatScale
      );
      
      const seatWrapper = new THREE.Group();
      seatWrapper.add(seatModel);
      
      // Face forward
      seatWrapper.rotation.y = Math.PI / 2;
      
      // Top-right corner as explicitly requested
      seatWrapper.position.set(2.0, -0.5, -4.0);
      
      window.stableSeat.add(seatWrapper);
  });
  // ----------------------------

gltfLoader.loadAsync('/assets/Truck_draco.glb').then((truckGltf) => {
    truckModel = truckGltf.scene;
  
    truckModel.traverse((child) => {
        if (child.isMesh) {
            child.visible = false;
            const wireMesh = new THREE.Mesh(child.geometry, truckWireMaterial);
            window.noiseClouds.push(wireMesh);
            child.parent.add(wireMesh);
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

  // Phase 1: Rez-in (Clipping)
  masterTl.fromTo(window.clipPlane, { constant: -10 }, { constant: 10, duration: 0.15, ease: "none" }, 0.0);
  // Drive to the top (center) from the bottom
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
let lastScrollY = window.scrollY;
let smoothedVelocity = 0;
let lastTime = performance.now();
// (Reverted to basic linear GSAP scroll as requested)


// -- MOUSE INTERACTION & PARALLAX --
let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const t = now / 1000;

  // Lerp mouse
  mouse.x += (mouse.targetX - mouse.x) * 0.1;
  mouse.y += (mouse.targetY - mouse.y) * 0.1;
  
  // Parallax Camera
  camera.position.x = mouse.x * 2.0;
  camera.position.z = mouse.y * -2.0;
  camera.lookAt(0,0,0);
  
  // Mouse Raycast for Shader
  const vector = new THREE.Vector3(mouse.targetX, mouse.targetY, 0.5);
  vector.unproject(camera);
  const dir = vector.sub(camera.position).normalize();
  const distance = -camera.position.y / dir.y;
  const pos = camera.position.clone().add(dir.multiplyScalar(distance));
  if(window.particleUniforms && window.particleUniforms.uMouse) {
      window.particleUniforms.uMouse.value.copy(pos);
  }
  
  // Glitch Physics Calculation
  let dt = (now - lastTime) / 1000;
  if(dt <= 0) dt = 0.016;
  dt = Math.min(dt, 0.05);
  lastTime = now;
  
  const currentScroll = window.scrollY;
  const rawVelocity = Math.abs(currentScroll - lastScrollY) / dt;
  lastScrollY = currentScroll;
  smoothedVelocity = smoothedVelocity + (rawVelocity - smoothedVelocity) * (1.0 - Math.exp(-10.0 * dt));
  
  if(window.particleUniforms && window.particleUniforms.uGlitch) {
      window.particleUniforms.uGlitch.value = Math.min(smoothedVelocity * 0.0005, 1.5);
  }

  
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
  { 
    id: 1, title: 'SUPREMO', img: '/assets/seats/Supremo.png', 
    desc: 'Supremo is a premium offering with top-of-the-line air suspension. It guarantees the absolute ultimate in long-haul comfort and vibration isolation for highway driving.', 
    badges: ['AIR SUSPENSION', 'VENTILATED', 'LUMBAR SUPPORT'],
    hotspots: [
        { top: '25%', left: '50%', title: 'ACTIVE HEADREST', desc: 'Reduces whiplash and neck strain over uneven terrain.' },
        { top: '65%', left: '30%', title: 'LUMBAR SUPPORT', desc: 'Multi-chamber pneumatic lumbar adjustment.' },
        { top: '85%', left: '50%', title: 'AIR SUSPENSION', desc: 'Isolates 90% of harmful vertical vibrations.' }
    ]
  },
  { 
    id: 2, title: 'EXCAVATOR PRO', img: '/assets/seats/Excavator.png', 
    desc: 'Built specifically for earth-moving equipment, this seat features mechanical suspension tuned for extreme vertical shocks.', 
    badges: ['MECHANICAL', 'HEAVY DUTY'],
    hotspots: [
        { top: '30%', left: '48%', title: 'RUGGED TRIM', desc: 'Tear-resistant industrial fabric.' },
        { top: '75%', left: '50%', title: 'MECHANICAL DAMPING', desc: 'Heavy-duty steel coil suspension block.' }
    ]
  },
  { 
    id: 3, title: 'TRACTOR COMMAND', img: '/assets/seats/Tractor.png', 
    desc: 'Designed for agricultural machinery, offering robust weather resistance and constant damping over uneven terrain.', 
    badges: ['WEATHERPROOF', 'SHOCK DAMPING'],
    hotspots: [
        { top: '40%', left: '60%', title: 'WEATHER RESISTANT', desc: 'Sealed seams and waterproof vinyl coating.' },
        { top: '80%', left: '45%', title: 'SHOCK DAMPING', desc: 'Constant rate damping for agricultural tracks.' }
    ]
  },
  { 
    id: 4, title: 'COMPACT LIFT', img: '/assets/seats/Mini Excavator.png', 
    desc: 'A compact, highly maneuverable seat for forklifts with active lateral support.', 
    badges: ['COMPACT', 'LATERAL SUPPORT'],
    hotspots: [
        { top: '55%', left: '35%', title: 'LATERAL BOLSTERS', desc: 'Holds operator securely during tight cornering.' },
        { top: '90%', left: '50%', title: 'LOW PROFILE', desc: 'Fits compactly into tight cabins.' }
    ]
  }
];

let currentSeatIndex = 0;

function updateCatalogueUI(index) {
    const data = seatData[index];
    const titleEl = document.getElementById('cat-title');
    if(!titleEl) return;
    titleEl.textContent = data.title;
    document.getElementById('cat-desc').textContent = data.desc;
    document.getElementById('cat-img').src = data.img;
    
    // Render Hotspots
    const hsContainer = document.getElementById('hotspots-container');
    if (hsContainer) {
        hsContainer.innerHTML = '';
        if (data.hotspots) {
            data.hotspots.forEach(hs => {
                const el = document.createElement('div');
                el.className = 'absolute group pointer-events-auto cursor-pointer flex items-center justify-center';
                el.style.top = hs.top;
                el.style.left = hs.left;
                el.style.transform = 'translate(-50%, -50%)'; // Center the dot
                
                el.innerHTML = `
                    <div class="relative w-6 h-6 flex items-center justify-center">
                        <div class="absolute inset-0 border border-white/50 rounded-full animate-ping" style="animation-duration: 2s;"></div>
                        <div class="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div class="absolute left-8 w-48 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 bg-black/80 backdrop-blur-md p-3 border border-white/10 rounded-sm pointer-events-none z-50">
                        <div class="text-[10px] font-bold text-white mb-1 tracking-widest uppercase">${hs.title}</div>
                        <div class="text-[10px] text-white/70 leading-snug">${hs.desc}</div>
                    </div>
                `;
                hsContainer.appendChild(el);
            });
        }
    }
  
  // Change the 3D seat colors to match the selected model!
  const seatColors = [
    { pt: 0x00ffff, line: 0x0088ff }, // Supremo (Blue)
    { pt: 0xffaa00, line: 0xff5500 }, // Excavator (Orange)
    { pt: 0x00ff44, line: 0x008822 }, // Tractor (Green)
    { pt: 0xff2222, line: 0xaa0000 }  // Forklift (Red)
  ];
  if (window.seatMaterials) {
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
