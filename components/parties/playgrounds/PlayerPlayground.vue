<template>
  <section class="playground user-playground block">
    <div class="head">
      <h5>Partie</h5>
      Statu: {{ game.status }}
    </div>
    <div class="content">
      <WaitingState v-if="!game.status" />
      <QuestionState v-else-if="game.status !== 3" />
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'PlayerPlayground',
  computed: mapState('parties', ['game']),
}
</script>
