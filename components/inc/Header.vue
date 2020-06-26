<template>
  <div class="header" :class="{ 'fixed-header': isFixed }">
    <div class="wrapper">
      <div class="container menu">
        <div class="left-menu">
          <nuxt-link to="/">
            <img class="logo" src="/images/logo.png" alt="Logo Bio2Game" />
          </nuxt-link>
          <nuxt-link class="link" to="/">Accueil</nuxt-link>
          <nuxt-link class="link" to="/quizs">Quizs</nuxt-link>
          <nuxt-link class="link" to="/parties">Parties</nuxt-link>
        </div>
        <div class="right-menu">
          <nuxt-link class="button md green" to="/">
            Créer un quiz
          </nuxt-link>
          <nuxt-link class="button md gray right" to="/login">
            Se connecter
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isFixed: false,
      stage: false,
    }
  },
  watch: {
    $route(newRoute, oldRoute) {
      if (newRoute.name !== 'index' && oldRoute.name === 'index') {
        this.stage = true
        setTimeout(() => {
          this.stage = false
        }, 600)
      }
      this.checkHeader()
    },
  },
  mounted() {
    this.checkHeader()
    window.addEventListener('scroll', this.checkHeader)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.checkHeader)
  },
  methods: {
    checkHeader() {
      if (this.$route.name !== 'index') {
        this.isFixed = true
        return
      }

      const position = window.pageYOffset || document.documentElement.scrollTop
      const isScrollingUp = this.isFixed ? position > 0 : position > 0

      if (this.isFixed !== isScrollingUp) {
        this.isFixed = isScrollingUp
      }
    },
  },
}
</script>

<style lang="scss">
.header {
  width: 100%;
  .wrapper {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 5rem;
    z-index: 20;
    background-color: white;
    transition: 0.1s background-color linear;
    .menu {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left-menu {
        display: flex;
        align-items: center;
        a .logo {
          height: 4rem;
          margin-top: -10px;
        }
        .link {
          font-weight: 500;
          font-size: 1rem;
          line-height: 24px;
          color: #4f4f4f;
          margin: 0 0.8rem;
          text-decoration: none;
        }
      }
      .right-menu {
        display: flex;
      }
    }
  }
  &.fixed-header {
    height: 0;
    animation: fadeOutBigger 0.3s ease-out forwards 0.4s;
    @keyframes fadeOutBigger {
      0% {
        height: 0;
      }
      100% {
        height: 5rem;
      }
    }
    .wrapper {
      transition: 0.1s background-color linear 0.3s;
      position: fixed !important;
      top: 0;
      z-index: 1000;
      opacity: 0;
      height: 5rem;
      animation: fadeIn 0.3s ease-out forwards 0.4s;
      @keyframes fadeIn {
        0% {
          opacity: 0;
          transform: translateY(-100px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
    }
  }
}
.route.index {
  .header {
    .wrapper {
      background-color: transparent;
      position: absolute;
    }
    &.fixed-header {
      height: 0;
      animation: none;
      .wrapper {
        background-color: white;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
          0 1px 2px 0 rgba(0, 0, 0, 0.06);
      }
    }
  }
}
</style>
