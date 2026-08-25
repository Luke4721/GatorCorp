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
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg'), antialias: true, alpha: true });
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

let truckModel;

gltfLoader.loadAsync('/assets/Truck_draco.glb').then((truckGltf) => {
  truckModel = truckGltf.scene;

  // Face UP
  truckModel.rotation.y = -Math.PI / 2;
  
  const truckBox = new THREE.Box3().setFromObject(truckModel);
  const truckSize = truckBox.getSize(new THREE.Vector3());
  const truckCenter = truckBox.getCenter(new THREE.Vector3());
  
  // Scale down for cinematic framing
  const truckScale = 9 / truckSize.x; 
  truckModel.scale.set(truckScale, truckScale, truckScale);
  truckModel.position.set(-truckCenter.x * truckScale, -truckCenter.y * truckScale, -truckCenter.z * truckScale);
  truckGroup.add(truckModel);
  
  // Start offscreen bottom (positive Z)
  truckGroup.position.set(0, 0, 25); 

  // Preloader Out Animation
  const tlPreload = gsap.timeline({ onComplete: () => { if(loader) loader.remove(); } });
  if(bar) tlPreload.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: "power3.inOut" });
  if(loader) tlPreload.to(loader, { yPercent: -100, duration: 1, ease: "power4.inOut" }, "+=0.2");

  initMasterTimeline();
});

function initMasterTimeline() {
  // Setup Sequence Canvas for the Seat
  const canvas = document.getElementById("seat-sequence");
  const context = canvas.getContext("2d");
  
  // High-res standard size
  canvas.width = 1200;
  canvas.height = 1000;
  
  const frameCount = 90;
  const currentFrame = index => `/assets/seat_sequence/seat_${(index + 1).toString().padStart(4, '0')}.png`;
  const images = [];
  const seatSequence = { frame: 0 };

  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
  }
  images[0].onload = renderSeat;
  
  function renderSeat() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images[seatSequence.frame], 0, 0, canvas.width, canvas.height);
  }

  // --- THE MASTER CHOREOGRAPHY ---
  const masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#master-pin-container",
      start: "top top",
      end: "+=8000", // Massive 8000px scroll for extremely fluid scrubbing
      pin: true,
      scrub: 1.5 // Added smoothing to the scrub
    }
  });

  // Phase 1: Hero out, Truck in (0.0 to 0.15)
  masterTl.to(".hero-overlay", { opacity: 0, scale: 0.95, duration: 0.1, ease: "power2.inOut" }, 0);
  masterTl.to(truckGroup.position, { z: 2, duration: 0.15, ease: "power2.out" }, 0);

  // Phase 2: Specs In, Hold (0.15 to 0.30)
  masterTl.to(".truck-specs-overlay", { opacity: 1, duration: 0.05, ease: "power2.out" }, 0.15);
  masterTl.to(".truck-specs-overlay", { opacity: 0, duration: 0.05, ease: "power2.in" }, 0.30);

  // Phase 3: The Conveyor Belt Slide Transition (0.30 to 0.45)
  // Truck drives straight UP off the screen
  masterTl.to(truckGroup.position, { z: -30, duration: 0.15, ease: "power2.inOut" }, 0.30);
  
  // Seat Canvas slides UP from the bottom at the exact same time
  masterTl.to("#seat-sequence", { top: "0%", duration: 0.15, ease: "power2.inOut" }, 0.30);
  masterTl.to(".seat-features-overlay", { top: "0%", duration: 0.15, ease: "power2.inOut" }, 0.30);

  // Phase 4: Apple Scrub & Feature Spotlight (0.45 to 1.0)
  masterTl.to(seatSequence, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    duration: 0.55,
    onUpdate: renderSeat
  }, 0.45);

  // Spotlight the 9 Features
  const featureCount = 9;
  const durationPerFeature = 0.55 / featureCount;
  
  for(let i=0; i<featureCount; i++) {
    const startTime = 0.45 + (i * durationPerFeature);
    
    // Feature fades in and slides UP slightly
    masterTl.fromTo(`.f-${i}`, 
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: durationPerFeature * 0.3, ease: "power2.out" },
      startTime
    );
    
    // Feature fades out and slides UP slightly
    masterTl.to(`.f-${i}`, 
      { opacity: 0, y: -40, duration: durationPerFeature * 0.3, ease: "power2.in" },
      startTime + (durationPerFeature * 0.7)
    );
  }
}

// Render Loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Resize Handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
