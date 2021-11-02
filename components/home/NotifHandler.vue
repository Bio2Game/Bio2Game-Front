<template>
  <div v-if="display" class="notif-container">
    <div class="notif" :class="{ hide, small }" @click="small = !small">
      <svg
        class="notif-icon"
        width="32"
        height="40"
        viewBox="0 0 32 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M31.7381 32.5714C30.8073 30.8584 29.7682 29.2165 28.8103 27.5208C28.6034 27.1533 28.4777 26.673 28.4714 26.2413C28.438 23.9873 28.4905 21.7334 28.4491 19.4794C28.3441 13.874 26.0002 9.73717 21.4605 7.10698C21.0054 6.84344 20.8049 6.61285 20.8001 6.02335C20.7794 3.04467 18.6743 0.766445 16.0249 0.787251C13.4105 0.806323 11.3451 3.08281 11.3308 6.02335C11.3276 6.61111 11.1287 6.84171 10.6704 7.10351C6.70989 9.36267 4.26896 12.884 3.81547 17.7543C3.55451 20.5596 3.72159 23.41 3.66112 26.2378C3.65157 26.6713 3.52746 27.1515 3.3206 27.5174C2.39451 29.1662 1.42068 30.7856 0.456407 32.4084C0.131799 32.9546 -0.189627 33.4869 0.138164 34.1683C0.477093 34.8705 1.06584 34.9381 1.70233 34.9363C4.40581 34.9294 7.11088 34.9415 9.81436 34.9242C10.2328 34.9225 10.4604 35.0248 10.6307 35.4946C11.5822 38.1213 13.6062 39.6454 16.0583 39.6436C18.4976 39.6419 20.528 38.1144 21.4939 35.4929C21.6673 35.0213 21.8949 34.9173 22.3118 34.9242C23.6898 34.9467 25.0694 34.9329 26.4473 34.9329C27.8269 34.9329 29.2049 34.9294 30.5845 34.9346C31.1749 34.9381 31.8018 34.8254 31.953 34.1613C32.0659 33.6741 31.9736 33.0066 31.7381 32.5714ZM15.958 3.48679C17.2342 3.41744 18.2367 4.42998 18.2733 5.8205H13.8958C13.8067 4.60856 14.7185 3.55267 15.958 3.48679ZM16.1951 36.9441C14.8426 37.0013 13.8306 36.3685 13.0525 34.9831H19.0673C18.3608 36.2523 17.4395 36.8903 16.1951 36.9441ZM3.52427 32.1865C3.99368 31.3803 4.34693 30.6174 4.83066 29.969C5.89041 28.5455 6.20707 26.9695 6.15615 25.1455C6.08613 22.5535 6.01453 19.9146 6.36778 17.3642C7.12679 11.8698 11.7031 8.08312 16.7807 8.44375C21.7342 8.79398 25.7711 13.3262 25.9461 18.8189C26.0305 21.4751 25.9636 24.1364 26.0305 26.7926C26.0448 27.3908 26.2389 28.0375 26.511 28.5629C27.1316 29.7592 27.8524 30.8948 28.6098 32.1865H3.52427V32.1865Z"
          fill="#B9E140"
        />
      </svg>

      <h3 class="title">Un nouveau quiz est disponible !</h3>
      <div class="wrapper">
        <div class="quiz">
          <div class="icon">
            <img src="../../assets/icons/notif.svg" />
          </div>
          <div class="quiz-content">
            <h4 class="name">Devoirs de vigilance</h4>
            <div class="description">
              Qu'est ce que le devoir de vigilance des entreprises
            </div>
          </div>
        </div>
        <div class="buttons">
          <nuxt-link class="button sm green" to="/quiz">Jouer</nuxt-link>
          <nuxt-link class="button sm white right" to="/quiz">
            <i class="material-icons">add</i><span>Ma liste</span>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotifHandler',
  data() {
    return {
      hide: false,
      display: true,
      small: true,
    }
  },
  watch: {
    $route(newValue, oldValue) {
      this.display = newValue.name === 'index' || oldValue.name === 'index'
      this.hide = newValue.name !== 'index'
    },
  },
  mounted() {
    this.display = this.$route.name === 'index'
    this.hide = this.$route.name !== 'index'
  },
}
</script>

<style lang="scss">
.notif-container {
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  height: 100vh;
  @media screen and (max-width: 1024px) {
    top: calc(100vh - 190px);
  }
  @media screen and (max-width: 768px) {
    display: none;
  }

  .notif {
    position: relative;
    overflow: hidden;
    width: 350px;
    height: 247px;
    padding: 24px;
    border: 3px solid #bce342;
    cursor: pointer;
    max-width: 350px;
    background-color: #f5f5f5;
    border-radius: 40px 40px 0 0;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    margin-right: 40px;
    transform: translateY(550px);
    animation: fadeUp 0.3s ease-out forwards 1s;
    transition: 0.2s width ease-out, 0.2s height ease-out, 0.3s padding ease;
    @media screen and (max-width: 1024px) {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-left: 40px;
      max-width: 100%;
    }
    @keyframes fadeUp {
      0% {
        opacity: 0;
        transform: translateY(550px);
      }

      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    &.hide {
      animation: fadeInRight 0.3s ease-out forwards;
      @keyframes fadeInRight {
        0% {
          opacity: 1;
          transform: translateX(0);
        }

        100% {
          opacity: 0;
          transform: translateX(500px);
        }
      }
    }

    .notif-icon {
      position: absolute;
      transform: translateY(600px);
      transition: 0.2s transform ease;
    }

    .title {
      color: #000000;
      font-size: 20px;
      font-weight: 700;
      line-height: 27px;
      text-align: center;
      margin-bottom: 16px;
      min-width: 296px;
      @media screen and (max-width: 1024px) {
        width: 100%;
      }
    }

    .wrapper {
      display: flex;
      justify-content: space-between;
      width: 100%;
      flex-direction: column;
      transition: 0.1s opacity ease-in-out, 0.2s transform ease-in-out;
      min-width: 296px;
      @media screen and (max-width: 1024px) {
        flex-direction: row;
      }

      .quiz {
        display: flex;

        .icon {
          width: 48px;
          min-width: 48px;
          min-height: 48px;
          margin-right: 16px;
        }

        .quiz-content {
          display: flex;
          flex-direction: column;
          margin-bottom: 24px;
          @media screen and (max-width: 1024px) {
            margin-bottom: 0;
          }

          .name {
            color: $green;
            font-size: 20px;
            font-weight: 500;
            line-height: 24px;
            margin-bottom: 4px;
          }

          .description {
            color: #494949;
            font-size: 15px;
            font-weight: 500;
            line-height: 17px;
          }
        }
      }

      .buttons {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
      }

      .close {
        position: absolute;
        top: 0;
        right: 0;
      }
    }

    &.small {
      width: 72px;
      height: 64px;
      padding: 11px 16px;

      .notif-icon {
        transform: translateY(0);
      }

      .wrapper,
      .title {
        opacity: 0;
        transform: scale(0.3) translateY(50px);
      }
    }
  }
}
</style>
