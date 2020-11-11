<template>
  <section class="playground user-playground block">
    <div class="head">
      <h5>Partie</h5>
    </div>
    <div class="content">
      <PartyWaitingState v-if="!game.status" />
      <PartyQuestionState v-else-if="game.status !== 3" />
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
