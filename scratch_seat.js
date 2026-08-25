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
const seatGroup = new THREE.Group();
scene.add(truckGroup);
scene.add(seatGroup);

camera.position.set(0, 35, 0); 
camera.lookAt(0, 0, 0); 

let truckModel, seatModel;

Promise.all([
  gltfLoader.loadAsync('/assets/Truck_draco.glb'),
  gltfLoader.loadAsync('/assets/Seat_draco.glb')
]).then(([truckGltf, seatGltf]) => {
  truckModel = truckGltf.scene;
  seatModel = seatGltf.scene;

  // Setup Truck
  truckModel.rotation.y = -Math.PI / 2;
  const truckBox = new THREE.Box3().setFromObject(truckModel);
  const truckSize = truckBox.getSize(new THREE.Vector3());
  const truckCenter = truckBox.getCenter(new THREE.Vector3());
  const truckScale = 8.5 / truckSize.x; 
  truckModel.scale.set(truckScale, truckScale, truckScale);
  truckModel.position.set(-truckCenter.x * truckScale, -truckCenter.y * truckScale, -truckCenter.z * truckScale);
  truckGroup.add(truckModel);
  truckGroup.position.set(0, 0, 20); 

  // Setup Seat
  const seatBox = new THREE.Box3().setFromObject(seatModel);
  const seatSize = seatBox.getSize(new THREE.Vector3());
  const seatCenter = seatBox.getCenter(new THREE.Vector3());
  const seatScale = 10 / seatSize.y; // Make it large and proud
  seatModel.scale.set(seatScale, seatScale, seatScale);
  seatModel.position.set(-seatCenter.x * seatScale, -seatCenter.y * seatScale, -seatCenter.z * seatScale);
  seatGroup.add(seatModel);
  
  // Hide seat initially by pushing it way down on Y (away from camera)
  seatGroup.position.set(0, -50, 0);

  const tlPreload = gsap.timeline({ onComplete: () => { if(loader) loader.remove(); } });
  if(bar) tlPreload.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power3.inOut" });
  if(loader) tlPreload.to(loader, { yPercent: -100, duration: 1, ease: "power4.inOut" }, "+=0.2");

  initScrollAnimations();
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

  // The Zoom & Breach Transition (Now swaps to 3D Seat)
  const zoomTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".roof-breach",
      start: "top center",
      end: "bottom top",
      scrub: 1
    }
  });

  // Fade in the transition mask
  zoomTl.to('.transition-mask', {
    opacity: 1,
    ease: "power2.out",
    duration: 0.4
  });

  // Plunge camera while masking
  zoomTl.to(camera.position, {
    y: 5,
    ease: "power1.in",
    duration: 0.5
  }, 0);

  // During the blackout mask: Move truck away, Move seat in, Reset camera to look at seat
  zoomTl.add(() => {
    truckGroup.position.set(0, -100, 0);
    seatGroup.position.set(0, 0, 0); // Seat takes center stage
    
    // Change camera from top-down to a front-perspective for the seat
    camera.position.set(0, 2, 18);
    camera.lookAt(0, 0, 0);
  }, 0.5);

  // Fade mask out to reveal the 3D Seat
  zoomTl.to('.transition-mask', {
    opacity: 0,
    ease: "power2.in",
    duration: 0.4
  }, 0.6);

  // 3D Seat Rotation on MouseMove
  const dioramaSection = document.querySelector('.diorama-section');
  if(dioramaSection) {
    document.addEventListener('mousemove', (e) => {
      // Only rotate seat if we are scrolled down to it
      if (window.scrollY > document.querySelector('.roof-breach').offsetTop) {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        gsap.to(seatGroup.rotation, {
          y: x * 0.5,
          x: y * 0.2,
          ease: "power2.out",
          duration: 1
        });
      }
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
