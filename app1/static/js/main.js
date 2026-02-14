/**
 * Main JavaScript file for EduSkills website
 * Uses OOP approach with ES6+ classes
 */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    const mobileMenu = new MobileMenu();
    const carousel = new Carousel();
    const form = new Form();
    const registrationForm = new RegistrationForm();
    const counter = new Counter();
    const smoothScroll = new SmoothScroll();
    const telegramLinks = new TelegramLinks();
    const multiselect = new Multiselect();
    const storyReadMore = new StoryReadMore();
    
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
});

/**
 * Mobile Menu Class
 * Handles mobile navigation functionality
 */
class MobileMenu {
    constructor() {
        this.toggle = document.querySelector('.header__toggle');
        this.nav = document.querySelector('.header__nav');
        this.links = document.querySelectorAll('.header__link');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        if (this.toggle && this.nav) {
            // Single click handler for the entire button
            this.toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleToggle();
            });
            
            // Close menu when clicking on links
            this.links.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMenu();
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.isOpen && !this.toggle.contains(e.target) && !this.nav.contains(e.target)) {
                    this.closeMenu();
                }
            });
            
            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.closeMenu();
                }
            });
        }
    }
    
    handleToggle() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.isOpen = true;
        this.nav.classList.add('show');
        this.toggle.classList.add('active');
        this.toggle.setAttribute('aria-expanded', 'true');
    }
    
    closeMenu() {
        this.isOpen = false;
        this.nav.classList.remove('show');
        this.toggle.classList.remove('active');
        this.toggle.setAttribute('aria-expanded', 'false');
    }
}

/**
 * Modal Class
 * Handles modal functionality
 */
class Modal {
    constructor() {
        this.modals = document.querySelectorAll('.modal');
        this.init();
    }
    
    init() {
        this.modals.forEach(modal => {
            const closeButtons = modal.querySelectorAll('[data-bs-dismiss="modal"]');
            closeButtons.forEach(button => {
                button.addEventListener('click', () => this.closeModal(modal));
            });
            
            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
    }
    
    closeModal(modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}

/**
 * Carousel Class
 * Handles Swiper carousels initialization
 */
class Carousel {
    constructor() {
        this.coursesSwiper = null;
        this.testimonialsSwiper = null;
        
        this.init();
    }
    
    init() {
        this.initCoursesSwiper();
        this.initTestimonialsSwiper();
    }
    
    initCoursesSwiper() {
        const coursesContainer = document.querySelector('.courses-swiper');
        if (coursesContainer) {
            this.coursesSwiper = new Swiper('.courses-swiper', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    }
                }
            });
        }
    }
    
    initTestimonialsSwiper() {
        const testimonialsContainer = document.querySelector('.testimonials-swiper');
        if (testimonialsContainer) {
            this.testimonialsSwiper = new Swiper('.testimonials-swiper', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                autoplay: {
                    delay: 6000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                    }
                }
            });
        }
    }
}

/**
 * Form Class
 * Handles form validation and submission
 */
class Form {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }
    
    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
            
            // Real-time validation
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearError(input));
            });
        });
    }
    
    handleSubmit(e) {
        const form = e.target;
        
        if (form.classList.contains('registration-form')) {
            return;
        }
        
        e.preventDefault();
        const isValid = this.validateForm(form);
        
        if (isValid) {
            this.submitForm(form);
        }
    }
    
    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            errorMessage = 'Это поле обязательно для заполнения';
            isValid = false;
        }
        
        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Введите корректный email адрес';
                isValid = false;
            }
        }
        
        // Password validation
        if (type === 'password' && value) {
            if (value.length < 6) {
                errorMessage = 'Пароль должен содержать минимум 6 символов';
                isValid = false;
            }
        }
        
        // Confirm password validation
        if (field.id === 'confirmPassword' && value) {
            const password = document.getElementById('registerPassword');
            if (password && value !== password.value) {
                errorMessage = 'Пароли не совпадают';
                isValid = false;
            }
        }
        
        // Textarea validation (comment field)
        if (field.tagName === 'TEXTAREA' && value) {
            if (value.length > 500) {
                errorMessage = 'Комментарий не должен превышать 500 символов';
                isValid = false;
            }
        }
        
        this.showFieldError(field, errorMessage);
        return isValid;
    }
    
    showFieldError(field, message) {
        this.clearError(field);
        
        if (message) {
            field.classList.add('is-invalid');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        } else {
            field.classList.add('is-valid');
        }
    }
    
    clearError(field) {
        field.classList.remove('is-invalid', 'is-valid');
        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    submitForm(form) {
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            this.showSuccessMessage(form);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            form.reset();
        }, 2000);
    }
    
    showSuccessMessage(form) {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success mt-3';
        successDiv.textContent = 'Форма успешно отправлена!';
        form.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
}

/**
 * RegistrationForm Class
 * Handles registration form submission with reliable button state management
 */
class RegistrationForm {
    constructor() {
        this.form = document.querySelector('.registration-form');
        this.submitBtn = null;
        this.isSubmitting = false;
        this.abortController = null;
        this.timeoutId = null;
        this.resetTimeoutId = null;
        this.originalButtonState = null;
        this.FETCH_TIMEOUT = 30000;
        this.SUCCESS_DISPLAY_TIME = 2000;
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.submitBtn = this.form.querySelector('button[type="submit"]');
        if (!this.submitBtn) return;
        
        this.saveOriginalButtonState();
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    saveOriginalButtonState() {
        const computedStyle = window.getComputedStyle(this.submitBtn);
        this.originalButtonState = {
            text: this.submitBtn.textContent,
            className: this.submitBtn.className,
            disabled: this.submitBtn.disabled
        };
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) {
            return;
        }
        
        if (!this.validateForm()) {
            return;
        }
        
        this.submitForm();
    }
    
    validateForm() {
        const commentField = this.form.querySelector('#comment');
        if (commentField && commentField.value.trim().length > 500) {
            this.showError('Комментарий не должен превышать 500 символов');
            return false;
        }
        
        const requiredFields = this.form.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('is-invalid');
            } else {
                field.classList.remove('is-invalid');
            }
        });
        
        const subjects = this.form.querySelectorAll('input[name="subjects[]"]:checked');
        if (subjects.length === 0) {
            isValid = false;
            const subjectTrigger = this.form.querySelector('#subject-trigger');
            if (subjectTrigger) {
                subjectTrigger.classList.add('is-invalid');
            }
        }
        
        if (!isValid) {
            this.showError('Пожалуйста, заполните все обязательные поля');
        }
        
        return isValid;
    }
    
    async submitForm() {
        this.isSubmitting = true;
        this.abortController = new AbortController();
        
        this.setButtonLoading();
        
        this.timeoutId = setTimeout(() => {
            this.abortController.abort();
            this.handleError('Превышено время ожидания. Попробуйте еще раз.');
        }, this.FETCH_TIMEOUT);
        
        try {
            const formData = new FormData(this.form);
            
            const response = await fetch('https://formspree.io/f/movnkqyw', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                },
                signal: this.abortController.signal
            });
            
            clearTimeout(this.timeoutId);
            
            if (response.ok) {
                this.handleSuccess();
            } else {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error || 'Ошибка отправки формы';
                throw new Error(errorMessage);
            }
        } catch (error) {
            clearTimeout(this.timeoutId);
            
            if (error.name === 'AbortError') {
                return;
            }
            
            this.handleError('Произошла ошибка при отправке формы. Попробуйте еще раз.');
        } finally {
            this.isSubmitting = false;
            this.abortController = null;
        }
    }
    
    setButtonLoading() {
        this.submitBtn.disabled = true;
        this.submitBtn.classList.add('registration-form__submit--loading');
        this.submitBtn.textContent = 'Отправка...';
    }
    
    setButtonSuccess() {
        this.submitBtn.classList.remove('registration-form__submit--loading');
        this.submitBtn.classList.add('registration-form__submit--success');
        this.submitBtn.textContent = 'Отправлено';
    }
    
    resetButton() {
        if (this.resetTimeoutId) {
            clearTimeout(this.resetTimeoutId);
            this.resetTimeoutId = null;
        }
        
        this.submitBtn.classList.remove('registration-form__submit--loading', 'registration-form__submit--success');
        this.submitBtn.className = this.originalButtonState.className;
        this.submitBtn.textContent = this.originalButtonState.text;
        this.submitBtn.disabled = this.originalButtonState.disabled;
        this.submitBtn.style.cssText = '';
    }
    
    handleSuccess() {
        this.setButtonSuccess();
        this.resetForm();
        
        this.resetTimeoutId = setTimeout(() => {
            this.resetButton();
        }, this.SUCCESS_DISPLAY_TIME);
    }
    
    handleError(message) {
        this.resetButton();
        this.showError(message);
    }
    
    showError(message) {
        this.removeMessages();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger mt-3';
        errorDiv.style.cssText = 'background: #f8d7da; color: #721c24; padding: 12px; border-radius: 8px; margin-top: 1rem; text-align: center;';
        errorDiv.textContent = message;
        
        this.form.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
    
    removeMessages() {
        const alerts = this.form.querySelectorAll('.alert');
        alerts.forEach(alert => alert.remove());
    }
    
    resetForm() {
        this.form.reset();
        
        const errorElements = this.form.querySelectorAll('.invalid-feedback');
        errorElements.forEach(error => error.remove());
        
        const invalidFields = this.form.querySelectorAll('.is-invalid, .is-valid');
        invalidFields.forEach(field => field.classList.remove('is-invalid', 'is-valid'));
        
        const multiselectCheckboxes = this.form.querySelectorAll('.multiselect-option input[type="checkbox"]');
        multiselectCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        const multiselectPlaceholders = this.form.querySelectorAll('.multiselect-placeholder');
        multiselectPlaceholders.forEach(placeholder => {
            placeholder.textContent = 'Выберите предмет';
            placeholder.classList.remove('has-selection');
        });
        
        const multiselectDropdowns = this.form.querySelectorAll('.multiselect-dropdown');
        multiselectDropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
        
        const multiselectTriggers = this.form.querySelectorAll('.multiselect-trigger');
        multiselectTriggers.forEach(trigger => {
            trigger.classList.remove('active', 'is-invalid');
        });
        
        this.removeMessages();
    }
}

/**
 * Counter Class
 * Handles animated counters
 */
class Counter {
    constructor() {
        this.counters = document.querySelectorAll('[data-count]');
        this.init();
    }
    
    init() {
        if (this.counters.length > 0) {
            this.observeCounters();
        }
    }
    
    observeCounters() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.counters.forEach(counter => {
            observer.observe(counter);
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }
}

/**
 * Smooth Scroll Class
 * Handles smooth scrolling for anchor links
 */
class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.init();
    }
    
    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => this.handleClick(e));
        });
    }
    
    handleClick(e) {
        const href = e.target.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
}

/**
 * Utility Functions
 */
class Utils {
    static debounce(func, wait) {
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
    
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    static isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

/**
 * Telegram Links Class
 * Handles course registration buttons with Telegram integration
 */
class TelegramLinks {
    constructor() {
        this.telegramUsername = 'brusiya';
        this.subjectMessages = {
            'math': 'Здравствуйте! Я хочу записаться на пробное занятие по математике',
            'physics': 'Здравствуйте! Я хочу записаться на пробное занятие по физике',
            'informatics': 'Здравствуйте! Я хочу записаться на пробное занятие по информатике',
            'common': 'Здравствуйте! Я хочу записаться на пробное занятие',
        };
        this.init();
    }
    
    init() {
        const buttons = document.querySelectorAll('[data-subject]');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => this.handleButtonClick(e));
        });
    }
    
    handleButtonClick(e) {
        e.preventDefault();
        const subject = e.target.getAttribute('data-subject');
        const message = this.subjectMessages[subject];
        
        if (message) {
            this.openTelegramChat(message);
        }
    }
    
    openTelegramChat(message) {
        const encodedMessage = encodeURIComponent(message);
        const telegramUrl = `https://t.me/${this.telegramUsername}?text=${encodedMessage}`;
        
        window.open(telegramUrl, '_blank');
    }
}

// Phone mask functionality
class PhoneMask {
    constructor() {
        this.init();
    }

    init() {
        const phoneInput = document.querySelector('.phone-mask');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => this.formatPhone(e));
            phoneInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        }
    }

    formatPhone(event) {
        let value = event.target.value.replace(/\D/g, '');
        
        if (value.length === 0) {
            event.target.value = '';
            return;
        }

        if (value[0] !== '7' && value[0] !== '8') {
            value = '7' + value;
        }

        if (value[0] === '8') {
            value = '7' + value.slice(1);
        }

        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        let formattedValue = '+7';
        
        if (value.length > 1) {
            formattedValue += ' (' + value.slice(1, 4);
        }
        if (value.length >= 5) {
            formattedValue += ') ' + value.slice(4, 7);
        }
        if (value.length >= 8) {
            formattedValue += '-' + value.slice(7, 9);
        }
        if (value.length >= 10) {
            formattedValue += '-' + value.slice(9, 11);
        }

        event.target.value = formattedValue;
    }

    handleKeydown(event) {
        if (event.key === 'Backspace') {
            const value = event.target.value.replace(/\D/g, '');
            if (value.length <= 1) {
                event.target.value = '';
            }
        }
    }
}

// Initialize phone mask when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new PhoneMask();
});

/**
 * StoryReadMore Class
 * Handles "read more" functionality for story islands
 */
class StoryReadMore {
    constructor() {
        this.buttons = document.querySelectorAll('.story__read-more-btn');
        this.allContents = document.querySelectorAll('.story__island-content');
        this.init();
    }
    
    init() {
        if (this.buttons.length > 0) {
            this.buttons.forEach(button => {
                button.addEventListener('click', (e) => this.handleClick(e));
            });
        }
    }
    
    handleClick(e) {
        e.preventDefault();
        const button = e.currentTarget;
        const content = button.closest('.story__island-content');
        const textElement = button.querySelector('.story__read-more-text');
        
        if (!content || !textElement) return;
        
        const isExpanded = content.classList.contains('expanded');
        
        if (isExpanded) {
            this.collapse(content, textElement);
        } else {
            this.closeAll();
            this.expand(content, textElement);
        }
    }
    
    closeAll() {
        this.allContents.forEach(content => {
            const isExpanded = content.classList.contains('expanded');
            if (isExpanded) {
                const button = content.querySelector('.story__read-more-btn');
                const textElement = button ? button.querySelector('.story__read-more-text') : null;
                if (textElement) {
                    this.collapse(content, textElement);
                }
            }
        });
    }
    
    expand(content, textElement) {
        content.classList.add('expanded');
        textElement.textContent = 'Свернуть';
    }
    
    collapse(content, textElement) {
        content.classList.remove('expanded');
        textElement.textContent = 'Читать подробнее';
    }
}

/**
 * Multiselect Class
 * Handles custom multiselect dropdown functionality
 */
class Multiselect {
    constructor() {
        this.triggers = document.querySelectorAll('.multiselect-trigger');
        this.dropdowns = document.querySelectorAll('.multiselect-dropdown');
        this.checkboxes = document.querySelectorAll('.multiselect-option input[type="checkbox"]');
        
        this.init();
    }
    
    init() {
        this.triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => this.toggleDropdown(e));
        });
        
        this.checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateDisplay());
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.multiselect-container')) {
                this.closeAllDropdowns();
            }
        });
        
        // Close dropdowns when pressing Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
            }
        });
    }
    
    toggleDropdown(e) {
        e.stopPropagation();
        const trigger = e.currentTarget;
        const dropdown = trigger.nextElementSibling;
        
        // Close all other dropdowns
        this.closeAllDropdowns();
        
        // Toggle current dropdown
        if (dropdown && dropdown.classList.contains('multiselect-dropdown')) {
            dropdown.classList.toggle('show');
            trigger.classList.toggle('active');
        }
    }
    
    closeAllDropdowns() {
        this.dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
        
        this.triggers.forEach(trigger => {
            trigger.classList.remove('active');
        });
    }
    
    updateDisplay() {
        this.triggers.forEach(trigger => {
            const container = trigger.closest('.multiselect-container');
            const checkboxes = container.querySelectorAll('input[type="checkbox"]:checked');
            const placeholder = trigger.querySelector('.multiselect-placeholder');
            
            if (checkboxes.length === 0) {
                placeholder.textContent = 'Выберите предмет';
                placeholder.classList.remove('has-selection');
            } else {
                const selectedLabels = Array.from(checkboxes).map(checkbox => 
                    checkbox.nextElementSibling.textContent
                );
                placeholder.textContent = selectedLabels.join(', ');
                placeholder.classList.add('has-selection');
            }
        });
    }
}

// Export classes for potential use in other files
window.TutorVic = {
    MobileMenu,
    Modal,
    Carousel,
    Form,
    RegistrationForm,
    Counter,
    SmoothScroll,
    Utils,
    TelegramLinks,
    PhoneMask,
    Multiselect,
    StoryReadMore
};
