// DOM Elements
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.querySelector('header');
const sections = document.querySelectorAll('section');
const skillItems = document.querySelectorAll('.skill-item');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.getElementById('contact-form');

// Mobile Menu Toggle
mobileMenuBtn?.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    mobileMenuBtn.querySelector('i').classList.toggle('fa-bars');
    mobileMenuBtn.querySelector('i').classList.toggle('fa-times');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Active navigation link
function updateActiveNav() {
    const scrollPosition = window.scrollY + 100;
    
    navLinks.forEach(link => {
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const sectionTop = targetSection.offsetTop;
            const sectionHeight = targetSection.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate skill bars when skills section is visible
            if (entry.target.classList.contains('skill-item')) {
                const bar = entry.target.querySelector('[style*="width"]');
                if (bar) {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                }
            }
        }
    });
}, observerOptions);

// Observe elements for animation
sections.forEach(section => observer.observe(section));
skillItems.forEach(item => observer.observe(item));
projectCards.forEach(card => observer.observe(card));

// Typing effect for hero section
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.getElementById('accueil');
    
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Smooth scroll for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission
contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name') || contactForm.querySelector('input[type="text"]').value;
    const email = formData.get('email') || contactForm.querySelector('input[type="email"]').value;
    const message = formData.get('message') || contactForm.querySelector('textarea').value;
    
    // Simple validation
    if (!name || !email || !message) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Envoi en cours...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual implementation)
    setTimeout(() => {
        showNotification('Message envoyé avec succès!', 'success');
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
    
    // Set color based on type
    const colors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white'
    };
    
    notification.classList.add(...colors[type].split(' '));
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Project card hover effects
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Skill bar animation on scroll
function animateSkillBars() {
    skillItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !item.classList.contains('animated')) {
            item.classList.add('animated');
            const bar = item.querySelector('[style*="width"]');
            if (bar) {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            }
        }
    });
}

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Update active nav on scroll
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
    
    // Animate skill bars
    window.addEventListener('scroll', animateSkillBars);
    animateSkillBars();
    
    // Add hover effects to social links
    const socialLinks = document.querySelectorAll('.fab');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-3px) rotate(5deg)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0) rotate(0deg)';
        });
    });
    
    // Initialize typing effect for hero title (optional)
    const heroTitle = document.querySelector('#accueil h1 .text-blue-600');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 150);
    }
});

// Performance optimization - Debounce scroll events
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

// Apply debounce to scroll events
window.addEventListener('scroll', debounce(() => {
    updateActiveNav();
    animateSkillBars();
}, 100));

// Dark mode toggle (optional enhancement)
function toggleDarkMode() {
    document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
}

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
    }
});

// Console welcome message
console.log('%c🚀 Portfolio chargé avec succès!', 'color: #2563eb; font-size: 16px; font-weight: bold;');
console.log('%cBienvenue sur mon portfolio! N\'hésitez pas à explorer mes projets.', 'color: #64748b; font-size: 12px;');
