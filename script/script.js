// Main JavaScript File
// Typewriter effect and scroll animations

// Typewriter Effect Class
class TypewriterEffect {
  constructor(element, delay = 50, lineDelay = 400) {
    this.element = element;
    this.delay = delay;
    this.lineDelay = lineDelay;
    this.words = element.querySelectorAll('.word');
    this.currentWordIndex = 0;
    this.onComplete = null; // Callback cuando termina la línea
  }

  async start(startDelay = 300) {
    await this.wait(startDelay);
    await this.animateWords();
    // Ejecutar callback si existe
    if (this.onComplete) {
      this.onComplete();
    }
  }

  async animateWords() {
    for (let i = 0; i < this.words.length; i++) {
      await this.revealWord(this.words[i]);
      await this.wait(this.delay);
    }
  }

  revealWord(word) {
    return new Promise((resolve) => {
      word.style.animation = 'fadeInUp 0.4s ease-out forwards';
      setTimeout(resolve, 400);
    });
  }

  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Método para agregar callback
  setOnComplete(callback) {
    this.onComplete = callback;
  }
}

// Initialize typewriter effects on page load
document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initTypewriter();
  initScrollReveal();
  initSmoothScroll();
  initMobileMenu();
});

// Initialize Typewriter Effect
function initTypewriter() {
  const lines = document.querySelectorAll('.typewriter-text');
  const annotations = document.querySelectorAll('.handwriting-annotation');

  // Configuración de tiempos (basado en tu referencia)
  const config = {
    delayBeforeStart: 500,
    delayBetweenWords: 150,
    delayBetweenLines: 400,
    highlightWords: ['estrategia', 'sistemas', 'valor', 'cliente']
  };

  let currentDelay = config.delayBeforeStart;

  lines.forEach((line, lineIndex) => {
    const text = line.getAttribute('data-text');
    const words = text.split(' ');

    // Limpiar contenido y crear spans para cada palabra
    line.innerHTML = '';
    words.forEach((word, wordIndex) => {
      const span = document.createElement('span');
      span.className = 'word';

      // Verificar si la palabra debe estar destacada
      const cleanWord = word.toLowerCase().replace(/[.,]/g, '');
      if (config.highlightWords.includes(cleanWord)) {
        span.classList.add('highlight');
      }

      span.textContent = word;
      line.appendChild(span);

      // Añadir espacio excepto después de la última palabra
      if (wordIndex < words.length - 1) {
        line.appendChild(document.createTextNode(' '));
      }
    });

    // Programar la aparición de la línea
    setTimeout(() => {
      line.classList.add('typing');

      // Animar cada palabra
      const wordSpans = line.querySelectorAll('.word');
      wordSpans.forEach((span, wordIndex) => {
        setTimeout(() => {
          span.classList.add('show');
        }, wordIndex * config.delayBetweenWords);
      });

      // Mostrar anotación correspondiente después de completar la línea
      if (annotations[lineIndex]) {
        setTimeout(() => {
          annotations[lineIndex].classList.add('revealed');
        }, (wordSpans.length * config.delayBetweenWords) + 200);
      }
    }, currentDelay);

    // Calcular delay para la siguiente línea
    currentDelay += (words.length * config.delayBetweenWords) + config.delayBetweenLines;
  });
}

// Scroll Reveal Animation
class ScrollReveal {
  constructor() {
    this.elements = document.querySelectorAll('.scroll-reveal');
    this.observerOptions = {
      root: null,
      threshold: 0.15,
      rootMargin: '0px'
    };

    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      this.observerOptions
    );

    this.init();
  }

  init() {
    this.elements.forEach((element) => {
      this.observer.observe(element);
    });
  }

  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        this.observer.unobserve(entry.target);
      }
    });
  }
}

// Initialize Scroll Reveal
function initScrollReveal() {
  // Add scroll-reveal class to elements that should animate on scroll
  const revealElements = [
    '.help-card',
    '.timeline-item',
    '.education-item',
    '.skill-item',
    '.language-item'
  ];

  revealElements.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
      element.classList.add('scroll-reveal');
      // Add stagger delay
      element.style.transitionDelay = `${index * 0.1}s`;
    });
  });

  // Initialize the scroll reveal observer
  new ScrollReveal();
}

// Smooth Scroll for Navigation Links
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const headerOffset = 80;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Optional: Add active state to navigation on scroll
function initNavActiveState() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (window.pageYOffset >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// Mobile Menu Toggle
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navOverlay = document.querySelector('.nav-overlay');
  const navLinks = document.querySelectorAll('.nav-menu a');

  if (!hamburger || !navMenu || !navOverlay) return;

  // Toggle menu
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    navOverlay.classList.toggle('active');

    // Prevent body scroll when menu is open
    document.body.style.overflow = hamburger.classList.contains('active') ? 'hidden' : '';

    // Update aria-expanded
    const isExpanded = hamburger.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isExpanded);
  });

  // Close menu when clicking overlay
  navOverlay.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  });

  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// Initialize nav active state
document.addEventListener('DOMContentLoaded', () => {
  initNavActiveState();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TypewriterEffect,
    ScrollReveal
  };
}

// Custom Cursor
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursor.classList.add('active');
  });
  
  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('active');
  });
  
  // Hover en elementos interactivos
  const hoverElements = document.querySelectorAll('a, button, .skill-item, .help-card');
  
  hoverElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
    });
    
    element.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
    });
  });
}