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

  /* --- CONTACT FORM HANDLING (SMART HYBRID & FALLBACK INTEGRATION) --- */
  const contactForm = document.getElementById('contact-form');
  const formSubmitBtn = document.getElementById('form-submit-btn');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formSubmitBtn && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const messageInput = document.getElementById('form-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !message) {
        formStatus.textContent = 'Please complete all form fields.';
        formStatus.className = 'form-status error';
        return;
      }

      // Update button state to sending
      formSubmitBtn.disabled = true;
      const btnText = formSubmitBtn.querySelector('span');
      const originalText = btnText ? btnText.textContent : 'Send Message';
      if (btnText) btnText.textContent = 'Sending...';
      
      formStatus.textContent = '';
      formStatus.className = 'form-status';

      // Check if browsing as direct local HTML file (file://)
      const isLocalFile = window.location.protocol === 'file:';

      if (isLocalFile) {
        // When running locally from file://, submit via standard POST to avoid browser file origin restrictions
        formStatus.textContent = 'Submitting message to darma.darma2506@gmail.com...';
        formStatus.className = 'form-status success';
        
        setTimeout(() => {
          contactForm.submit();
        }, 600);
        return;
      }

      // When running on a web server (localhost, Live Server, GitHub Pages, Vercel, etc.)
      const formData = new FormData(contactForm);

      try {
        const response = await fetch('https://formsubmit.co/ajax/darma.darma2506@gmail.com', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        const data = await response.json();

        if (response.ok && (data.success === 'true' || data.success === true)) {
          // Success scenario via AJAX
          formStatus.textContent = `Thank you, ${name}! Your message has been sent directly to darma.darma2506@gmail.com.`;
          formStatus.className = 'form-status success';
          contactForm.reset();
        } else {
          // Fallback to standard form submission if AJAX response was rejected
          console.warn('AJAX rejected, falling back to direct submit:', data);
          contactForm.submit();
        }
      } catch (error) {
        // Fallback to standard form submission if network / CORS failed
        console.warn('API error, falling back to form submit:', error);
        contactForm.submit();
      } finally {
        setTimeout(() => {
          formSubmitBtn.disabled = false;
          if (btnText) btnText.textContent = originalText;
        }, 4000);

        // Clear message state after 7 seconds
        setTimeout(() => {
          formStatus.style.opacity = '0';
          setTimeout(() => {
            formStatus.className = 'form-status';
            formStatus.textContent = '';
            formStatus.style.opacity = '1';
          }, 300);
        }, 7000);
      }
    });
  }

});


