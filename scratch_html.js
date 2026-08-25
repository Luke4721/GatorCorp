<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GatorCorp - The Backbone of Industry</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;500;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <div class="preloader" data-preloader>
    <div class="preloader__bar" data-preloader-bar></div>
  </div>

  <canvas id="bg"></canvas>
  
  <div class="transition-mask" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #050505; opacity: 0; pointer-events: none; z-index: 5;"></div>

  <div id="scroll-container">
    <section class="hero">
      <div class="hero-content">
        <h1 class="left-text">GATOR</h1>
        <h1 class="right-text">CORP</h1>
      </div>
      <p class="scroll-prompt">Scroll to explore</p>
    </section>

    <section class="truck-arrival">
      <div class="specs-content specs-left">
        <h3 class="spec-label">Chassis Design</h3>
        <p class="spec-value">Heavy-Duty</p>
        <h3 class="spec-label">Payload Capacity</h3>
        <p class="spec-value">120,000 lbs</p>
      </div>
      
      <div class="specs-content specs-right">
        <h3 class="spec-label">Suspension</h3>
        <p class="spec-value">Active Air-Ride</p>
        <h3 class="spec-label">Drive</h3>
        <p class="spec-value">All-Wheel 6x6</p>
      </div>
    </section>

    <section class="roof-breach"></section>

    <section class="apple-sequence-section" style="position: relative; width: 100%; height: 300vh; background: transparent; z-index: 10;">
      <!-- Sticky container for the scrubbing animation -->
      <div class="sequence-sticky" style="position: sticky; top: 0; width: 100%; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden;">
        <h2 class="diorama-title" style="position: absolute; top: 10%; z-index: 12;">Unrivaled Comfort.</h2>
        
        <canvas id="seat-sequence" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); max-width: 100%; max-height: 100vh; z-index: 11;"></canvas>
        
        <p class="diorama-caption" style="position: absolute; bottom: 15%; z-index: 12;">Scroll down to inspect.</p>
        <a href="#" class="cta-btn diorama-cta" style="position: absolute; bottom: 5%; z-index: 12;">View Product Catalog</a>
      </div>
    </section>

    <footer class="footer">
      <h2>Experience GatorCorp.</h2>
    </footer>
  </div>
  <script type="module" src="/main.js"></script>
</body>
</html>
