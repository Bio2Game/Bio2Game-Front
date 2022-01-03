<template>
  <img :src="getImage" :alt="name" :width="size" :height="size" />
</template>

<script>
import md5 from 'md5'

export default {
  name: 'AvatarElement',
  props: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: '',
    },
    path: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      default: 16,
    },
  },
  computed: {
    getImage() {
      if (this.path) {
        if (this.path.startsWith('http')) return this.path
        return `${this.$config.cdnURL}/${this.path}`
      }
      return `https://www.gravatar.com/avatar/${md5(
        this.email.trim().toLowerCase()
      )}?s=${this.size}&d=mp`
    },
  },
}
</script>
