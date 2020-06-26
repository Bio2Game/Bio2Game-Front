<template>
  <div class="content-hero">
    <NotifHandler />
    <div class="content-part" :class="{ isFromIndex }">
      <svg
        class="decorator"
        fill="currentColor"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polygon points="0,0 100,0 0,100 0,100" />
      </svg>
      <div class="content-text">
        <h2>
          Chalengez-vous
          <br />
          sur la <span class="color">Nature</span> !
        </h2>
        <p>
          Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem
          cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat
          aliqua.
        </p>
        <div class="buttons">
          <a href="#" class="button green lg">
            Jouer
          </a>
          <a href="#" class="button gray lg right">
            Parties
          </a>
        </div>
      </div>
    </div>
    <div class="background">
      <div class="cover" />
      <div class="back" />
    </div>
  </div>
</template>

<script>
import NotifHandler from '~/components/home/NotifHandler.vue'

export default {
  name: 'Hero',
  components: {
    NotifHandler,
  },
  data() {
    return {
      isFromIndex: false,
    }
  },
  watch: {
    $route(newRoute, oldRoute) {
      this.isFromIndex = newRoute.name !== 'index' && oldRoute.name === 'index'
    },
  },
}
</script>

<style lang="scss">
.content-hero {
  position: relative;
  .content-part {
    display: flex;
    align-items: center;
    position: relative;
    width: 50%;
    height: calc(100vh - 5rem);
    transform: translateX(-50vw);
    transition: transform 0.6s ease;
    z-index: 10;
    &.isFromIndex {
      animation: fadeOutBiggerPage 0.3s ease-out forwards 0.6s;
      height: 100vh;
      @keyframes fadeOutBiggerPage {
        0% {
          height: 100vh;
        }
        100% {
          height: calc(100vh - 5rem);
        }
      }
    }
    .decorator {
      position: absolute;
      top: 0;
      left: 100%;
      color: white;
      width: 0;
      height: 100vh;
      transition: width 0.6s ease;
    }
    .content-text {
      padding-left: calc((100vw - 1280px) / 2);
      h2 {
        font-weight: 800;
        font-size: 64px;
        line-height: 70px;
        color: #161e2e;
        margin-bottom: 16px;
        .color {
          color: #19683b;
        }
      }
      p {
        font-size: 16px;
        line-height: 24px;
        color: #6b7280;
        margin-bottom: 24px;
      }
      .buttons {
        display: flex;
      }
    }
  }
  .background {
    min-height: calc(100vh - 5rem);
    transition: width 0.6s ease;
    position: fixed;
    right: 0;
    top: 0;
    width: 100%;
    .cover {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 2;
      background: rgba(200, 200, 200, 0.65);
      backdrop-filter: blur(16px);
      transition: 0.6s backdrop-filter ease;
    }
    .back {
      position: relative;
      height: 100vh;
      width: 100%;
      z-index: 1;
      background-image: url('/images/hero.jpg');
      background-position: center;
      background-size: cover;
      transition: width 0.6s ease;
    }
  }
}
.route.index {
  .content-part {
    transform: translateX(0);
    transition: transform 0.6s ease;
    height: 100vh;
    .decorator {
      width: 8vw;
    }
  }
  .background {
    width: 50%;
    min-height: 100vh;
    .cover {
      backdrop-filter: blur(0);
    }
  }
}
</style>
