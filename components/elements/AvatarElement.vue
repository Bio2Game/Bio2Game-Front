<template>
  <img :src="getImage" :alt="name" :width="size" :height="size" />
</template>

<script>
import md5 from 'md5'

export default {
  name: 'Avatar',
  props: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
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
      return this.path
        ? `https://www.bio2game.com/avatar_uploads/${this.path}`
        : `https://www.gravatar.com/avatar/` +
            md5(this.email.trim().toLowerCase()) +
            `?s=${this.size}&d=mp`
    },
  },
}
</script>
