<template>
  <div class="formation-page">
    <div class="top">
      <h1>{{ formation.label }}</h1>
      <p>{{ formation.description }}</p>
    </div>
    <div class="container" v-html="content"></div>
  </div>
</template>

<script>
import { parseFormations } from '@/utils/markdown'

export default {
  name: 'Formation',
  async fetch({ store, params, error }) {
    try {
      const [, id] = params.formation.match(/^(\d+)-\S+$/)
      await store.dispatch('formations/fetchFormation', id)
    } catch (e) {
      console.error(e)
      error({
        statusCode: 404,
        message: 'Unable to fetch formation on the Bio2Game API',
      })
    }
  },
  computed: {
    content() {
      return this.formation
        ? parseFormations(this.formation.quizzes)(this.formation.content)
        : ''
    },
    formation() {
      return this.$store.state.formations.formation
    },
  },
}
</script>

<style lang="scss">
.formation-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  .nature {
    width: 350px;
    height: 293.5px;
    margin: 24px 0 16px;
  }
  .top {
    h1 {
      margin: 32px 0 24px;
      color: #292929;
      font-size: 36px;
      font-weight: 700;
      text-align: center;
    }
    p {
      color: #292929;
      font-size: 18px;
      text-align: center;
    }
  }
  .container {
    flex: 1;
    white-space: break-spaces;
    flex-direction: column;
    align-items: center;
  }
}
</style>
