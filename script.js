/* CZ Software LLC — site script (no dependencies) */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function isOpen() {
    return toggle && toggle.getAttribute('aria-expanded') === 'true';
  }
  function setOpen(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () { setOpen(!isOpen()); });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (isOpen() && header && !header.contains(e.target)) setOpen(false);
    });

    var desktopMq = window.matchMedia('(min-width: 900px)');
    var closeOnDesktop = function (e) { if (e.matches) setOpen(false); };
    if (desktopMq.addEventListener) desktopMq.addEventListener('change', closeOnDesktop);
    else if (desktopMq.addListener) desktopMq.addListener(closeOnDesktop);
  }

  var hasIO = 'IntersectionObserver' in window;

  /* ---------- Active nav link ---------- */
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]')) : [];
  if (hasIO && navLinks.length) {
    var linkFor = {};
    navLinks.forEach(function (a) { linkFor[a.getAttribute('href').slice(1)] = a; });

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.remove('is-active');
          a.removeAttribute('aria-current');
        });
        var link = linkFor[entry.target.id];
        if (link) {
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'location');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    Object.keys(linkFor).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });

    // Clear the highlight while the hero is in view.
    var hero = document.querySelector('.hero');
    if (hero) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          navLinks.forEach(function (a) {
            a.classList.remove('is-active');
            a.removeAttribute('aria-current');
          });
        }
      }, { rootMargin: '-45% 0px -50% 0px' }).observe(hero);
    }
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (!hasIO || reduceMotion.matches) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    // Stagger siblings that share a parent (card grids, process steps).
    revealEls.forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
        return c.classList.contains('reveal');
      });
      var index = siblings.indexOf(el);
      if (siblings.length > 1 && index > 0) {
        el.style.transitionDelay = Math.min(index, 5) * 80 + 'ms';
      }
    });

    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-visible');
        obs.unobserve(el);
        // Drop the stagger delay afterwards so hover transitions stay snappy.
        window.setTimeout(function () { el.style.transitionDelay = ''; }, 1200);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Hero network canvas ---------- */
  var canvas = document.getElementById('hero-canvas');
  var heroEl = canvas ? canvas.closest('.hero') : null;
  var ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;

  if (ctx && heroEl) {
    var LINK = 140;
    var LINK_SQ = LINK * LINK;
    var POINTER_LINK_SQ = 180 * 180;
    var width = 0;
    var height = 0;
    var nodes = [];
    var rafId = null;
    var inView = true;
    var pointer = { x: 0, y: 0, active: false };

    var seed = function (count) {
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.32,
          vy: (Math.random() - 0.5) * 0.32,
          r: Math.random() * 1.5 + 0.8,
          accent: Math.random() < 0.14
        });
      }
    };

    var resize = function () {
      var rect = heroEl.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed(Math.max(26, Math.min(80, Math.round((width * height) / 16000))));
      draw();
    };

    var step = function () {
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }
    };

    var draw = function () {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;

      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j];
          var dx = a.x - b.x;
          var dy = a.y - b.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < LINK_SQ) {
            var alpha = (1 - d2 / LINK_SQ) * 0.28;
            ctx.strokeStyle = 'rgba(110, 160, 225, ' + alpha.toFixed(3) + ')';
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        if (pointer.active) {
          var px = a.x - pointer.x;
          var py = a.y - pointer.y;
          var p2 = px * px + py * py;
          if (p2 < POINTER_LINK_SQ) {
            var pa = (1 - p2 / POINTER_LINK_SQ) * 0.45;
            ctx.strokeStyle = 'rgba(247, 147, 26, ' + pa.toFixed(3) + ')';
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }

      for (var k = 0; k < nodes.length; k++) {
        var n = nodes[k];
        ctx.fillStyle = n.accent ? 'rgba(247, 147, 26, 0.9)' : 'rgba(156, 200, 245, 0.75)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    var frame = function () {
      step();
      draw();
      rafId = window.requestAnimationFrame(frame);
    };

    var start = function () {
      if (rafId || reduceMotion.matches || !inView || document.hidden) return;
      rafId = window.requestAnimationFrame(frame);
    };
    var stop = function () {
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = null;
    };

    resize();
    start();

    if ('ResizeObserver' in window) {
      var resizeTimer = null;
      new ResizeObserver(function () {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(resize, 120);
      }).observe(heroEl);
    } else {
      window.addEventListener('resize', resize);
    }

    if (hasIO) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView) start(); else stop();
      }).observe(heroEl);
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    var onMotionChange = function () {
      if (reduceMotion.matches) {
        stop();
        pointer.active = false;
        draw();
      } else {
        start();
      }
    };
    if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', onMotionChange);
    else if (reduceMotion.addListener) reduceMotion.addListener(onMotionChange);

    heroEl.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' || reduceMotion.matches) return;
      var rect = heroEl.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    });
    heroEl.addEventListener('pointerleave', function () { pointer.active = false; });
  }
})();
