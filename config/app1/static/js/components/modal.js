/**
 * Modal Component
 * Enhanced modal functionality with animations and accessibility
 */

class ModalComponent {
    constructor() {
        this.modals = document.querySelectorAll('.modal');
        this.activeModal = null;
        this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        this.init();
    }
    
    init() {
        this.setupModals();
        this.setupEventListeners();
    }
    
    setupModals() {
        this.modals.forEach(modal => {
            // Add ARIA attributes for accessibility
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('aria-hidden', 'true');
            
            // Add animation classes
            modal.classList.add('modal--animated');
        });
    }
    
    setupEventListeners() {
        // Handle modal triggers
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-bs-toggle="modal"]');
            if (trigger) {
                const targetId = trigger.getAttribute('data-bs-target');
                const modal = document.querySelector(targetId);
                if (modal) {
                    e.preventDefault();
                    this.openModal(modal);
                }
            }
        });
        
        // Handle close buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-bs-dismiss="modal"]') || 
                e.target.matches('.btn-close')) {
                this.closeActiveModal();
            }
        });
        
        // Handle backdrop clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal') && e.target === this.activeModal) {
                this.closeActiveModal();
            }
        });
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeActiveModal();
            }
        });
        
        // Handle tab navigation within modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && this.activeModal) {
                this.handleTabNavigation(e);
            }
        });
    }
    
    openModal(modal) {
        this.activeModal = modal;
        modal.setAttribute('aria-hidden', 'false');
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
        
        // Focus management
        this.trapFocus(modal);
        
        // Add opening animation
        requestAnimationFrame(() => {
            modal.classList.add('modal--show');
        });
        
        // Prevent body scroll
        this.preventBodyScroll();
        
        // Emit custom event
        modal.dispatchEvent(new CustomEvent('modal:opened', { detail: { modal } }));
    }
    
    closeActiveModal() {
        if (!this.activeModal) return;
        
        const modal = this.activeModal;
        modal.classList.remove('modal--show');
        
        // Wait for animation to complete
        setTimeout(() => {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
            this.activeModal = null;
            
            // Restore body scroll
            this.restoreBodyScroll();
            
            // Return focus to trigger element
            this.returnFocus();
            
            // Emit custom event
            modal.dispatchEvent(new CustomEvent('modal:closed', { detail: { modal } }));
        }, 300);
    }
    
    trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(this.focusableElements);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (firstElement) {
            firstElement.focus();
        }
        
        // Store elements for tab navigation
        modal._firstFocusable = firstElement;
        modal._lastFocusable = lastElement;
    }
    
    handleTabNavigation(e) {
        const modal = this.activeModal;
        if (!modal) return;
        
        const firstElement = modal._firstFocusable;
        const lastElement = modal._lastFocusable;
        
        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement?.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement?.focus();
            }
        }
    }
    
    returnFocus() {
        const trigger = document.querySelector('[data-bs-toggle="modal"]:focus');
        if (trigger) {
            trigger.focus();
        }
    }
    
    preventBodyScroll() {
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
    }
    
    restoreBodyScroll() {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    
    // Public methods
    openModalById(id) {
        const modal = document.getElementById(id);
        if (modal) {
            this.openModal(modal);
        }
    }
    
    closeModalById(id) {
        const modal = document.getElementById(id);
        if (modal && modal === this.activeModal) {
            this.closeActiveModal();
        }
    }
    
    isModalOpen() {
        return this.activeModal !== null;
    }
    
    getActiveModal() {
        return this.activeModal;
    }
}

// Initialize modal component when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.modalComponent = new ModalComponent();
});
