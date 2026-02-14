/**
 * Carousel Component
 * Enhanced carousel functionality with custom controls
 */

class CarouselComponent {
    constructor() {
        this.coursesSwiper = null;
        this.testimonialsSwiper = null;
        this.currentSlide = 0;
        
        this.init();
    }
    
    init() {
        this.initCoursesCarousel();
        this.initTestimonialsCarousel();
        this.setupCustomControls();
    }
    
    initCoursesCarousel() {
        const container = document.querySelector('.courses-swiper');
        if (!container) return;
        
        this.coursesSwiper = new Swiper('.courses-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                576: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            },
            on: {
                slideChange: () => {
                    this.handleSlideChange('courses');
                }
            }
        });
    }
    
    initTestimonialsCarousel() {
        const container = document.querySelector('.testimonials-swiper');
        if (!container) return;
        
        this.testimonialsSwiper = new Swiper('.testimonials-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30
                }
            },
            on: {
                slideChange: () => {
                    this.handleSlideChange('testimonials');
                }
            }
        });
    }
    
    setupCustomControls() {
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
        
        // Add touch/swipe indicators
        this.addSwipeIndicators();
    }
    
    handleSlideChange(type) {
        this.currentSlide = type === 'courses' ? 
            this.coursesSwiper?.realIndex || 0 : 
            this.testimonialsSwiper?.realIndex || 0;
        
        // Add any custom logic for slide changes
        this.updateSlideCounter(type);
    }
    
    updateSlideCounter(type) {
        const counter = document.querySelector(`.${type}-counter`);
        if (counter) {
            const total = type === 'courses' ? 
                this.coursesSwiper?.slides?.length || 0 : 
                this.testimonialsSwiper?.slides?.length || 0;
            counter.textContent = `${this.currentSlide + 1} / ${total}`;
        }
    }
    
    nextSlide() {
        if (this.coursesSwiper) {
            this.coursesSwiper.slideNext();
        }
        if (this.testimonialsSwiper) {
            this.testimonialsSwiper.slideNext();
        }
    }
    
    previousSlide() {
        if (this.coursesSwiper) {
            this.coursesSwiper.slidePrev();
        }
        if (this.testimonialsSwiper) {
            this.testimonialsSwiper.slidePrev();
        }
    }
    
    addSwipeIndicators() {
        // Add visual indicators for touch devices
        const carousels = document.querySelectorAll('.swiper');
        carousels.forEach(carousel => {
            const indicator = document.createElement('div');
            indicator.className = 'swipe-indicator';
            indicator.innerHTML = '<i class="fas fa-hand-paper"></i> Проведите для навигации';
            carousel.appendChild(indicator);
            
            // Hide indicator after first interaction
            carousel.addEventListener('touchstart', () => {
                indicator.style.opacity = '0';
            }, { once: true });
        });
    }
    
    // Public methods for external control
    goToSlide(slideIndex, type = 'courses') {
        if (type === 'courses' && this.coursesSwiper) {
            this.coursesSwiper.slideTo(slideIndex);
        } else if (type === 'testimonials' && this.testimonialsSwiper) {
            this.testimonialsSwiper.slideTo(slideIndex);
        }
    }
    
    pauseAutoplay(type = 'all') {
        if (type === 'all' || type === 'courses') {
            this.coursesSwiper?.autoplay?.stop();
        }
        if (type === 'all' || type === 'testimonials') {
            this.testimonialsSwiper?.autoplay?.stop();
        }
    }
    
    startAutoplay(type = 'all') {
        if (type === 'all' || type === 'courses') {
            this.coursesSwiper?.autoplay?.start();
        }
        if (type === 'all' || type === 'testimonials') {
            this.testimonialsSwiper?.autoplay?.start();
        }
    }
}

// Initialize carousel component when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.carouselComponent = new CarouselComponent();
});
