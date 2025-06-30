// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Add js-enabled class to body
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('js-enabled');
    console.log("Project cards found:", document.querySelectorAll('.project-card').length);
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
        gsap.to(header, { y: '-100%', duration: 0.3, ease: 'power2.out' });
    } else if (currentScroll < lastScroll) {
        gsap.to(header, { y: '0%', duration: 0.3, ease: 'power2.out' });
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
gsap.to('header', { y: 0, duration: 1, ease: "power3.out", delay: 0.5 });

// Hero section animations
const tl = gsap.timeline();
tl.to('.hero-content h1', { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
    .to('.hero-content .subtitle', { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
    .to('.hero-content .description', { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.3")
    .to('.hero-content .cta-button', { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.3");

// Typing effect for subtitle
gsap.to('.hero-content .subtitle', {
    text: "Fresher Backend Developer",
    duration: 2,
    ease: "power2.inOut",
    delay: 1
});

// Enhanced scroll animations for sections with full directional support
gsap.utils.toArray('.section').forEach((section) => {
    gsap.set(section, { y: 100, opacity: 0 });

    ScrollTrigger.create({
        trigger: section,
        start: "top 85%",
        end: "bottom 15%",
        onEnter: () => {
            gsap.to(section, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out"
            });
        },
        onLeave: () => {
            gsap.to(section, {
                y: -50,
                opacity: 0.6,
                duration: 0.6,
                ease: "power2.out"
            });
        },
        onEnterBack: () => {
            gsap.to(section, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out"
            });
        },
        onLeaveBack: () => {
            gsap.to(section, {
                y: 100,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out"
            });
        }
    });
});

// Enhanced batch animations with full scroll direction support
gsap.set(".skill-card, .experience-item, .project-card, .certificate-card", {
    opacity: 0,
    y: 80,
    scale: 0.8
});

ScrollTrigger.batch(".skill-card", {
    onEnter: (elements) => {
        gsap.to(elements, {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.15,
            duration: 1.2,
            ease: "back.out(1.2)"
        });
    },
    onLeave: (elements) => {
        gsap.to(elements, {
            opacity: 0.4,
            y: -30,
            scale: 0.9,
            duration: 0.5,
            stagger: 0.05
        });
    },
    onEnterBack: (elements) => {
        gsap.to(elements, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        });
    },
    onLeaveBack: (elements) => {
        gsap.to(elements, {
            opacity: 0,
            y: 80,
            scale: 0.8,
            duration: 0.6,
            stagger: 0.05
        });
    },
    start: "top 90%",
    end: "bottom 10%"
});

ScrollTrigger.batch(".experience-item", {
    onEnter: (elements) => {
        gsap.to(elements, {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.2,
            duration: 1,
            ease: "power3.out"
        });
    },
    onLeave: (elements) => {
        gsap.to(elements, {
            opacity: 0.3,
            y: -40,
            duration: 0.5,
            stagger: 0.1
        });
    },
    onEnterBack: (elements) => {
        gsap.to(elements, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        });
    },
    onLeaveBack: (elements) => {
        gsap.to(elements, {
            opacity: 0,
            y: 80,
            scale: 0.8,
            duration: 0.6,
            stagger: 0.1
        });
    },
    start: "top 90%",
    end: "bottom 10%"
});

ScrollTrigger.batch(".project-card", {
    onEnter: (elements) => {
        gsap.to(elements, {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.25,
            duration: 1.2,
            ease: "back.out(1.1)"
        });
    },
    onLeave: (elements) => {
        gsap.to(elements, {
            opacity: 0.4,
            y: -50,
            scale: 0.95,
            duration: 0.6,
            stagger: 0.1
        });
    },
    onEnterBack: (elements) => {
        gsap.to(elements, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power2.out"
        });
    },
    onLeaveBack: (elements) => {
        gsap.to(elements, {
            opacity: 0,
            y: 80,
            scale: 0.8,
            duration: 0.6,
            stagger: 0.1
        });
    },
    start: "top 90%",
    end: "bottom 10%"
});

// Certificate cards animations
ScrollTrigger.batch(".certificate-card", {
    onEnter: (elements) => {
        gsap.to(elements, {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.2,
            duration: 1.1,
            ease: "back.out(1.2)"
        });
    },
    onLeave: (elements) => {
        gsap.to(elements, {
            opacity: 0.4,
            y: -40,
            scale: 0.95,
            duration: 0.5,
            stagger: 0.1
        });
    },
    onEnterBack: (elements) => {
        gsap.to(elements, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.1,
            ease: "power2.out"
        });
    },
    onLeaveBack: (elements) => {
        gsap.to(elements, {
            opacity: 0,
            y: 80,
            scale: 0.8,
            duration: 0.6,
            stagger: 0.1
        });
    },
    start: "top 90%",
    end: "bottom 10%"
});

// Enhanced form animations with directional support
gsap.set('.form-group', { y: 50, opacity: 0 });

gsap.utils.toArray('.form-group').forEach((group, index) => {
    ScrollTrigger.create({
        trigger: group,
        start: "top 90%",
        end: "bottom 10%",
        onEnter: () => {
            gsap.to(group, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                delay: index * 0.1
            });
        },
        onLeave: () => {
            gsap.to(group, {
                y: -30,
                opacity: 0.5,
                duration: 0.5
            });
        },
        onEnterBack: () => {
            gsap.to(group, {
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: "power2.out"
            });
        },
        onLeaveBack: () => {
            gsap.to(group, {
                y: 50,
                opacity: 0,
                duration: 0.5
            });
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

// Enhanced parallax effect
gsap.to('.hero-content', {
    yPercent: -30,
    ease: "none",
    scrollTrigger: {
        trigger: '.hero',
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
        invalidateOnRefresh: true
    }
});

// Button hover animations
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('mouseenter', () => {
        gsap.to(button, { scale: 1.05, duration: 0.3, ease: "power2.out" });
    });
    button.addEventListener('mouseleave', () => {
        gsap.to(button, { scale: 1, duration: 0.3, ease: "power2.out" });
    });
});

// Form submission with EmailJS
emailjs.init("YOUR_USER_ID");
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
        gsap.to(card, { scale: 1.02, y: -5, duration: 0.3, ease: "power2.out" });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(card, { scale: 1, y: 0, duration: 0.3, ease: "power2.out" });
    });
});

// Certificate cards hover effect
document.querySelectorAll('.certificate-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            scale: 1.03,
            y: -8,
            boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
            duration: 0.3,
            ease: "power2.out"
        });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            scale: 1,
            y: 0,
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            duration: 0.3,
            ease: "power2.out"
        });
    });
});

// Social links hover animations
document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(link, { y: -3, duration: 0.3, ease: "power2.out" });
    });
    link.addEventListener('mouseleave', () => {
        gsap.to(link, { y: 0, duration: 0.3, ease: "power2.out" });
    });
});

// GitHub and LinkedIn buttons hover effect
document.querySelectorAll('a[href*="github"], a[href*="linkedin"]').forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(link, { scale: 1.05, y: -2, duration: 0.3, ease: "power2.out" });
    });
    link.addEventListener('mouseleave', () => {
        gsap.to(link, { scale: 1, y: 0, duration: 0.3, ease: "power2.out" });
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

// Better refresh handling with debounce
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});

// ScrollTrigger refresh event listener
ScrollTrigger.addEventListener("refresh", () => {
    console.log("ScrollTrigger refreshed");
});