<template>
  <div :class="['route', $route.name]">
    <Header />
    <div class="db-container">
      <div class="cover-hero" />
      <Hero />
      <transition name="slide">
        <Nuxt class="page" />
      </transition>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '~/components/inc/Header.vue'
import Footer from '~/components/inc/Footer.vue'
import Hero from '~/components/home/Hero.vue'

export default {
  components: {
    Header,
    Footer,
    Hero,
  },
}
</script>

<style lang="scss">
.slide-enter,
.slide-leave-to {
  opacity: 0;
}
.slide-leave,
.slide-enter-to {
  opacity: 1;
}
.slide-enter-active {
  position: absolute;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.6s ease-in-out;
}

.db-container {
  position: relative;
  min-height: calc(100vh - 5rem);
  .cover-hero {
    height: 0;
    transition: all 0.3s;
  }
  .page {
    position: relative;
    z-index: 3;
    padding-top: 24px;
    padding-bottom: 24px;
    min-height: calc(100vh - 5rem);
  }
}
.route.index .db-container {
  .page {
    background-color: white;
  }
  .cover-hero {
    height: 100vh;
    transition: all 0.1s;
  }
}

.vue-notification-group {
  top: 6rem !important;
  width: 400px !important;
  .notifications {
    padding: 16px;
    margin: 0 16px 8px;
    font-size: 14px;
    color: #636363;
    background: #ffffff;
    border-left: 5px solid #187fe7;
    box-shadow: 0 3px 6px #00000033;

    &.warn {
      background: #ffb648;
      border-left-color: #f48a06;
    }

    &.error {
      background: #e54d42;
      color: #ffffff;
      border-left-color: #b82e24;
    }

    &.success {
      // background: #68cd86;
      color: #636363;
      border-left-color: #42a85f;
    }
  }
}
</style>
