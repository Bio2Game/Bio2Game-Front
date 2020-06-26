<template>
  <div :class="['route', $route.name]">
    <Header />
    <div class="db-container">
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
  .page {
    position: absolute;
    z-index: 3;
    top: 0;
    left: 0;
    right: 0;
    padding: 30px 0;
    min-height: calc(100vh - 5rem);
  }
}
.route.index .db-container {
  .page {
    position: relative;
    background-color: white;
  }
}
</style>
