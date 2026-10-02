document.addEventListener('DOMContentLoaded', () => {

  /* --- MOBILE MENU TOGGLE --- */
  const menuBtn = document.getElementById('menu-btn');
  const navBar = document.getElementById('nav-bar');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuBtn && navBar) {
    const toggleMenu = () => {
      const isOpen = menuBtn.classList.toggle('active');
      navBar.classList.toggle('active');
      document.body.classList.toggle('menu-open', isOpen);
    };

    const closeMenu = () => {
      menuBtn.classList.remove('active');
      navBar.classList.remove('active');
      document.body.classList.remove('menu-open');
    };

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close menu when links are clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navBar.contains(e.target) && !menuBtn.contains(e.target) && navBar.classList.contains('active')) {
        closeMenu();
      }
    });

    // Close menu on resize back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navBar.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  /* --- STICKY HEADER & NAV SCROLL SPY --- */
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Sticky Header Scroll effect
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Spy active navigation highlight
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  /* --- TYPING ANIMATION --- */
  const typedTextEl = document.getElementById('typed-text');
  const words = ['UI/UX Design', 'Custom E-Commerce', 'Frontend Web Development', 'Photography', 'Videography'];
  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentWord = words[wordIdx];
    
    if (isDeleting) {
      typedTextEl.textContent = currentWord.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 50; // faster deleting
    } else {
      typedTextEl.textContent = currentWord.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 100; // normal typing
    }

    // Check typing limits
    if (!isDeleting && charIdx === currentWord.length) {
      // Pause at full word
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      typingSpeed = 500; // brief pause before next word
    }

    setTimeout(typeEffect, typingSpeed);
  }

  if (typedTextEl) {
    typeEffect();
  }

  /* --- PROJECTS FILTER LOGIC --- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Manage active state of buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || cardCategory === filterValue) {
          // Show with layout reset
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          // Hide elegantly
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  /* --- SKILLS ANIMATION (ON INTERSECTION) --- */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetPercent = bar.getAttribute('data-percentage');
        bar.style.width = targetPercent;
        skillsObserver.unobserve(bar); // Stop observing after animation triggers
      }
    });
  }, {
    threshold: 0.1
  });

  skillBars.forEach(bar => {
    skillsObserver.observe(bar);
  });

  /* --- CONTACT FORM HANDLING (ZERO-TOKEN DIRECT EMAIL INTEGRATION) --- */
  const contactForm = document.getElementById('contact-form');
  const formMailtoBtn = document.getElementById('form-mailto-btn');
  const formStatus = document.getElementById('form-status');

  const TARGET_EMAIL = 'darma.darma2506@gmail.com';

  function getFormData() {
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const messageInput = document.getElementById('form-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) {
      return null;
    }

    const subject = `[Portfolio Inquiry] Message from ${name}`;
    const body = `Hi Darma,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nSent from DarmaDev Portfolio Contact Form`;

    return { name, email, message, subject, body };
  }

  function dispatchEmail(mode) {
    const data = getFormData();

    if (!data) {
      if (formStatus) {
        formStatus.textContent = 'Please fill out all fields before sending.';
        formStatus.className = 'form-status error';
      }
      return;
    }

    if (formStatus) {
      formStatus.textContent = '';
      formStatus.className = 'form-status';
    }

    if (mode === 'gmail') {
      // Direct Gmail Web Composer URL with pre-filled recipient, subject, and body
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(TARGET_EMAIL)}&su=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.body)}`;
      
      const newTab = window.open(gmailUrl, '_blank');
      
      if (formStatus) {
        if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
          // In case popups are blocked by browser, fallback to standard window location
          window.location.href = `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.body)}`;
          formStatus.textContent = `✨ Opening email client to send message to ${TARGET_EMAIL}...`;
        } else {
          formStatus.textContent = `✨ Gmail tab opened! Your message is ready to send to ${TARGET_EMAIL}.`;
        }
        formStatus.className = 'form-status success';
      }
    } else {
      // Direct Default Mail Client (Outlook, Apple Mail, Thunderbird, etc.)
      const mailtoUrl = `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.body)}`;
      window.location.href = mailtoUrl;

      if (formStatus) {
        formStatus.textContent = `✨ Launching your default mail app to send to ${TARGET_EMAIL}...`;
        formStatus.className = 'form-status success';
      }
    }

    // Clear feedback message after 7 seconds
    setTimeout(() => {
      if (formStatus) {
        formStatus.style.opacity = '0';
        setTimeout(() => {
          formStatus.className = 'form-status';
          formStatus.textContent = '';
          formStatus.style.opacity = '1';
        }, 300);
      }
    }, 7000);
  }

  if (contactForm) {
    // Submit default triggers Gmail Web composer
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      dispatchEmail('gmail');
    });

    // Secondary button triggers default desktop/mobile mail client
    if (formMailtoBtn) {
      formMailtoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        dispatchEmail('mailto');
      });
    }
  }

});



