<template>
  <Nuxt class="page" />
</template>

<script>
export default {
  head: {
    meta: [
      // OpenGraph data (Most widely used)
      {
        hid: 'robots',
        name: 'robots',
        content: 'noindex',
      },
    ],
  },
}
</script>

<style lang="scss">
.page {
  position: relative;
  z-index: 3;
  padding-top: 24px;
  padding-bottom: 24px;
  min-height: calc(100vh - 5rem);
}
</style>
