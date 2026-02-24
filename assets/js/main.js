/* ========================================================
   main.js — Shared JavaScript for Alexander Voss Portfolio
   ======================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. CUSTOM CURSOR
  ------------------------------------------------------------------ */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (dot && ring && window.matchMedia('(pointer: fine)').matches) {
    let mx = -100, my = -100;   // mouse target
    let rx = -100, ry = -100;   // ring current (lagged)

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    });

    (function animRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
      requestAnimationFrame(animRing);
    })();

    // Cursor grow on interactive elements
    const growTargets = 'a, button, .g-item, .filter-btn, .stat-cell, .cat-card, .contact-method, .tag-pill';
    document.querySelectorAll(growTargets).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-grow'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-grow'));
    });

    // Also handle dynamically — delegate from body
    document.body.addEventListener('mouseover', (e) => {
      if (e.target.closest(growTargets)) document.body.classList.add('cursor-grow');
    });
    document.body.addEventListener('mouseout', (e) => {
      if (e.target.closest(growTargets)) document.body.classList.remove('cursor-grow');
    });
  }

  /* ------------------------------------------------------------------
     2. SCROLL PROGRESS BAR
  ------------------------------------------------------------------ */
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    const updateProgress = () => {
      const scrolled = window.scrollY;
      const total    = document.body.scrollHeight - window.innerHeight;
      const pct      = total > 0 ? (scrolled / total) * 100 : 0;
      progressBar.style.width = pct + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ------------------------------------------------------------------
     3. NAV SCROLL STATE
  ------------------------------------------------------------------ */
  const nav = document.getElementById('nav');
  if (nav) {
    const updateNav = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  /* ------------------------------------------------------------------
     4. MOBILE HAMBURGER MENU
  ------------------------------------------------------------------ */
  const hamBtn  = document.getElementById('ham-btn');
  const drawer  = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const hLine1  = document.getElementById('h1');
  const hLine2  = document.getElementById('h2');
  const hLine3  = document.getElementById('h3');
  let drawerOpen = false;

  function openDrawer() {
    drawerOpen = true;
    drawer && drawer.classList.add('open');
    backdrop && backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (hLine1) { hLine1.style.transform = 'translateY(7px) rotate(45deg)'; }
    if (hLine2) { hLine2.style.opacity   = '0'; hLine2.style.transform = 'scaleX(0)'; }
    if (hLine3) { hLine3.style.transform = 'translateY(-7px) rotate(-45deg)'; }
  }

  window.closeDrawer = function () {
    drawerOpen = false;
    drawer && drawer.classList.remove('open');
    backdrop && backdrop.classList.remove('active');
    document.body.style.overflow = '';
    if (hLine1) { hLine1.style.transform = ''; }
    if (hLine2) { hLine2.style.opacity   = ''; hLine2.style.transform = ''; }
    if (hLine3) { hLine3.style.transform = ''; }
  };

  if (hamBtn) {
    hamBtn.addEventListener('click', () => {
      drawerOpen ? window.closeDrawer() : openDrawer();
    });
  }

  // Close drawer on backdrop click
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      if (drawerOpen) window.closeDrawer();
    });
  }

  // Close drawer on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawerOpen) window.closeDrawer();
  });

  /* ------------------------------------------------------------------
     5. SCROLL REVEAL (IntersectionObserver)
  ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length) {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    revealEls.forEach((el) => revealObs.observe(el));
  }

  /* ------------------------------------------------------------------
     6. HERO IMMEDIATE REVEAL (stagger on page load)
     Trigger hero .reveal elements right away so they animate in
     without needing to scroll.
  ------------------------------------------------------------------ */
  window.addEventListener('load', () => {
    const heroSection = document.querySelector('#hero, [data-hero], .hero-section, section:first-of-type');
    if (!heroSection) return;

    const heroRevealEls = heroSection.querySelectorAll('.reveal');
    heroRevealEls.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 150 + i * 140);
    });
  });

  /* ------------------------------------------------------------------
     7. PAGE TRANSITION COVER
     Fades out on load; adds a brief cover on link clicks for polish.
  ------------------------------------------------------------------ */
  const cover = document.getElementById('page-cover');
  if (cover) {
    // Fade out the cover after page load
    window.addEventListener('load', () => {
      cover.style.opacity = '0';
      cover.style.pointerEvents = 'none';
    });

    // Fade in cover on internal navigation links
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      // Only intercept same-origin, non-anchor, non-external links
      if (
        href &&
        !href.startsWith('http') &&
        !href.startsWith('#') &&
        !href.startsWith('mailto:') &&
        !href.startsWith('tel:') &&
        !href.startsWith('https://wa.me')
      ) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const dest = link.href;
          cover.style.transition = 'opacity 0.35s ease';
          cover.style.opacity    = '1';
          cover.style.pointerEvents = 'all';
          setTimeout(() => { window.location.href = dest; }, 360);
        });
      }
    });
  }

  /* ------------------------------------------------------------------
     8. HERO PARTICLES (home page)
  ------------------------------------------------------------------ */
  const particleContainer = document.getElementById('hero-particles');
  if (particleContainer) {
    for (let i = 0; i < 28; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 3 + 1;
      p.style.cssText = [
        `width:${size}px`,
        `height:${size}px`,
        `left:${Math.random() * 100}%`,
        `top:${Math.random() * 100}%`,
        `opacity:${Math.random() * 0.4 + 0.1}`,
        `animation-duration:${Math.random() * 14 + 8}s`,
        `animation-delay:${Math.random() * -12}s`,
        `border-radius:50%`,
        `position:absolute`,
        `background:rgba(212,197,169,${Math.random() * 0.5 + 0.1})`,
        `animation-name:float-up`,
        `animation-timing-function:ease-in-out`,
        `animation-iteration-count:infinite`,
      ].join(';');
      particleContainer.appendChild(p);
    }
  }

  /* ------------------------------------------------------------------
     9. HERO PARALLAX (home page, subtle)
  ------------------------------------------------------------------ */
  const heroImg = document.querySelector('.hero-img-wrap');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.5) {
        heroImg.style.transform = `translateY(${y * 0.12}px)`;
      }
    }, { passive: true });
  }

  /* ------------------------------------------------------------------
     10. GALLERY FILTER (gallery page) — delegates in case inline
         script didn't run yet; also attaches MO for lazy loaded items.
  ------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.dataset.filter;
        document.querySelectorAll('.g-item').forEach(item => {
          const show = cat === 'all' || item.dataset.cat === cat;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

})();
