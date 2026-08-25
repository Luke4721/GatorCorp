import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({ lerp: 0.08, smoothWheel: true, wheelMultiplier: 0.9 });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

const loader = document.querySelector("[data-preloader]");
const bar = document.querySelector("[data-preloader-bar]");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg'), antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

const truckGroup = new THREE.Group();
scene.add(truckGroup);

camera.position.set(0, 0, 15);
truckGroup.position.set(0, -2, -200); // Deep background

let truckModel, seatModel;

Promise.all([
  gltfLoader.loadAsync('/assets/Truck_draco.glb'),
  gltfLoader.loadAsync('/assets/Seat_draco.glb')
]).then(([truckGltf, seatGltf]) => {
  truckModel = truckGltf.scene;
  seatModel = seatGltf.scene;

  // Fix rotations: The truck is sideways, rotate it 90 degrees to face camera
  truckModel.rotation.y = Math.PI / 2;
  
  // Normalize sizes based on bounding boxes
  const truckBox = new THREE.Box3().setFromObject(truckModel);
  const truckSize = truckBox.getSize(new THREE.Vector3());
  const truckCenter = truckBox.getCenter(new THREE.Vector3());

  const seatBox = new THREE.Box3().setFromObject(seatModel);
  const seatSize = seatBox.getSize(new THREE.Vector3());
  const seatCenter = seatBox.getCenter(new THREE.Vector3());

  // We want the truck to be massive (say, 12 units wide/tall)
  const truckScale = 12 / truckSize.x; 
  truckModel.scale.set(truckScale, truckScale, truckScale);
  
  // We want the seat to be realistically proportioned inside the truck cabin
  // A seat is maybe 1/3 the height of the full truck
  const targetSeatHeight = (truckSize.y * truckScale) * 0.4;
  const seatScale = targetSeatHeight / seatSize.y;
  seatModel.scale.set(seatScale, seatScale, seatScale);

  // Center truck at origin
  truckModel.position.set(-truckCenter.x * truckScale, -truckCenter.y * truckScale, -truckCenter.z * truckScale);
  
  // Position seat inside the truck cabin
  // We center it first, then move it slightly up and back
  seatModel.position.set(-seatCenter.x * seatScale, (-seatCenter.y * seatScale) + 0.5, (-seatCenter.z * seatScale) - 1.0);

  // Ensure truck can be transparent
  truckModel.traverse((child) => {
    if (child.isMesh) {
      child.material.transparent = true;
      child.material.needsUpdate = true;
    }
  });

  truckGroup.add(truckModel);
  truckGroup.add(seatModel);

  // Preload animation
  const tlPreload = gsap.timeline({ onComplete: () => { if(loader) loader.remove(); } });
  if(bar) tlPreload.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power3.inOut" });
  if(loader) tlPreload.to(loader, { yPercent: -100, duration: 1, ease: "power4.inOut" }, "+=0.2");
  
  // Snap up to center for Hero
  tlPreload.to(truckGroup.position, { y: -2, x: 0, z: -80, duration: 2, ease: "power4.out" }, "-=0.5"); // Starts far away

  initScrollAnimations();
});

// --- CONTENT INJECTION ---
const features = [
  { name: "Integrated 3 Point Seat Belt", desc: "Maximum safety with ABTS locking mechanism." },
  { name: "Lumbar Support Mechanical", desc: "Ergonomic curvature to prevent driver fatigue." },
  { name: "Adjustable Armrest", desc: "Precision tactile dials for perfect positioning." },
  { name: "Pneumatic Suspension System", desc: "Patented air-ride technology for rough terrain." },
  { name: "Shock Absorber Adjustment", desc: "Adapt instantly to changing industrial environments." },
  { name: "7 step-Height adjustment", desc: "Perfect visibility for any operator size." },
  { name: "Quick dump lever", desc: "Rapid egress in critical situations." }
];

const featuresLeft = document.querySelector('.features-left');
featuresLeft.innerHTML = "";
features.forEach((feat, index) => {
  const el = document.createElement('div');
  el.className = 'feature-item';
  el.id = `feat-${index}`;
  el.innerHTML = `<span class="spec-line"></span><h3>${feat.name}</h3><p>${feat.desc}</p>`;
  featuresLeft.appendChild(el);
});

document.querySelectorAll('[data-split-reveal]').forEach(el => {
  if (el.dataset.splitReady === "true") return;
  const text = el.textContent;
  el.textContent = "";
  text.split(" ").forEach(word => {
    if(!word.trim()) return;
    const mask = document.createElement('span'); mask.className = 'split-word-mask';
    const span = document.createElement('span'); span.className = 'split-word';
    span.textContent = word + " ";
    mask.appendChild(span);
    el.appendChild(mask);
  });
  el.dataset.splitReady = "true";
});

function initScrollAnimations() {
  // Text Reveals
  gsap.utils.toArray('.intro-content').forEach(section => {
    gsap.from(section.querySelectorAll('.split-word'), {
      yPercent: 110, opacity: 0, duration: 1, ease: "power4.out", stagger: 0.05,
      scrollTrigger: { trigger: section, start: "top 75%" }
    });
  });

  // SNAP ANIMATIONS
  // 1. Truck Intro (Snap to right to avoid text overlap)
  ScrollTrigger.create({
    trigger: ".truck-intro",
    start: "top center",
    toggleActions: "play none none reverse",
    onEnter: () => gsap.to(truckGroup.position, { x: 4, z: -15, y: -2, duration: 1.2, ease: "power3.out" }), // Races forward
    onLeaveBack: () => gsap.to(truckGroup.position, { x: 0, z: -80, y: -2, duration: 1.2, ease: "power3.inOut" })
  });

  // 2. The Push-In & X-Ray (Seat Transition)
  ScrollTrigger.create({
    trigger: ".seat-transition",
    start: "top center",
    toggleActions: "play none none reverse",
    onEnter: () => {
      // Bring truck to z:0, push camera in
      gsap.to(camera.position, { z: 8, duration: 1.0, ease: "power3.inOut" });
      gsap.to(truckGroup.position, { x: 1.5, y: -0.5, z: 0, duration: 1.0, ease: "power3.inOut" });
      
      // X-Ray the truck
      truckModel.traverse((child) => {
        if (child.isMesh) gsap.to(child.material, { opacity: 0.05, duration: 0.8 });
      });
    },
    onLeaveBack: () => {
      gsap.to(camera.position, { z: 15, duration: 1.0, ease: "power3.inOut" });
      gsap.to(truckGroup.position, { x: 4, y: -2, z: -15, duration: 1.0, ease: "power3.inOut" });
      
      // Restore truck
      truckModel.traverse((child) => {
        if (child.isMesh) gsap.to(child.material, { opacity: 1, duration: 0.8 });
      });
    }
  });

  // 3. Features: Stay on right side, tilt to show LEFT face
  const featureEls = document.querySelectorAll('.feature-item');
  featureEls.forEach((feat, i) => {
    ScrollTrigger.create({
      trigger: feat,
      start: "top center",
      end: "bottom center",
      toggleClass: "active",
      onEnter: () => {
        // Rotate y positively (0.3 to 0.7 rad) to expose the LEFT side of the seat
        gsap.to(seatModel.rotation, { 
          y: i % 2 === 0 ? 0.4 : 0.7, 
          x: i % 3 === 0 ? 0.1 : -0.05,
          duration: 0.6, ease: "power3.out", overwrite: "auto"
        });
      },
      onEnterBack: () => {
        gsap.to(seatModel.rotation, { 
          y: i % 2 === 0 ? 0.4 : 0.7, 
          x: i % 3 === 0 ? 0.1 : -0.05,
          duration: 0.6, ease: "power3.out", overwrite: "auto"
        });
      }
    });
  });
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
