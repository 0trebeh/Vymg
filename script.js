// ========================================
// Navigation
// ========================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        nav.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        nav.style.background = 'rgba(0, 0, 0, 0.8)';
    }
    
    lastScroll = currentScroll;
});

// ========================================
// Smooth Scrolling
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Gallery Slider
// ========================================
let currentSlide = 0;
const slides = document.querySelectorAll('.gallery-slide');
const totalSlides = slides.length;
const dotsContainer = document.getElementById('gallery-dots');

// Create dots
if (dotsContainer) {
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.classList.add('gallery-dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
}

function updateDots() {
    const dots = document.querySelectorAll('.gallery-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
    updateDots();
}

function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
}

function changeSlide(direction) {
    currentSlide += direction;
    
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }
    
    showSlide(currentSlide);
}

// Auto-advance gallery
let galleryInterval = setInterval(() => changeSlide(1), 5000);

// Pause on hover
const galleryContainer = document.querySelector('.gallery-container');
if (galleryContainer) {
    galleryContainer.addEventListener('mouseenter', () => {
        clearInterval(galleryInterval);
    });
    
    galleryContainer.addEventListener('mouseleave', () => {
        galleryInterval = setInterval(() => changeSlide(1), 5000);
    });
}

// Touch support for gallery
let touchStartX = 0;
let touchEndX = 0;

if (galleryContainer) {
    galleryContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    galleryContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            changeSlide(1);
        } else {
            changeSlide(-1);
        }
    }
}

// ========================================
// Scroll Progress Indicator
// ========================================
const scrollProgress = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    if (scrollProgress) {
        scrollProgress.style.width = scrollPercent + '%';
    }
});

// ========================================
// AOS (Animate On Scroll)
// ========================================
function initAOS() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

// ========================================
// Card Hover Effects
// ========================================
function initCardEffects() {
    const cards = document.querySelectorAll('.service-card, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--mouse-x', `${x}px`);
            this.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// ========================================
// Intersection Observer for Animations
// ========================================
function initScrollAnimations() {
    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    };

    const observer = new IntersectionObserver(animateOnScroll, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    document.querySelectorAll('.service-card, .testimonial-card, .about-feature').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// ========================================
// Stats Counter Animation
// ========================================
function animateStats() {
    const stats = document.querySelectorAll('.hero-stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const numericValue = parseInt(finalValue.replace(/\D/g, ''));
                const suffix = finalValue.replace(/\d/g, '');
                
                let current = 0;
                const increment = numericValue / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= numericValue) {
                        target.textContent = finalValue;
                        clearInterval(timer);
                    } else {
                        target.textContent = Math.floor(current) + suffix;
                    }
                }, 30);
                
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initAOS();
    initCardEffects();
    initScrollAnimations();
    animateStats();
});

// Preload images
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});
