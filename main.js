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
// Top-Down Camera Setup
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

// Initial Camera Top-Down View
camera.position.set(0, 35, 0); // High up on Y axis
camera.lookAt(0, 0, 0); // Looking straight down

let truckModel;

gltfLoader.loadAsync('/assets/Truck_draco.glb').then((truckGltf) => {
  truckModel = truckGltf.scene;

  // The truck is sideways, rotate it to face "UP" (negative Z in Threejs)
  truckModel.rotation.y = Math.PI / 2;
  
  const truckBox = new THREE.Box3().setFromObject(truckModel);
  const truckSize = truckBox.getSize(new THREE.Vector3());
  const truckCenter = truckBox.getCenter(new THREE.Vector3());

  const truckScale = 12 / truckSize.x; 
  truckModel.scale.set(truckScale, truckScale, truckScale);
  
  truckModel.position.set(-truckCenter.x * truckScale, -truckCenter.y * truckScale, -truckCenter.z * truckScale);

  truckGroup.add(truckModel);
  
  // Initial Truck Position: Off-screen at the "bottom" (positive Z when looking down from Y)
  truckGroup.position.set(0, 0, 20); 

  const tlPreload = gsap.timeline({ onComplete: () => { if(loader) loader.remove(); } });
  if(bar) tlPreload.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power3.inOut" });
  if(loader) tlPreload.to(loader, { yPercent: -100, duration: 1, ease: "power4.inOut" }, "+=0.2");

  initScrollAnimations();
});

function initScrollAnimations() {
  // 1. Truck drives up from the bottom to the center nav
  const arrivalTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".truck-arrival",
      start: "top bottom",
      end: "top top",
      scrub: 1
    }
  });
  
  // Move truck into view
  arrivalTl.to(truckGroup.position, {
    z: -2, // Move up screen
    ease: "power2.out"
  });
  
  // Fade in specs
  arrivalTl.to('.specs-content', {
    opacity: 1,
    stagger: 0.2,
    ease: "power2.out"
  }, "-=0.5");

  // 2. The Zoom & Breach Transition
  const zoomTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".roof-breach",
      start: "top center",
      end: "bottom top",
      scrub: 1
    }
  });

  // Plunge camera down through the roof
  zoomTl.to(camera.position, {
    y: 2, // Plunge close to the roof
    ease: "power1.inOut"
  });
  
  // Fade out the canvas as we breach
  zoomTl.to('#bg', {
    opacity: 0,
    ease: "power1.in"
  }, ">-0.2");

  // 3. 2.5D Diorama Interaction
  const dioramaScene = document.querySelector('.diorama-scene');
  const layers = document.querySelectorAll('.diorama-layer');
  
  if(dioramaScene) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      // Rotate the whole scene slightly for Magnetic Tilt
      gsap.to(dioramaScene, {
        rotationY: x * 10,
        rotationX: -y * 10,
        ease: "power2.out",
        duration: 1
      });

      // Shift the sliced layers for Parallax Depth
      layers.forEach(layer => {
        const speed = parseFloat(layer.getAttribute('data-speed')) || 0;
        gsap.to(layer, {
          x: -x * speed * 500,
          y: -y * speed * 500,
          ease: "power2.out",
          duration: 1
        });
      });
    });
  }
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
