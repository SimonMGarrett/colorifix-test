<template>
  <div
    class="scrolling-container w-full border-t border-b border-gray-200 px-4 my-8"
  >
    <div
      ref="formSwiper"
      class="scrolling-wrapper-flexbox flex flex-nowrap content-start overflow-auto form-swiper w-full px-0 py-8"
    >
      <slot />
      <div style="padding-right: 1px;"></div>
    </div>

    <div class="scroll scroll-left" @click="scrollLeft()">&lt;</div>
    <div class="scroll scroll-right" @click="scrollRight()">&gt;</div>
  </div>
</template>

<script>
import $ from 'cash-dom'; // mini version of jQuery

export default {
  data() {
    return {
      onSlide: 0,
    };
  },

  computed: {
    slides() {
      return Array.from(
        document.querySelectorAll('.scrolling-wrapper-flexbox .swiper-card')
      );
    },
  },

  mounted() {
    console.log('MOUNTED'); // eslint-disable-line no-console
    this.recheckSlides();
  },

  methods: {
    recheckSlides() {
      const slides = Array.from(
        document.querySelectorAll('.scrolling-wrapper-flexbox .swiper-card')
      );
      console.log('-- SLIDES', slides); // eslint-disable-line no-console
      slides.forEach(slide => {
        console.log('setting event'); // eslint-disable-line no-console
        slide.onclick = this.scrollToSlide;
      });
    },
    scroll(amount) {
      console.log('... scrolling by', amount); // eslint-disable-line no-console
      const elem = document.querySelector('.scrolling-wrapper-flexbox');
      if (elem.scrollTo) {
        elem.scrollTo({
          top: 0,
          left: elem.scrollLeft + amount,
          behavior: 'smooth',
        });
      } else {
        elem.scrollLeft += amount; // IE11
      }
    },
    scrollMeTo(pos) {
      console.log('... scrolling to', pos); // eslint-disable-line no-console
      const elem = document.querySelector('.scrolling-wrapper-flexbox');
      if (elem.scrollTo) {
        elem.scrollTo({
          top: 0,
          left: pos,
          behavior: 'smooth',
        });
      } else {
        elem.scrollLeft = pos; // IE11
      }
    },
    scrollLeft() {
      const amount =
        Array.from(document.querySelectorAll('.swiper-card'))[0].clientWidth +
        32 +
        16;
      this.scroll(-amount);
    },
    scrollRight() {
      const amount =
        Array.from(document.querySelectorAll('.swiper-card'))[0].clientWidth +
        32 +
        16;
      this.scroll(amount);
    },
    scrollToSlide(evt) {
      console.log('evt *', evt); // eslint-disable-line no-console
      const chosenCard = evt.target.closest('.swiper-card');
      const num = parseInt($(chosenCard).data('slider-card-indx'), 10);
      const widthOfScroller = this.$el.clientWidth;
      const widthOfSlide = chosenCard.clientWidth;
      console.log('widthOfScroller', widthOfScroller); // eslint-disable-line no-console
      const offsetCentreSlide = chosenCard.offsetLeft + widthOfSlide / 2;
      const offsetLeft = 17 + offsetCentreSlide - widthOfScroller / 2;
      console.log('-- scroll to slide', num, offsetLeft); // eslint-disable-line no-console
      this.scrollMeTo(offsetLeft);

      // Remove active from all, add to new active
      this.slides.forEach(slide => {
        slide.classList.remove('active');
      });
      chosenCard.classList.add('active');
    },
  },
};
</script>

<style>
.scrolling-container {
  position: relative;
}

.scrolling-wrapper-flexbox {
  position: relative;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
}
.scrolling-wrapper-flexbox::-webkit-scrollbar {
  display: none;
}

.scroll {
  position: absolute;
  height: 32px;
  width: 32px;
  top: calc(50% - 16px);
  font-size: 22px;
  opacity: 0.5;
  border-radius: 100%;
  color: white;
  background-color: rgba(128, 128, 128, 0.8);
  text-align: center;
  cursor: pointer;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
}
.scroll:hover {
  opacity: 0.8;
}
.scroll-left {
  left: -12px;
}
.scroll-right {
  right: -12px;
}

.swell {
  transform: scale(1, 1);
  transition: transform 0.25s ease-in-out;
}
.swell:hover,
.swell.active {
  transform: scale(1.04, 1.04);
}
</style>
