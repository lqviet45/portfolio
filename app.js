// Language data
const translations = {
    en: {
        'hero-title': 'Le Quoc Viet',
        'hero-subtitle': 'Backend Developer',
        'hero-description': 'Passionate about building scalable backend systems with experience in microservices architecture. Currently developing a core banking platform using Java 21, Spring Boot, and Oracle, specializing in high-throughput transaction processing and distributed systems.',
        'status-available': 'Available for work',
        'cta-contact': "Let's Work Together",
        'cta-projects': 'View Projects',
        'scroll-text': 'Scroll to explore',
        'nav-about': 'About',
        'nav-skills': 'Skills',
        'nav-experience': 'Experience',
        'nav-projects': 'Projects',
        'nav-certificates': 'Certificates',
        'nav-contact': 'Contact',
        'about-title': 'About Me',
        'about-description': 'Graduated with a Bachelor\'s in Information Technology from FPT University (GPA: 7.92/10). Currently working as a Backend Developer on CoreSL — a microservices-based core banking system for Certificate of Deposit management using Java 21, Spring Boot, Oracle, and Redis. Previously built production-level backend systems at Amazing Tech across tax invoicing, water management, and construction domains.',
        'stat-experience': 'Years Experience',
        'stat-projects': 'Projects Completed',
        'stat-gpa': 'GPA Score',
        'skills-title': 'Technical Skills',
        'backend-title': 'Backend Development',
        'database-title': 'Database',
        'tools-title': 'Tools & Technologies',
        'frontend-title': 'Frontend',
        'experience-title': 'Experience',
        'exp2-title': 'Backend Developer',
        'exp2-company': 'CoreSL',
        'exp2-date': 'Present',
        'exp2-desc1': 'Developed CD issuance API with PaymentHub/T24 integration. Built CD buying API with interest-rate-based pricing formula, lot locking mechanism, and Redis-based idempotency. Developed CD selling API supporting 3 sell modes (by quantity, by amount, sell all) with a prioritization algorithm based on maturity and purchase date.',
        'exp2-desc2': 'Built Apache Airflow DAGs for automated bulk CD purchasing: 4-step pipeline with lot allocation algorithm by customer segment. Optimized DAG performance by migrating to async batch processing (aiohttp + semaphore) and moving large inter-task datasets (>2,000 records) from XCom to Redis.',
        'exp2-desc3': 'Integrated ODS (balance inquiry), PaymentHub/T24, and interest rate API via OpenFeign. Implemented distributed locking, patched security vulnerabilities in dependencies, and built configuration management APIs for buy/sell limits and interest rate tables. Deployed on Kubernetes/OpenShift.',
        'exp1-title': 'Backend Developer Intern',
        'exp1-company': 'Amazing Tech',
        'exp1-date': '9 months',
        'exp1-desc1': 'Developed a Node.js web API for creating tax invoices for businesses, integrating with Odoo for data storage and facilitating connections with the Malaysian government. Implemented robust OTP validation for enhanced security.',
        'exp1-desc2': 'Built a comprehensive water plant management system. Designed and implemented APIs for complex data queries and statistical reports with Excel export functionality. Optimized performance using Dapper and stored procedures.',
        'exp1-desc3': 'Developed a web application for tracking and managing concrete piles in construction projects. Collaborated with stakeholders to gather requirements and designed the initial database structure and feature specifications.',
        'projects-title': 'Featured Projects',
        'project1-title': 'FPTU HCM Examination Department Operation Management System',
        'project1-desc': 'A comprehensive mobile and web system for FPTU Examination Office with AI chatbot integration. Built with modern architecture patterns and real-time features.',
        'project2-title': 'Gym Management System',
        'project2-desc': 'Full-stack gym management system handling members, subscriptions, and operations with integrated payment processing and admin interface.',
        'certificates-title': 'Certificates & Achievements',
        'cert-verified': 'Verified',
        'cert1-title': 'Software Development Lifecycle',
        'cert1-issuer': 'University of Minnesota in Coursera',
        'cert1-date': '2024',
        'cert1-desc': 'Software Development Processes and Methodologies.',
        'cert2-title': 'Backend Development',
        'cert2-issuer': 'Microsoft in Coursera',
        'cert2-date': '2023',
        'cert2-desc': 'Comprehensive course covering backend development fundamentals, including databases, APIs, and server-side programming.',
        'cert3-title': 'C# Programming',
        'cert3-issuer': 'Microsoft in Coursera',
        'cert3-date': '2023',
        'cert3-desc': 'Introduction to C# programming language, covering syntax, data types, and basic programming concepts.',
        'cert-view': 'View Certificate',
        'contact-title': 'Let\'s Connect',
        'contact-subtitle': 'Ready to bring your ideas to life? Let\'s discuss your next project.',
        'contact-email-title': 'Email',
        'contact-phone-title': 'Phone',
        'contact-facebook-title': 'Facebook',
        'contact-github-title': 'GitHub',
        'form-name': 'Your Name',
        'form-email': 'Your Email',
        'form-message': 'Your Message',
        'form-submit': 'Send Message',
        'footer-text': '© 2025 Le Quoc Viet. All rights reserved.'
    },
    vi: {
        'hero-title': 'Lê Quốc Việt',
        'hero-subtitle': 'Lập Trình Viên Backend',
        'hero-description': 'Đam mê xây dựng các hệ thống backend có khả năng mở rộng với kinh nghiệm về kiến trúc microservices. Hiện đang phát triển nền tảng core banking với Java 21, Spring Boot và Oracle, chuyên về xử lý giao dịch hiệu suất cao và hệ thống phân tán.',
        'status-available': 'Sẵn sàng làm việc',
        'cta-contact': 'Hãy Cùng Làm Việc',
        'cta-projects': 'Xem Dự Án',
        'scroll-text': 'Cuộn để khám phá',
        'nav-about': 'Giới Thiệu',
        'nav-skills': 'Kỹ Năng',
        'nav-experience': 'Kinh Nghiệm',
        'nav-projects': 'Dự Án',
        'nav-certificates': 'Chứng Chỉ',
        'nav-contact': 'Liên Hệ',
        'about-title': 'Giới Thiệu Về Tôi',
        'about-description': 'Tốt nghiệp Cử nhân Công nghệ Thông tin tại Đại học FPT với GPA 7.92/10. Hiện đang làm Backend Developer trên dự án CoreSL — hệ thống core banking quản lý Chứng chỉ tiền gửi theo kiến trúc microservices, sử dụng Java 21, Spring Boot, Oracle và Redis. Trước đó đã xây dựng các hệ thống backend production tại Amazing Tech trong các lĩnh vực hóa đơn thuế, quản lý nước và xây dựng.',
        'stat-experience': 'Năm Kinh Nghiệm',
        'stat-projects': 'Dự Án Hoàn Thành',
        'stat-gpa': 'Điểm GPA',
        'skills-title': 'Kỹ Năng Kỹ Thuật',
        'backend-title': 'Backend',
        'database-title': 'Cơ Sở Dữ Liệu',
        'tools-title': 'Công Cụ & Công Nghệ',
        'frontend-title': 'Frontend',
        'experience-title': 'Kinh Nghiệm',
        'exp2-title': 'Lập Trình Viên Backend',
        'exp2-company': 'CoreSL',
        'exp2-date': 'Hiện tại',
        'exp2-desc1': 'Phát triển API phát hành chứng chỉ tiền gửi (CD) tích hợp PaymentHub/T24. Xây dựng API mua CD với công thức định giá theo lãi suất, cơ chế khóa lô và idempotency qua Redis. Phát triển API bán CD hỗ trợ 3 chế độ bán (theo số lượng, theo số tiền, bán toàn bộ) với thuật toán ưu tiên theo ngày đáo hạn và ngày mua.',
        'exp2-desc2': 'Xây dựng Apache Airflow DAGs cho quy trình mua CD hàng loạt tự động: pipeline 4 bước với thuật toán phân bổ lô theo phân khúc khách hàng. Tối ưu hiệu năng bằng cách chuyển sang xử lý bất đồng bộ theo lô (aiohttp + semaphore) và migrate dữ liệu liên task lớn (>2.000 bản ghi) từ XCom sang Redis.',
        'exp2-desc3': 'Tích hợp các hệ thống ngoài ODS (truy vấn số dư), PaymentHub/T24 và API lãi suất qua OpenFeign. Triển khai distributed locking, vá lỗi bảo mật trong các dependency, và xây dựng API quản lý cấu hình hạn mức mua/bán và bảng lãi suất. Triển khai trên Kubernetes/OpenShift.',
        'exp1-title': 'Thực Tập Sinh Backend Developer',
        'exp1-company': 'Amazing Tech',
        'exp1-date': '9 tháng',
        'exp1-desc1': 'Phát triển web API Node.js để tạo hóa đơn thuế cho doanh nghiệp, tích hợp với Odoo để lưu trữ dữ liệu và tạo kết nối với chính phủ Malaysia. Triển khai xác thực OTP mạnh mẽ để tăng cường bảo mật.',
        'exp1-desc2': 'Xây dựng hệ thống quản lý nhà máy nước toàn diện. Thiết kế và triển khai API cho các truy vấn dữ liệu phức tạp và báo cáo thống kê với chức năng xuất Excel. Tối ưu hóa hiệu suất bằng Dapper và stored procedures.',
        'exp1-desc3': 'Phát triển ứng dụng web để theo dõi và quản lý cọc bê tông trong các dự án xây dựng. Hợp tác với các bên liên quan để thu thập yêu cầu và thiết kế cấu trúc cơ sở dữ liệu ban đầu và đặc tả tính năng.',
        'projects-title': 'Dự Án Nổi Bật',
        'project1-title': 'Hệ thống quản lý hoạt động Phòng Khảo thí Đại học FPT HCM',
        'project1-desc': 'Hệ thống di động và web toàn diện cho Phòng Thi FPTU với tích hợp chatbot AI. Được xây dựng với các mẫu kiến trúc hiện đại và tính năng thời gian thực.',
        'project2-title': 'Hệ Thống Quản Lý Phòng Gym',
        'project2-desc': 'Hệ thống quản lý phòng gym full-stack xử lý thành viên, đăng ký và hoạt động với xử lý thanh toán tích hợp và giao diện quản trị.',
        'certificates-title': 'Chứng Chỉ & Thành Tích',
        'cert-verified': 'Đã Xác Minh',
        'cert1-title': 'Quy Trình Phát Triển Phần Mềm',
        'cert1-issuer': 'University of Minnesota in Coursera',
        'cert1-date': '2024',
        'cert1-desc': 'Quy trình và phương pháp phát triển phần mềm.',
        'cert2-title': 'Backend Developer',
        'cert2-issuer': 'Microsoft in Coursera',
        'cert2-date': '2023',
        'cert2-desc': 'Khóa học toàn diện về các nguyên tắc cơ bản phát triển backend, bao gồm cơ sở dữ liệu, API và lập trình phía máy chủ.',
        'cert3-title': 'Lập Trình C#',
        'cert3-issuer': 'Microsoft in Coursera',
        'cert3-date': '2023',
        'cert3-desc': 'Giới thiệu về ngôn ngữ lập trình C#, bao gồm cú pháp, kiểu dữ liệu và các khái niệm lập trình cơ bản.',
        'cert-view': 'Xem Chứng Chỉ',
        'contact-title': 'Kết Nối Với Tôi',
        'contact-subtitle': 'Sẵn sàng biến ý tưởng của bạn thành hiện thực? Hãy thảo luận về dự án tiếp theo của bạn.',
        'contact-email-title': 'Email',
        'contact-phone-title': 'Điện Thoại',
        'contact-facebook-title': 'Facebook',
        'contact-github-title': 'GitHub',
        'form-name': 'Tên Của Bạn',
        'form-email': 'Email Của Bạn',
        'form-message': 'Tin Nhắn Của Bạn',
        'form-submit': 'Gửi Tin Nhắn',
        'footer-text': '© 2025 Lê Quốc Việt. Tất cả quyền được bảo lưu.'
    }
};

// Current language
let currentLang = 'en';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializePortfolio();
});

function initializePortfolio() {
    createParticles();
    loadLanguagePreference();
    initializeAnimations();
    setupEventListeners();
    setupScrollAnimations();
}

// Create particles
function createParticles() {
    const particleContainer = document.querySelector('.particles');
    if (!particleContainer) return;

    const particleCount = window.innerWidth < 768 ? 30 : 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particleContainer.appendChild(particle);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', currentTheme);
            themeToggle.innerHTML = currentTheme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', currentTheme);
        });
    }

    // Language toggle
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'vi' : 'en';
            updateLanguage();
            updateToggleButton();
            saveLanguagePreference();
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (navLinks) navLinks.classList.remove('active');
                if (menuToggle) menuToggle.classList.remove('active');
            }
        });
    });

    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Header hide/show on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const header = document.querySelector('header');

        if (header) {
            if (currentScroll > lastScroll && currentScroll > 100) {
                gsap.to(header, { y: '-100%', duration: 0.3, ease: 'power2.out' });
            } else if (currentScroll < lastScroll) {
                gsap.to(header, { y: '0%', duration: 0.3, ease: 'power2.out' });
            }
        }

        lastScroll = currentScroll;
    });
}

// Language functions
function updateLanguage() {
    const elements = document.querySelectorAll('[data-lang]');
    elements.forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[currentLang][key]) {
            gsap.to(element, {
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                    element.textContent = translations[currentLang][key];
                    gsap.to(element, { opacity: 1, duration: 0.2 });
                }
            });
        }
    });
}

function updateToggleButton() {
    const toggleBtn = document.getElementById('lang-toggle');
    if (!toggleBtn) return;

    const flag = toggleBtn.querySelector('.flag');
    const text = toggleBtn.querySelector('.lang-text');

    if (flag && text) {
        if (currentLang === 'en') {
            flag.textContent = '🇻🇳';
            text.textContent = 'VI';
        } else {
            flag.textContent = '🇺🇸';
            text.textContent = 'EN';
        }
    }
}

function saveLanguagePreference() {
    localStorage.setItem('preferredLanguage', currentLang);
}

function loadLanguagePreference() {
    const saved = localStorage.getItem('preferredLanguage');
    const savedTheme = localStorage.getItem('theme');

    if (saved) {
        currentLang = saved;
        updateLanguage();
        updateToggleButton();
    }

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = savedTheme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        }
    }
}

// Animations
function initializeAnimations() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.warn('GSAP is not loaded');
        return;
    }

    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    // Hero animations
    const tl = gsap.timeline();
    tl.to('.hero-text h1', { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
        .to('.subtitle', { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
        .to('.description', { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.3")
        .to('.cta-button', { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.2 }, "-=0.3");

    // Typing effect for subtitle
    const subtitleElement = document.querySelector('.subtitle');
    if (subtitleElement) {
        gsap.to(subtitleElement, {
            text: currentLang === 'en' ? "Backend Developer" : "Lập Trình Viên Backend",
            duration: 2,
            ease: "power2.inOut",
            delay: 1
        });
    }

    // Floating elements animation
    gsap.to('.floating-element', {
        y: -30,
        duration: 3,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.5
    });
}

function setupScrollAnimations() {
    // Check if GSAP and ScrollTrigger are loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger is not loaded');
        return;
    }

    // Enhanced Section animations with reverse
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
                    opacity: 0.3,
                    duration: 0.5,
                    ease: "power2.in"
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
                    duration: 0.5,
                    ease: "power2.in"
                });
            }
        });
    });

    // Enhanced Skill cards animation with reverse
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
                opacity: 0.3,
                y: -30,
                scale: 0.95,
                stagger: 0.1,
                duration: 0.5,
                ease: "power2.in"
            });
        },
        onEnterBack: (elements) => {
            gsap.to(elements, {
                opacity: 1,
                y: 0,
                scale: 1,
                stagger: 0.1,
                duration: 0.8,
                ease: "back.out(1.1)"
            });
        },
        onLeaveBack: (elements) => {
            gsap.to(elements, {
                opacity: 0,
                y: 50,
                scale: 0.9,
                stagger: 0.1,
                duration: 0.5,
                ease: "power2.in"
            });
        },
        start: "top 90%",
        end: "bottom 10%"
    });

    // Enhanced Certificate cards animation with reverse
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
                opacity: 0.3,
                y: -30,
                scale: 0.95,
                stagger: 0.1,
                duration: 0.5,
                ease: "power2.in"
            });
        },
        onEnterBack: (elements) => {
            gsap.to(elements, {
                opacity: 1,
                y: 0,
                scale: 1,
                stagger: 0.15,
                duration: 0.8,
                ease: "back.out(1.1)"
            });
        },
        onLeaveBack: (elements) => {
            gsap.to(elements, {
                opacity: 0,
                y: 50,
                scale: 0.9,
                stagger: 0.1,
                duration: 0.5,
                ease: "power2.in"
            });
        },
        start: "top 90%",
        end: "bottom 10%"
    });

    // Enhanced Project cards animation with reverse
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
                opacity: 0.3,
                y: -30,
                scale: 0.95,
                stagger: 0.15,
                duration: 0.5,
                ease: "power2.in"
            });
        },
        onEnterBack: (elements) => {
            gsap.to(elements, {
                opacity: 1,
                y: 0,
                scale: 1,
                stagger: 0.2,
                duration: 0.8,
                ease: "back.out(1.1)"
            });
        },
        onLeaveBack: (elements) => {
            gsap.to(elements, {
                opacity: 0,
                y: 50,
                scale: 0.9,
                stagger: 0.15,
                duration: 0.5,
                ease: "power2.in"
            });
        },
        start: "top 90%",
        end: "bottom 10%"
    });

    // Enhanced Skill level animations with reverse
    document.querySelectorAll('.skill-level').forEach(level => {
        const percentage = level.getAttribute('data-level');

        ScrollTrigger.create({
            trigger: level,
            start: "top 90%",
            end: "bottom 10%",
            onEnter: () => {
                gsap.to(level, {
                    '--skill-width': percentage + '%',
                    duration: 1.5,
                    ease: "power2.out"
                });
            },
            onLeave: () => {
                gsap.to(level, {
                    '--skill-width': '0%',
                    duration: 0.5,
                    ease: "power2.in"
                });
            },
            onEnterBack: () => {
                gsap.to(level, {
                    '--skill-width': percentage + '%',
                    duration: 1,
                    ease: "power2.out"
                });
            },
            onLeaveBack: () => {
                gsap.to(level, {
                    '--skill-width': '0%',
                    duration: 0.5,
                    ease: "power2.in"
                });
            }
        });
    });

    // Enhanced Experience timeline animations
    ScrollTrigger.batch(".timeline-item", {
        onEnter: (elements) => {
            gsap.to(elements, {
                opacity: 1,
                x: 0,
                duration: 1,
                stagger: 0.3,
                ease: "power3.out"
            });
        },
        onLeave: (elements) => {
            gsap.to(elements, {
                opacity: 0.3,
                x: -50,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.in"
            });
        },
        onEnterBack: (elements) => {
            gsap.to(elements, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out"
            });
        },
        onLeaveBack: (elements) => {
            gsap.to(elements, {
                opacity: 0,
                x: 50,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.in"
            });
        },
        start: "top 85%",
        end: "bottom 15%"
    });

    // Set initial states for timeline items
    gsap.set(".timeline-item", { opacity: 0, x: 50 });
}

// Form handling
function handleFormSubmit(e) {
    e.preventDefault();
    const submitBtn = e.target.querySelector('.submit-btn');
    if (!submitBtn) return;

    const originalText = submitBtn.innerHTML;

    // Loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Simulate form submission
    setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = '#4caf50';

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
            e.target.reset();
        }, 2000);
    }, 2000);
}

// Hover effects
document.addEventListener('DOMContentLoaded', () => {
    // Button hover effects
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(button, { scale: 1.05, duration: 0.3, ease: "power2.out" });
            }
        });
        button.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(button, { scale: 1, duration: 0.3, ease: "power2.out" });
            }
        });
    });

    // Card hover effects
    document.querySelectorAll('.skill-card, .certificate-card, .project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(card, { y: -10, duration: 0.3, ease: "power2.out" });
            }
        });
        card.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(card, { y: 0, duration: 0.3, ease: "power2.out" });
            }
        });
    });
});

// Responsive handling
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }

        // Recreate particles for mobile
        if (window.innerWidth < 768) {
            const particles = document.querySelectorAll('.particle');
            particles.forEach(particle => particle.remove());
            createParticles();
        }
    }, 250);
});

// Performance optimization
window.addEventListener('load', () => {
    // Preload images
    const images = ['face-img.png'];
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // Initialize lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Skill level animation on scroll
function animateSkillLevels() {
    document.querySelectorAll('.skill-level').forEach((level, index) => {
        const percentage = level.getAttribute('data-level');
        if (percentage) {
            setTimeout(() => {
                level.style.setProperty('--skill-width', percentage + '%');
            }, index * 200);
        }
    });
}

// Initialize intersection observer for skill levels
function initializeSkillLevelObserver() {
    if ('IntersectionObserver' in window) {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillLevel = entry.target.querySelector('.skill-level');
                    if (skillLevel) {
                        const percentage = skillLevel.getAttribute('data-level');
                        skillLevel.style.setProperty('--skill-width', percentage + '%');
                    }
                } else {
                    // Reset when leaving viewport
                    const skillLevel = entry.target.querySelector('.skill-level');
                    if (skillLevel) {
                        skillLevel.style.setProperty('--skill-width', '0%');
                    }
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.skill-card').forEach(card => {
            skillObserver.observe(card);
        });
    }
}

// Add smooth reveal animations for sections
function addRevealAnimations() {
    const sections = document.querySelectorAll('.section');

    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in', 'visible');
                } else {
                    // Remove classes when leaving viewport for re-animation
                    entry.target.classList.remove('fade-in', 'visible');
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => {
            section.classList.add('fade-in');
            sectionObserver.observe(section);
        });
    }
}

// Initialize all observers and animations
document.addEventListener('DOMContentLoaded', () => {
    initializeSkillLevelObserver();
    addRevealAnimations();
});

// Utility function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add loading state management
function showLoading(element) {
    if (element) {
        element.classList.add('loading');
    }
}

function hideLoading(element) {
    if (element) {
        element.classList.remove('loading');
    }
}

// Error handling for animations
function safeAnimate(target, properties, options = {}) {
    try {
        if (typeof gsap !== 'undefined' && target) {
            return gsap.to(target, { ...properties, ...options });
        }
    } catch (error) {
        console.warn('Animation error:', error);
    }
    return null;
}

// Enhanced scroll-based particle effects
let particleAnimations = [];

function createEnhancedParticles() {
    const particleContainer = document.querySelector('.particles');
    if (!particleContainer) return;

    // Clear existing particles
    particleContainer.innerHTML = '';
    particleAnimations.forEach(anim => anim.kill());
    particleAnimations = [];

    const particleCount = window.innerWidth < 768 ? 20 : 35;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';

        // Create GSAP animation for each particle
        const anim = gsap.to(particle, {
            y: `-=${Math.random() * 200 + 100}px`,
            x: `+=${(Math.random() - 0.5) * 100}px`,
            opacity: Math.random() * 0.5 + 0.2,
            duration: Math.random() * 15 + 10,
            ease: "none",
            repeat: -1,
            yoyo: true,
            delay: Math.random() * 5
        });

        particleAnimations.push(anim);
        particleContainer.appendChild(particle);
    }
}

// Update particles based on scroll
let lastScrollY = 0;
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    const scrollDelta = scrollY - lastScrollY;

    // Update particle movement based on scroll direction
    particleAnimations.forEach((anim, index) => {
        if (anim && anim.target) {
            const currentY = gsap.getProperty(anim.target, 'y');
            gsap.set(anim.target, {
                y: currentY + scrollDelta * 0.1 * (index % 2 === 0 ? 1 : -1)
            });
        }
    });

    lastScrollY = scrollY;
});

// Initialize enhanced effects
window.addEventListener('load', () => {
    if (typeof gsap !== 'undefined') {
        createEnhancedParticles();
    }
});

// FIXED Music Player Class
class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audioPlayer');
        this.isPlaying = false;
        this.currentTrack = 0;
        this.isMinimized = false;

        // Your playlist - update with your actual music files
        this.playlist = [
            {
                title: "La vaguelette",
                artist: "Genshin Impact",
                src: "music/la-vaguelette.mp3", // Your actual file path
                duration: "2:30"
            },
            // {
            //     title: "Your Song 2",
            //     artist: "Artist Name",
            //     src: "music/song2.mp3",
            //     duration: "3:45"
            // },
            // {
            //     title: "Your Song 3",
            //     artist: "Artist Name",
            //     src: "music/song3.mp3",
            //     duration: "4:20"
            // }
        ];

        this.initializePlayer();
        this.setupEventListeners();
        this.renderPlaylist();
        if (this.playlist.length > 0) {
            this.loadTrack(0);
        }
    }

    initializePlayer() {
        this.audio.volume = 0.3;
    }

    setupEventListeners() {
        // FIXED: Minimize button event
        const minimizeBtn = document.getElementById('minimizeBtn');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling
                this.toggleMinimize();
            });
        }

        // FIXED: Click on minimized player to expand
        const musicPlayer = document.getElementById('musicPlayer');
        if (musicPlayer) {
            musicPlayer.addEventListener('click', (e) => {
                if (this.isMinimized) {
                    // Only expand if clicking on the player itself
                    if (e.target === musicPlayer ||
                        e.target === minimizeBtn ||
                        e.target.closest('.minimize-btn')) {
                        this.toggleMinimize();
                    }
                }
            });
        }

        // Play/Pause button
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                this.togglePlayPause();
            });
        }

        // Previous/Next buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.previousTrack();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextTrack();
            });
        }

        // Volume control
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.audio.volume = e.target.value / 100;
            });
        }

        // Progress bar
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                const rect = e.target.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                this.audio.currentTime = percent * this.audio.duration;
            });
        }

        // Audio events
        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        this.audio.addEventListener('ended', () => {
            this.nextTrack();
        });

        this.audio.addEventListener('loadedmetadata', () => {
            this.updateDuration();
        });
    }

    renderPlaylist() {
        const playlistContainer = document.getElementById('playlist');
        if (!playlistContainer) return;

        playlistContainer.innerHTML = '';

        this.playlist.forEach((track, index) => {
            const playlistItem = document.createElement('div');
            playlistItem.className = 'playlist-item';
            playlistItem.innerHTML = `
                <i class="fas fa-music"></i>
                <div style="flex: 1; margin-left: 10px;">
                    <div style="font-size: 0.85rem; font-weight: 500; color: var(--text-color);">${track.title}</div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">${track.artist}</div>
                </div>
                <div style="font-size: 0.75rem; color: var(--text-secondary);">${track.duration}</div>
            `;

            playlistItem.addEventListener('click', () => {
                this.loadTrack(index);
                if (this.isPlaying) {
                    this.audio.play();
                }
            });

            playlistContainer.appendChild(playlistItem);
        });
    }

    loadTrack(index) {
        this.currentTrack = index;
        const track = this.playlist[index];

        this.audio.src = track.src;
        const trackTitle = document.getElementById('trackTitle');
        const trackArtist = document.getElementById('trackArtist');

        if (trackTitle) trackTitle.textContent = track.title;
        if (trackArtist) trackArtist.textContent = track.artist;

        // Update playlist active state
        document.querySelectorAll('.playlist-item').forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }

    togglePlayPause() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (!playPauseBtn) return;

        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            this.audio.play().then(() => {
                this.isPlaying = true;
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }).catch((error) => {
                console.error('Error playing audio:', error);
                // Show user-friendly message
                this.showNotification('Audio file not found or cannot be played');
            });
        }
    }

    previousTrack() {
        this.currentTrack = (this.currentTrack - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(this.currentTrack);
        if (this.isPlaying) {
            this.audio.play();
        }
    }

    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
        this.loadTrack(this.currentTrack);
        if (this.isPlaying) {
            this.audio.play();
        }
    }

    updateProgress() {
        if (this.audio.duration) {
            const percent = (this.audio.currentTime / this.audio.duration) * 100;
            const progressFill = document.getElementById('progressFill');
            const currentTime = document.getElementById('currentTime');

            if (progressFill) {
                progressFill.style.width = percent + '%';
            }
            if (currentTime) {
                currentTime.textContent = this.formatTime(this.audio.currentTime);
            }
        }
    }

    updateDuration() {
        const totalTime = document.getElementById('totalTime');
        if (totalTime && this.audio.duration) {
            totalTime.textContent = this.formatTime(this.audio.duration);
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    // FIXED: Toggle minimize function
    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        const player = document.getElementById('musicPlayer');
        const minimizeBtn = document.getElementById('minimizeBtn');

        if (!player || !minimizeBtn) return;

        if (this.isMinimized) {
            player.classList.add('minimized');
            minimizeBtn.innerHTML = '<i class="fas fa-expand"></i>';
        } else {
            player.classList.remove('minimized');
            minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>';
        }
    }

    // Utility function to show notifications
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 107, 107, 0.9);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 1001;
            font-size: 0.9rem;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// UPDATED: Initialize music player with proper error handling
// document.addEventListener('DOMContentLoaded', () => {
//     // Initialize existing portfolio functionality
//     if (typeof initializePortfolio === 'function') {
//         initializePortfolio();
//     }
//
//     // Initialize music player with delay to ensure DOM is ready
//     setTimeout(() => {
//         try {
//             const musicPlayerElement = document.getElementById('musicPlayer');
//             if (musicPlayerElement) {
//                 new MusicPlayer();
//                 console.log('Music player initialized successfully');
//             } else {
//                 console.warn('Music player element not found');
//             }
//         } catch (error) {
//             console.error('Error initializing music player:', error);
//         }
//     }, 1000);
// });

window.addEventListener('load', () => {
    setTimeout(() => {
        try {
            const musicPlayerElement = document.getElementById('musicPlayer');
            if (musicPlayerElement) {
                new MusicPlayer();
                console.log('Music player initialized');
            }
        } catch (error) {
            console.error('Music player error:', error);
        }
    }, 1000);
});