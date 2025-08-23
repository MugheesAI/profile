// Advanced Portfolio JavaScript with Dark Theme Support
// Muhammad Mughees Portfolio - Interactive Features

class PortfolioManager {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.initAnimations();
        this.initTheme();
        this.handleLoading();
    }

    // Initialize all components
    init() {
        this.navbar = document.querySelector('.navbar');
        this.navMenu = document.querySelector('.nav-menu');
        this.hamburger = document.querySelector('.hamburger');
        this.themeToggle = document.getElementById('theme-toggle');
        this.loadingScreen = document.getElementById('loading-screen');
        this.typewriter = document.querySelector('.typewriter');
        this.dynamicTitle = document.getElementById('dynamic-title');
        this.contactForm = document.getElementById('contactForm');

        // Animation observers
        this.observedElements = new Set();
        this.setupIntersectionObserver();

        // Project filtering
        this.initProjectFiltering();
        
        // Modal management
        this.initModals();
    }

    // Handle loading screen
    handleLoading() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.loadingScreen.classList.add('hidden');
                this.startHeroAnimations();
            }, 2500);
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Navigation
        this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        this.navMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                this.closeMobileMenu();
            }
        });

        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Scroll events
        window.addEventListener('scroll', () => {
            this.handleScroll();
            this.updateActiveNavLink();
        });

        // Contact form
        this.contactForm.addEventListener('submit', (e) => this.handleContactForm(e));

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleSmoothScroll(e));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));

        // Window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    // Mobile menu toggle
    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.hamburger.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.hamburger.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    // Theme management
    initTheme() {
        const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
        this.setTheme(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
        
        const icon = this.themeToggle.querySelector('i');
        if (theme === 'light') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    // Scroll handling
    handleScroll() {
        const scrolled = window.pageYOffset > 50;
        this.navbar.classList.toggle('scrolled', scrolled);
    }

    // Update active navigation link
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        const scrollPosition = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
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
    }

    // Smooth scrolling
    handleSmoothScroll(e) {
        e.preventDefault();
        
        // Get the target element, handle both direct clicks and clicks on child elements
        let targetHref = e.target.getAttribute('href');
        if (!targetHref && e.target.closest('a[href^="#"]')) {
            targetHref = e.target.closest('a[href^="#"]').getAttribute('href');
        }
        
        if (targetHref && targetHref.startsWith('#')) {
            const target = document.querySelector(targetHref);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if it's open
                this.closeMobileMenu();
            }
        }
    }

    // Keyboard navigation
    handleKeyboardNavigation(e) {
        if (e.key === 'Escape') {
            this.closeMobileMenu();
            this.closeModal();
        }
    }

    // Handle window resize
    handleResize() {
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
    }

    // Initialize animations
    initAnimations() {
        this.startTypewriterEffect();
        this.startDynamicTitleRotation();
        this.initSkillBars();
        this.initCounterAnimation();
    }

    // Start hero animations after loading
    startHeroAnimations() {
        const heroContent = document.querySelector('.hero-content');
        const heroImage = document.querySelector('.hero-image');
        
        if (heroContent) {
            heroContent.style.animation = 'fadeInUp 1s ease-out forwards';
        }
        
        if (heroImage) {
            heroImage.style.animation = 'fadeInRight 1s ease-out 0.3s forwards';
        }
    }

    // Typewriter effect for name
    startTypewriterEffect() {
        const text = this.typewriter.getAttribute('data-text') || 'Muhammad Mughees';
        let index = 0;
        let isDeleting = false;
        
        const typeSpeed = 100;
        const deleteSpeed = 50;
        const pauseTime = 2000;

        const type = () => {
            const currentText = isDeleting 
                ? text.substring(0, index - 1) 
                : text.substring(0, index + 1);
            
            this.typewriter.textContent = currentText;

            let speed = isDeleting ? deleteSpeed : typeSpeed;

            if (!isDeleting && index === text.length) {
                speed = pauseTime;
                isDeleting = true;
            } else if (isDeleting && index === 0) {
                isDeleting = false;
                speed = 500;
            }

            index = isDeleting ? index - 1 : index + 1;
            setTimeout(type, speed);
        };

        // Start typing after a delay
        setTimeout(type, 1000);
    }

    // Dynamic title rotation
    startDynamicTitleRotation() {
        const titles = [
            'Laravel Developer',
            'PHP Expert',
            'Full Stack Developer',
            'API Specialist',
            'Payment Integration Expert',
            'Web Solutions Architect'
        ];

        let currentIndex = 0;
        const rotateTitle = () => {
            this.dynamicTitle.style.opacity = '0';
            
            setTimeout(() => {
                this.dynamicTitle.textContent = titles[currentIndex];
                this.dynamicTitle.style.opacity = '1';
                currentIndex = (currentIndex + 1) % titles.length;
            }, 300);
        };

        // Start after initial load
        setTimeout(() => {
            rotateTitle();
            setInterval(rotateTitle, 3000);
        }, 2000);
    }

    // Intersection Observer for animations
    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.observedElements.has(entry.target)) {
                    this.observedElements.add(entry.target);
                    this.triggerAnimation(entry.target);
                }
            });
        }, options);

        // Observe sections
        document.querySelectorAll('section').forEach(section => {
            this.observer.observe(section);
        });

        // Observe specific elements
        document.querySelectorAll('.skill-category, .project-card, .timeline-item, .cert-card').forEach(el => {
            this.observer.observe(el);
        });
    }

    // Trigger animations based on element type
    triggerAnimation(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';

        if (element.classList.contains('skills')) {
            this.animateSkillBars();
        }
        
        if (element.classList.contains('about')) {
            this.animateCounters();
        }

        if (element.classList.contains('skill-category')) {
            element.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }

        if (element.classList.contains('project-card')) {
            const delay = Array.from(element.parentNode.children).indexOf(element) * 0.1;
            element.style.animation = `fadeInUp 0.6s ease-out ${delay}s forwards`;
        }

        if (element.classList.contains('timeline-item')) {
            element.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }

        if (element.classList.contains('cert-card')) {
            const delay = Array.from(element.parentNode.children).indexOf(element) * 0.2;
            element.style.animation = `fadeInUp 0.6s ease-out ${delay}s forwards`;
        }
    }

    // Initialize skill bars
    initSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            bar.style.width = '0%';
        });
    }

    // Animate skill bars
    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const targetWidth = bar.getAttribute('data-width');
                bar.style.width = targetWidth;
            }, index * 100);
        });
    }

    // Initialize counter animation
    initCounterAnimation() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            counter.textContent = '0+';
        });
    }

    // Animate counters
    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current >= target) {
                    counter.textContent = target + '+';
                } else {
                    counter.textContent = Math.floor(current) + '+';
                    requestAnimationFrame(updateCounter);
                }
            };

            updateCounter();
        });
    }

    // Project filtering
    initProjectFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter projects
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        card.classList.remove('hidden');
                        card.style.animation = 'fadeInUp 0.6s ease-out forwards';
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    // Contact form handling
    async handleContactForm(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('.btn-submit');
        const formData = new FormData(e.target);
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            // Simulate form submission (replace with actual endpoint)
            await this.simulateFormSubmission(formData);
            
            // Show success message
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            e.target.reset();
            
        } catch (error) {
            this.showNotification('Error sending message. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    // Simulate form submission
    simulateFormSubmission(formData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form data:', Object.fromEntries(formData));
                resolve();
            }, 2000);
        });
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            minWidth: '300px',
            maxWidth: '400px',
            background: type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--error-color)' : 'var(--primary-color)',
            color: 'white',
            padding: '1rem',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--shadow-large)',
            zIndex: '10001',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        });

        document.body.appendChild(notification);

        // Add close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.closeNotification(notification));

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Auto close after 5 seconds
        setTimeout(() => {
            this.closeNotification(notification);
        }, 5000);
    }

    closeNotification(notification) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Modal management
    initModals() {
        this.projectModal = document.getElementById('projectModal');
        this.galleryModal = document.getElementById('galleryModal');
        
        // Close modals when clicking outside
        [this.projectModal, this.galleryModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        });
    }

    closeModal() {
        if (this.projectModal.classList.contains('active')) {
            this.projectModal.classList.remove('active');
        }
        if (this.galleryModal.classList.contains('active')) {
            this.galleryModal.classList.remove('active');
        }
    }
}

// Project modal functions (called from HTML)
function openProjectModal(projectId) {
    const portfolio = window.portfolioManager;
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    // Project data (you can expand this with more details)
    const projectData = {
        'ecommerce1': {
            title: 'Advanced Multi-Vendor Marketplace',
            description: 'A comprehensive e-commerce platform built with Laravel that supports multiple vendors, advanced inventory management, and integrated payment processing.',
            features: [
                'Multi-vendor marketplace architecture',
                'Advanced inventory management system',
                'Integrated payment processing with Stripe and PayPal',
                'Real-time order tracking and notifications',
                'Comprehensive admin dashboard',
                'Mobile-responsive design',
                'SEO optimized product pages',
                'Advanced search and filtering'
            ],
            technologies: ['Laravel 10', 'Vue.js 3', 'MySQL 8', 'Stripe API', 'PayPal SDK', 'AWS S3', 'Redis Cache', 'Laravel Horizon'],
            challenges: 'Managing complex vendor relationships, implementing real-time notifications, and optimizing performance for thousands of products.',
            results: 'Successfully processed over $100K in transactions within the first month, with 99.9% uptime and excellent user feedback.'
        },
        'dashboard1': {
            title: 'Real-time Analytics Dashboard',
            description: 'Interactive business intelligence dashboard providing real-time data visualization and comprehensive reporting capabilities.',
            features: [
                'Real-time data visualization',
                'Interactive charts and graphs',
                'Custom report generation',
                'Data export functionality',
                'Role-based access control',
                'Mobile-responsive interface',
                'Automated email reports',
                'API integrations'
            ],
            technologies: ['Laravel 10', 'Chart.js', 'Vue.js 3', 'PostgreSQL', 'Redis', 'WebSockets', 'Laravel Broadcasting', 'D3.js'],
            challenges: 'Implementing real-time data updates, optimizing database queries for large datasets, and creating intuitive data visualizations.',
            results: 'Reduced reporting time by 75% and improved decision-making speed for management team.'
        }
        // Add more project data as needed
    };

    const project = projectData[projectId];
    if (!project) return;

    modalTitle.textContent = project.title;
    modalBody.innerHTML = `
        <div class="project-modal-content">
            <p class="project-description">${project.description}</p>
            
            <h4>Key Features:</h4>
            <ul class="feature-list">
                ${project.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            
            <h4>Technologies Used:</h4>
            <div class="tech-tags">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            
            <h4>Challenges & Solutions:</h4>
            <p>${project.challenges}</p>
            
            <h4>Results & Impact:</h4>
            <p>${project.results}</p>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeProjectModal() {
    document.getElementById('projectModal').classList.remove('active');
}

// Gallery slider global variables
let currentSlideIndex = 0;
let galleryImages = [];

// Gallery modal functions
function openGallery(projectId) {
    const modal = document.getElementById('galleryModal');
    const galleryTitle = document.getElementById('galleryTitle');
    const galleryContainer = document.getElementById('galleryContainer');
    const currentSlideSpan = document.getElementById('currentSlide');
    const totalSlidesSpan = document.getElementById('totalSlides');
    const galleryDots = document.getElementById('galleryDots');
    
    // Sample gallery images (replace with actual project images)
    const galleries = {
        'ecommerce1': [
            {
                src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
                alt: 'E-commerce Homepage'
            },
            {
                src: 'https://images.unsplash.com/photo-1556742111-f7cacd7c60d8?w=800&h=600&fit=crop',
                alt: 'Product Catalog'
            },
            {
                src: 'https://images.unsplash.com/photo-1556742058-90de4c93b42e?w=800&h=600&fit=crop',
                alt: 'Shopping Cart'
            },
            {
                src: 'https://images.unsplash.com/photo-1556742078-1a7b3e8f8b6e?w=800&h=600&fit=crop',
                alt: 'Checkout Process'
            }
        ],
        'dashboard1': [
            {
                src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
                alt: 'Analytics Overview'
            },
            {
                src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
                alt: 'Data Visualization'
            },
            {
                src: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&h=600&fit=crop',
                alt: 'Reports Dashboard'
            },
            {
                src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop',
                alt: 'Settings Panel'
            }
        ],
        'payment1': [
            {
                src: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
                alt: 'Payment Gateway Interface'
            },
            {
                src: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&h=600&fit=crop',
                alt: 'Transaction Dashboard'
            },
            {
                src: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=600&fit=crop',
                alt: 'Security Features'
            }
        ],
        'api1': [
            {
                src: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
                alt: 'API Documentation'
            },
            {
                src: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
                alt: 'Endpoint Testing'
            },
            {
                src: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
                alt: 'Response Examples'
            }
        ],
        'frontend1': [
            {
                src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
                alt: 'Homepage Design'
            },
            {
                src: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&h=600&fit=crop',
                alt: 'Responsive Layout'
            },
            {
                src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
                alt: 'Interactive Features'
            }
        ],
        'crm1': [
            {
                src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
                alt: 'CRM Dashboard'
            },
            {
                src: 'https://images.unsplash.com/photo-1554224154-26032fced8bd?w=800&h=600&fit=crop',
                alt: 'Customer Management'
            },
            {
                src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
                alt: 'Sales Pipeline'
            }
        ]
    };
    
    galleryImages = galleries[projectId] || [];
    currentSlideIndex = 0;
    
    if (galleryImages.length === 0) return;
    
    // Set gallery title
    galleryTitle.textContent = `${getProjectTitle(projectId)} - Gallery`;
    
    // Update counter
    currentSlideSpan.textContent = '1';
    totalSlidesSpan.textContent = galleryImages.length.toString();
    
    // Create slides
    galleryContainer.innerHTML = galleryImages.map((image, index) => 
        `<div class="gallery-slide">
            <img src="${image.src}" alt="${image.alt}" loading="${index === 0 ? 'eager' : 'lazy'}">
        </div>`
    ).join('');
    
    // Create dots
    galleryDots.innerHTML = galleryImages.map((_, index) => 
        `<button class="gallery-dot ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></button>`
    ).join('');
    
    // Show modal
    modal.classList.add('active');
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleGalleryKeyboard);
}

function closeGallery() {
    const modal = document.getElementById('galleryModal');
    modal.classList.remove('active');
    document.removeEventListener('keydown', handleGalleryKeyboard);
}

function nextSlide() {
    if (currentSlideIndex < galleryImages.length - 1) {
        currentSlideIndex++;
    } else {
        currentSlideIndex = 0; // Loop to first slide
    }
    updateSliderPosition();
}

function prevSlide() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
    } else {
        currentSlideIndex = galleryImages.length - 1; // Loop to last slide
    }
    updateSliderPosition();
}

function goToSlide(index) {
    if (index >= 0 && index < galleryImages.length) {
        currentSlideIndex = index;
        updateSliderPosition();
    }
}

function updateSliderPosition() {
    const galleryContainer = document.getElementById('galleryContainer');
    const currentSlideSpan = document.getElementById('currentSlide');
    const dots = document.querySelectorAll('.gallery-dot');
    
    // Update slider position
    const translateX = -currentSlideIndex * 100;
    galleryContainer.style.transform = `translateX(${translateX}%)`;
    
    // Update counter
    currentSlideSpan.textContent = (currentSlideIndex + 1).toString();
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlideIndex);
    });
}

function handleGalleryKeyboard(e) {
    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            prevSlide();
            break;
        case 'ArrowRight':
            e.preventDefault();
            nextSlide();
            break;
        case 'Escape':
            e.preventDefault();
            closeGallery();
            break;
    }
}

function getProjectTitle(projectId) {
    const titles = {
        'ecommerce1': 'Multi-Vendor E-commerce Platform',
        'dashboard1': 'Analytics Dashboard',
        'payment1': 'Payment Gateway System',
        'api1': 'RESTful API Platform',
        'frontend1': 'Corporate Website',
        'crm1': 'CRM System'
    };
    return titles[projectId] || 'Project Gallery';
}

// Scroll to contact function
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Add CSS for notifications
const notificationStyles = `
    .notification {
        font-family: var(--font-primary);
        font-size: 0.9rem;
        border-radius: var(--border-radius);
        overflow: hidden;
        box-shadow: var(--shadow-large);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex: 1;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: currentColor;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 50%;
        transition: background 0.2s ease;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .project-modal-content {
        max-width: 600px;
    }
    
    .project-description {
        font-size: 1.1rem;
        margin-bottom: 2rem;
        color: var(--text-secondary);
    }
    
    .feature-list {
        list-style: none;
        margin-bottom: 2rem;
    }
    
    .feature-list li {
        padding: 0.5rem 0;
        padding-left: 1.5rem;
        position: relative;
        color: var(--text-secondary);
    }
    
    .feature-list li::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--success-color);
        font-weight: bold;
    }
    
    .tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 2rem;
    }
    
    .tech-tag {
        background: var(--primary-color);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 50px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .project-modal-content h4 {
        color: var(--primary-color);
        margin-top: 2rem;
        margin-bottom: 1rem;
        font-size: 1.2rem;
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize portfolio manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioManager = new PortfolioManager();
    
    // Add some CSS for initial state of animated elements
    const initialStyles = `
        section {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .skill-category,
        .project-card,
        .timeline-item,
        .cert-card {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        body.menu-open {
            overflow: hidden;
        }
        
        .typing-cursor::after {
            content: '';
            animation: none;
        }
    `;
    
    const animationStyleSheet = document.createElement('style');
    animationStyleSheet.textContent = initialStyles;
    document.head.appendChild(animationStyleSheet);
    
    // WhatsApp Popup Widget
    const whatsappFloat = document.querySelector('.whatsapp-float');
    const whatsappPopup = document.querySelector('.whatsapp-popup');
    const whatsappClose = document.querySelector('.whatsapp-close');
    
    if (whatsappFloat && whatsappPopup) {
        let popupTimer;
        let isPopupOpen = false;
        let autoShowCount = 0;
        const maxAutoShows = 3; // Limit auto-shows to avoid being annoying
        
        // Show popup automatically every 5 seconds (but only if not already open)
        function showPopupAuto() {
            if (!isPopupOpen && autoShowCount < maxAutoShows) {
                whatsappPopup.classList.add('show');
                isPopupOpen = true;
                autoShowCount++;
                
                // Auto hide after 5 seconds if user doesn't interact
                setTimeout(() => {
                    if (isPopupOpen && !whatsappPopup.matches(':hover')) {
                        hidePopup();
                    }
                }, 5000);
            }
        }
        
        function hidePopup() {
            whatsappPopup.classList.remove('show');
            isPopupOpen = false;
        }
        
        // Start the auto-show timer after page has loaded for a bit
        setTimeout(() => {
            popupTimer = setInterval(showPopupAuto, 8000); // Show every 8 seconds
            showPopupAuto(); // Show immediately on first call
        }, 3000); // Wait 3 seconds after page load
        
        // Manual toggle on float button click
        whatsappFloat.addEventListener('click', (e) => {
            e.preventDefault();
            if (isPopupOpen) {
                hidePopup();
            } else {
                whatsappPopup.classList.add('show');
                isPopupOpen = true;
            }
        });
        
        // Close popup when close button is clicked
        if (whatsappClose) {
            whatsappClose.addEventListener('click', (e) => {
                e.preventDefault();
                hidePopup();
            });
        }
        
        // Keep popup open when hovering
        whatsappPopup.addEventListener('mouseenter', () => {
            clearTimeout();
        });
        
        // Resume auto-hide when mouse leaves (if popup is still open)
        whatsappPopup.addEventListener('mouseleave', () => {
            if (isPopupOpen) {
                setTimeout(() => {
                    if (isPopupOpen && !whatsappPopup.matches(':hover')) {
                        hidePopup();
                    }
                }, 2000);
            }
        });
        
        // Close popup when clicking outside
        document.addEventListener('click', (e) => {
            if (isPopupOpen && !whatsappFloat.contains(e.target) && !whatsappPopup.contains(e.target)) {
                hidePopup();
            }
        });
    }
    
    console.log('🚀 Muhammad Mughees Portfolio Loaded Successfully!');
    console.log('💻 Dark theme with advanced interactions ready');
    console.log('📱 WhatsApp widget initialized and ready!');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioManager;
}
