<template>
  <section v-show="active" :id="id" class="tab-content">
    <slot />
  </section>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      active: false,
    }
  },
  watch: {
    hidden(value) {
      if (value && this.active) {
        this.$parent.selectTab(this.$parent.lastActiveTab, null)
      }
    },
  },
}
</script>
