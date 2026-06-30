/* ═══════════════════════════════════════════════════════════════
   ADITYA PAGARE — PORTFOLIO BEHAVIOR LAYER
   Scroll reveals, counters, progress bars, nav, contact form
   ═══════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  // ─── NAVBAR ───
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('.section, .hero');

  // Scroll: add .scrolled class to navbar
  let lastScrollY = 0;
  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // init

  // Mobile menu toggle
  navToggle.addEventListener('click', function() {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  navAnchors.forEach(function(anchor) {
    anchor.addEventListener('click', function() {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Active nav link highlighting on scroll
  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    let current = '';

    sections.forEach(function(section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navAnchors.forEach(function(a) {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) {
        a.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav(); // init

  // ─── SCROLL REVEAL (IntersectionObserver) ───
  const revealClasses = [
    'reveal', 'reveal-left', 'reveal-right',
    'reveal-scale', 'reveal-flip', 'reveal-drop', 'reveal-spring'
  ];

  const revealSelector = revealClasses.map(function(c) { return '.' + c; }).join(',');

  // Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Don't unobserve — we want one-time reveal only
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    document.querySelectorAll(revealSelector).forEach(function(el) {
      revealObserver.observe(el);
    });
  } else {
    // If reduced motion, reveal everything immediately
    document.querySelectorAll(revealSelector).forEach(function(el) {
      el.classList.add('revealed');
    });
  }

  // ─── SKILL PROGRESS BARS ───
  const skillCards = document.querySelectorAll('.skill-card');
  let skillsAnimated = false;

  const skillObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !skillsAnimated) {
        skillsAnimated = true;
        animateSkills();
        skillObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });

  skillCards.forEach(function(card) {
    skillObserver.observe(card);
  });

  function animateSkills() {
    const progressFills = document.querySelectorAll('.skill-progress-fill');
    const percentages = document.querySelectorAll('.skill-percentage');

    progressFills.forEach(function(fill, index) {
      const target = parseInt(fill.getAttribute('data-progress'), 10);
      // Stagger the start
      setTimeout(function() {
        fill.style.width = target + '%';
      }, index * 150);
    });

    percentages.forEach(function(pct, index) {
      const target = parseInt(pct.getAttribute('data-target'), 10);
      setTimeout(function() {
        animateCounter(pct, 0, target, 1200, '%');
      }, index * 150);
    });
  }

  // ─── STAT COUNTERS ───
  const statCounters = document.querySelectorAll('.counter');
  let statsAnimated = false;

  const statObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statCounters.forEach(function(counter, index) {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          setTimeout(function() {
            animateCounter(counter, 0, target, 1500, '');
          }, index * 200);
        });
        statObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  statCounters.forEach(function(counter) {
    statObserver.observe(counter);
  });

  // Generic counter animation
  function animateCounter(element, start, end, duration, suffix) {
    const range = end - start;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(start + range * eased);
      element.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ─── CONTACT FORM ───
  window.handleContactSubmit = function(event) {
    event.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !subject || !message) return false;

    // Construct mailto link
    const body = 'From: ' + name + '\nEmail: ' + email + '\n\n' + message;
    const mailtoLink = 'mailto:adityapaagare619@gmail.com'
      + '?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body);

    window.location.href = mailtoLink;

    // Visual feedback
    var btn = document.getElementById('btn-send-message');
    var originalText = btn.innerHTML;
    btn.innerHTML = '✓ Opening Mail Client...';
    btn.style.background = 'linear-gradient(135deg, #5B8FA8, #72A8C4)';

    setTimeout(function() {
      btn.innerHTML = originalText;
      btn.style.background = '';
    }, 3000);

    return false;
  };

  // ─── SEND BUTTON PULSE on load (after form renders) ───
  const contactSection = document.getElementById('contact');
  const sendPulseObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        setTimeout(function() {
          var btn = document.getElementById('btn-send-message');
          if (btn) {
            btn.style.animation = 'pulseGlow 1.5s ease-in-out 1';
            setTimeout(function() {
              btn.style.animation = '';
            }, 1500);
          }
        }, 1200);
        sendPulseObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  if (contactSection) {
    sendPulseObserver.observe(contactSection);
  }

  // ─── SMOOTH SCROLL POLYFILL for older browsers ───
  // Modern browsers support scroll-behavior: smooth in CSS
  // This JS fallback handles programmatic scrolling
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        // Update URL without scroll jump
        history.pushState(null, null, targetId);
      }
    });
  });

  // ─── PARALLAX LITE on hero circuit background ───
  var heroBg = document.querySelector('.hero-bg img');
  if (heroBg && !prefersReducedMotion) {
    window.addEventListener('scroll', function() {
      var scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBg.style.transform = 'translateY(' + (scrollY * 0.3) + 'px) scale(1.1)';
      }
    }, { passive: true });
  }

  // ─── TECH PILL hover sound-like effect (visual micro-feedback) ───
  document.querySelectorAll('.tech-pill').forEach(function(pill) {
    pill.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.08)';
    });
    pill.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });

  // ─── OUTCOME BOXES stagger animation on hover ───
  document.querySelectorAll('.outcome-box').forEach(function(box) {
    box.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px)';
    });
    box.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });

  // ─── TYPING EFFECT for education highlights ───
  // Adds a subtle left-border reveal on each education bullet
  var eduHighlights = document.querySelectorAll('.edu-highlights li');
  var eduObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'all 600ms cubic-bezier(0.16, 1, 0.3, 1)';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
      }
    });
  }, { threshold: 0.2 });

  eduHighlights.forEach(function(li) {
    if (!prefersReducedMotion) {
      li.style.opacity = '0';
      li.style.transform = 'translateX(-20px)';
    }
    eduObserver.observe(li);
  });

  // ─── EXPERIENCE CARD curtain-open animation ───
  var expHeaders = document.querySelectorAll('.exp-card-header');
  var expObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        // Animate the left amber border (curtain effect)
        var before = entry.target.querySelector('::before');
        entry.target.style.animation = 'curtainOpen 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards';
      }
    });
  }, { threshold: 0.3 });

  expHeaders.forEach(function(header) {
    expObserver.observe(header);
  });

  // ─── CONSOLE GREETING ───
  console.log(
    '%c⚙️ Aditya Pagare — Portfolio',
    'color: #F2A65A; font-size: 16px; font-weight: bold; font-family: "Space Grotesk", sans-serif;'
  );
  console.log(
    '%cHardware-first. Constraint-driven. Built to survive contact with the real world.',
    'color: #5B8FA8; font-size: 12px; font-family: "JetBrains Mono", monospace;'
  );
  console.log(
    '%cView source: github.com/AdityaPagare619',
    'color: #A8A5A0; font-size: 11px;'
  );

})();
