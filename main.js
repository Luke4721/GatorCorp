import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import PixelSwap from './PixelSwap.js';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const seatData = [
  { 
    id: 1, title: 'SUPREMO', img: '/assets/seats/Supremo.png', 
    desc: 'Supremo is a premium offering with top-of-the-line air suspension. It guarantees the absolute ultimate in long-haul comfort and vibration isolation for highway driving.', 
    hotspots: [
        { dot: { top: '15%', left: '48%' }, panel: { top: '5%', left: '85%' }, title: 'ACTIVE HEADREST', desc: 'Reduces whiplash.' },
        { dot: { top: '35%', left: '20%' }, panel: { top: '25%', left: '-5%' }, title: 'SHOULDER BOLSTERS', desc: 'Lateral support.' },
        { dot: { top: '55%', left: '25%' }, panel: { top: '50%', left: '-15%' }, title: 'LUMBAR SYSTEM', desc: 'Pneumatic adjustment.' },
        { dot: { top: '65%', left: '80%' }, panel: { top: '60%', left: '100%' }, title: 'ARMREST CONTROLS', desc: 'Integrated haptics.' },
        { dot: { top: '75%', left: '30%' }, panel: { top: '75%', left: '-10%' }, title: 'SEAT PAN TILT', desc: 'Thigh support.' },
        { dot: { top: '80%', left: '50%' }, panel: { top: '85%', left: '110%' }, title: 'AIR SUSPENSION', desc: 'Isolates 90% vibration.' },
        { dot: { top: '95%', left: '50%' }, panel: { top: '100%', left: '-5%' }, title: 'BASE DAMPERS', desc: 'Heavy shock absorption.' }
    ]
  }
];

// Initialize PixelSwap
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('pixel-swap-container');
    if (container) {
        new PixelSwap(container, {
            pixelSize: 24, duration: 800, pixelDuration: 400, fade: true, trigger: 'hover',
            firstContent: '<div class="text-[10px] font-bold tracking-[0.2em] text-white">EXPLORE SEAT</div>',
            secondContent: '<div class="text-[10px] font-bold tracking-[0.2em] text-white">VIEW DETAILS</div>'
        });
    }
});

// 1. SMOOTH SCROLLING (Lenis)
const lenis = new Lenis({ lerp: 0.05, smoothWheel: true, wheelMultiplier: 1.0 });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// --- 2. THREE.JS SPATIAL JOURNEY SETUP ---
const canvas = document.getElementById('tron-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x070e11, 0.012); // Slightly pushed back fog

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 0); 
camera.rotation.set(0, 0, 0); 

// Lighting for the 3D chair
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);
const backLight = new THREE.DirectionalLight(0x0099ff, 3);
backLight.position.set(-10, -10, -10);
scene.add(backLight);

const gridColor = 0xffffff; 
const wireColor = 0xffffff; 

// --- BUILD THE PROCEDURAL 3D CHAIR FOR THE EXPLODED VIEW ---
const chairGroup = new THREE.Group();
chairGroup.position.set(0, -90, -40); // Position it exactly where the camera drops down to
chairGroup.rotation.y = -Math.PI / 4; // Angle it nicely

// Material for the chair parts (Dark sleek metallic + bright wireframe edges)
const chairMat = new THREE.MeshStandardMaterial({ color: 0x1a2b3c, roughness: 0.2, metalness: 0.8 });
const edgeMat = new THREE.LineBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.8 });

function createChairPart(geometry, yOffset, zOffset, isCylinder = false) {
    const mesh = new THREE.Mesh(geometry, chairMat);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), edgeMat);
    mesh.add(edges);
    mesh.position.set(0, yOffset, zOffset);
    // Store original positions for GSAP exploding
    mesh.userData = { origY: yOffset, origZ: zOffset, origX: 0 };
    chairGroup.add(mesh);
    return mesh;
}

// 1. Base Plate
const base = createChairPart(new THREE.BoxGeometry(16, 2, 16), -10, 0);
// 2. Suspension Core
const suspension = createChairPart(new THREE.CylinderGeometry(3, 3, 8, 16), -5, 0, true);
// 3. Seat Cushion
const cushion = createChairPart(new THREE.BoxGeometry(18, 4, 18), 1, 0);
// 4. Backrest
const backrest = createChairPart(new THREE.BoxGeometry(16, 24, 4), 15, -7);
// 5. Headrest
const headrest = createChairPart(new THREE.BoxGeometry(10, 6, 3), 31, -7);
// 6. Armrests
const armL = createChairPart(new THREE.BoxGeometry(3, 2, 14), 10, 2);
armL.position.x = -10; armL.userData.origX = -10;
const armR = createChairPart(new THREE.BoxGeometry(3, 2, 14), 10, 2);
armR.position.x = 10; armR.userData.origX = 10;

scene.add(chairGroup);

// Environment 1: The Elevator Shaft
const shaftGroup = new THREE.Group();
for(let i = 0; i < 20; i++) {
    const box = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(60, 10, 60)), // Made wider so chair fits
        new THREE.LineBasicMaterial({ color: wireColor, transparent: true, opacity: 1.0 })
    );
    box.position.y = 40 - (i * 20);
    shaftGroup.add(box);
}
scene.add(shaftGroup);

// Environment 2: The Corridor
const gridHelper = new THREE.GridHelper(300, 100, gridColor, gridColor);
gridHelper.position.set(100, -100, -50); 
gridHelper.material.transparent = true;
gridHelper.material.opacity = 1.0;
scene.add(gridHelper);

// Environment 3: The Integration Matrix
const matrixGroup = new THREE.Group();
matrixGroup.position.set(250, -100, -50);
const chassis = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(30, 20, 60)),
    new THREE.LineBasicMaterial({ color: wireColor, transparent: true, opacity: 1.0 })
);
chassis.position.y = -30;
matrixGroup.add(chassis);
scene.add(matrixGroup);

function animate() {
    requestAnimationFrame(animate);
    
    // Slowly rotate the chair group for a premium showroom feel
    if(chairGroup) {
        chairGroup.rotation.y += 0.002;
    }

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- 3. MASTER GSAP SCROLL TIMELINE ---
const masterTl = gsap.timeline({
    scrollTrigger: { trigger: "#scroll-container", start: "top top", end: "bottom bottom", scrub: 1.0 }
});

// PHASE 1: HERO DEPARTURE (0 - 15%)
masterTl.to("#hero-typography", { y: -150, opacity: 0, duration: 0.10 }, 0.0);
masterTl.to("#hero-split-left", { x: -200, opacity: 0, duration: 0.05 }, 0.05);
masterTl.to("#hero-split-right", { x: 200, opacity: 0, duration: 0.05 }, 0.05);
masterTl.to(["#hero-circle-1", "#hero-circle-2"], { scale: 1.5, opacity: 0, duration: 0.1 }, 0.0);
masterTl.to("#hero-img", { opacity: 0, duration: 0.1 }, 0.05);
masterTl.to("#tron-canvas", { opacity: 1, duration: 0.1 }, 0.05);

masterTl.to(camera.position, { y: -90, ease: "power2.inOut", duration: 0.25 }, 0.15);
masterTl.to("#era-hero", { opacity: 0, duration: 0.1 }, 0.15);
masterTl.to("#section-descent", { opacity: 1, duration: 0.05 }, 0.15);
masterTl.to("#descent-text-1", { y: "0%", duration: 0.05, ease: "power3.out" }, 0.17);
masterTl.to("#descent-text-2", { y: "0%", duration: 0.05, ease: "power3.out" }, 0.19);
masterTl.to("#descent-sub", { y: "0%", opacity: 1, duration: 0.05, ease: "power3.out" }, 0.21);

// --- THE REAL 3D EXPLODED VIEW ANIMATION ---
// As camera reaches the chair, explode the parts outwards!
const explodeDuration = 0.15;
const explodeStart = 0.25;

masterTl.to(headrest.position, { y: headrest.userData.origY + 20, ease: "power1.inOut", duration: explodeDuration }, explodeStart);
masterTl.to(backrest.position, { z: backrest.userData.origZ - 15, ease: "power1.inOut", duration: explodeDuration }, explodeStart);
masterTl.to(cushion.position, { y: cushion.userData.origY + 10, ease: "power1.inOut", duration: explodeDuration }, explodeStart);
masterTl.to(armL.position, { x: armL.userData.origX - 15, ease: "power1.inOut", duration: explodeDuration }, explodeStart);
masterTl.to(armR.position, { x: armR.userData.origX + 15, ease: "power1.inOut", duration: explodeDuration }, explodeStart);
masterTl.to(base.position, { y: base.userData.origY - 10, ease: "power1.inOut", duration: explodeDuration }, explodeStart);

// Assemble back together before moving on
masterTl.to(headrest.position, { y: headrest.userData.origY, ease: "power1.inOut", duration: 0.05 }, 0.40);
masterTl.to(backrest.position, { z: backrest.userData.origZ, ease: "power1.inOut", duration: 0.05 }, 0.40);
masterTl.to(cushion.position, { y: cushion.userData.origY, ease: "power1.inOut", duration: 0.05 }, 0.40);
masterTl.to(armL.position, { x: armL.userData.origX, ease: "power1.inOut", duration: 0.05 }, 0.40);
masterTl.to(armR.position, { x: armR.userData.origX, ease: "power1.inOut", duration: 0.05 }, 0.40);
masterTl.to(base.position, { y: base.userData.origY, ease: "power1.inOut", duration: 0.05 }, 0.40);

masterTl.to("#section-descent", { opacity: 0, duration: 0.05 }, 0.40);

// PHASE 3: THE CORRIDOR
masterTl.to(camera.rotation, { y: -Math.PI / 2, ease: "power1.inOut", duration: 0.05 }, 0.45);
masterTl.to(camera.position, { x: 150, ease: "none", duration: 0.25 }, 0.50);
masterTl.to("#catalogue-ui", { opacity: 1, x: "0%", duration: 0.05, ease: "power3.out" }, 0.48);
masterTl.to("#catalogue-ui", { opacity: 0, x: "-100%", duration: 0.05, ease: "power3.in" }, 0.70);

// PHASE 4: THE INTEGRATION MATRIX
masterTl.to(camera.rotation, { z: -Math.PI / 2, x: -Math.PI / 2, ease: "power2.inOut", duration: 0.1 }, 0.72);
masterTl.to(camera.position, { y: -150, ease: "power2.inOut", duration: 0.18 }, 0.82);
masterTl.to("#section-matrix", { opacity: 1, duration: 0.05 }, 0.75);
masterTl.to("#matrix-text", { scale: 1, opacity: 1, duration: 0.1, ease: "power2.out" }, 0.75);

// Update logic
function updateCatalogueUI(index) {
    const data = seatData[0]; // Simplified
    const titleEl = document.getElementById('cat-title');
    if(!titleEl) return;
    titleEl.textContent = data.title;
    document.getElementById('cat-desc').textContent = data.desc;
    
    const imgEl = document.getElementById('cat-img');
    if(!imgEl.src.includes(data.img)) {
       gsap.to(imgEl, { opacity: 0, duration: 0.2, onComplete: () => { imgEl.src = data.img; gsap.to(imgEl, { opacity: 1, duration: 0.3 }); }});
    }
}
updateCatalogueUI(0);
