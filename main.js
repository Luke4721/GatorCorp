import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import PixelSwap from './PixelSwap.js';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// Data with 7-9 features per chair
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
  },
  { 
    id: 2, title: 'EXCAVATOR', img: '/assets/seats/Excavator.png', 
    desc: 'Built specifically for earth-moving equipment, this seat features mechanical suspension tuned for extreme vertical shocks.', 
    hotspots: [
        { dot: { top: '20%', left: '50%' }, panel: { top: '10%', left: '90%' }, title: 'REINFORCED FRAME', desc: 'Steel construction.' },
        { dot: { top: '40%', left: '25%' }, panel: { top: '30%', left: '-10%' }, title: 'RUGGED TRIM', desc: 'Tear-resistant fabric.' },
        { dot: { top: '55%', left: '85%' }, panel: { top: '50%', left: '105%' }, title: 'CONTROL PODS', desc: 'Joystick mounts.' },
        { dot: { top: '65%', left: '40%' }, panel: { top: '70%', left: '-15%' }, title: 'MECHANICAL DAMPING', desc: 'Coil suspension.' },
        { dot: { top: '75%', left: '60%' }, panel: { top: '80%', left: '100%' }, title: 'WEIGHT ADJUST', desc: 'Manual dial calibration.' },
        { dot: { top: '85%', left: '50%' }, panel: { top: '95%', left: '-5%' }, title: 'TETHER POINTS', desc: 'Safety harness anchors.' },
        { dot: { top: '90%', left: '70%' }, panel: { top: '105%', left: '95%' }, title: 'MUD GUARDS', desc: 'Sealed base.' }
    ]
  },
  { 
    id: 3, title: 'TRACTOR', img: '/assets/seats/Tractor.png', 
    desc: 'Designed for agricultural machinery, offering robust weather resistance and constant damping over uneven terrain.', 
    hotspots: [
        { dot: { top: '25%', left: '50%' }, panel: { top: '15%', left: '85%' }, title: 'WEATHER COATING', desc: 'Waterproof sealant.' },
        { dot: { top: '45%', left: '30%' }, panel: { top: '40%', left: '-10%' }, title: 'VINYL TRIM', desc: 'Easy wash down.' },
        { dot: { top: '55%', left: '80%' }, panel: { top: '55%', left: '100%' }, title: 'SWIVEL BASE', desc: '360 degree rotation.' },
        { dot: { top: '70%', left: '45%' }, panel: { top: '70%', left: '-15%' }, title: 'LOW FREQ DAMPING', desc: 'Tractor track isolation.' },
        { dot: { top: '85%', left: '40%' }, panel: { top: '90%', left: '-5%' }, title: 'HEATED SEAT', desc: 'Winter operations.' },
        { dot: { top: '90%', left: '60%' }, panel: { top: '95%', left: '95%' }, title: 'DRAINAGE', desc: 'Moisture runoff.' },
        { dot: { top: '95%', left: '50%' }, panel: { top: '110%', left: '40%' }, title: 'RUGGED MOUNTS', desc: 'Universal tractor fit.' }
    ]
  },
  { 
    id: 4, title: 'COMPACT', img: '/assets/seats/Mini Excavator.png', 
    desc: 'A compact, highly maneuverable seat for forklifts with active lateral support.', 
    hotspots: [
        { dot: { top: '30%', left: '50%' }, panel: { top: '20%', left: '85%' }, title: 'COMPACT PROFILE', desc: 'Fits tight cabins.' },
        { dot: { top: '50%', left: '20%' }, panel: { top: '45%', left: '-10%' }, title: 'LATERAL BOLSTERS', desc: 'Holds operator.' },
        { dot: { top: '60%', left: '80%' }, panel: { top: '60%', left: '100%' }, title: 'QUICK RELEASE', desc: 'Fast egress.' },
        { dot: { top: '75%', left: '50%' }, panel: { top: '75%', left: '-15%' }, title: 'MICRO SUSPENSION', desc: '1-inch travel.' },
        { dot: { top: '85%', left: '40%' }, panel: { top: '95%', left: '-5%' }, title: 'SENSOR SWITCH', desc: 'Operator presence.' },
        { dot: { top: '90%', left: '60%' }, panel: { top: '100%', left: '95%' }, title: 'SEATBELT LOCK', desc: 'Interlock system.' },
        { dot: { top: '95%', left: '50%' }, panel: { top: '110%', left: '50%' }, title: 'NARROW BASE', desc: 'Forklift standard.' }
    ]
  }
];

// Initialize PixelSwap
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('pixel-swap-container');
    if (container) {
        new PixelSwap(container, {
            pixelSize: 24,
            duration: 800,
            pixelDuration: 400,
            fade: true,
            trigger: 'hover',
            firstContent: '<div class="text-[10px] font-bold tracking-[0.2em] text-[#1a1a1a]">EXPLORE SEAT</div>',
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
// Background wooden cream color: #E3D3C2
scene.fog = new THREE.FogExp2(0xE3D3C2, 0.015);

// Camera starts at Hero position (looking down -Z)
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 0); 
camera.rotation.set(0, 0, 0); // Straight forward

// Vibrant (but not eye-hitting) grid color: Warm Coral / Vibrant Blue combination. Let's use a nice vibrant Azure Blue for the technical contrast on wood.
const gridColor = 0x0099ff; // Vibrant Azure Blue

// Environment 1: The Elevator Shaft (Vertical descent)
const shaftGroup = new THREE.Group();
for(let i = 0; i < 20; i++) {
    const box = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(40, 10, 40)),
        new THREE.LineBasicMaterial({ color: gridColor, transparent: true, opacity: 0.4 })
    );
    box.position.y = 40 - (i * 20);
    shaftGroup.add(box);
}
scene.add(shaftGroup);

// Environment 2: The Corridor (Horizontal travel)
const gridHelper = new THREE.GridHelper(300, 100, gridColor, gridColor);
gridHelper.position.set(100, -100, -50); 
gridHelper.material.transparent = true;
gridHelper.material.opacity = 0.3;
scene.add(gridHelper);

// Environment 3: The Integration Matrix (Deep dive)
const matrixGroup = new THREE.Group();
matrixGroup.position.set(250, -100, -50);
const chassis = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(30, 20, 60)),
    new THREE.LineBasicMaterial({ color: gridColor, transparent: true, opacity: 0.6 })
);
chassis.position.y = -30;
matrixGroup.add(chassis);
scene.add(matrixGroup);

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

// --- 3. MASTER GSAP SCROLL TIMELINE ---
const masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#scroll-container",
      start: "top top",
      end: "bottom bottom", 
      scrub: 1.0,
    }
});

masterTl.to(camera.position, { y: -90, ease: "power2.inOut", duration: 0.25 }, 0.15);
masterTl.to("#era-hero", { opacity: 0, duration: 0.1 }, 0.15);
masterTl.to("#section-descent", { opacity: 1, duration: 0.05 }, 0.15);
masterTl.to("#descent-text-1", { y: "0%", duration: 0.05, ease: "power3.out" }, 0.17);
masterTl.to("#descent-text-2", { y: "0%", duration: 0.05, ease: "power3.out" }, 0.19);
masterTl.to("#descent-sub", { y: "0%", opacity: 1, duration: 0.05, ease: "power3.out" }, 0.21);
masterTl.to("#section-descent", { opacity: 0, duration: 0.05 }, 0.38);

masterTl.to(camera.rotation, { y: -Math.PI / 2, ease: "power1.inOut", duration: 0.05 }, 0.40);
masterTl.to(camera.position, { x: 150, ease: "none", duration: 0.25 }, 0.45);
masterTl.to("#catalogue-ui", { opacity: 1, x: "0%", duration: 0.05, ease: "power3.out" }, 0.42);
masterTl.to("#catalogue-ui", { opacity: 0, x: "-100%", duration: 0.05, ease: "power3.in" }, 0.70);

masterTl.to(camera.rotation, { z: -Math.PI / 2, x: -Math.PI / 2, ease: "power2.inOut", duration: 0.1 }, 0.72);
masterTl.to(camera.position, { y: -150, ease: "power2.inOut", duration: 0.18 }, 0.82);
masterTl.to("#section-matrix", { opacity: 1, duration: 0.05 }, 0.75);
masterTl.to("#matrix-text", { scale: 1, opacity: 1, duration: 0.1, ease: "power2.out" }, 0.75);

// --- CAROUSEL LOGIC ---
const carouselContainer = document.getElementById('carousel-container');
if (carouselContainer) {
    seatData.forEach((seat, i) => {
        const dot = document.createElement('div');
        // Switched to dark styling for the cream background
        dot.className = `w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${i === 0 ? 'bg-[#1a1a1a] scale-125' : 'bg-[#1a1a1a]/30 hover:bg-[#1a1a1a]/60'}`;
        dot.addEventListener('click', () => {
            document.querySelectorAll('#carousel-container div').forEach((el, idx) => {
                el.className = `w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${idx === i ? 'bg-[#1a1a1a] scale-125' : 'bg-[#1a1a1a]/30 hover:bg-[#1a1a1a]/60'}`;
            });
            updateCatalogueUI(i);
        });
        carouselContainer.appendChild(dot);
    });
}

function updateCatalogueUI(index) {
    const data = seatData[index];
    const titleEl = document.getElementById('cat-title');
    if(!titleEl) return;
    titleEl.textContent = data.title;
    document.getElementById('cat-desc').textContent = data.desc;
    
    // SIMPLE CLEAN CROSSFADE, NO MORE SVG PIXEL SWAP BUGS!
    const imgEl = document.getElementById('cat-img');
    if(imgEl.src && imgEl.src.includes(data.img)) {
       imgEl.src = data.img;
    } else {
       gsap.to(imgEl, {
           opacity: 0,
           duration: 0.2,
           onComplete: () => {
               imgEl.src = data.img;
               gsap.to(imgEl, { opacity: 1, duration: 0.3 });
           }
       });
    }
    
    // Render ERA-Style Circular Hotspots with Lines connecting dot and panel
    const hsContainer = document.getElementById('hotspots-container');
    if (hsContainer) {
        hsContainer.innerHTML = '';
        
        const svgLines = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgLines.style.position = 'absolute';
        svgLines.style.inset = '0';
        svgLines.style.width = '100%';
        svgLines.style.height = '100%';
        svgLines.style.pointerEvents = 'none';
        svgLines.style.zIndex = '1';
        hsContainer.appendChild(svgLines);

        if (data.hotspots) {
            data.hotspots.forEach((hs, i) => {
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute('x1', hs.dot.left);
                line.setAttribute('y1', hs.dot.top);
                line.setAttribute('x2', hs.panel.left);
                line.setAttribute('y2', hs.panel.top);
                // Dark lines for cream background
                line.setAttribute('stroke', 'rgba(26,26,26,0.2)');
                line.setAttribute('stroke-width', '1');
                svgLines.appendChild(line);

                const anchor = document.createElement('div');
                anchor.className = 'absolute w-1 h-1 bg-[#1a1a1a] rounded-full pointer-events-none z-10';
                anchor.style.top = hs.dot.top;
                anchor.style.left = hs.dot.left;
                anchor.style.transform = 'translate(-50%, -50%)';
                hsContainer.appendChild(anchor);

                const el = document.createElement('div');
                el.className = 'absolute group pointer-events-auto flex items-center justify-center z-20 w-32 h-32 rounded-full cursor-pointer mix-blend-difference';
                el.style.top = hs.panel.top;
                el.style.left = hs.panel.left;
                el.style.transform = 'translate(-50%, -50%)'; 
                
                const border = document.createElement('div');
                // Dark border for cream background
                border.className = 'absolute inset-0 rounded-full border-[0.5px] border-[#1a1a1a]/20 group-hover:border-[#1a1a1a]/80 group-hover:scale-110 transition-all duration-700 ease-out';
                
                const center = document.createElement('div');
                center.className = 'w-1 h-1 bg-[#1a1a1a]/40 rounded-full group-hover:scale-150 transition-all duration-500';
                
                const panel = document.createElement('div');
                const isLeft = parseFloat(hs.panel.left) < 50;
                
                // Text classes changed from text-white to text-[#1a1a1a] (dark mode)
                if (isLeft) {
                    panel.className = 'absolute top-1/2 right-full mr-4 -translate-y-1/2 w-48 opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:-translate-x-2 pointer-events-none text-right';
                } else {
                    panel.className = 'absolute top-1/2 left-full ml-4 -translate-y-1/2 w-48 opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-2 pointer-events-none text-left';
                }
                
                panel.innerHTML = `
                    <div class="font-['Playfair_Display'] text-xl text-[#1a1a1a] mb-1 whitespace-nowrap">${hs.title}</div>
                    <div class="text-[9px] font-sans text-[#1a1a1a]/60 tracking-widest uppercase">${hs.desc}</div>
                `;
                
                el.appendChild(border);
                el.appendChild(center);
                el.appendChild(panel);
                hsContainer.appendChild(el);
            });
        }
    }
}

updateCatalogueUI(0);
