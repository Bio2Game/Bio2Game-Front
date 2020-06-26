<template>
  <div v-if="display" class="notif-container">
    <div class="notif" :class="{ hide }">
      <h3 class="title">Un nouveau quiz est disponible !</h3>
      <div class="quiz">
        <div class="icon">
          <img src="/images/icon-notif.svg" />
        </div>
        <div class="quiz-content">
          <h4 class="name">Devoirs de vigilance</h4>
          <div class="description">
            Qu'est ce que le devoir de vigilance des entreprises
          </div>
        </div>
      </div>
      <div class="buttons">
        <nuxt-link class="button lg green" to="/quiz">Jouer</nuxt-link>
        <nuxt-link class="button lg white right" to="/quiz">
          <i class="material-icons">add</i><span>Ma liste</span>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Notif',
  data() {
    return {
      hide: false,
      display: true,
    }
  },
  watch: {
    $route(newValue, oldValue) {
      this.hide =
        this.display && oldValue.name === 'index' && newValue.name !== 'index'
    },
  },
  mounted() {
    this.hide = this.$route.name !== 'index'
  },
}
</script>

<style lang="scss">
.notif-container {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 4;
  overflow: hidden;
  .notif {
    min-width: 22vw;
    max-width: 420px;
    background-color: #f5f5f5;
    border-radius: 6px;
    position: relative;
    padding: 24px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    margin-bottom: 40px;
    margin-right: 40px;
    transform: translateX(550px);
    animation: fadeInLeft 0.3s ease-out forwards 1s;
    @keyframes fadeInLeft {
      0% {
        opacity: 0;
        transform: translateX(550px);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
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
    .title {
      font-weight: 500;
      font-size: 22px;
      line-height: 27px;
      color: #000000;
      margin-bottom: 24px;
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
        .name {
          font-weight: 500;
          font-size: 20px;
          line-height: 24px;
          color: #19683b;
        }
        .description {
          font-weight: 500;
          font-size: 14px;
          line-height: 17px;
          color: #494949;
        }
      }
    }
    .buttons {
      display: flex;
      justify-content: flex-end;
    }
    .close {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
</style>
