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
    badges: ['AIR SUSPENSION', 'VENTILATED', 'LUMBAR SUPPORT'],
    hotspots: [
        { dot: { top: '15%', left: '75%' }, target: { top: '35%', left: '50%' }, title: 'ACTIVE HEADREST', desc: 'Reduces whiplash and neck strain.' },
        { dot: { top: '65%', left: '15%' }, target: { top: '65%', left: '30%' }, title: 'LUMBAR SUPPORT', desc: 'Multi-chamber pneumatic lumbar adjustment.' },
        { dot: { top: '85%', left: '75%' }, target: { top: '85%', left: '50%' }, title: 'AIR SUSPENSION', desc: 'Isolates 90% of harmful vibrations.' }
    ]
  },
  { 
    id: 2, title: 'EXCAVATOR PRO', img: '/assets/seats/Excavator.png', 
    desc: 'Built specifically for earth-moving equipment, this seat features mechanical suspension tuned for extreme vertical shocks.', 
    badges: ['MECHANICAL', 'HEAVY DUTY'],
    hotspots: [
        { dot: { top: '25%', left: '20%' }, target: { top: '30%', left: '48%' }, title: 'RUGGED TRIM', desc: 'Tear-resistant industrial fabric.' },
        { dot: { top: '75%', left: '80%' }, target: { top: '75%', left: '50%' }, title: 'MECHANICAL DAMPING', desc: 'Heavy-duty steel coil suspension.' }
    ]
  },
  { 
    id: 3, title: 'TRACTOR COMMAND', img: '/assets/seats/Tractor.png', 
    desc: 'Designed for agricultural machinery, offering robust weather resistance and constant damping over uneven terrain.', 
    badges: ['WEATHERPROOF', 'SHOCK DAMPING'],
    hotspots: [
        { dot: { top: '30%', left: '85%' }, target: { top: '40%', left: '60%' }, title: 'WEATHER RESISTANT', desc: 'Sealed seams and waterproof coating.' },
        { dot: { top: '80%', left: '20%' }, target: { top: '80%', left: '45%' }, title: 'SHOCK DAMPING', desc: 'Constant rate damping for agricultural tracks.' }
    ]
  },
  { 
    id: 4, title: 'COMPACT LIFT', img: '/assets/seats/Mini Excavator.png', 
    desc: 'A compact, highly maneuverable seat for forklifts with active lateral support.', 
    badges: ['COMPACT', 'LATERAL SUPPORT'],
    hotspots: [
        { dot: { top: '55%', left: '10%' }, target: { top: '55%', left: '35%' }, title: 'LATERAL BOLSTERS', desc: 'Holds operator securely.' },
        { dot: { top: '90%', left: '80%' }, target: { top: '90%', left: '50%' }, title: 'LOW PROFILE', desc: 'Fits compactly into tight cabins.' }
    ]
  }
];

// Initialize PixelSwap
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('pixel-swap-container');
    if (container) {
        new PixelSwap(container, {
            pixelSize: 32,
            duration: 800,
            pixelDuration: 400,
            fade: true,
            trigger: 'hover',
            firstContent: '<div class="text-[10px] font-bold tracking-[0.2em]">EXPLORE SEAT</div>',
            secondContent: '<div class="text-[10px] font-bold tracking-[0.2em] text-[#ff2222]">VIEW DETAILS</div>'
        });
    }

    // Auto-play videos just in case
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

// Hide Catalogue at start
gsap.set("#catalogue-ui", { y: "20vh", scale: 0.9, filter: "blur(20px)", opacity: 0, pointerEvents: "none" });

// Phase 1: Hero Text Fade Out
masterTl.to("#hero-text-left", { x: -300, opacity: 0, duration: 0.10 }, 0.10);
masterTl.to("#hero-text-right", { x: 300, opacity: 0, duration: 0.10 }, 0.10);
masterTl.to(["#hero-sub-left", "#hero-sub-right"], { opacity: 0, y: 50, duration: 0.10 }, 0.10);
masterTl.to("#section-1", { opacity: 0, duration: 0.10 }, 0.10);

// Phase 2: Heart Aerospace Transition (Black Video -> White Video)
masterTl.to("#section-ha-black", { opacity: 1, duration: 0.05, ease: "none" }, 0.15);
masterTl.to("#ha-text-1", { y: "0%", opacity: 1, duration: 0.1, ease: "power2.out" }, 0.20);
masterTl.to("#ha-text-2", { y: "0%", opacity: 1, duration: 0.1, ease: "power2.out" }, 0.22);
masterTl.to("#ha-text-3", { y: "0%", opacity: 1, duration: 0.1, ease: "power2.out" }, 0.24);

masterTl.to("#section-ha-black", { opacity: 0, duration: 0.05, ease: "none" }, 0.40);

// Transition body bg to white
masterTl.to("body", { backgroundColor: "#f4f4f5", duration: 0.05, ease: "none" }, 0.40);
masterTl.to("#section-ha-white", { opacity: 1, duration: 0.05, ease: "none" }, 0.40); masterTl.to("#hero-bg", { opacity: 0, duration: 0.05, ease: "none" }, 0.40);

masterTl.to("#ha-text-white", { scale: 1, opacity: 1, duration: 0.1, ease: "power2.out" }, 0.45);

masterTl.to("#section-ha-white", { opacity: 0, duration: 0.05, ease: "none" }, 0.65);
// Revert body bg to black for the rest of the site
masterTl.to("body", { backgroundColor: "#0d0d0d", duration: 0.05, ease: "none" }, 0.65);

// Phase 3: Isolating Vibration
masterTl.to("#section-2", { opacity: 1, duration: 0.05, ease: "power1.inOut" }, 0.70);
masterTl.to("#tease-text-1", { y: "0%", duration: 0.05, ease: "power3.out" }, 0.70);
masterTl.to("#tease-text-2", { y: "0%", duration: 0.05, ease: "power3.out" }, 0.72);
masterTl.to("#tease-sub", { y: "0%", opacity: 1, duration: 0.05, ease: "power3.out" }, 0.74);

// Phase 4: Product Tease Reveal
masterTl.to("#section-2", { opacity: 0, duration: 0.05, ease: "power1.inOut" }, 0.85);
masterTl.to("#section-3", { opacity: 1, duration: 0.05, ease: "power1.inOut" }, 0.85);

// Phase 5: Catalogue Reveal
masterTl.to("#section-3", { opacity: 0, duration: 0.05 }, 0.93);
masterTl.to("#catalogue-ui", { y: "0vh", scale: 1, opacity: 1, filter: "blur(0px)", pointerEvents: "auto", duration: 0.07, ease: "power3.out" }, 0.93);

// --- CAROUSEL LOGIC ---
const carouselContainer = document.getElementById('carousel-container');
if (carouselContainer) {
    seatData.forEach((seat, i) => {
        const dot = document.createElement('div');
        dot.className = `w-2 h-2 rounded-full cursor-pointer transition-all duration-300 \${i === 0 ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/60'}`;
        dot.addEventListener('click', () => {
            document.querySelectorAll('#carousel-container div').forEach((el, idx) => {
                el.className = `w-2 h-2 rounded-full cursor-pointer transition-all duration-300 \${idx === i ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/60'}`;
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
    
    // PixelSwap transition for the image!
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
               duration: 0.3,
               stagger: 0.005,
               ease: "power1.inOut",
               onComplete: () => {
                   imgEl.src = data.img;
                   gsap.to(rects.sort(() => Math.random() - 0.5), {
                       scale: 0, opacity: 0,
                       duration: 0.3, stagger: 0.005,
                       ease: "power1.inOut",
                       onComplete: () => { svg.remove(); }
                   });
               }
           });
       } else {
           imgEl.src = data.img;
       }
    }
    
    // Render Hotspots with lines
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
            data.hotspots.forEach(hs => {
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute('x1', hs.dot.left);
                line.setAttribute('y1', hs.dot.top);
                line.setAttribute('x2', hs.target.left);
                line.setAttribute('y2', hs.target.top);
                line.setAttribute('stroke', 'rgba(255,255,255,0.4)');
                line.setAttribute('stroke-width', '1');
                line.setAttribute('stroke-dasharray', '4 4');
                svgLines.appendChild(line);

                const anchor = document.createElement('div');
                anchor.className = 'absolute w-1 h-1 bg-white/50 rounded-full pointer-events-none z-10';
                anchor.style.top = hs.target.top;
                anchor.style.left = hs.target.left;
                anchor.style.transform = 'translate(-50%, -50%)';
                hsContainer.appendChild(anchor);

                const el = document.createElement('div');
                el.className = 'absolute group pointer-events-auto cursor-pointer flex items-center justify-center z-20';
                el.style.top = hs.dot.top;
                el.style.left = hs.dot.left;
                el.style.transform = 'translate(-50%, -50%)'; 
                
                el.innerHTML = `
                    <div class="relative w-8 h-8 flex items-center justify-center bg-black/40 rounded-full border border-white/20 backdrop-blur-md hover:bg-white/10 transition-colors">
                        <div class="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                    </div>
                    <div class="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 bg-black/90 backdrop-blur-md p-4 border border-white/20 rounded pointer-events-none shadow-2xl">
                        <div class="text-[11px] font-bold text-white mb-2 tracking-widest uppercase border-b border-white/20 pb-2">\${hs.title}</div>
                        <div class="text-[11px] text-white/80 leading-relaxed">\${hs.desc}</div>
                    </div>
                `;
                hsContainer.appendChild(el);
            });
        }
    }
}

// Initial call
updateCatalogueUI(0);
