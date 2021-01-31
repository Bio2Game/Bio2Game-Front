<template>
  <div ref="container" />
</template>

<script>
import lottie from 'lottie-web'

export default {
  props: {
    animationData: {
      type: Object,
      required: true,
    },
    play: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    play(value) {
      if (value) {
        this.anim.play()
      } else {
        this.anim.pause()
      }
    },
  },
  mounted() {
    this.anim = lottie.loadAnimation({
      container: this.$refs.container,
      renderer: 'svg',
      loop: true,
      animationData: this.animationData,
      autoplay: this.play,
    })
  },
}
</script>
