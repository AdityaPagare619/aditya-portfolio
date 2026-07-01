/* ═══════════════════════════════════════════════════════════════
   ADITYA PAGARE — DIGITAL NATURALIST PORTFOLIO
   Behavior: ink-fade reveals, rule-drawing, nav, contact form
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── NAVBAR ───
  var navbar = document.getElementById('navbar');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  var navAnchors = navLinks.querySelectorAll('a');
  var sections = document.querySelectorAll('section');

  function handleScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link
    var scrollPos = window.scrollY + 140;
    var current = '';

    sections.forEach(function (section) {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        current = section.getAttribute('id');
      }
    });

    navAnchors.forEach(function (a) {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) {
        a.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile toggle
  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navAnchors.forEach(function (a) {
    a.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ─── INK-FADE REVEALS ───
  if (!prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    document.querySelectorAll('.reveal, .rule-animate').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Reduced motion: show everything immediately
    document.querySelectorAll('.reveal, .rule-animate').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ─── SMOOTH SCROLL ───
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, null, targetId);
      }
    });
  });

  // ─── CONTACT FORM ───
  window.handleContactSubmit = function (event) {
    event.preventDefault();

    var name = document.getElementById('contact-name').value.trim();
    var email = document.getElementById('contact-email').value.trim();
    var subject = document.getElementById('contact-subject').value.trim();
    var message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !subject || !message) return false;

    var body = 'From: ' + name + '\nEmail: ' + email + '\n\n' + message;
    var mailto =
      'mailto:adityapaagare619@gmail.com' +
      '?subject=' +
      encodeURIComponent(subject) +
      '&body=' +
      encodeURIComponent(body);

    window.location.href = mailto;

    var btn = document.getElementById('btn-send-message');
    var original = btn.textContent;
    btn.textContent = 'Opening mail client...';
    setTimeout(function () {
      btn.textContent = original;
    }, 3000);

    return false;
  };

  // ─── CONSOLE ───
  console.log(
    '%cAditya Pagare — Portfolio',
    'font-family: Georgia, serif; font-size: 14px; color: #8B4513;'
  );
  console.log(
    '%cHardware-first. Constraint-driven.',
    'font-family: Georgia, serif; font-size: 11px; color: #9C8B7A;'
  );
})();
