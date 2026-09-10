// GatorCorp offline resilience — precaches every model/image/page this
// site actually uses (list generated directly from what the HTML
// references, not hand-typed) so the kiosk keeps working through venue
// WiFi drop-outs. Deliberately conservative: HTML pages are always
// fetched fresh from network first (falling back to cache only if the
// network fails), so normal online behavior — including future
// deploys — is completely unaffected. Only the heavy static assets
// (GLBs/images) are served cache-first, since those are versioned by
// filename already and don't change under a given name.

const CACHE_NAME = 'gatorcorp-precache-v1';

const PRECACHE_URLS = [
  "/index.html",
  "/product-supremo.html",
  "/product-ultimo.html",
  "/product-leo.html",
  "/product-duro.html",
  "/product-boss.html",
  "/product-ergo.html",
  "/product-vrs.html",
  "/product-tlv-ii.html",
  "/manifest.json",
  "/images/Duro.png",
  "/images/Excavator.png",
  "/images/Leo-opt.glb",
  "/images/Leo.png",
  "/images/Supremo.png",
  "/images/TLV-II.png",
  "/images/Tractor.png",
  "/images/Ultimo.png",
  "/images/VRS.png",
  "/images/base-optimized-safe.glb",
  "/images/bg-boss.jpg",
  "/images/bg-duro.jpg",
  "/images/bg-ergo.jpg",
  "/images/bg-leo.jpg",
  "/images/bg-supremo.jpg",
  "/images/bg-ultimo.jpg",
  "/images/boss-detail-backrest.jpg",
  "/images/boss-detail-cushion.jpg",
  "/images/boss-detail-headrest.jpg",
  "/images/boss-detail-height.jpg",
  "/images/boss-detail-ops.jpg",
  "/images/boss-detail-recliner.jpg",
  "/images/boss-detail-towelbar.jpg",
  "/images/boss-detail-weight.jpg",
  "/images/boss-seat.glb",
  "/images/brochure-boss-1.jpg",
  "/images/brochure-boss-2.jpg",
  "/images/brochure-duro-1.jpg",
  "/images/brochure-duro-2.jpg",
  "/images/brochure-ergo-1.jpg",
  "/images/brochure-ergo-2.jpg",
  "/images/brochure-leo-1.jpg",
  "/images/brochure-leo-2.jpg",
  "/images/brochure-supremo-1.jpg",
  "/images/brochure-supremo-2.jpg",
  "/images/brochure-tlv-ii-1.jpg",
  "/images/brochure-tlv-ii-2.jpg",
  "/images/brochure-tlv-ii-3.jpg",
  "/images/brochure-tlv-ii-4.jpg",
  "/images/brochure-ultimo-1.jpg",
  "/images/brochure-ultimo-2.jpg",
  "/images/brochure-vrs-1.jpg",
  "/images/brochure-vrs-2.jpg",
  "/images/detail-7-step-height-adjustment.png",
  "/images/detail-9-step-shock-absorber.png",
  "/images/detail-adjustable-armrest.png",
  "/images/detail-adjustable-backrest.png",
  "/images/detail-armrest.jpg",
  "/images/detail-automatic-weight-adjustment.png",
  "/images/detail-boot.jpg",
  "/images/detail-fore-aft-travel.png",
  "/images/detail-heating-venting-option.png",
  "/images/detail-homologation-ce-standards.png",
  "/images/detail-integrated-3-point-seat-belt-abts.png",
  "/images/detail-integrated-headrest.png",
  "/images/detail-lumbar-support-mechanical-pneumatic.png",
  "/images/detail-lumbar.jpg",
  "/images/detail-optimum-vibration-reduction.png",
  "/images/detail-optional-multi-zone-hardness.png",
  "/images/detail-optional-seat-belt-pretensioner.png",
  "/images/detail-patented-pneumatic-suspension.png",
  "/images/detail-pneumatic.jpg",
  "/images/detail-recliner.jpg",
  "/images/detail-seat-cushion-slide.png",
  "/images/detail-seat-cushion-tilt-adjustment.png",
  "/images/detail-seatbelt.jpg",
  "/images/detail-shock.jpg",
  "/images/detail-superior-fabric-faux-leather.png",
  "/images/detail-suspension-stroke.png",
  "/images/detail-towelbar.jpg",
  "/images/duro-detail-armrest.jpg",
  "/images/duro-detail-boot.jpg",
  "/images/duro-detail-lumbar.jpg",
  "/images/duro-detail-pneumatic.jpg",
  "/images/duro-detail-recliner.jpg",
  "/images/duro-detail-seatbelt.jpg",
  "/images/duro-detail-shock.jpg",
  "/images/duro-detail-towelbar.jpg",
  "/images/duro-seat.glb",
  "/images/ergo-detail-backrest.jpg",
  "/images/ergo-detail-compressor.jpg",
  "/images/ergo-detail-height.jpg",
  "/images/ergo-detail-recline.jpg",
  "/images/ergo-detail-rollerslide.jpg",
  "/images/ergo-detail-seatbelt.jpg",
  "/images/ergo-detail-suspension.jpg",
  "/images/ergo-detail-weight.jpg",
  "/images/ergo-seat.glb",
  "/images/hero-bg.png",
  "/images/leo-detail-adjustable-backrest.png",
  "/images/leo-detail-armrest.jpg",
  "/images/leo-detail-boot.jpg",
  "/images/leo-detail-fixed-shock-absorber.png",
  "/images/leo-detail-fore-aft-travel.png",
  "/images/leo-detail-integrated-headrest.png",
  "/images/leo-detail-lumbar-support.png",
  "/images/leo-detail-lumbar.jpg",
  "/images/leo-detail-lumbar.png",
  "/images/leo-detail-mechanical-suspension.png",
  "/images/leo-detail-multi-zone-hardness.png",
  "/images/leo-detail-optimum-vibration-reduction.png",
  "/images/leo-detail-optional-armrest.png",
  "/images/leo-detail-pneumatic.jpg",
  "/images/leo-detail-recliner.jpg",
  "/images/leo-detail-seat-belt-buckle.png",
  "/images/leo-detail-seat-belt-reminder-switch.png",
  "/images/leo-detail-seat-height-adjustment.png",
  "/images/leo-detail-seatbelt.jpg",
  "/images/leo-detail-shock.jpg",
  "/images/leo-detail-superior-fabric-faux-leather-options.png",
  "/images/leo-detail-towelbar.jpg",
  "/images/logo-new.png",
  "/images/sears-seat-optimized.glb",
  "/images/supremo-seat-classic.glb",
  "/images/supremo-seat-v4.glb",
  "/images/ultimo-detail-adjustable-backrest.png",
  "/images/ultimo-detail-boot.jpg",
  "/images/ultimo-detail-fixed-shock-absorber.png",
  "/images/ultimo-detail-fore-aft-travel.png",
  "/images/ultimo-detail-integrated-headrest.png",
  "/images/ultimo-detail-lumbar-support.png",
  "/images/ultimo-detail-lumbar.jpg",
  "/images/ultimo-detail-multi-zone-hardness.png",
  "/images/ultimo-detail-optimum-vibration-reduction.png",
  "/images/ultimo-detail-optional-armrest.png",
  "/images/ultimo-detail-pneumatic-suspension-system.png",
  "/images/ultimo-detail-pneumatic.jpg",
  "/images/ultimo-detail-recliner.jpg",
  "/images/ultimo-detail-seat-belt-buckle.png",
  "/images/ultimo-detail-seat-belt-reminder-switch.png",
  "/images/ultimo-detail-seat-height-adjustment.png",
  "/images/ultimo-detail-seatbelt.jpg",
  "/images/ultimo-detail-shock.jpg",
  "/images/ultimo-detail-superior-fabric-faux-leather-options.png",
  "/images/ultimo-detail-towelbar.jpg",
  "/images/ultimo-seat.glb",
  "/images/vrs-seat-opt.glb"
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      // Individually, not cache.addAll() — addAll() fails ALL-OR-NOTHING,
      // so a single missing/mistyped file (a real risk in this project —
      // see the Supremo.png case-sensitivity issue) would silently wipe
      // out the entire precache instead of just that one file.
      return Promise.allSettled(
        PRECACHE_URLS.map(function(url) {
          return cache.add(url).catch(function(err) {
            console.warn('[sw] precache skipped (not found):', url);
          });
        })
      );
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(name) { return name !== CACHE_NAME; })
             .map(function(name) { return caches.delete(name); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

function isStaticAsset(url) {
  return /\.(glb|jpg|jpeg|png|json)(\?.*)?$/i.test(url);
}

self.addEventListener('fetch', function(event) {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // leave CDN scripts alone entirely

  if (req.mode === 'navigate' || req.destination === 'document') {
    // Pages: network-first. Online behavior is untouched — this only
    // matters as a fallback if the network request actually fails.
    event.respondWith(
      fetch(req).then(function(res) {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(function(cache) { cache.put(req, copy); });
        return res;
      }).catch(function() {
        return caches.match(req).then(function(cached) {
          return cached || caches.match('/index.html');
        });
      })
    );
    return;
  }

  if (isStaticAsset(url.pathname + url.search)) {
    // Models/images: cache-first — these are heavy, versioned by
    // filename, and safe to serve instantly from cache when present.
    event.respondWith(
      caches.match(req).then(function(cached) {
        if (cached) return cached;
        return fetch(req).then(function(res) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(function(cache) { cache.put(req, copy); });
          return res;
        });
      })
    );
  }
  // everything else (fonts, misc) — no interception, normal network request
});
