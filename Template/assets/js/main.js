/* ============================================================
   main.js
   ------------------------------------------------------------
   Table of Contents
      1.  Helper Functions & Utilities
      2.  Custom Cursor Architecture
      3.  Magnetic Typography
      4.  3D Tilt Card Physics
      5.  Velocity Marquee Engine
      6.  Expanding Process Rows
      7.  Capabilities Scene Switcher
      8.  Client Quotes Switcher
      9.  Accolades Hover Preview
      10. FAQ & Transparency Accordion
      11. Initiative Scope Planner Widget
      12. Smooth Scroll & Lenis Integration
      13. GSAP ScrollTrigger Parallax
      14. Hero Dot Field Canvas
   ============================================================ */

/* ────────────────────────────────────────────────────────────
   1. HELPER FUNCTIONS & UTILITIES
   ──────────────────────────────────────────────────────────── */

var root = document.documentElement;
var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (window.ScrollTrigger) ScrollTrigger.config({ ignoreMobileResize: true });

function loop(fn) {
  var id, on = true;
  (function f(t) {
    if (!on) return;
    if (!document.hidden) fn(t);
    id = requestAnimationFrame(f);
  })(performance.now());
  return function () {
    on = false;
    cancelAnimationFrame(id);
  };
}

function spring(o, k, tx, ty, tr) {
  o.vx = (o.vx + (tx - o.ox) * 0.12) * 0.78;
  o.ox += o.vx;
  o.vy = (o.vy + (ty - o.oy) * 0.12) * 0.78;
  o.oy += o.vy;
  if (tr !== undefined) {
    o.vr = (o.vr + (tr - o.rot) * 0.12) * 0.78;
    o.rot += o.vr;
  }
}

/* ────────────────────────────────────────────────────────────
2. CUSTOM CURSOR ARCHITECTURE
──────────────────────────────────────────────────────────── */
function initCustomCursor() {
  if (reduce || matchMedia('(pointer: coarse)').matches) return;

  var dot = document.getElementById('cux-dot');
  var ring = document.getElementById('cux-ring');
  var label = document.getElementById('cux-label');
  if (!dot || !ring || !label) return;

  var mx = -200, my = -200;
  var rx = -200, ry = -200;
  var hasMoved = false;

  function onPointerMove(e) {
    mx = e.clientX;
    my = e.clientY;
    if (!hasMoved) {
      hasMoved = true;
      rx = mx;
      ry = my;
    }
    document.body.classList.add('cux-active');

    // Direct hardware update on input event: 0ms delay!
    dot.style.transform = 'translate3d(' + mx + 'px, ' + my + 'px, 0)';

    // State Detection: Distinct Badge Hover vs Pill Button vs Interactive Inverting Lens
    var labelEl = e.target.closest('[data-cur]');
    var pillBtnEl = e.target.closest('.btn-read-all, .header-cta-btn');
    var interactiveEl = e.target.closest('a, button, [role="button"], input, select, textarea, .plan-pill, .faq-toggle, .svc-card, .member-card, .cap-item, .quote-word, .q-tab-btn, .svc-arrow-btn, .work-arrow-circle, .btn-learn-more, .about-play-badge, .faq-sprint-btn, .footer-email-btn, .j-tab-btn, .filter-tab-btn, .filter-btn, .mo-sound-btn, .sound-btn');

    if (labelEl && labelEl.getAttribute('data-cur')) {
      var text = labelEl.getAttribute('data-cur');
      label.textContent = text;
      document.body.classList.add('is-hover-label');
      document.body.classList.remove('is-hover-interactive', 'is-hover-pill-btn');
    } else if (pillBtnEl) {
      document.body.classList.add('is-hover-pill-btn');
      document.body.classList.remove('is-hover-label', 'is-hover-interactive');
      label.textContent = '';
    } else if (interactiveEl) {
      document.body.classList.remove('is-hover-label', 'is-hover-pill-btn');
      document.body.classList.add('is-hover-interactive');
      label.textContent = '';
    } else {
      document.body.classList.remove('is-hover-label', 'is-hover-interactive', 'is-hover-pill-btn');
      label.textContent = '';
    }
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });

  // Cleanly hide when mouse leaves the document window or tab loses focus
  function hideCursor() {
    document.body.classList.remove('cux-active', 'is-hover-label', 'is-hover-interactive', 'is-hover-pill-btn');
  }

  document.addEventListener('mouseleave', hideCursor);
  window.addEventListener('pointerleave', hideCursor);
  window.addEventListener('blur', hideCursor);
  document.addEventListener('mouseenter', function () {
    if (hasMoved) document.body.classList.add('cux-active');
  });

  loop(function () {
    if (!hasMoved) return;
    // High-velocity silky spring momentum (0.44 lerp)
    rx += (mx - rx) * 0.44;
    ry += (my - ry) * 0.44;
    ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px, ' + ry.toFixed(1) + 'px, 0)';
  });
}

// 2B. ScrollTrigger Animation on Tailored Solutions Section
function initTailoredSolutions() {
  var solHeadline = document.querySelector('.solutions-headline');
  var solMedia = document.querySelector('.solutions-media-card');
  var solKicker = document.querySelector('.solutions-kicker');
  var solDesc = document.querySelector('.solutions-desc-copy');
  var solWatermark = document.querySelector('.solutions-brand-watermark');

  if (solHeadline && !reduce && typeof gsap !== 'undefined') {
    var solTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.solutions-tailored-section',
        start: 'top 75%',
        once: true
      }
    });

    if (solKicker) gsap.set(solKicker, { opacity: 0, y: 20 });
    gsap.set(solHeadline, { opacity: 0, y: 28 });
    if (solMedia) gsap.set(solMedia, { opacity: 0, scale: 0.94, y: 35 });
    if (solDesc) gsap.set(solDesc, { opacity: 0, y: 20 });

    if (solKicker) {
      solTl.to(solKicker, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0);
    }
    solTl.to(solHeadline, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.1);
    if (solMedia) {
      solTl.to(solMedia, { opacity: 1, scale: 1, y: 0, duration: 0.75, ease: 'power3.out' }, 0.25);
    }
    if (solDesc) {
      solTl.to(solDesc, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0.35);
    }

    // Parallax drift on watermark
    if (solWatermark) {
      gsap.fromTo(solWatermark,
        { x: -20 },
        {
          x: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: '.solutions-tailored-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8
          }
        }
      );
    }
  }
}

/* ────────────────────────────────────────────────────────────
3. MAGNETIC TYPOGRAPHY
──────────────────────────────────────────────────────────── */
function initMagneticType() {
  var heading = document.getElementById('hero-heading');
  if (!heading) return;

  var rawText = heading.textContent.trim();
  heading.setAttribute('aria-label', rawText);
  heading.innerHTML = '';

  var chars = [];
  var words = rawText.split(' ');

  words.forEach(function (word, wIdx) {
    var wordSpan = document.createElement('span');
    wordSpan.className = 'w';
    wordSpan.setAttribute('aria-hidden', 'true');

    word.split('').forEach(function (char) {
      var charSpan = document.createElement('span');
      charSpan.className = 'c';
      charSpan.textContent = char;
      wordSpan.appendChild(charSpan);
      chars.push({
        el: charSpan,
        ox: 0, oy: 0,
        vx: 0, vy: 0,
        rot: 0, vr: 0
      });
    });

    heading.appendChild(wordSpan);
    if (wIdx < words.length - 1) {
      heading.appendChild(document.createTextNode(' '));
    }
  });

  var px = 0, py = 0, hasMoved = false;

  window.addEventListener('pointermove', function (e) {
    px = e.clientX;
    py = e.clientY;
    hasMoved = true;
  });

  loop(function () {
    if (!hasMoved) return;
    var b = heading.getBoundingClientRect();
    var rad = Math.max(140, Math.min(b.width, b.height) * 0.4);

    chars.forEach(function (c) {
      var r = c.el.getBoundingClientRect();
      var hx = r.left + r.width / 2 - c.ox;
      var hy = r.top + r.height / 2 - c.oy;
      var dx = hx - px;
      var dy = hy - py;
      var dist = Math.hypot(dx, dy) || 1;
      var f = Math.max(0, 1 - dist / rad);
      f *= f;

      var tx = (dx / dist) * f * rad * 0.35;
      var ty = (dy / dist) * f * rad * 0.35;
      var tr = (dx / dist) * f * 18;

      if (reduce) {
        c.ox = tx; c.oy = ty; c.rot = tr;
      } else {
        spring(c, 0, tx, ty, tr);
      }

      c.el.style.transform = 'translate(' + c.ox.toFixed(1) + 'px, ' + c.oy.toFixed(1) + 'px) rotate(' + c.rot.toFixed(1) + 'deg)';
    });
  });
}

/* ────────────────────────────────────────────────────────────
4. 3D TILT CARD PHYSICS
──────────────────────────────────────────────────────────── */
function initTiltCard() {
  var card = document.getElementById('hero-goal-card');
  if (!card || reduce) return;

  var cx = 0, cy = 0;
  var tx = 0, ty = 0;

  card.addEventListener('pointermove', function (e) {
    var r = card.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width - 0.5;
    var y = (e.clientY - r.top) / r.height - 0.5;
    tx = x * 14;
    ty = -y * 14;
  });

  card.addEventListener('pointerleave', function () {
    tx = 0;
    ty = 0;
  });

  loop(function () {
    cx += (tx - cx) * 0.1;
    cy += (ty - cy) * 0.1;
    card.style.transform = 'perspective(800px) rotateY(' + cx.toFixed(2) + 'deg) rotateX(' + cy.toFixed(2) + 'deg)';
  });
}

/* ────────────────────────────────────────────────────────────
5. VELOCITY MARQUEE ENGINE
──────────────────────────────────────────────────────────── */
function initVelocityMarquee() {
  var track = document.getElementById('marquee-track');
  if (!track) return;

  var x = 0;
  var speed = 0.8;
  var scrollVelocity = 0;
  var lastScrollY = window.scrollY;

  window.addEventListener('scroll', function () {
    var diff = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;
    scrollVelocity = Math.max(-25, Math.min(25, diff * 0.3));
  }, { passive: true });

  loop(function () {
    if (!reduce) {
      scrollVelocity *= 0.92;
    } else {
      scrollVelocity = 0;
    }

    x -= (speed + Math.abs(scrollVelocity) * 0.4);
    var halfWidth = track.scrollWidth / 2;
    if (Math.abs(x) >= halfWidth) {
      x = 0;
    }

    track.style.transform = 'translate3d(' + x.toFixed(2) + 'px, 0, 0)';
  });
}

/* ────────────────────────────────────────────────────────────
6. EXPANDING PROCESS ROWS
──────────────────────────────────────────────────────────── */
function initExpandingProcess() {
  var rows = Array.from(document.querySelectorAll('.ex-r'));
  if (!rows.length) return;

  rows.forEach(function (row) {
    var btn = row.querySelector('.ex-h');
    btn.addEventListener('click', function () {
      var isAlreadyOn = row.classList.contains('on');

      // Close all rows
      rows.forEach(function (r) {
        r.classList.remove('on');
        r.querySelector('.ex-h').setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked row
      if (!isAlreadyOn) {
        row.classList.add('on');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ────────────────────────────────────────────────────────────
7. CAPABILITIES SCENE SWITCHER
──────────────────────────────────────────────────────────── */
function initCapabilitiesSwitcher() {
  var items = Array.from(document.querySelectorAll('.cap-item'));
  var img = document.getElementById('portal-img');
  if (!items.length || !img) return;

  items.forEach(function (item) {
    item.addEventListener('mouseenter', function () {
      items.forEach(function (i) { i.classList.remove('active'); });
      item.classList.add('active');
      var src = item.getAttribute('data-img');
      if (src && img.src.indexOf(src) === -1) {
        img.style.opacity = '0.4';
        setTimeout(function () {
          img.src = src;
          img.style.opacity = '1';
        }, 120);
      }
    });
  });
}


/* --- Works Horizontal Rail Controller --- */
function initWorksRail() {
  var rail = document.getElementById('worksRail');
  var bar = document.getElementById('worksRailBar');
  if (!rail || !bar) return;

  // fills from left to right and is 100% full when the rail reaches its end
  function updateProgress() {
    var maxScroll = rail.scrollWidth - rail.clientWidth;
    var progress = maxScroll <= 0 ? 1 : Math.max(0, Math.min(1, rail.scrollLeft / maxScroll));
    if (maxScroll > 0 && maxScroll - rail.scrollLeft < 2) progress = 1; // snap to full at the end
    bar.style.width = (progress * 100).toFixed(2) + '%';
    bar.style.transform = 'none';
  }

  rail.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  setTimeout(updateProgress, 300);

  // Drag to scroll
  var isDown = false;
  var startX = 0;
  var scrollLeft = 0;

  rail.addEventListener('mousedown', function (e) {
    isDown = true;
    startX = e.pageX - rail.offsetLeft;
    scrollLeft = rail.scrollLeft;
  });

  window.addEventListener('mouseup', function () {
    isDown = false;
  });

  rail.addEventListener('mousemove', function (e) {
    if (!isDown) return;
    e.preventDefault();
    var x = e.pageX - rail.offsetLeft;
    var walk = (x - startX) * 1.6;
    rail.scrollLeft = scrollLeft - walk;
  });
}

/* ────────────────────────────────────────────────────────────
8. CLIENT QUOTES SWITCHER
──────────────────────────────────────────────────────────── */
function initClientQuotes() {
  var display = document.getElementById('quote-display');
  var tabs = Array.from(document.querySelectorAll('.q-tab-btn'));
  if (!display || !tabs.length) return;

  var quotes = [
    "“Kromatik transformed our digital presence from a standard corporate site into a living, tactile brand universe that increased inbound enterprise inquiries by 310%.”",
    "“The physics-driven interaction tokens and WebGL configurator delivered sub-second load times while earning our team Site of the Day accolades across global juries.”",
    "“In a digital landscape drowned in identical AI templates, Kromatik gave our architecture exhibition authentic digital soul, craft, and unforgettable spatial identity.”",
    "“Working with Kromatik felt like working with a high-velocity product laboratory. Every sprint produced measurable conversion gains and awe-inspiring aesthetic polish.”"
  ];

  var currentIdx = 0;
  var autoTimer = null;

  function renderQuote(idx, immediate) {
    currentIdx = idx;
    var text = quotes[idx];
    var words = text.split(' ');

    tabs.forEach(function (tab, i) {
      tab.classList.toggle('active', i === idx);
    });

    function populate() {
      display.innerHTML = words.map(function (w, i) {
        return '<span class="quote-word" style="--i:' + i + '">' + w + '</span>';
      }).join(' ');
      display.style.opacity = '1';
    }

    if (immediate) {
      populate();
    } else {
      display.style.opacity = '0';
      setTimeout(populate, 150);
    }
  }

  function startAutoPlay() {
    clearInterval(autoTimer);
    autoTimer = setInterval(function () {
      var next = (currentIdx + 1) % quotes.length;
      renderQuote(next, false);
    }, 7000);
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var idx = parseInt(tab.getAttribute('data-i'), 10);
      renderQuote(idx, false);
      startAutoPlay();
    });
  });

  renderQuote(0, true);
  startAutoPlay();
}

/* ────────────────────────────────────────────────────────────
9. ACCOLADES HOVER PREVIEW
──────────────────────────────────────────────────────────── */
function initAccoladesHover() {
  var rows = Array.from(document.querySelectorAll('.accolade-row'));
  var thumb = document.getElementById('accoladeThumb');
  var thumbImg = document.getElementById('accoladeThumbImg') || (thumb ? thumb.querySelector('img') : null);
  if (!rows.length || !thumb || !thumbImg) return;

  // Preload accolade preview images into browser cache so they appear instantaneously
  rows.forEach(function (row) {
    var s = row.getAttribute('data-img');
    if (s) {
      var p = new Image();
      p.src = s;
    }
  });

  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var targetX = mouseX;
  var targetY = mouseY;
  var isHovered = false;

  window.addEventListener('mousemove', function (e) {
    targetX = e.clientX;
    targetY = e.clientY;
  }, { passive: true });

  function renderThumb() {
    if (isHovered) {
      mouseX += (targetX - mouseX) * 0.18;
      mouseY += (targetY - mouseY) * 0.18;
      thumb.style.left = mouseX + 'px';
      thumb.style.top = mouseY + 'px';
    }
    requestAnimationFrame(renderThumb);
  }
  requestAnimationFrame(renderThumb);

  rows.forEach(function (row) {
    row.addEventListener('mouseenter', function () {
      var src = row.getAttribute('data-img');
      if (src && thumbImg) {
        thumbImg.style.opacity = '1';
        thumbImg.style.color = '';
        thumbImg.src = src;
        thumb.classList.add('visible');
        isHovered = true;
      }
    });

    row.addEventListener('mouseleave', function () {
      thumb.classList.remove('visible');
      isHovered = false;
    });
  });
}

/* ────────────────────────────────────────────────────────────
10. FAQ & TRANSPARENCY ACCORDION
──────────────────────────────────────────────────────────── */
function initFaqAccordion() {
  var items = Array.from(document.querySelectorAll('.faq-item'));
  if (!items.length) return;

  items.forEach(function (item) {
    var btn = item.querySelector('.faq-toggle');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('on');
      items.forEach(function (i) {
        i.classList.remove('on');
        var b = i.querySelector('.faq-toggle');
        if (b) b.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('on');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ────────────────────────────────────────────────────────────
11. INITIATIVE SCOPE PLANNER WIDGET
──────────────────────────────────────────────────────────── */
function initScopePlanner() {
  var groups = Array.from(document.querySelectorAll('.planner-pills'));
  var titleEl = document.getElementById('plannerSelectedDiscipline');
  var cadenceEl = document.getElementById('plannerSelectedTimeline');
  var deliverablesEl = document.getElementById('plannerDeliverables');
  var ctaBtn = document.getElementById('plannerInquiryBtn');
  if (!groups.length || !titleEl || !deliverablesEl || !ctaBtn) return;

  var state = {
    discipline: 'Flagship WebGL Platform',
    timeline: 'Standard (8–10 Weeks)',
    scale: 'Enterprise Production'
  };

  var deliverablesMap = {
    'Flagship WebGL Platform': [
      'Custom 60fps WebGL / Three.js Interactive Engine',
      'Art Directed Typography & Fluid Layout Tokens',
      'Sub-Second Performance & Lighthouse >95 Audit',
      'Awwwards & FWA Jury Submission Strategy'
    ],
    'Brand & Motion Identity': [
      'Comprehensive Kinetic Design System & Tokens',
      'Custom Logotype, Typographic Scale & Color Matrices',
      'Interactive Web Brand Guidelines & Shader Assets',
      'Vector Asset Library & Motion Expression Rules'
    ],
    'Spatial 3D Configurator': [
      'Photorealistic PBR Materials & Custom Shaders',
      'Real-Time Camera Rig & Interactive Haptic Controls',
      'Multi-Platform WebGL & WebGPU Fallback Stack',
      'ERP / E-Commerce Cart & Variant Integration'
    ],
    'Design System & Full-Stack': [
      'Production-Grade Component Repository & Tokens',
      'TypeScript Architecture & Distributed API Layer',
      'Zero-Drift Figma to Code Synchronization',
      'Automated CI/CD & Global CDN Edge Deployment'
    ]
  };

  function updateSummary() {
    titleEl.textContent = state.discipline;
    cadenceEl.textContent = 'ESTIMATED CADENCE: ' + state.timeline;

    var items = deliverablesMap[state.discipline] || deliverablesMap['Flagship WebGL Platform'];
    deliverablesEl.innerHTML = items.map(function (item) {
      return '<li>' + item + '</li>';
    }).join('');

    var subject = encodeURIComponent('Project Initiative: ' + state.discipline + ' [' + state.timeline + ']');
    var body = encodeURIComponent('Hello Kromatik Team,\n\nWe would like to initiate discussions regarding:\nDiscipline: ' + state.discipline + '\nTimeline: ' + state.timeline + '\nScale: ' + state.scale + '\n\nPlease let us know when we can connect.\n');
    ctaBtn.href = 'mailto:hello@kromatik.studio?subject=' + subject + '&body=' + body;
  }

  groups.forEach(function (group) {
    var pills = Array.from(group.querySelectorAll('.plan-pill'));
    var groupKey = group.getAttribute('data-group');

    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        pills.forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');
        var val = pill.getAttribute('data-val');
        if (groupKey && val) {
          state[groupKey] = val;
          updateSummary();
        }
      });
    });
  });

  updateSummary();
}

/* ────────────────────────────────────────────────────────────
12. SMOOTH SCROLL & LENIS INTEGRATION
──────────────────────────────────────────────────────────── */
var lenisInstance = null;
function initLenisSmoothScroll() {
  if (reduce || typeof Lenis === 'undefined') return null;

  try {
    lenisInstance = new Lenis({
      lerp: 0.088, // Natural spring momentum (eliminates sluggish duration easing)
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      smoothWheel: true,
      syncTouch: false,
    });

    // Dedicated high-frequency RAF loop for Lenis
    gsap.ticker.add(function (time) { lenisInstance.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    if (window.ScrollTrigger) {
      lenisInstance.on('scroll', ScrollTrigger.update);
      if (window.gsap && gsap.ticker) {
        gsap.ticker.lagSmoothing(0);
      }
    }

    // Circular seal acceleration on scroll
    var seal = document.querySelector('.circular-seal-svg');
    if (seal) {
      lenisInstance.on('scroll', function (e) {
        var speed = Math.min(6, Math.abs(e.velocity || 0) * 0.18);
        seal.style.animationDuration = Math.max(2.5, 18 - speed * 2.5) + 's';
      });
    }

    // Smooth anchor scrolling
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = anchor.getAttribute('href');
        if (targetId && targetId !== '#' && targetId.length > 1) {
          var targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            lenisInstance.scrollTo(targetEl, { offset: -70, duration: 1.1 });
          }
        }
      });
    });

    return lenisInstance;
  } catch (err) {
    console.warn('Lenis initialization fallback:', err);
    return null;
  }
}

/* ────────────────────────────────────────────────────────────
13. GSAP SCROLLTRIGGER PARALLAX
──────────────────────────────────────────────────────────── */
function initGsapScrollTriggerEffects() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  /* =========================================================================
     COLOR CHANGER (GSAP ScrollTrigger)
     Matches CodePen: Smoothly transitions background and typography colors
     at section midpoints with zero conflicting triggers or frame drops.
     ========================================================================= */
  var scrollColorElems = Array.prototype.slice.call(document.querySelectorAll('[data-bgcolor]'));
  var themeMeta = document.getElementById('theme-color-meta');

  function parseColor(c) {
    c = String(c || '').trim();
    if (c.charAt(0) === '#') {
      c = c.slice(1);
      if (c.length === 3) c = c.split('').map(function (ch) { return ch + ch; }).join('');
      return [parseInt(c.substr(0, 2), 16), parseInt(c.substr(2, 2), 16), parseInt(c.substr(4, 2), 16), 1];
    }
    var m = c.match(/[\d.]+/g);
    if (!m) return [20, 32, 22, 1];
    return [Number(m[0]), Number(m[1]), Number(m[2]), m.length > 3 ? Number(m[3]) : 1];
  }

  function luminance(c) {
    if (typeof c === 'string') c = parseColor(c);
    return (c[0] * 299 + c[1] * 587 + c[2] * 114) / 1000;
  }

  function updateColor(bg, text) {
    if (!bg) return;
    var isLight = (text && text.toLowerCase() === '#141714') || (luminance(bg) > 160);

    document.body.classList.toggle('theme-light', isLight);
    document.body.classList.toggle('theme-dark', !isLight);
    document.body.classList.toggle('cux-on-light', isLight);
    if (themeMeta) themeMeta.setAttribute('content', bg);

    gsap.to(['body', '#fxBgLayer'], {
      backgroundColor: bg,
      color: text,
      duration: 0.4,
      ease: 'power1.out',
      overwrite: 'auto'
    });
  }

  scrollColorElems.forEach(function (colorSection, i) {
    var prevBg = i === 0 ? '' : scrollColorElems[i - 1].dataset.bgcolor;
    var prevText = i === 0 ? '' : scrollColorElems[i - 1].dataset.textcolor;

    ScrollTrigger.create({
      trigger: colorSection,
      start: 'top 50%',
      onEnter: function () {
        updateColor(colorSection.dataset.bgcolor, colorSection.dataset.textcolor);
      },
      onLeaveBack: function () {
        if (prevBg) {
          updateColor(prevBg, prevText);
        }
      }
    });
  });

  // Synchronize initial theme on page load or restore
  (function initFirstTheme() {
    if (!scrollColorElems.length) return;
    var targetSection = scrollColorElems[0];
    var midY = window.innerHeight * 0.5;
    for (var i = 0; i < scrollColorElems.length; i++) {
      var rect = scrollColorElems[i].getBoundingClientRect();
      if (rect.top <= midY && rect.bottom >= midY) {
        targetSection = scrollColorElems[i];
        break;
      }
    }
    updateColor(targetSection.dataset.bgcolor, targetSection.dataset.textcolor);
  })();

  // 1. Reading Progress Bar
  var progressBar = document.getElementById('scrollProgressLine');
  if (progressBar) {
    gsap.to(progressBar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.1
      }
    });
  }

  // 2. Kinetic Text & Content Scroll Animation on About Section
  var manifestoHeading = document.getElementById('manifestoHeading');
  if (manifestoHeading && !reduce) {
    var originalText = manifestoHeading.innerText.trim();
    var words = originalText.split(/\s+/);
    manifestoHeading.innerHTML = words.map(function (word) {
      return '<span class="scrub-word">' + word + '</span>';
    }).join(' ');

    var wordSpans = manifestoHeading.querySelectorAll('.scrub-word');
    var leftLead = document.querySelector('.about-sub-lead');
    var ctaBtn = document.querySelector('.about-cta-wrap');
    var mediaCard = document.querySelector('.about-media-card');
    var bottomCopy = document.querySelector('.about-bottom-copy');

    // Initial states
    gsap.set(wordSpans, { opacity: 0.18, y: 12 });
    if (leftLead) gsap.set(leftLead, { opacity: 0, y: 24 });
    if (ctaBtn) gsap.set(ctaBtn, { opacity: 0, y: 20 });
    if (mediaCard) gsap.set(mediaCard, { opacity: 0, scale: 0.94, y: 35 });
    if (bottomCopy) gsap.set(bottomCopy, { opacity: 0, y: 20 });

    // Master ScrollTrigger Timeline
    var aboutTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.about-editorial-section',
        start: 'top 75%',
        once: true
      }
    });

    // 1. Reveal top left lead
    if (leftLead) {
      aboutTl.to(leftLead, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
      }, 0);
    }

    // 2. Word-by-word kinetic illuminate headline
    if (wordSpans.length) {
      aboutTl.to(wordSpans, {
        opacity: 1,
        y: 0,
        stagger: 0.024,
        duration: 0.5,
        ease: 'power2.out'
      }, 0.1);
    }

    // 3. Staggered reveal of CTA, Media Card, and Bottom Copy
    if (ctaBtn) {
      aboutTl.to(ctaBtn, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power3.out'
      }, '-=0.2');
    }

    if (mediaCard) {
      aboutTl.to(mediaCard, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.75,
        ease: 'power3.out'
      }, '-=0.35');
    }

    if (bottomCopy) {
      aboutTl.to(bottomCopy, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.4');
    }

    // 4. Subtle Parallax Drift on Media Card as user continues scrolling
    if (mediaCard) {
      gsap.fromTo(mediaCard,
        { y: 15 },
        {
          y: -25,
          ease: 'none',
          scrollTrigger: {
            trigger: '.about-editorial-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8
          }
        }
      );
    }
  }

  // 3. Capabilities Arched Portal Frame Zoom & Float
  var portalFrame = document.querySelector('.arched-portal-frame');
  if (portalFrame && !reduce) {
    gsap.fromTo(portalFrame,
      { scale: 0.92, y: 35, opacity: 0.4 },
      {
        scale: 1,
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: portalFrame,
          start: 'top 85%'
        }
      }
    );
  }

  // 4. Accolades Row Stagger Slide
  var accoladesList = document.querySelector('.accolades-table');
  if (accoladesList && !reduce) {
    var accoladeRows = gsap.utils.toArray('.accolade-row');
    if (accoladeRows.length) {
      gsap.from(accoladeRows, {
        x: -40,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: accoladesList,
          start: 'top 82%'
        }
      });
    }
  }

  // 5. Dynamic Velocity-Responsive Marquee Track
  var marqueeTrack = document.getElementById('marquee-track');
  if (marqueeTrack && !reduce) {
    ScrollTrigger.create({
      onUpdate: function (self) {
        var v = Math.min(6, Math.abs(self.getVelocity() / 250));
        var targetDuration = Math.max(7, 28 - v * 4.5);
        marqueeTrack.style.animationDuration = targetDuration.toFixed(1) + 's';
      }
    });
  }

  if (!reduce) {
    // Hero Multi-layer Parallax
    var heroHeadline = document.querySelector('.hero-headline-col');
    var heroCard = document.querySelector('.hero-card-col');
    var heroBannerImg = document.querySelector('.hero-photo-banner img');

    if (heroHeadline) {
      gsap.to(heroHeadline, {
        y: 75,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6
        }
      });
    }

    if (heroCard) {
      gsap.to(heroCard, {
        y: 45,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6
        }
      });
    }

    if (heroBannerImg) {
      gsap.fromTo(heroBannerImg,
        { scale: 1 },
        {
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero-photo-banner',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6
          }
        }
      );
    }

    // Parallax image frames (gsap/zoom pattern)
    var innerImages = gsap.utils.toArray('.member-photo img, .article-thumb img');
    innerImages.forEach(function (img) {
      if (img.parentElement) {
        gsap.fromTo(img,
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: 'none',
            scrollTrigger: {
              trigger: img.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6
            }
          }
        );
      }
    });
  }

  // Count-up stats (gsap/counter pattern)
  var counterEls = document.querySelectorAll('[data-to]');
  counterEls.forEach(function (el) {
    var targetVal = parseFloat(el.getAttribute('data-to'));
    var suffix = el.getAttribute('data-suf') || '';
    var stateObj = { v: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: function () {
        gsap.to(stateObj, {
          v: targetVal,
          duration: 2.2,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.round(stateObj.v) + suffix;
          }
        });
      }
    });
  });
}

/* ────────────────────────────────────────────────────────────
14. HERO DOT FIELD CANVAS
──────────────────────────────────────────────────────────── */
function initHeroDotField() {
  var cv = document.getElementById('heroDotField');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  var W = 1, H = 1, D = [];
  var mx = -999, my = -999, sx = 0, sy = 0, rip = [];
  var spacing = 32;

  function build() {
    var d = Math.min(2, window.devicePixelRatio || 1);
    W = cv.clientWidth;
    H = cv.clientHeight;
    cv.width = W * d;
    cv.height = H * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);

    var cols = Math.ceil(W / spacing) + 1;
    var rows = Math.ceil(H / spacing) + 1;
    var ox = (W - (cols - 1) * spacing) / 2;
    var oy = (H - (rows - 1) * spacing) / 2;
    D = [];
    for (var j = 0; j < rows; j++) {
      for (var i = 0; i < cols; i++) {
        D.push([ox + i * spacing, oy + j * spacing]);
      }
    }
    sx = W / 2;
    sy = H / 2;
  }

  build();
  window.addEventListener('resize', build);

  var hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('pointermove', function (e) {
      var r = cv.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    });
    hero.addEventListener('pointerleave', function () {
      mx = my = -999;
    });
    hero.addEventListener('pointerdown', function (e) {
      var r = cv.getBoundingClientRect();
      rip.push([e.clientX - r.left, e.clientY - r.top, performance.now()]);
    });
  }

  loop(function (now) {
    var tx = mx > -900 ? mx : W / 2 + Math.sin(now * 0.0006) * W * 0.25;
    var ty = my > -900 ? my : H / 2 + Math.cos(now * 0.0008) * H * 0.2;
    sx += (tx - sx) * 0.12;
    sy += (ty - sy) * 0.12;

    rip = rip.filter(function (r) { return now - r[2] < 1200; });
    ctx.clearRect(0, 0, W, H);

    var R = 180;
    for (var i = 0; i < D.length; i++) {
      var x = D[i][0];
      var y = D[i][1];
      var dx = sx - x;
      var dy = sy - y;
      var dist = Math.hypot(dx, dy) || 1;
      var f = Math.max(0, 1 - dist / R);
      f *= f;

      var w = 0;
      for (var k = 0; k < rip.length; k++) {
        var q = rip[k];
        var age = (now - q[2]) / 1200;
        var rr = age * Math.max(W, H) * 0.5;
        var dd = Math.hypot(x - q[0], y - q[1]);
        w += Math.exp(-Math.pow((dd - rr) / 44, 2)) * (1 - age);
      }

      var a = Math.min(1, Math.max(0, f + w));
      var px = x - (dx / dist) * (f * 32 + w * 18);
      var py = y - (dy / dist) * (f * 32 + w * 18);

      ctx.fillStyle = a > 0.04 ? '#E2F804' : 'rgba(255, 255, 255, 0.12)';
      ctx.globalAlpha = a > 0.04 ? 0.75 : 0.22;
      ctx.beginPath();
      ctx.arc(px, py, 1.2 + a * 2.8, 0, 6.283);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  });
}

/* --- 15. Interactive Pill Scramble --- */
function initPillScramble() {
  if (reduce) return;
  var glyphs = '#%&*+=?@$/<>0123456789_';
  var pills = Array.from(document.querySelectorAll('.pill-kicker'));

  pills.forEach(function (pill) {
    var originalText = pill.textContent.trim();
    var isRunning = false;

    function scramble() {
      if (isRunning) return;
      isRunning = true;
      var t0 = performance.now();
      var len = originalText.length;

      var off = loop(function (now) {
        var elapsed = now - t0;
        var progress = elapsed / 450;
        if (progress >= 1) {
          pill.textContent = originalText;
          isRunning = false;
          off();
          return;
        }

        var revealCount = Math.floor(progress * len);
        var res = '';
        for (var i = 0; i < len; i++) {
          if (i < revealCount || originalText[i] === ' ' || originalText[i] === '•') {
            res += originalText[i];
          } else {
            res += glyphs.charAt(Math.floor(Math.random() * glyphs.length));
          }
        }
        pill.textContent = res;
      });
    }

    pill.addEventListener('mouseenter', scramble);

    if (window.ScrollTrigger) {
      ScrollTrigger.create({
        trigger: pill,
        start: 'top 92%',
        once: true,
        onEnter: scramble
      });
    }
  });
}

/* --- 16. Magnetic Button Physics --- */
function initMagneticButtons() {
  if (reduce || matchMedia('(pointer: coarse)').matches) return;
  var btns = Array.from(document.querySelectorAll('.header-cta-btn, .btn-about-dark, .planner-cta-btn, .circular-seal-badge, .btn-read-all'));

  btns.forEach(function (btn) {
    btn.addEventListener('mouseenter', function () {
      btn.style.transition = 'none';
    });

    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var dx = (e.clientX - cx) * 0.35;
      var dy = (e.clientY - cy) * 0.35;
      btn.style.transform = 'translate(' + dx.toFixed(1) + 'px, ' + dy.toFixed(1) + 'px)';
    });

    btn.addEventListener('mouseleave', function () {
      btn.style.transition = 'transform 0.4s var(--ez-spring)';
      btn.style.transform = '';
    });
  });
}

/* --- 17. 3D Glare Reflection on Hover --- */
function initCardGlares() {
  if (reduce || matchMedia('(pointer: coarse)').matches) return;
  var cards = Array.from(document.querySelectorAll('.work-card, .svc-card, .member-card'));
  cards.forEach(function (card) {
    if (!card.querySelector('.card-glare-overlay')) {
      var glare = document.createElement('div');
      glare.className = 'card-glare-overlay';
      card.appendChild(glare);
    }
    card.addEventListener('pointermove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--gx', x.toFixed(1) + '%');
      card.style.setProperty('--gy', y.toFixed(1) + '%');
    });
  });
}

/* --- 18. Click Micro-Interactions --- */
function initClickBursts() {
  if (reduce) return;
  var cv = document.getElementById('burstCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  var particles = [];

  function resize() {
    var d = Math.min(2, window.devicePixelRatio || 1);
    cv.width = window.innerWidth * d;
    cv.height = window.innerHeight * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('pointerdown', function (e) {
    var isLight = document.body.classList.contains('cux-on-light');
    var color = isLight ? '#142016' : '#E2F804';
    var count = 9;
    for (var i = 0; i < count; i++) {
      var angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      var speed = 2.2 + Math.random() * 3.5;
      particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2.2 + Math.random() * 2,
        color: color,
        life: 0,
        maxLife: 26 + Math.random() * 10
      });
    }
    // Concentric shockwave ring
    particles.push({
      ring: true,
      x: e.clientX,
      y: e.clientY,
      radius: 3,
      maxRadius: 36,
      color: color,
      life: 0,
      maxLife: 24
    });
  });

  loop(function () {
    if (!particles.length) {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      return;
    }
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.life++;
      var progress = p.life / p.maxLife;
      if (progress >= 1) {
        particles.splice(i, 1);
        continue;
      }

      if (p.ring) {
        p.radius += (p.maxRadius - p.radius) * 0.18;
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = Math.max(0, (1 - progress) * 0.85);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, (1 - progress) * 0.9);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - progress * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  });
}


/* --- 20. Atmospheric Sound Design (Web Audio API) --- */
function initStudioSound() {
  var btn = document.getElementById('menuSoundToggle');
  var icon = document.getElementById('menuSoundIcon');
  var label = document.getElementById('menuSoundLabel');

  var audioCtx = null;
  var isSoundOn = false; // Default OFF

  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function unlockAudio() {
    if (isSoundOn) {
      getAudioContext();
    }
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  }
  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });
  window.addEventListener('touchstart', unlockAudio, { passive: true });

  function playChime(freq, dur, gainLevel) {
    if (!isSoundOn) return;
    try {
      var ctx = getAudioContext();
      if (!ctx) return;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      // Low subtle tactile click rather than piercing arcade beep
      var tone = Math.min(freq || 220, 320);
      osc.frequency.setValueAtTime(tone, ctx.currentTime);
      gain.gain.setValueAtTime(gainLevel || 0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (dur || 0.025));
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + (dur || 0.025));
    } catch (e) { }
  }

  function updateBtnState() {
    if (!btn) return;
    btn.classList.toggle('is-muted', !isSoundOn);
    if (icon) icon.textContent = isSoundOn ? '🔊' : '🔈';
    if (label) label.textContent = isSoundOn ? 'SOUND: ON' : 'SOUND: OFF';
  }

  if (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      isSoundOn = !isSoundOn;
      updateBtnState();
      if (isSoundOn) {
        getAudioContext();
        playChime(880, 0.08, 0.04);
      }
    });
    updateBtnState();
  }

  // Subtle click feedback only, avoiding noisy hover chatter
  // Hover beeps removed for clean editorial experience

  window.addEventListener('pointerdown', function () {
    if (isSoundOn) playChime(480, 0.05, 0.03);
  });
}

/* --- 21. Section Animations: everything is a scrubbed slide-up --- */
function initSectionAnimations() {
  if (reduce || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var small = matchMedia('(max-width: 768px)').matches;

  // Hero intro (plays on load)
  gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.15 })
    .from('.hero-h1', { clipPath: 'inset(0 0 100% 0)', y: 40, opacity: 0, duration: 1.3, clearProps: 'clipPath' })
    .from('.hero-card-col', { opacity: 0, duration: 1 }, 0.5)
    .fromTo('.hero-photo-banner', { clipPath: 'inset(12% 8% 0% 8% round 28px)' },
      { clipPath: 'inset(0% 0% 0% 0% round 20px)', duration: 1.6, clearProps: 'clipPath' }, 0.35)
    .from('.circular-seal-badge', { opacity: 0, duration: 1 }, 1);

  // Headings: words slide up cleanly into view on scroll entry (no scrub clipping)
  gsap.utils.toArray('.process-h2,.services-dark-h2,.works-h2,.accolades-h2,.atelier-h2,.insights-h2,.faq-h2').forEach(function (h) {
    var words = [];
    Array.prototype.slice.call(h.childNodes).forEach(function (n) {
      if (n.nodeType !== 3) return;
      var frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
        var w = document.createElement('span'), i = document.createElement('span');
        w.className = 'mw'; i.className = 'mi'; i.textContent = part;
        w.appendChild(i); frag.appendChild(w); words.push(i);
      });
      h.replaceChild(frag, n);
    });
    gsap.fromTo(words, { yPercent: 105, opacity: 0 }, {
      yPercent: 0,
      opacity: 1,
      duration: 0.85,
      ease: 'power3.out',
      stagger: 0.04,
      scrollTrigger: {
        trigger: h,
        start: 'top 88%',
        toggleActions: 'play none none none',
        once: true
      },
      onComplete: function () {
        h.querySelectorAll('.mw').forEach(function (w) {
          w.style.overflow = 'visible';
        });
      }
    });
  });

  // Generic scrubbed slide-up (+ optional fade). Elements in the same row get a tiny offset = stagger.
  function slideUp(sel, y, fade, st, en) {
    gsap.utils.toArray(sel).forEach(function (el, i) {
      var o = (i % 4) * 4;
      el.classList.add(fade ? 'fx-su' : 'fx-sy');
      var from = { '--sy': y + 'px' }, to = {
        '--sy': '0px', ease: 'none',
        scrollTrigger: { trigger: el, start: 'top ' + ((st || 100) - o) + '%', end: 'top ' + ((en || 68) - o) + '%', scrub: 0.5, invalidateOnRefresh: true }
      };
      if (fade) { from['--so'] = 0; to['--so'] = 1; }
      gsap.fromTo(el, from, to);
    });
  }
  slideUp('.svc-card,.member-card,.article-card,.faq-item', 80, true);
  slideUp('.ex-r', 70, true);
  slideUp('.cap-item', 50, false);
  slideUp('.accolade-row', 55, true);
  slideUp('.q-tab-btn', 30, false);
  slideUp('.planner-card', 100, true);
  if (!small) slideUp('#about .container,#process .container,#services .container,#accolades .container,#atelier .container,#testimonials .container,#insights .container,#faq .container,#planner .container', 90, false, 104, 62);

  // Images: unmask from an inset frame, scrubbed
  (small ? [] : gsap.utils.toArray('.about-media-card,.solutions-media-card,.member-photo,.article-thumb')).forEach(function (el) {
    var r = getComputedStyle(el).borderTopLeftRadius || '14px';
    gsap.fromTo(el, { clipPath: 'inset(14% 10% 14% 10% round ' + r + ')' },
      {
        clipPath: 'inset(0% 0% 0% 0% round ' + r + ')', ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 96%', end: 'top 50%', scrub: 0.5 }
      });
  });
}

/* --- 22. Header + Fullscreen Navigation --- */
function initHeader() {
  var hd = document.getElementById('siteHeader');
  if (!hd || typeof gsap === 'undefined') return;
  var nav = document.getElementById('hdNav'), pill = document.getElementById('hdPill');
  var links = nav ? [].slice.call(nav.querySelectorAll('a')) : [];
  var ring = document.getElementById('hdRing');
  var active = null, hidden = false, C = 150.8;
  var lastY = window.scrollY || 0;

  // Guarantee header is fully loaded and 100% visible immediately (no stuck opacity or dull state)
  gsap.set(hd, { yPercent: 0, opacity: 1, visibility: 'visible', clearProps: 'opacity' });
  hd.style.opacity = '1';
  hd.style.visibility = 'visible';

  function place(a) {
    if (!pill) return;
    if (!a) {
      gsap.to(pill, { opacity: 0, duration: 0.25, overwrite: 'auto' });
      links.forEach(function (l) { l.classList.remove('is-on'); });
      return;
    }
    gsap.to(pill, {
      x: a.offsetLeft,
      width: a.offsetWidth,
      opacity: 1,
      duration: reduce ? 0 : 0.35,
      ease: 'power2.out',
      overwrite: 'auto'
    });
    links.forEach(function (l) { l.classList.toggle('is-on', l === a); });
  }

  links.forEach(function (l) {
    l.addEventListener('mouseenter', function () { place(l); });
    l.addEventListener('click', function () {
      active = l;
      place(l);
    });
  });

  if (nav) {
    nav.addEventListener('mouseleave', function () { place(active); });
  }
  window.addEventListener('resize', function () { place(active); }, { passive: true });

  var secMap = {
    'about': 'about',
    'solutions': 'about',
    'process': 'about',
    'services': 'services',
    'works': 'works',
    'capabilities': 'works',
    'accolades': 'accolades',
    'atelier': 'insights',
    'testimonials': 'insights',
    'insights': 'insights',
    'faq': 'faq',
    'planner': 'faq'
  };

  var secIds = ['hero', 'about', 'solutions', 'process', 'services', 'works', 'capabilities', 'accolades', 'atelier', 'testimonials', 'insights', 'faq', 'planner', 'contact'];

  function updateActiveNav() {
    if (!nav) return;
    var mid = window.innerHeight * 0.45;
    var curNavSec = null;
    for (var i = 0; i < secIds.length; i++) {
      var el = document.getElementById(secIds[i]);
      if (!el) continue;
      var rect = el.getBoundingClientRect();
      if (rect.top <= mid && rect.bottom >= mid) {
        curNavSec = secMap[secIds[i]] || null;
        break;
      }
    }
    if (!curNavSec) {
      if (active !== null) { active = null; place(null); }
    } else {
      var a = nav.querySelector('a[data-sec="' + curNavSec + '"]');
      if (a && a !== active) { active = a; place(a); }
    }
  }

  // Smart header: hides smoothly on scroll down, reveals on scroll up; always visible near top
  function onScroll() {
    var y = window.scrollY || 0;
    var max = (window.ScrollTrigger && ScrollTrigger.maxScroll ? ScrollTrigger.maxScroll(window) : (document.documentElement.scrollHeight - window.innerHeight)) || 1;
    hd.classList.toggle('is-scrolled', y > 40);
    if (ring) ring.style.strokeDashoffset = C * (1 - Math.min(1, y / max));

    if (!document.body.classList.contains('menu-open')) {
      var dy = y - lastY;
      if (y <= 120) {
        // Always reveal header near top of the page
        if (hidden) {
          hidden = false;
          gsap.to(hd, { yPercent: 0, opacity: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
        }
      } else if (dy > 6 && y > 200 && !hidden) {
        // Scrolling down past threshold: tuck header away
        hidden = true;
        gsap.to(hd, { yPercent: -130, duration: 0.45, ease: 'power3.inOut', overwrite: 'auto' });
      } else if (dy < -6 && hidden) {
        // Scrolling up: bring header back smoothly at full opacity
        hidden = false;
        gsap.to(hd, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
      }
    }
    lastY = y;
    updateActiveNav();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Subtle entrance reveal on initial visit only, NEVER setting opacity to 0 or locking it with delay
  if (!reduce && (window.scrollY || 0) < 60) {
    gsap.fromTo(hd,
      { yPercent: -60 },
      { yPercent: 0, opacity: 1, duration: 0.7, ease: 'power3.out', overwrite: 'auto', clearProps: 'transform,opacity' }
    );
  } else {
    gsap.set(hd, { yPercent: 0, opacity: 1, clearProps: 'transform,opacity' });
  }

  // Restore header on browser back/forward (bfcache) navigation
  window.addEventListener('pageshow', function () {
    hidden = false;
    lastY = window.scrollY || 0;
    gsap.set(hd, { yPercent: 0, opacity: 1, visibility: 'visible', clearProps: 'opacity' });
    hd.style.opacity = '1';
    hd.style.visibility = 'visible';
    onScroll();
  });

  // fullscreen menu
  var btn = document.getElementById('hdMenu'), ov = document.getElementById('menuOverlay'), isOpen = false;
  if (btn && ov) {
    var tl = gsap.timeline({ paused: true, onReverseComplete: function () { ov.style.visibility = 'hidden'; } })
      .set(ov, { visibility: 'visible' })
      .fromTo(ov, { clipPath: 'circle(0% at calc(100% - 56px) 40px)' }, { clipPath: 'circle(150% at calc(100% - 56px) 40px)', duration: 1.1, ease: 'expo.inOut' }, 0)
      .fromTo('.mo-in', { yPercent: 115 }, { yPercent: 0, duration: 1, stagger: 0.04, ease: 'expo.out' }, 0.35)
      .fromTo('.mo-fade', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, 0.6);

    function toggle(force) {
      isOpen = typeof force === 'boolean' ? force : !isOpen;
      document.body.classList.toggle('menu-open', isOpen);
      btn.setAttribute('aria-expanded', isOpen);
      btn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      if (isOpen) {
        hidden = false; gsap.to(hd, { yPercent: 0, duration: 0.4, overwrite: true });
        if (lenisInstance) lenisInstance.stop();
        tl.timeScale(1).play();
      } else {
        if (lenisInstance) lenisInstance.start();
        tl.timeScale(1.3).reverse();
      }
    }
    btn.addEventListener('click', function () { toggle(); });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) toggle(false); });
    // capture phase: Lenis must be running again before its own anchor handler scrolls
    ov.addEventListener('click', function (e) { if (e.target.closest('a[href^="#"]')) toggle(false); }, true);
  }
}

/* --- 23. Scrubbed slide-up parallax footer --- */
function initFooterParallax() {
  var ft = document.querySelector('.site-footer');
  var top = document.getElementById('ftTop');
  if (top) top.addEventListener('click', function () {
    if (lenisInstance) lenisInstance.scrollTo(0, { duration: 1.8 }); else window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  if (!ft || reduce || typeof gsap === 'undefined') return;

  // each layer travels a different distance = depth; scrub ties it to the scrollbar
  gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: ft, start: 'top bottom', end: 'bottom bottom', scrub: 0.8 } })
    .fromTo('.ft-cta .pill-kicker', { y: 120, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, 0)
    .fromTo('.ft-line-in', { yPercent: 115 }, { yPercent: 0, duration: 0.45, stagger: 0.12 }, 0.05)
    .fromTo('.ft-btnwrap', { y: 220, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, 0.15)
    .fromTo('.ft-col', { y: 260, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.06 }, 0.25)
    .fromTo('.ft-wordmark .ft-char-wrap', { yPercent: 125 }, { yPercent: 0, duration: 0.5, stagger: 0.04 }, 0.4)
    .fromTo('.footer-bottom-strip', { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, 0.7);
}

/* --- 23b. Magnetic Kinetic Typography on Footer Wordmark (Like Hero Section Headline) --- */
function initFooterMagneticWordmark() {
  var wordmark = document.getElementById('ftWordmark');
  if (!wordmark) return;

  var charEls = wordmark.querySelectorAll('.ft-char');
  if (!charEls.length) return;

  var chars = [];
  charEls.forEach(function (el) {
    chars.push({
      el: el,
      ox: 0, oy: 0,
      vx: 0, vy: 0,
      rot: 0, vr: 0
    });
  });

  var px = -9999, py = -9999, hasMoved = false;

  window.addEventListener('pointermove', function (e) {
    px = e.clientX;
    py = e.clientY;
    hasMoved = true;
  });

  loop(function () {
    if (!hasMoved) return;
    var b = wordmark.getBoundingClientRect();
    // Skip calculations if wordmark is far out of view
    if (b.bottom < -100 || b.top > window.innerHeight + 100) return;

    var rad = Math.max(160, Math.min(window.innerWidth * 0.28, b.height * 1.3));

    chars.forEach(function (c) {
      var r = c.el.getBoundingClientRect();
      var hx = r.left + r.width / 2 - c.ox;
      var hy = r.top + r.height / 2 - c.oy;
      var dx = hx - px;
      var dy = hy - py;
      var dist = Math.hypot(dx, dy) || 1;
      var f = Math.max(0, 1 - dist / rad);
      f *= f;

      var tx = (dx / dist) * f * rad * 0.42;
      var ty = (dy / dist) * f * rad * 0.42;
      var tr = (dx / dist) * f * 24;

      if (reduce) {
        c.ox = tx; c.oy = ty; c.rot = tr;
      } else {
        spring(c, 0, tx, ty, tr);
      }

      c.el.style.transform = 'translate(' + c.ox.toFixed(1) + 'px, ' + c.oy.toFixed(1) + 'px) rotate(' + c.rot.toFixed(1) + 'deg)';
    });
  });
}

/* --- 24. Works rail: vertical scroll drives horizontal movement (pin + scrub) --- */
function initWorksPin() {
  var sec = document.getElementById('works'), rail = document.getElementById('worksRail');
  if (!sec || !rail || reduce || typeof ScrollTrigger === 'undefined') return;
  var mm = gsap.matchMedia();
  mm.add('(min-width: 769px)', function () {
    rail.style.scrollBehavior = 'auto';
    var st = { p: 0 };
    gsap.to(st, {
      p: 1, ease: 'none',
      onUpdate: function () { rail.scrollLeft = st.p * Math.max(0, rail.scrollWidth - rail.clientWidth); },
      scrollTrigger: {
        trigger: sec, start: 'center center',
        end: function () { return '+=' + Math.max(1, rail.scrollWidth - rail.clientWidth); },
        pin: true, scrub: true, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 1
      }
    });
    return function () { rail.style.scrollBehavior = ''; };
  });
}

/* --- 25. Broken-image fallback (missing assets show a tinted block, not alt text) --- */
function initImageFallbacks() {
  function fix(img) {
    if (!img || img.id === 'accoladeThumbImg' || img.closest('#accoladeThumb')) return;
    img.style.color = 'transparent';
    img.style.opacity = '0';
    if (img.parentElement) img.parentElement.style.background = 'color-mix(in srgb, var(--fx-head) 9%, transparent)';
  }
  document.querySelectorAll('img').forEach(function (img) {
    if (!img || img.id === 'accoladeThumbImg' || img.closest('#accoladeThumb')) return;
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) fix(img);
    else img.addEventListener('error', function () { fix(img); }, { once: true });
  });
}

/* --- 26. Capability SVG scenes: follow the active discipline, draw in on switch --- */
function initCapabilityScenes() {
  var scenes = [].slice.call(document.querySelectorAll('.cap-scene'));
  var items = [].slice.call(document.querySelectorAll('.cap-item'));
  if (!scenes.length || !items.length) return;
  var cur = 0;
  function show(i) {
    if (i === cur && scenes[i].classList.contains('on')) return;
    cur = i;
    items.forEach(function (it, j) { it.classList.toggle('active', j === i); });
    scenes.forEach(function (sc, j) { sc.classList.toggle('on', j === i); });
    if (typeof gsap === 'undefined' || reduce) return;
    gsap.fromTo(scenes[i].querySelectorAll('.dr'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, stagger: 0.04, ease: 'power2.out', overwrite: true });
    gsap.fromTo(scenes[i], { scale: 0.95, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.8, ease: 'expo.out', overwrite: 'auto' });
  }
  items.forEach(function (it, i) {
    it.addEventListener('mouseenter', function () { show(i); });
    it.addEventListener('click', function () { show(i); });
  });
}

/* --- DOM Ready Initialization --- */
document.addEventListener('DOMContentLoaded', function () {
  initCustomCursor();
  initMagneticType();
  initTiltCard();
  initVelocityMarquee();
  initExpandingProcess();
  initCapabilitiesSwitcher();
  initClientQuotes();
  initWorksRail();
  initAccoladesHover();
  initFaqAccordion();
  initScopePlanner();
  initHeroDotField();
  initLenisSmoothScroll();
  initTailoredSolutions();
  initGsapScrollTriggerEffects();
  initSectionAnimations();
  initHeader();
  initFooterParallax();
  initFooterMagneticWordmark();
  initWorksPin();
  initCapabilityScenes();
  initImageFallbacks();
  // initPillScramble(); // Disabled to maintain typographic clarity and readability
  initMagneticButtons();
  initCardGlares();
  // initClickBursts(); // Disabled to remove unnecessary click clutter
  initStudioSound();
  if (window.ScrollTrigger) {
    ScrollTrigger.refresh();
  }
});

/* --- Editorial Reading Progress & Category Filter --- */
function initEditorialFeatures() {
  var progressFill = document.getElementById('readingProgressFill');
  if (progressFill) {
    window.addEventListener('scroll', function () {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var p = docH > 0 ? (window.scrollY / docH) * 100 : 0;
      progressFill.style.width = Math.min(100, Math.max(0, p)) + '%';
    }, { passive: true });
  }

  var tabBtns = document.querySelectorAll('.j-tab-btn, .filter-tab-btn');
  var articleCards = document.querySelectorAll('.journal-grid .article-card');
  var searchInput = document.getElementById('journalSearchInput');
  var searchClear = document.getElementById('journalSearchClear');
  var countDisplay = document.getElementById('journalCountDisplay');
  var emptyState = document.getElementById('journalEmptyState');
  var resetBtn = document.getElementById('journalResetFilterBtn');

  if (articleCards.length) {
    var activeCat = 'all';
    var searchQuery = '';

    function filterArticles() {
      var visibleCount = 0;
      articleCards.forEach(function (card) {
        var cardCat = card.getAttribute('data-cat') || '';
        var text = (card.textContent || '').toLowerCase();
        var matchesCat = (activeCat === 'all' || cardCat === activeCat);
        var matchesSearch = (!searchQuery || text.indexOf(searchQuery) !== -1);

        if (matchesCat && matchesSearch) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (countDisplay) {
        countDisplay.innerHTML = 'SHOWING <strong>' + visibleCount + '</strong> DISPATCHES';
      }

      if (emptyState) {
        emptyState.classList.toggle('is-hidden', visibleCount > 0);
      }
    }

    if (tabBtns.length) {
      tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          tabBtns.forEach(function (b) {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');
          activeCat = btn.getAttribute('data-cat') || 'all';
          filterArticles();
        });
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        searchQuery = searchInput.value.trim().toLowerCase();
        if (searchClear) searchClear.classList.toggle('is-hidden', !searchQuery);
        filterArticles();
      });
    }

    if (searchClear) {
      searchClear.addEventListener('click', function () {
        searchInput.value = '';
        searchQuery = '';
        searchClear.classList.add('is-hidden');
        searchInput.focus();
        filterArticles();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        activeCat = 'all';
        searchQuery = '';
        if (searchInput) searchInput.value = '';
        if (searchClear) searchClear.classList.add('is-hidden');
        tabBtns.forEach(function (b, i) {
          b.classList.toggle('active', i === 0);
          b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        });
        filterArticles();
      });
    }
  }
}
initEditorialFeatures();

/* --- Awwwards Article Deep-Dive Interactive Suite --- */
function initArticleExperience() {
  var content = document.querySelector('.article-body-content');
  if (!content) return;

  // 1. Reading Progress & Sidebar Ring
  var ring = document.getElementById('sidebarProgressFill');
  var ringText = document.getElementById('sidebarProgressPercent');
  var maxOffset = 113.1; // 2 * PI * 18

  function updateArticleProgress() {
    var rect = content.getBoundingClientRect();
    var totalH = content.offsetHeight - window.innerHeight;
    var scrolled = -rect.top;
    var percent = totalH > 0 ? Math.min(100, Math.max(0, Math.round((scrolled / totalH) * 100))) : 0;

    if (ring) {
      var offset = maxOffset - (percent / 100) * maxOffset;
      ring.style.strokeDashoffset = offset;
    }
    if (ringText) {
      ringText.textContent = percent + '% READ';
    }
  }
  window.addEventListener('scroll', updateArticleProgress, { passive: true });
  updateArticleProgress();

  // 2. Active ScrollSpy for Table of Contents
  var tocLinks = document.querySelectorAll('.sidebar-toc-list a');
  var headings = content.querySelectorAll('h2[id]');
  if (tocLinks.length && headings.length) {
    function updateTOC() {
      var scrollPos = window.scrollY + 180;
      var activeId = '';
      headings.forEach(function (h) {
        if (h.offsetTop <= scrollPos) {
          activeId = h.getAttribute('id');
        }
      });
      tocLinks.forEach(function (link) {
        var targetId = (link.getAttribute('href') || '').replace('#', '');
        link.classList.toggle('is-active', targetId && targetId === activeId);
      });
    }
    window.addEventListener('scroll', updateTOC, { passive: true });
    updateTOC();
  }

  // 3. Font Size Adjuster
  var decBtn = document.getElementById('articleFontDecreaseBtn');
  var incBtn = document.getElementById('articleFontIncreaseBtn');
  var currentFontSize = 1.1; // rem
  if (decBtn && incBtn) {
    decBtn.addEventListener('click', function () {
      currentFontSize = Math.max(0.95, currentFontSize - 0.08);
      content.style.fontSize = currentFontSize.toFixed(2) + 'rem';
    });
    incBtn.addEventListener('click', function () {
      currentFontSize = Math.min(1.35, currentFontSize + 0.08);
      content.style.fontSize = currentFontSize.toFixed(2) + 'rem';
    });
  }

  // 4. Copy Article Link
  var copyBtns = [document.getElementById('articleCopyLinkBtn'), document.getElementById('reactionCopyBtn')];
  copyBtns.forEach(function (btn) {
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(window.location.href);
      }
      var span = btn.querySelector('#copyLinkText') || btn;
      var original = span.textContent;
      span.textContent = 'COPIED ✓';
      setTimeout(function () { span.textContent = original; }, 2000);
    });
  });

  // 5. Interactive Spring Physics Sandbox
  var springOrb = document.getElementById('springOrb');
  var triggerSpringBtn = document.getElementById('triggerSpringBtn');
  if (springOrb) {
    function triggerSpring() {
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(springOrb,
          { scale: 0.6, rotation: -25, y: -40 },
          { scale: 1, rotation: 0, y: 0, duration: 1.4, ease: 'elastic.out(1, 0.3)', overwrite: 'auto' }
        );
      }
      var telCards = document.querySelectorAll('.telemetry-card');
      if (typeof gsap !== 'undefined' && telCards.length) {
        gsap.fromTo(telCards, { y: 3 }, { y: 0, stagger: 0.04, duration: 0.3 });
      }
    }
    springOrb.addEventListener('click', triggerSpring);
    if (triggerSpringBtn) triggerSpringBtn.addEventListener('click', triggerSpring);
  }

  // 6. Interactive Sound Lab
  var soundLabBtn = document.getElementById('btnTestSoundLab');
  var soundVisualBars = document.getElementById('soundVisualBars');
  var soundLabText = document.getElementById('soundLabBtnText');
  if (soundLabBtn && soundVisualBars) {
    soundLabBtn.addEventListener('click', function () {
      soundVisualBars.classList.add('is-active-sound');
      if (soundLabText) soundLabText.textContent = 'SYNTHESIZING...';

      try {
        var AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          var sCtx = new AudioCtx();
          if (sCtx.state === 'suspended') sCtx.resume();
          var osc = sCtx.createOscillator();
          var g = sCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(432, sCtx.currentTime);
          g.gain.setValueAtTime(0.08, sCtx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.0001, sCtx.currentTime + 0.5);
          osc.connect(g);
          g.connect(sCtx.destination);
          osc.start();
          osc.stop(sCtx.currentTime + 0.5);
        }
      } catch (e) { }

      setTimeout(function () {
        soundVisualBars.classList.remove('is-active-sound');
        if (soundLabText) soundLabText.textContent = 'PLAY FREQUENCY (432Hz)';
      }, 1400);
    });
  }

  // 7. Interactive Audio Dispatch HUD Toggle
  var audioHudBtn = document.getElementById('articleAudioPlayBtn');
  var audioHudLabel = document.getElementById('articleAudioBtnLabel');
  var isAudioPlaying = false;
  if (audioHudBtn) {
    audioHudBtn.addEventListener('click', function () {
      isAudioPlaying = !isAudioPlaying;
      audioHudBtn.classList.toggle('is-playing', isAudioPlaying);
      if (audioHudLabel) {
        audioHudLabel.textContent = isAudioPlaying ? 'PLAYING [4:18]' : 'LISTEN [4:18]';
      }
    });
  }

  // 8. Code Copy Button
  var codeCopyBtn = document.getElementById('codeCopyBtn');
  if (codeCopyBtn) {
    codeCopyBtn.addEventListener('click', function () {
      var codeEl = document.querySelector('.code-pre code');
      if (codeEl && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(codeEl.textContent || '');
      }
      codeCopyBtn.textContent = 'COPIED ✓';
      setTimeout(function () { codeCopyBtn.textContent = 'COPY CODE'; }, 2000);
    });
  }

  // 9. Interactive Appreciation Clap Button
  var clapBtn = document.getElementById('articleClapBtn');
  var clapCountEl = document.getElementById('clapCount');
  var clapFeedback = document.getElementById('clapFeedback');
  var claps = 348;
  if (clapBtn && clapCountEl) {
    clapBtn.addEventListener('click', function () {
      claps++;
      clapCountEl.textContent = claps;
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(clapBtn, { scale: 1.15 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' });
      }
      if (clapFeedback) {
        clapFeedback.classList.add('show');
        setTimeout(function () { clapFeedback.classList.remove('show'); }, 2200);
      }
    });
  }
}
initArticleExperience();
