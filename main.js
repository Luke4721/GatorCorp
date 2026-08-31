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

// --- ERA RESIDENCE 1:1 MASTER SCROLL TIMELINE ---
// We pin the container, and use the scroll distance (end: "+=300%") to control the wipes
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

// PHASE 1: The Massive Light-Blue Circular Wipe
// Animates the clip-path of Panel 2 from circle(0%) at bottom center to circle(150%) (covering screen)
masterTl.to("#panel-2", {
    clipPath: "circle(150% at 50% 100%)",
    ease: "power2.inOut",
    duration: 1.0
}, 0);

// Parallax the Hero content slightly down as it gets covered
masterTl.to("#panel-1", {
    y: 100,
    opacity: 0.5,
    ease: "power1.in",
    duration: 1.0
}, 0);

// Add a slight pause (duration: 0.5) so the user can actually read Panel 2
masterTl.to({}, { duration: 0.5 }); 

// PHASE 2: The Massive Warm Circular Wipe (Catalogue / Matrix)
// Animates the clip-path of Panel 3 over Panel 2
masterTl.to("#panel-3", {
    clipPath: "circle(150% at 50% 100%)",
    ease: "power2.inOut",
    duration: 1.0
});

// Parallax Panel 2 content down as it gets covered
masterTl.to("#panel-2", {
    y: 100,
    opacity: 0.5,
    ease: "power1.in",
    duration: 1.0
}, "<"); // "<" means start at the exact same time as the previous animation

console.log("ERA Residence 1:1 Transitions Loaded successfully.");
