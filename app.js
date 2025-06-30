// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Add js-enabled class to body
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('js-enabled');
    console.log("Project cards found:", document.querySelectorAll('.project-card').length);
});

// Custom cursor
// const cursor = document.querySelector('.cursor');
// document.addEventListener('mousemove', (e) => {
//     gsap.to(cursor, {
//         x: e.clientX,
//         y: e.clientY,
//         duration: 0.1,
//         ease: "power2.out"
//     });
// });

document.addEventListener('mouseenter', () => {
    gsap.to(cursor, { opacity: 1, duration: 0.3 });
});

document.addEventListener('mouseleave', () => {
    gsap.to(cursor, { opacity: 0, duration: 0.3 });
});

// Mobile menu toggle
document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
    const isActive = document.querySelector('.nav-links').classList.contains('active');
    document.querySelector('.menu-toggle').textContent = isActive ? '✕' : '☰';
});

// Theme toggle
document.querySelector('.theme-toggle').addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.querySelector('.theme-toggle').textContent = currentTheme === 'light' ? '🌙' : '☀';
});

// Header hide/show on scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const header = document.querySelector('header');
    const isMenuActive = document.querySelector('.nav-links').classList.contains('active');

    if (isMenuActive) return;

    if (currentScroll > lastScroll && currentScroll > 100) {
        gsap.to(header, {
            y: '-100%',
            duration: 0.3,
            ease: 'power2.out'
        });
    } else if (currentScroll < lastScroll) {
        gsap.to(header, {
            y: '0%',
            duration: 0.3,
            ease: 'power2.out'
        });
    }
    lastScroll = currentScroll;
});

// Floating elements animation
gsap.to('.floating-element', {
    y: -30,
    duration: 3,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1,
    stagger: 0.5
});

// Header animation
gsap.to('header', {
    y: 0,
    duration: 1,
    ease: "power3.out",
    delay: 0.5
});

// Hero section animations
const tl = gsap.timeline();
tl.to('.hero-content h1', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power3.out"
})
    .to('.hero-content .subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.5")
    .to('.hero-content .description', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.3")
    .to('.hero-content .cta-button', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.3");

// Typing effect for subtitle
gsap.to('.hero-content .subtitle', {
    text: "Fresher Backend Developer",
    duration: 2,
    ease: "power2.inOut",
    delay: 1
});

// Sections scroll animations
gsap.utils.toArray('.section').forEach((section) => {
    gsap.to(section, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        }
    });
});

// FIXED: Batch animations for skill cards, experience items, and project cards
// Set initial state first, then animate to visible state
gsap.set(".skill-card, .experience-item, .project-card", {
    opacity: 0,
    y: 50,
    scale: 0.8
});

ScrollTrigger.batch(".skill-card, .experience-item, .project-card", {
    onEnter: (elements) => {
        gsap.to(elements, {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.1,
            duration: 1,
            ease: "power3.out"
        });
    },
    onLeave: (elements) => {
        gsap.to(elements, {
            opacity: 0.3,
            duration: 0.5
        });
    },
    onEnterBack: (elements) => {
        gsap.to(elements, {
            opacity: 1,
            duration: 0.5
        });
    },
    start: "top 90%",
    end: "bottom 10%",
    toggleActions: "play none none reverse"
});

// Form fields animation
gsap.utils.toArray('.form-group').forEach((group, index) => {
    gsap.to(group, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        delay: index * 0.1,
        scrollTrigger: {
            trigger: group,
            start: "top 90%",
            toggleActions: "play none none reverse"
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Parallax effect for hero section
gsap.to('.hero-content', {
    yPercent: -50,
    ease: "none",
    scrollTrigger: {
        trigger: '.hero',
        start: "top bottom",
        end: "bottom top",
        scrub: true
    }
});

// Button hover animations
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('mouseenter', () => {
        gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    button.addEventListener('mouseleave', () => {
        gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });
});

// Form submission with EmailJS
emailjs.init("YOUR_USER_ID"); // Replace with your EmailJS user ID
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const button = this.querySelector('.cta-button');
    const originalText = button.textContent;

    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
        .then(() => {
            gsap.to(button, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    button.textContent = 'Message Sent!';
                    gsap.to(button, {
                        backgroundColor: '#27ae60',
                        duration: 0.3,
                        onComplete: () => {
                            setTimeout(() => {
                                button.textContent = originalText;
                                gsap.to(button, {
                                    backgroundColor: 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))',
                                    duration: 0.3
                                });
                            }, 2000);
                        }
                    });
                }
            });
            this.reset();
        }, (error) => {
            alert('Failed to send message: ' + error.text);
        });
});

// Skills hover effect
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            y: -10,
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            duration: 0.3,
            ease: "power2.out"
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            y: 0,
            boxShadow: "0 0px 0px rgba(0,0,0,0)",
            duration: 0.3,
            ease: "power2.out"
        });
    });
});

// Project cards hover effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            scale: 1.02,
            y: -5,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
        });
    });
});

// Social links hover animations
document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(link, {
            y: -3,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    link.addEventListener('mouseleave', () => {
        gsap.to(link, {
            y: 0,
            duration: 0.3,
            ease: "power2.out"
        });
    });
});

// GitHub and LinkedIn buttons hover effect
document.querySelectorAll('a[href*="github"], a[href*="linkedin"]').forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(link, {
            scale: 1.05,
            y: -2,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    link.addEventListener('mouseleave', () => {
        gsap.to(link, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
        });
    });
});

// Loading animation on page load
window.addEventListener('load', () => {
    gsap.timeline()
        .from('body', { opacity: 0, duration: 0.5 })
        .from('.floating-element', {
            scale: 0,
            duration: 1,
            stagger: 0.2,
            ease: "back.out(1.7)"
        }, "-=0.3");
});

// Refresh ScrollTrigger on window resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});