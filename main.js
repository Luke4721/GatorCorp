import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import PixelSwap from './PixelSwap.js';

gsap.registerPlugin(ScrollTrigger);

// Data with 7-9 features per chair
const seatData = [
  { 
    id: 1, title: 'SUPREMO', img: '/assets/seats/Supremo.png', 
    desc: 'Supremo is a premium offering with top-of-the-line air suspension. It guarantees the absolute ultimate in long-haul comfort and vibration isolation for highway driving.', 
    hotspots: [
        { dot: { top: '15%', left: '48%' }, panel: { top: '10%', left: '75%' }, title: 'ACTIVE HEADREST', desc: 'Reduces whiplash.' },
        { dot: { top: '35%', left: '20%' }, panel: { top: '30%', left: '5%' }, title: 'SHOULDER BOLSTERS', desc: 'Lateral support.' },
        { dot: { top: '55%', left: '25%' }, panel: { top: '55%', left: '5%' }, title: 'LUMBAR SYSTEM', desc: 'Pneumatic adjustment.' },
        { dot: { top: '65%', left: '80%' }, panel: { top: '60%', left: '85%' }, title: 'ARMREST CONTROLS', desc: 'Integrated haptics.' },
        { dot: { top: '75%', left: '30%' }, panel: { top: '80%', left: '10%' }, title: 'SEAT PAN TILT', desc: 'Thigh support.' },
        { dot: { top: '80%', left: '50%' }, panel: { top: '90%', left: '75%' }, title: 'AIR SUSPENSION', desc: 'Isolates 90% vibration.' },
        { dot: { top: '95%', left: '50%' }, panel: { top: '95%', left: '20%' }, title: 'BASE DAMPERS', desc: 'Heavy shock absorption.' }
    ]
  },
  { 
    id: 2, title: 'EXCAVATOR', img: '/assets/seats/Excavator.png', 
    desc: 'Built specifically for earth-moving equipment, this seat features mechanical suspension tuned for extreme vertical shocks.', 
    hotspots: [
        { dot: { top: '20%', left: '50%' }, panel: { top: '15%', left: '75%' }, title: 'REINFORCED FRAME', desc: 'Steel construction.' },
        { dot: { top: '40%', left: '25%' }, panel: { top: '35%', left: '5%' }, title: 'RUGGED TRIM', desc: 'Tear-resistant fabric.' },
        { dot: { top: '55%', left: '85%' }, panel: { top: '50%', left: '90%' }, title: 'CONTROL PODS', desc: 'Joystick mounts.' },
        { dot: { top: '65%', left: '40%' }, panel: { top: '70%', left: '10%' }, title: 'MECHANICAL DAMPING', desc: 'Coil suspension.' },
        { dot: { top: '75%', left: '60%' }, panel: { top: '85%', left: '80%' }, title: 'WEIGHT ADJUST', desc: 'Manual dial calibration.' },
        { dot: { top: '85%', left: '50%' }, panel: { top: '95%', left: '25%' }, title: 'TETHER POINTS', desc: 'Safety harness anchors.' },
        { dot: { top: '90%', left: '70%' }, panel: { top: '90%', left: '95%' }, title: 'MUD GUARDS', desc: 'Sealed base.' }
    ]
  },
  { 
    id: 3, title: 'TRACTOR', img: '/assets/seats/Tractor.png', 
    desc: 'Designed for agricultural machinery, offering robust weather resistance and constant damping over uneven terrain.', 
    hotspots: [
        { dot: { top: '25%', left: '50%' }, panel: { top: '20%', left: '75%' }, title: 'WEATHER COATING', desc: 'Waterproof sealant.' },
        { dot: { top: '45%', left: '30%' }, panel: { top: '40%', left: '5%' }, title: 'VINYL TRIM', desc: 'Easy wash down.' },
        { dot: { top: '55%', left: '80%' }, panel: { top: '50%', left: '90%' }, title: 'SWIVEL BASE', desc: '360 degree rotation.' },
        { dot: { top: '70%', left: '45%' }, panel: { top: '75%', left: '15%' }, title: 'LOW FREQ DAMPING', desc: 'Tractor track isolation.' },
        { dot: { top: '85%', left: '40%' }, panel: { top: '90%', left: '10%' }, title: 'HEATED SEAT', desc: 'Winter operations.' },
        { dot: { top: '90%', left: '60%' }, panel: { top: '95%', left: '85%' }, title: 'DRAINAGE', desc: 'Moisture runoff.' },
        { dot: { top: '95%', left: '50%' }, panel: { top: '100%', left: '50%' }, title: 'RUGGED MOUNTS', desc: 'Universal tractor fit.' }
    ]
  },
  { 
    id: 4, title: 'COMPACT', img: '/assets/seats/Mini Excavator.png', 
    desc: 'A compact, highly maneuverable seat for forklifts with active lateral support.', 
    hotspots: [
        { dot: { top: '30%', left: '50%' }, panel: { top: '20%', left: '75%' }, title: 'COMPACT PROFILE', desc: 'Fits tight cabins.' },
        { dot: { top: '50%', left: '20%' }, panel: { top: '45%', left: '5%' }, title: 'LATERAL BOLSTERS', desc: 'Holds operator.' },
        { dot: { top: '60%', left: '80%' }, panel: { top: '55%', left: '90%' }, title: 'QUICK RELEASE', desc: 'Fast egress.' },
        { dot: { top: '75%', left: '50%' }, panel: { top: '80%', left: '20%' }, title: 'MICRO SUSPENSION', desc: '1-inch travel.' },
        { dot: { top: '85%', left: '40%' }, panel: { top: '95%', left: '10%' }, title: 'SENSOR SWITCH', desc: 'Operator presence.' },
        { dot: { top: '90%', left: '60%' }, panel: { top: '95%', left: '85%' }, title: 'SEATBELT LOCK', desc: 'Interlock system.' },
        { dot: { top: '95%', left: '50%' }, panel: { top: '100%', left: '50%' }, title: 'NARROW BASE', desc: 'Forklift standard.' }
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

masterTl.to("#hero-typography", { y: -150, opacity: 0, duration: 0.20 }, 0.0);
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
        dot.className = `w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${i === 0 ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/60'}`;
        dot.addEventListener('click', () => {
            document.querySelectorAll('#carousel-container div').forEach((el, idx) => {
                el.className = `w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${idx === i ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/60'}`;
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
           rect.style.transformOrigin = `${x * size + size/2}px ${y * size + size/2}px`;
           svg.appendChild(rect);
           rects.push(rect);
         }
       }
       
       const wrapper = document.querySelector('.relative.inline-block.h-\\[75vh\\]');
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
    
    // Render ERA-Style Circular Hotspots with Lines connecting dot and panel!
    const hsContainer = document.getElementById('hotspots-container');
    if (hsContainer) {
        hsContainer.innerHTML = '';
        
        // Layer 1: The SVG Lines
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
                // 1. Draw the line from dot to panel
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute('x1', hs.dot.left);
                line.setAttribute('y1', hs.dot.top);
                line.setAttribute('x2', hs.panel.left);
                line.setAttribute('y2', hs.panel.top);
                line.setAttribute('stroke', 'rgba(255,255,255,0.2)');
                line.setAttribute('stroke-width', '1');
                svgLines.appendChild(line);

                // 2. The Anchor Dot (literally on the seat)
                const anchor = document.createElement('div');
                anchor.className = 'absolute w-1 h-1 bg-white rounded-full pointer-events-none z-10';
                anchor.style.top = hs.dot.top;
                anchor.style.left = hs.dot.left;
                anchor.style.transform = 'translate(-50%, -50%)';
                hsContainer.appendChild(anchor);

                // 3. The ERA Interactive Circle (at the panel location)
                const el = document.createElement('div');
                el.className = 'absolute group pointer-events-auto flex items-center justify-center z-20 w-32 h-32 rounded-full cursor-pointer mix-blend-difference';
                el.style.top = hs.panel.top;
                el.style.left = hs.panel.left;
                el.style.transform = 'translate(-50%, -50%)'; 
                
                // Outer circle border (thin, elegant)
                const border = document.createElement('div');
                border.className = 'absolute inset-0 rounded-full border-[0.5px] border-white/20 group-hover:border-white/80 group-hover:scale-110 transition-all duration-700 ease-out';
                
                // Crosshair / center dot in the panel
                const center = document.createElement('div');
                center.className = 'w-1 h-1 bg-white/40 rounded-full group-hover:scale-150 transition-all duration-500';
                
                // The Typography Panel (always visible but fades in more on hover, or just sits elegantly)
                const panel = document.createElement('div');
                panel.className = 'absolute top-1/2 left-full ml-4 -translate-y-1/2 w-48 opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-2 pointer-events-none';
                
                // Using pure template literals without escaping for write_to_file
                panel.innerHTML = `
                    <div class="font-['Playfair_Display'] text-xl text-white mb-1 whitespace-nowrap">${hs.title}</div>
                    <div class="text-[9px] font-sans text-white/60 tracking-widest uppercase uppercase">${hs.desc}</div>
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
