document.addEventListener('DOMContentLoaded', () => {

  /* --- MOBILE MENU TOGGLE --- */
  const menuBtn = document.getElementById('menu-btn');
  const navBar = document.getElementById('nav-bar');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuBtn && navBar) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('active');
      navBar.classList.toggle('active');
    });

    // Close menu when links are clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        navBar.classList.remove('active');
      });
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

  /* --- CONTACT FORM HANDLING --- */
  const contactForm = document.getElementById('contact-form');
  const formSubmitBtn = document.getElementById('form-submit-btn');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const message = document.getElementById('form-message').value;

      // Update state to submitting
      formSubmitBtn.disabled = true;
      const btnText = formSubmitBtn.querySelector('span');
      const originalText = btnText.textContent;
      btnText.textContent = 'Sending Message...';
      
      // Simulate form processing time
      setTimeout(() => {
        // Success scenario
        formStatus.textContent = `Thank you, ${name}! Your message has been sent successfully.`;
        formStatus.className = 'form-status success';
        
        // Reset form
        contactForm.reset();
        formSubmitBtn.disabled = false;
        btnText.textContent = originalText;
        
        // Clear message state after 5 seconds
        setTimeout(() => {
          formStatus.style.opacity = '0';
          setTimeout(() => {
            formStatus.className = 'form-status';
            formStatus.textContent = '';
            formStatus.style.opacity = '1';
          }, 300);
        }, 5000);

      }, 1500);
    });
  }

});
