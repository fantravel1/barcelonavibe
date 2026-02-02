/**
 * BarcelonaVibe.com - Main JavaScript
 * Mobile-First Interactive Features
 */

(function() {
  'use strict';

  // DOM Ready
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNavigation();
    initFAQ();
    initSmoothScroll();
    initScrollHeader();
    initLazyLoad();
    initHeroVideo();
  }

  /**
   * Mobile Navigation Toggle
   */
  function initNavigation() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', function() {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

      toggle.setAttribute('aria-expanded', !isExpanded);
      toggle.classList.toggle('active');
      menu.classList.toggle('active');

      // Prevent body scroll when menu is open
      document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    menu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('active');
        menu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('active');
        menu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /**
   * FAQ Accordion
   */
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function(item) {
      const question = item.querySelector('.faq-question');

      if (!question) return;

      question.addEventListener('click', function() {
        const isActive = item.classList.contains('active');

        // Close all other items
        faqItems.forEach(function(otherItem) {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherQuestion = otherItem.querySelector('.faq-question');
            if (otherQuestion) {
              otherQuestion.setAttribute('aria-expanded', 'false');
            }
          }
        });

        // Toggle current item
        item.classList.toggle('active');
        question.setAttribute('aria-expanded', !isActive);
      });
    });
  }

  /**
   * Smooth Scroll for Anchor Links
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');

        if (targetId === '#' || targetId === '#main') {
          return; // Let skip links work naturally
        }

        const target = document.querySelector(targetId);

        if (target) {
          e.preventDefault();

          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * Header Scroll Effects
   */
  function initScrollHeader() {
    const header = document.querySelector('.header');

    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
      const scrollY = window.scrollY;

      // Add/remove scrolled class
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Hide/show header on scroll direction (optional enhancement)
      // Uncomment if you want the header to hide on scroll down
      /*
      if (scrollY > lastScrollY && scrollY > 100) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      */

      lastScrollY = scrollY;
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    });
  }

  /**
   * Hero Video Background with Sound Toggle
   */
  function initHeroVideo() {
    const soundToggle = document.querySelector('.video-sound-toggle');
    const videoIframe = document.getElementById('hero-video');

    if (!soundToggle || !videoIframe) return;

    let isMuted = true;
    let player = null;

    // Initialize YouTube API
    function onYouTubeIframeAPIReady() {
      player = new YT.Player('hero-video', {
        events: {
          'onReady': function(event) {
            event.target.mute();
            event.target.playVideo();
          }
        }
      });
    }

    // Load YouTube API if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    } else if (window.YT && window.YT.Player) {
      onYouTubeIframeAPIReady();
    }

    // Sound toggle button
    soundToggle.addEventListener('click', function() {
      if (player && player.isMuted) {
        if (isMuted) {
          player.unMute();
          player.setVolume(50);
          soundToggle.classList.add('unmuted');
          soundToggle.setAttribute('title', 'Mute video');
        } else {
          player.mute();
          soundToggle.classList.remove('unmuted');
          soundToggle.setAttribute('title', 'Unmute video');
        }
        isMuted = !isMuted;
      } else {
        // Fallback: manipulate iframe src
        const src = videoIframe.src;
        if (isMuted) {
          videoIframe.src = src.replace('mute=1', 'mute=0');
          soundToggle.classList.add('unmuted');
          soundToggle.setAttribute('title', 'Mute video');
        } else {
          videoIframe.src = src.replace('mute=0', 'mute=1');
          soundToggle.classList.remove('unmuted');
          soundToggle.setAttribute('title', 'Unmute video');
        }
        isMuted = !isMuted;
      }
    });
  }

  /**
   * Lazy Loading for Images
   */
  function initLazyLoad() {
    // Native lazy loading is supported, but add intersection observer for placeholders
    if ('IntersectionObserver' in window) {
      const lazyImages = document.querySelectorAll('img[data-src]');

      const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      lazyImages.forEach(function(img) {
        imageObserver.observe(img);
      });
    }
  }

  /**
   * Theme Toggle (Dark/Light Mode)
   */
  function initThemeToggle() {
    const toggle = document.querySelector('.theme-toggle');

    if (!toggle) return;

    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
      document.documentElement.classList.remove('dark-mode');
    }

    toggle.addEventListener('click', function() {
      document.documentElement.classList.toggle('dark-mode');
      const isDark = document.documentElement.classList.contains('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  /**
   * Category Pills Active State
   */
  function initCategoryPills() {
    const pillContainers = document.querySelectorAll('.category-pills');

    pillContainers.forEach(function(container) {
      const pills = container.querySelectorAll('.category-pill');

      pills.forEach(function(pill) {
        pill.addEventListener('click', function(e) {
          // Only prevent default if it's a filter action, not a link
          if (this.getAttribute('data-filter')) {
            e.preventDefault();

            pills.forEach(function(p) {
              p.classList.remove('active');
            });

            this.classList.add('active');

            // Trigger filter action
            const filter = this.getAttribute('data-filter');
            filterContent(filter, container.closest('section'));
          }
        });
      });
    });
  }

  /**
   * Content Filtering
   */
  function filterContent(filter, section) {
    if (!section) return;

    const items = section.querySelectorAll('[data-category]');

    items.forEach(function(item) {
      if (filter === 'all' || item.getAttribute('data-category') === filter) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }

  /**
   * Intersection Observer for Animations
   */
  function initAnimations() {
    if (!('IntersectionObserver' in window)) return;

    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(function(el) {
      observer.observe(el);
    });
  }

  /**
   * Handle External Links
   */
  function initExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(function(link) {
      if (!link.href.includes(window.location.hostname)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  /**
   * Performance: Debounce function
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    };
  }

  /**
   * Performance: Throttle function
   */
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const context = this;
      const args = arguments;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(function() {
          inThrottle = false;
        }, limit);
      }
    };
  }

})();
