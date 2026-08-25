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
  <style>
    body, html { margin: 0; padding: 0; background: #050505; color: white; overflow-x: hidden; }
    
    #master-pin-container {
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      position: relative;
    }

    #bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    #seat-sequence {
      position: absolute;
      top: 100%; /* Starts offscreen at bottom */
      left: 50%;
      transform: translateX(-50%);
      height: 100%;
      object-fit: contain;
      z-index: 2;
    }

    .hero-overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 3;
    }
    
    .hero-title {
      font-size: 10vw;
      font-weight: 900;
      letter-spacing: -2px;
      text-align: center;
    }

    .truck-specs-overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 3;
      pointer-events: none;
      opacity: 0;
    }

    .seat-features-overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 100%; /* Starts offscreen at bottom, follows canvas */
      z-index: 4;
      display: flex;
      align-items: center;
      padding-left: 10vw;
    }

    .feature-list-container {
      position: relative;
      height: 200px;
      width: 40%;
    }

    .feature-item {
      position: absolute;
      font-size: 3rem;
      font-weight: 900;
      text-transform: uppercase;
      line-height: 1.1;
      opacity: 0;
      transform: translateY(30px);
    }
  </style>
</head>
<body>
  <div class="preloader" data-preloader>
    <div class="preloader__bar" data-preloader-bar></div>
  </div>

  <div id="master-pin-container">
    
    <!-- 1. 3D WebGL Canvas (Truck) -->
    <canvas id="bg"></canvas>

    <!-- 2. Apple Sequence Canvas (Seat) -->
    <canvas id="seat-sequence"></canvas>

    <!-- 3. Overlays -->
    <div class="hero-overlay">
      <h1 class="hero-title">GATOR CORP</h1>
    </div>

    <div class="truck-specs-overlay">
      <div class="specs-content specs-left" style="position:absolute; left: 10%; top: 40%;">
        <h3 class="spec-label">Chassis Design</h3>
        <p class="spec-value">Heavy-Duty</p>
        <h3 class="spec-label">Payload Capacity</h3>
        <p class="spec-value">120,000 lbs</p>
      </div>
      <div class="specs-content specs-right" style="position:absolute; right: 10%; top: 40%; text-align: right;">
        <h3 class="spec-label">Suspension</h3>
        <p class="spec-value">Active Air-Ride</p>
        <h3 class="spec-label">Drive</h3>
        <p class="spec-value">All-Wheel 6x6</p>
      </div>
    </div>

    <div class="seat-features-overlay">
      <div class="feature-list-container">
        <h2 class="feature-item f-0">Integrated 3 Point Seat Belt</h2>
        <h2 class="feature-item f-1">Adjustable Armrest</h2>
        <h2 class="feature-item f-2">Seat Back Recliner Lever</h2>
        <h2 class="feature-item f-3">Lumbar Support Mechanical</h2>
        <h2 class="feature-item f-4">7 step-Height adjustment</h2>
        <h2 class="feature-item f-5">Shock Absorber Adjustment</h2>
        <h2 class="feature-item f-6">Quick dump lever</h2>
        <h2 class="feature-item f-7">Seat Sliding with towel bar</h2>
        <h2 class="feature-item f-8">Patented Pneumatic Suspension System</h2>
      </div>
    </div>

  </div>

  <script type="module" src="/main.js"></script>
</body>
</html>
