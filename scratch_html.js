<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GatorCorp - Heavy Duty Engineering</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <!-- PRELOADER -->
  <div class="preloader" data-preloader>
    <div class="preloader__bar" data-preloader-bar></div>
  </div>

  <!-- NAVBAR -->
  <nav class="navbar">
    <div class="nav-logo">GatorCorp</div>
    <div class="nav-links">
      <a href="#">Vehicles</a>
      <a href="#">Seating</a>
      <a href="#">Engineering</a>
    </div>
  </nav>

  <!-- MASTER PINNED SCROLL AREA -->
  <div id="master-pin-container">
    
    <!-- CANVAS 1: 3D TRUCK -->
    <canvas id="bg"></canvas>

    <!-- CANVAS 2: APPLE-STYLE SEAT SEQUENCE -->
    <canvas id="seat-sequence"></canvas>

    <!-- OVERLAY 1: HERO TEXT -->
    <div class="hero-overlay">
      <h1 class="hero-title">HEAVY<br>DUTY.</h1>
      <div class="hero-subtitle">Scroll to Ignite</div>
    </div>

    <!-- OVERLAY 2: TRUCK SPECS -->
    <div class="truck-specs-overlay">
      <div class="spec-card spec-left">
        <div class="spec-line"></div>
        <h4>Chassis</h4>
        <p>Rigid Steel</p>
        <div class="spec-line"></div>
        <h4>Payload</h4>
        <p>120,000 lbs</p>
      </div>
      <div class="spec-card spec-right">
        <div class="spec-line"></div>
        <h4>Suspension</h4>
        <p>Active Air-Ride</p>
        <div class="spec-line"></div>
        <h4>Drive</h4>
        <p>6x6 All-Wheel</p>
      </div>
    </div>

    <!-- OVERLAY 3: SEAT FEATURES -->
    <div class="seat-features-overlay">
      <div class="feature-list-container">
        <h2 class="feature-item f-0"><span>01 / 09</span> Integrated 3-Point Belt</h2>
        <h2 class="feature-item f-1"><span>02 / 09</span> Adjustable Armrest</h2>
        <h2 class="feature-item f-2"><span>03 / 09</span> Seat Back Recliner</h2>
        <h2 class="feature-item f-3"><span>04 / 09</span> Mechanical Lumbar</h2>
        <h2 class="feature-item f-4"><span>05 / 09</span> 7-Step Height Adjust</h2>
        <h2 class="feature-item f-5"><span>06 / 09</span> Shock Absorber</h2>
        <h2 class="feature-item f-6"><span>07 / 09</span> Quick Dump Lever</h2>
        <h2 class="feature-item f-7"><span>08 / 09</span> Seat Sliding Bar</h2>
        <h2 class="feature-item f-8"><span>09 / 09</span> Pneumatic Suspension</h2>
      </div>
    </div>

  </div>

  <!-- FOOTER -->
  <footer class="footer">
    <h2>The Backbone of Industry.</h2>
  </footer>

  <script type="module" src="/main.js"></script>
</body>
</html>
