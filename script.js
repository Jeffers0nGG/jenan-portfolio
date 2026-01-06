// ========================================
// PORTFOLIO WEBSITE JAVASCRIPT
// Author: Jenan Jefferson Acio
// ========================================

// ========================================
// SMOOTH SCROLLING
// ========================================

/**
 * Initialize smooth scrolling for navigation links
 * Handles click events on nav links and scrolls to target sections smoothly
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
    
    // Smooth scroll for hero buttons
    const heroButtons = document.querySelectorAll('.hero-buttons a, .scroll-indicator a');
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// STICKY NAVIGATION BAR
// ========================================

/**
 * Add/remove shadow effect on navbar when scrolling
 * Shows navbar after scrolling past hero section
 */
function initStickyNavbar() {
    const navbar = document.getElementById('navbar');
    const heroSection = document.getElementById('home');
    
    window.addEventListener('scroll', function() {
        const heroHeight = heroSection.offsetHeight;
        
        // Show navbar after scrolling past hero section
        if (window.scrollY > heroHeight - 100) {
            navbar.classList.add('visible');
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('visible');
            navbar.classList.remove('scrolled');
        }
    });
}

// ========================================
// MOBILE NAVIGATION TOGGLE
// ========================================

/**
 * Handle mobile navigation menu toggle
 * Opens/closes mobile menu when hamburger icon is clicked
 */
function initMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger icon
        this.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

/**
 * Animate elements on scroll
 * Elements fade in and slide up when they enter the viewport
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    const elementsToAnimate = document.querySelectorAll(
        '.project-card, .skill-category, .activity-card, .timeline-item, .affiliation-item'
    );
    
    elementsToAnimate.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });
}

// ========================================
// ACTIVE NAVIGATION HIGHLIGHT
// ========================================

/**
 * Highlight active navigation link based on scroll position
 * Updates active state of nav links as user scrolls through sections
 */
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ========================================
// CONTACT FORM HANDLING
// ========================================

/**
 * Handle contact form submission
 * Validates form data and sends email using EmailJS
 * Emails will be sent to: aciojenan@gmail.com and qjjaacio@tip.edu.ph
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Basic validation
        if (!name || !email || !message) {
            showFormMessage('Please fill in all fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Disable submit button and show loading state
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Send email using EmailJS
        // Template parameters
        const templateParams = {
            from_name: name,
            from_email: email,
            message: message,
            to_email: 'aciojenan@gmail.com, qjjaacio@tip.edu.ph'
        };
        
        // Replace 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', and 'YOUR_PUBLIC_KEY' with your EmailJS credentials
        emailjs.send('service_qdx72pr', 'template_h3i8gyo', templateParams, 'Y0c3-BIlgy3SA6PeR')
            .then(function(response) {
                console.log('Email sent successfully!', response.status, response.text);
                showFormMessage(
                    `Thank you, ${name}! Your message has been sent successfully. I'll get back to you soon at ${email}.`,
                    'success'
                );
                
                // Reset form
                contactForm.reset();
                
                // Hide message after 7 seconds
                setTimeout(() => {
                    hideFormMessage();
                }, 7000);
            }, function(error) {
                console.error('Failed to send email:', error);
                showFormMessage(
                    'Sorry, there was an error sending your message. Please try again or email me directly at aciojenan@gmail.com',
                    'error'
                );
            })
            .finally(function() {
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            });
    });
}

/**
 * Display form message (success or error)
 * @param {string} message - Message to display
 * @param {string} type - Message type ('success' or 'error')
 */
function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
}

/**
 * Hide form message
 */
function hideFormMessage() {
    const formMessage = document.getElementById('formMessage');
    formMessage.className = 'form-message';
    formMessage.textContent = '';
}

/**
 * Validate email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ========================================
// PROJECT CARD HOVER EFFECTS
// ========================================

/**
 * Add enhanced hover effects to project cards
 * Adds subtle tilt effect on mouse move
 */
function initProjectCardEffects() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.1s ease';
        });
        
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.3s ease';
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ========================================
// TYPING EFFECT FOR HERO SECTION
// ========================================

/**
 * Add typing effect to hero title (optional enhancement)
 * Creates a typewriter animation for the hero title
 */
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.opacity = '1';
    
    let charIndex = 0;
    
    function typeChar() {
        if (charIndex < originalText.length) {
            heroTitle.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeChar, 50);
        }
    }
    
    // Start typing after initial fade-in animation
    setTimeout(typeChar, 1200);
}



// ========================================
// PERFORMANCE: LAZY LOADING IMAGES
// ========================================

/**
 * Initialize lazy loading for images
 * Improves page load performance by loading images only when needed
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ========================================
// UTILITIES
// ========================================

/**
 * Debounce function to limit how often a function can fire
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to limit function execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================================
// PRELOADER (Optional)
// ========================================

/**
 * Initialize page preloader
 * Shows loading animation until page is fully loaded
 */
function initPreloader() {
    // Create preloader element
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    document.body.insertBefore(preloader, document.body.firstChild);
    
    // Add preloader styles
    const style = document.createElement('style');
    style.textContent = `
        .preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--background);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }
        
        .preloader.hidden {
            opacity: 0;
            visibility: hidden;
        }
        
        .preloader-content {
            text-align: center;
        }
        
        .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid var(--border-color);
            border-top-color: var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Hide preloader when page is loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 500);
    });
}

// ========================================
// INITIALIZE ALL FEATURES
// ========================================

/**
 * Initialize all website features when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio website initialized - Jenan Jefferson Acio');
    
    // Core features
    initSmoothScrolling();
    initStickyNavbar();
    initMobileNavigation();
    initActiveNavigation();
    initContactForm();
    
    // Visual enhancements
    initScrollAnimations();
    initProjectCardEffects();
    
    // Optional features
    // initTypingEffect(); // Uncomment to enable typing effect
    // initPreloader(); // Uncomment to enable preloader
    
    // Lazy loading (if images are added later)
    initLazyLoading();
});

// ========================================
// WINDOW LOAD EVENT
// ========================================

/**
 * Actions to perform after all resources are loaded
 */
window.addEventListener('load', function() {
    console.log('All resources loaded successfully');
});

// ========================================
// EXPORT FOR TESTING (Optional)
// ========================================

// Export functions if needed for testing or module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initSmoothScrolling,
        initStickyNavbar,
        initMobileNavigation,
        initScrollAnimations,
        initActiveNavigation,
        initContactForm,
        isValidEmail,
        debounce,
        throttle
    };
}
