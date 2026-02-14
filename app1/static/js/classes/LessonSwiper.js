export class LessonSwiper {
  constructor(selector) {
    this.selector = selector;
    this.swiper = null;
    this.init();
  }

  init() {
    this.swiper = new Swiper(this.selector, {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.lesson__pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.lesson__next',
        prevEl: '.lesson__prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
      },
    });
  }
}
