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
scene.fog = new THREE.FogExp2(0x050505, 0.0);

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

camera.position.set(0, 35, 0); 
camera.lookAt(0, 0, 0); 

let truckModel;

// WE ONLY LOAD THE TRUCK 3D MODEL NOW - MASSIVE RAM SAVINGS
gltfLoader.loadAsync('/assets/Truck_draco.glb').then((truckGltf) => {
  truckModel = truckGltf.scene;

  truckModel.rotation.y = -Math.PI / 2;
  const truckBox = new THREE.Box3().setFromObject(truckModel);
  const truckSize = truckBox.getSize(new THREE.Vector3());
  const truckCenter = truckBox.getCenter(new THREE.Vector3());
  const truckScale = 8.5 / truckSize.x; 
  truckModel.scale.set(truckScale, truckScale, truckScale);
  truckModel.position.set(-truckCenter.x * truckScale, -truckCenter.y * truckScale, -truckCenter.z * truckScale);
  truckGroup.add(truckModel);
  truckGroup.position.set(0, 0, 20); 

  const tlPreload = gsap.timeline({ onComplete: () => { if(loader) loader.remove(); } });
  if(bar) tlPreload.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power3.inOut" });
  if(loader) tlPreload.to(loader, { yPercent: -100, duration: 1, ease: "power4.inOut" }, "+=0.2");

  initScrollAnimations();
  initAppleSequence();
});

function initScrollAnimations() {
  const arrivalTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".truck-arrival",
      start: "top bottom",
      end: "top top",
      scrub: 1
    }
  });
  
  arrivalTl.to(truckGroup.position, { z: 2, ease: "power2.out" });
  arrivalTl.to('.specs-content', { opacity: 1, stagger: 0.2, ease: "power2.out" }, "-=0.5");

  // The Zoom & Breach Transition
  const zoomTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".roof-breach",
      start: "top center",
      end: "bottom top",
      scrub: 1
    }
  });

  // Fade out 3D Canvas
  zoomTl.to('#bg', {
    opacity: 0,
    ease: "power1.in",
    duration: 0.5
  });

  // Plunge camera
  zoomTl.to(camera.position, {
    y: 5,
    ease: "power1.in",
    duration: 1
  }, 0);
}

function initAppleSequence() {
  const canvas = document.getElementById("seat-sequence");
  if(!canvas) return;
  const context = canvas.getContext("2d");

  // Based on your original image dimensions
  canvas.width = 1024;
  canvas.height = 903;

  const frameCount = 60;
  const currentFrame = index => /assets/seat_sequence/seat_.png;

  const images = [];
  const seatSequence = { frame: 0 };

  // Preload frames
  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
  }

  // Initial draw
  images[0].onload = render;

  function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images[seatSequence.frame], 0, 0);
  }

  // Link scroll to frame sequence
  gsap.to(seatSequence, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
      trigger: ".apple-sequence-section",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5
    },
    onUpdate: render
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
