export class ImageModal {
  constructor(modalSelector, imageSelector) {
    this.modal = document.querySelector(modalSelector);
    this.image = this.modal.querySelector(imageSelector);
    this.closeBtn = this.modal.querySelector('.image-modal__close');
    this.prevBtn = this.modal.querySelector('.image-modal__prev');
    this.nextBtn = this.modal.querySelector('.image-modal__next');
    this.counter = this.modal.querySelector('.image-modal__counter');
    this.overlay = this.modal.querySelector('.image-modal__overlay');
    
    this.images = document.querySelectorAll('.lesson__card img');
    this.currentIndex = 0;
    
    this.init();
  }

  init() {
    this.images.forEach((img, index) => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => this.open(index));
    });

    this.closeBtn.addEventListener('click', () => this.close());
    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());
    this.overlay.addEventListener('click', () => this.close());

    document.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  open(index) {
    this.currentIndex = index;
    this.update();
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  update() {
    const currentImage = this.images[this.currentIndex];
    this.image.src = currentImage.src;
    this.image.alt = currentImage.alt;
    this.counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.update();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.update();
  }

  handleKeydown(e) {
    if (!this.modal.classList.contains('active')) return;

    switch (e.key) {
      case 'Escape':
        this.close();
        break;
      case 'ArrowRight':
        this.next();
        break;
      case 'ArrowLeft':
        this.prev();
        break;
    }
  }
}
