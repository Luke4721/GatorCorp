import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis for buttery smooth scrolling (essential for high-end editorial feel)
const lenis = new Lenis({
    lerp: 0.05,
    smoothWheel: true,
    wheelMultiplier: 1.0,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Ensure panels have transform-style set for 3D
gsap.set(["#panel-1", "#panel-2", "#panel-3"], { transformStyle: "preserve-3d" });

// --- ERA RESIDENCE 1:1 MASTER SCROLL TIMELINE (3D PARALLAX WIPE) ---
const masterTl = gsap.timeline({
    scrollTrigger: {
        trigger: "#master-pin-container",
        start: "top top",
        end: "+=300%", // Scroll for 3 screen heights
        scrub: 1.0,    // Smooth scrubbing
        pin: true,     // Pin the container so the panels stay in place
        anticipatePin: 1
    }
});

// -------------------------------------------------------------
// PHASE 1: TRANSITION FROM HERO (PANEL 1) TO ISOLATING VIBRATION (PANEL 2)
// -------------------------------------------------------------

// 1. The 3D Parallax Exit for Panel 1
// It pushes back into the screen (scale down, rotateX back) and fades out
masterTl.to("#panel-1", {
    scale: 0.85,
    rotationX: -15, // Tilts back in 3D space
    yPercent: -10,  // Parallax slightly up
    opacity: 0.2,
    ease: "power2.inOut",
    duration: 1.0
}, 0.0);

// 2. The Curved Arch Enter for Panel 2
// Slides up from 100vh and flattens its border-radius from a massive dome to a flat rectangle
masterTl.to("#panel-2", {
    y: "0vh",
    borderRadius: "0vw 0vw 0 0",
    ease: "power2.inOut",
    duration: 1.0
}, 0.0);

// Parallax the contents inside Panel 2 so they feel like they are rising slightly slower than the background
masterTl.from("#panel-2 > div", {
    y: 100,
    opacity: 0,
    stagger: 0.1,
    ease: "power2.out",
    duration: 0.5
}, 0.5);

// Add a pause in the timeline (duration: 0.5) so the user can read Panel 2 while scrolling
masterTl.to({}, { duration: 0.5 }); 

// -------------------------------------------------------------
// PHASE 2: TRANSITION FROM ISOLATING VIBRATION (PANEL 2) TO CATALOGUE (PANEL 3)
// -------------------------------------------------------------

// 1. The 3D Parallax Exit for Panel 2
masterTl.to("#panel-2", {
    scale: 0.85,
    rotationX: -15,
    yPercent: -10,
    opacity: 0.2,
    ease: "power2.inOut",
    duration: 1.0
}, "+=0"); // Starts immediately after the pause

// 2. The Curved Arch Enter for Panel 3
masterTl.to("#panel-3", {
    y: "0vh",
    borderRadius: "0vw 0vw 0 0",
    ease: "power2.inOut",
    duration: 1.0
}, "<"); // Starts at the exact same time as Panel 2 exit

// Parallax the contents inside Panel 3
masterTl.from("#panel-3 > div", {
    y: 100,
    opacity: 0,
    stagger: 0.1,
    ease: "power2.out",
    duration: 0.5
}, "-=0.5");

console.log("ERA Residence 1:1 3D Parallax Transitions Loaded successfully.");
