import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import PixelSwap from './PixelSwap.js';

gsap.registerPlugin(ScrollTrigger);

// Data
const seatData = [
  { 
    id: 1, title: 'SUPREMO', img: '/assets/seats/Supremo.png', 
    desc: 'Supremo is a premium offering with top-of-the-line air suspension. It guarantees the absolute ultimate in long-haul comfort and vibration isolation for highway driving.', 
    hotspots: [
        { dot: { top: '35%', left: '75%' }, title: 'ACTIVE HEADREST', desc: 'Reduces whiplash and neck strain.' },
        { dot: { top: '65%', left: '30%' }, title: 'LUMBAR SUPPORT', desc: 'Multi-chamber pneumatic lumbar adjustment.' },
        { dot: { top: '85%', left: '50%' }, title: 'AIR SUSPENSION', desc: 'Isolates 90% of harmful vibrations.' }
    ]
  },
  { 
    id: 2, title: 'EXCAVATOR', img: '/assets/seats/Excavator.png', 
    desc: 'Built specifically for earth-moving equipment, this seat features mechanical suspension tuned for extreme vertical shocks.', 
    hotspots: [
        { dot: { top: '30%', left: '48%' }, title: 'RUGGED TRIM', desc: 'Tear-resistant industrial fabric.' },
        { dot: { top: '75%', left: '50%' }, title: 'MECHANICAL DAMPING', desc: 'Heavy-duty steel coil suspension.' }
    ]
  },
  { 
    id: 3, title: 'TRACTOR', img: '/assets/seats/Tractor.png', 
    desc: 'Designed for agricultural machinery, offering robust weather resistance and constant damping over uneven terrain.', 
    hotspots: [
        { dot: { top: '40%', left: '60%' }, title: 'WEATHER RESISTANT', desc: 'Sealed seams and waterproof coating.' },
        { dot: { top: '80%', left: '45%' }, title: 'SHOCK DAMPING', desc: 'Constant rate damping for agricultural tracks.' }
    ]
  },
  { 
    id: 4, title: 'COMPACT', img: '/assets/seats/Mini Excavator.png', 
    desc: 'A compact, highly maneuverable seat for forklifts with active lateral support.', 
    hotspots: [
        { dot: { top: '55%', left: '35%' }, title: 'LATERAL BOLSTERS', desc: 'Holds operator securely.' },
        { dot: { top: '90%', left: '50%' }, title: 'LOW PROFILE', desc: 'Fits compactly into tight cabins.' }
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
            firstContent: '<div class="text-[10px] font-bold tracking-[0.2em]">EXPLORE SEAT</div>',
            secondContent: '<div class="text-[10px] font-bold tracking-[0.2em] text-black">VIEW DETAILS</div>'
        });
    }

    const vids = document.querySelectorAll('video');
    vids.forEach(v => {
        v.play().catch(e => console.log("Autoplay prevented", e));
    });
});

// 1. SMOOTH SCROLLING (Lenis)
const lenis = new Lenis({ lerp: 0.05, smoothWheel: true, wheelMultiplier: 1.0 });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// 2. TIMELINES
const masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#scroll-container",
      start: "top top",
      end: "bottom bottom", 
      scrub: 1.5,
    }
});

// Phase 1: ERA Hero Scroll Parallax & Fade
masterTl.to("#hero-script", { y: "-150%", rotate: "5deg", duration: 0.15 }, 0.0);
masterTl.to("#hero-typography", { y: -200, opacity: 0, duration: 0.20 }, 0.0);
masterTl.to("#hero-split-left", { x: -200, opacity: 0, duration: 0.15 }, 0.05);
masterTl.to("#hero-split-right", { x: 200, opacity: 0, duration: 0.15 }, 0.05);
masterTl.to(["#hero-circle-1", "#hero-circle-2"], { scale: 1.5, opacity: 0, duration: 0.2 }, 0.0);
masterTl.to("#era-hero", { opacity: 0, duration: 0.1 }, 0.25);

// Phase 2: White Drone Video
masterTl.to("body", { backgroundColor: "#f4f4f5", duration: 0.05, ease: "none" }, 0.25);
masterTl.to("#section-ha-white", { opacity: 1, duration: 0.05, ease: "none" }, 0.25);
masterTl.to("#ha-text-white", { scale: 1, opacity: 1, duration: 0.1, ease: "power2.out" }, 0.35);
masterTl.to("#ha-text-white", { scale: 1.1, opacity: 0, duration: 0.1, ease: "power2.in" }, 0.55);
masterTl.to("#section-ha-white", { opacity: 0, duration: 0.05, ease: "none" }, 0.65);

// Phase 3: Return to Black and Catalogue Reveal
masterTl.to("body", { backgroundColor: "#0d0d0d", duration: 0.05, ease: "none" }, 0.65);
masterTl.to("#catalogue-ui", { y: "0vh", opacity: 1, pointerEvents: "auto", duration: 0.1, ease: "power3.out" }, 0.68);

// --- CAROUSEL LOGIC ---
const carouselContainer = document.getElementById('carousel-container');
if (carouselContainer) {
    seatData.forEach((seat, i) => {
        const dot = document.createElement('div');
        dot.className = `w-1.5 h-1.5 rounded-full cursor-pointer transition-all duration-300 \${i === 0 ? 'bg-white scale-150' : 'bg-white/30 hover:bg-white/60'}`;
        dot.addEventListener('click', () => {
            document.querySelectorAll('#carousel-container div').forEach((el, idx) => {
                el.className = `w-1.5 h-1.5 rounded-full cursor-pointer transition-all duration-300 \${idx === i ? 'bg-white scale-150' : 'bg-white/30 hover:bg-white/60'}`;
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
    
    // PixelSwap transition for the image
    const imgEl = document.getElementById('cat-img');
    if(imgEl.src && imgEl.src.includes(data.img)) {
       imgEl.src = data.img;
    } else {
       const width = imgEl.offsetWidth;
       const height = imgEl.offsetHeight;
       const size = 64;
       const cols = Math.ceil(width / size);
       const rows = Math.ceil(height / size);
       
       const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
       svg.style.position = "absolute";
       svg.style.top = "0";
       svg.style.left = "0";
       svg.style.width = "100%";
       svg.style.height = "100%";
       svg.style.pointerEvents = "none";
       svg.style.zIndex = "50";
       
       let rects = [];
       for (let y = 0; y < rows; y++) {
         for (let x = 0; x < cols; x++) {
           const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
           rect.setAttribute("x", x * size);
           rect.setAttribute("y", y * size);
           rect.setAttribute("width", size);
           rect.setAttribute("height", size);
           rect.setAttribute("fill", "#0d0d0d");
           rect.style.transformOrigin = `\${x * size + size/2}px \${y * size + size/2}px`;
           svg.appendChild(rect);
           rects.push(rect);
         }
       }
       
       const wrapper = document.querySelector('.relative.inline-block.h-\\\\[75vh\\\\]');
       if(wrapper) {
           wrapper.appendChild(svg);
           gsap.fromTo(rects.sort(() => Math.random() - 0.5), {
               scale: 0, opacity: 0
           }, {
               scale: 1, opacity: 1,
               duration: 0.3, stagger: 0.005, ease: "power1.inOut",
               onComplete: () => {
                   imgEl.src = data.img;
                   gsap.to(rects.sort(() => Math.random() - 0.5), {
                       scale: 0, opacity: 0,
                       duration: 0.3, stagger: 0.005, ease: "power1.inOut",
                       onComplete: () => { svg.remove(); }
                   });
               }
           });
       } else {
           imgEl.src = data.img;
       }
    }
    
    // Render ERA-Style Circular Hotspots
    const hsContainer = document.getElementById('hotspots-container');
    if (hsContainer) {
        hsContainer.innerHTML = '';
        if (data.hotspots) {
            data.hotspots.forEach((hs, i) => {
                const el = document.createElement('div');
                el.className = 'absolute group pointer-events-auto flex items-center justify-center z-20 w-32 h-32 rounded-full cursor-pointer mix-blend-difference';
                el.style.top = hs.dot.top;
                el.style.left = hs.dot.left;
                el.style.transform = 'translate(-50%, -50%)'; 
                
                // Outer circle border (thin, elegant)
                const border = document.createElement('div');
                border.className = 'absolute inset-0 rounded-full border-[0.5px] border-white/20 group-hover:border-white/80 group-hover:scale-110 transition-all duration-700 ease-out';
                
                // Crosshair / center dot
                const center = document.createElement('div');
                center.className = 'w-1 h-1 bg-white/40 rounded-full group-hover:scale-150 transition-all duration-500';
                
                // The Panel
                const panel = document.createElement('div');
                // Alternating left/right popups
                const isLeft = i % 2 === 0;
                panel.className = `absolute top-1/2 -translate-y-1/2 \${isLeft ? 'right-full mr-4' : 'left-full ml-4'} w-48 opacity-0 group-hover:opacity-100 transition-all duration-500 \${isLeft ? 'translate-x-4 group-hover:translate-x-0' : '-translate-x-4 group-hover:translate-x-0'} pointer-events-none`;
                
                panel.innerHTML = `
                    <div class="font-['Playfair_Display'] text-xl text-white mb-1 whitespace-nowrap">\${hs.title}</div>
                    <div class="text-[9px] font-sans text-white/60 tracking-widest uppercase uppercase">\${hs.desc}</div>
                `;
                
                el.appendChild(border);
                el.appendChild(center);
                el.appendChild(panel);
                hsContainer.appendChild(el);
            });
        }
    }
}

// Initial call
updateCatalogueUI(0);
