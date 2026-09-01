document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Lenis Smooth Scroll Engine
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });
    
    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
    
    // 2. Loading Sequence
    const loader = document.getElementById('loader');
    if(loader) {
        gsap.to(loader, {
            opacity: 0,
            duration: 1,
            delay: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
                loader.style.display = 'none';
                initHeroAnimation();
            }
        });
    } else {
        initHeroAnimation();
    }
    
    // 3. Hero Animation
    function initHeroAnimation() {
        gsap.fromTo('.stagger-hero', 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1.5, stagger: 0.2, ease: "power3.out" }
        );
    }
    
    // 4. Staggered Word Reveal (Manifesto Section)
    const splitElements = document.querySelectorAll('.staggered-text-reveal');
    splitElements.forEach(el => {
        // A simple split text fallback for Awwwards staggered reveals
        const text = el.innerText;
        el.innerHTML = '';
        text.split(' ').forEach(word => {
            const span = document.createElement('span');
            span.innerText = word + ' ';
            span.className = 'stagger-word';
            el.appendChild(span);
        });
        
        gsap.to(el.querySelectorAll('.stagger-word'), {
            scrollTrigger: {
                trigger: el,
                start: "top 80%",
            },
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.05,
            ease: "power3.out"
        });
    });
    
    // 5. Parallax Image
    gsap.to('#p-img-1', {
        scrollTrigger: {
            trigger: '.parallax-img',
            start: "top bottom",
            end: "bottom top",
            scrub: true
        },
        yPercent: 20,
        ease: "none"
    });
    
});
