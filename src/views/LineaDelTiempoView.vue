<template>
    <div class="container">
      <h1 class="title">Responsive Slider Timeline</h1>
      <div class="timeline">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div
              class="swiper-slide"
              v-for="i in 6"
              :key="i"
              :style="`background-image: url(https://unsplash.it/1920/500?image=1${i})`"
              :data-year="`201${i}`"
            >
              <div class="swiper-slide-content">
                <span class="timeline-year">201{{ i }}</span>
                <h4 class="timeline-title">Our nice super title</h4>
                <p class="timeline-text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua.
                </p>
              </div>
            </div>
          </div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
          <div class="swiper-pagination"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { onMounted } from 'vue'
  import Swiper from 'swiper'
  import 'swiper/swiper-bundle.css'
  
  export default {
    name: 'LineaDelTiempoView',
    setup() {
      onMounted(() => {
        new Swiper('.swiper-container', {
          direction: 'vertical',
          loop: false,
          speed: 1600,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
              const year = document.querySelectorAll('.swiper-slide')[index].getAttribute('data-year')
              return `<span class="${className}">${year}</span>`
            }
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          breakpoints: {
            768: {
              direction: 'horizontal'
            }
          }
        })
      })
    }
  }
  </script>
  
  <style scoped lang="scss">
  $white: #fff;
  $black: #000;
  $primary: #d4a024;
  $gray: #616161;
  
  html,
  body,
  .container {
    height: 100%;
  }
  
  body {
    font-family: 'Open Sans', sans-serif;
    font-size: 14px;
  }
  
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    flex-direction: column;
  }
  
  .title {
    font-size: 38px;
    color: $gray;
    font-style: italic;
    font-weight: 800;
  }
  
  .timeline {
    width: 100%;
    background-color: #fff;
    box-shadow: 0 5px 25px 5px rgba($black, 0.2);
  
    .swiper-container {
      height: 600px;
      width: 100%;
      position: relative;
    }
  
    .swiper-wrapper {
      transition: 2s cubic-bezier(0.68, -0.4, 0.27, 1.34) 0.2s;
    }
  
    .swiper-slide {
      position: relative;
      color: $white;
      overflow: hidden;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
  
      &::after {
        content: '';
        position: absolute;
        z-index: 1;
        right: -115%;
        bottom: -10%;
        width: 100%;
        height: 100%;
        background-color: rgba($black, 0.7);
        box-shadow: -230px 0 150px 60vw rgba($black, 0.7);
        border-radius: 100%;
      }
  
      &-content {
        position: absolute;
        text-align: center;
        width: 80%;
        max-width: 310px;
        right: 50%;
        top: 13%;
        transform: translate(50%, 0);
        font-size: 12px;
        z-index: 2;
      }
  
      .timeline-year {
        display: block;
        font-style: italic;
        font-size: 42px;
        margin-bottom: 50px;
        transform: translate3d(20px, 0, 0);
        color: $primary;
        font-weight: 300;
        opacity: 0;
        transition: 0.2s ease 0.4s;
      }
  
      .timeline-title {
        font-weight: 800;
        font-size: 34px;
        margin: 0 0 30px;
        opacity: 0;
        transform: translate3d(20px, 0, 0);
        transition: 0.2s ease 0.5s;
      }
  
      .timeline-text {
        line-height: 1.5;
        opacity: 0;
        transform: translate3d(20px, 0, 0);
        transition: 0.2s ease 0.6s;
      }
  
      &-active {
        .timeline-year,
        .timeline-title,
        .timeline-text {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
  
        .timeline-year {
          transition: 0.4s ease 1.6s;
        }
  
        .timeline-title {
          transition: 0.4s ease 1.7s;
        }
  
        .timeline-text {
          transition: 0.4s ease 1.8s;
        }
      }
    }
  
    .swiper-pagination {
      right: 15% !important;
      height: 100%;
      display: none;
      flex-direction: column;
      justify-content: center;
      font-style: italic;
      font-weight: 300;
      font-size: 18px;
      z-index: 1;
  
      &::before {
        content: '';
        position: absolute;
        left: -30px;
        top: 0;
        height: 100%;
        width: 1px;
        background-color: rgba($white, 0.2);
      }
  
      &-bullet {
        width: auto;
        height: auto;
        text-align: center;
        opacity: 1;
        background: transparent;
        color: $primary;
        margin: 15px 0 !important;
        position: relative;
  
        &::before {
          content: '';
          position: absolute;
          top: 8px;
          left: -32.5px;
          width: 6px;
          height: 6px;
          border-radius: 100%;
          background-color: $primary;
          transform: scale(0);
          transition: 0.2s;
        }
  
        &-active {
          color: $primary;
  
          &::before {
            transform: scale(1);
          }
        }
      }
    }
  
    .swiper-button-next,
    .swiper-button-prev {
      background-size: 20px 20px;
      top: 15%;
      width: 20px;
      height: 20px;
      margin-top: 0;
      z-index: 2;
      transition: 0.2s;
    }
  
    .swiper-button-prev {
      left: 8%;
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http://www.w3.org/2000/svg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0,22L22,0l2.1,2.1L4.2,22l19.9,19.9L22,44L0,22L0,22L0,22z'%20fill%3D'%23d4a024'/%3E%3C/svg%3E");
  
      &:hover {
        transform: translateX(-3px);
      }
    }
  
    .swiper-button-next {
      right: 8%;
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http://www.w3.org/2000/svg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27,22L27,22L5,44l-2.1-2.1L22.8,22L2.9,2.1L5,0L27,22L27,22z'%20fill%3D'%23d4a024'/%3E%3C/svg%3E");
  
      &:hover {
        transform: translateX(3px);
      }
    }
  
    @media screen and (min-width: 768px) {
      .swiper-slide {
        &::after {
          right: -30%;
          bottom: -8%;
          width: 240px;
          height: 50%;
          box-shadow: -230px 0 150px 50vw rgba($black, 0.7);
        }
  
        &-content {
          right: 30%;
          top: 50%;
          transform: translateY(-50%);
          width: 310px;
          font-size: 11px;
          text-align: right;
        }
  
        .timeline-year {
          margin-bottom: 0;
          font-size: 32px;
        }
  
        .timeline-title {
          font-size: 46px;
          margin: 0;
        }
      }
  
      .swiper-pagination {
        display: flex;
      }
  
      .swiper-button-prev {
        top: 15%;
        left: auto;
        right: 15%;
        transform: rotate(90deg) translate(0, 10px);
  
        &:hover {
          transform: rotate(90deg) translate(-3px, 10px);
        }
      }
  
      .swiper-button-next {
        top: auto;
        bottom: 15%;
        right: 15%;
        transform: rotate(90deg) translate(0, 10px);
  
        &:hover {
          transform: rotate(90deg) translate(3px, 10px);
        }
      }
    }
  
    @media screen and (min-width: 1024px) {
      .swiper-slide {
        &::after {
          right: -20%;
          bottom: -12%;
          width: 240px;
          height: 50%;
          box-shadow: -230px 0 150px 39vw rgba($black, 0.7);
        }
  
        &-content {
          right: 25%;
        }
      }
    }
  }
  </style>
  