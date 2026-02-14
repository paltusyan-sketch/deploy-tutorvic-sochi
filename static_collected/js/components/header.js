/**
 * Header Component
 * Handles header-specific functionality
 */

class HeaderComponent {
    constructor() {
        this.header = document.querySelector('.header');
        this.navbar = document.querySelector('.navbar');
        this.lastScrollY = window.scrollY;
        
        this.init();
    }
    
    init() {
        this.handleScroll();
        this.handleResize();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Throttled scroll handler for better performance
        window.addEventListener('scroll', Utils.throttle(() => {
            this.handleScroll();
        }, 16));
        
        // Handle window resize
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, 250));
    }
    
    handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Add/remove scrolled class for styling
        if (currentScrollY > 100) {
            this.header.classList.add('header--scrolled');
        } else {
            this.header.classList.remove('header--scrolled');
        }
        
        // Hide/show header on scroll (optional)
        if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
            this.header.style.transform = 'translateY(-100%)';
        } else {
            this.header.style.transform = 'translateY(0)';
        }
        
        this.lastScrollY = currentScrollY;
    }
    
    handleResize() {
        // Close mobile menu on resize
        const nav = document.querySelector('.header__nav');
        const toggle = document.querySelector('.header__toggle');
        
        if (window.innerWidth > 991) {
            nav.classList.remove('show');
            toggle.classList.remove('active');
        }
    }
}

// Initialize header component when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new HeaderComponent();
});
