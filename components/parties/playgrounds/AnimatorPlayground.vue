<template>
  <section class="playground animator-playground">
    <div v-if="!game.status" class="block waiting-animator">
      <div class="head">
        <h5>Partie</h5>
      </div>
      <div class="content">
        <PartyWaitingState />
      </div>
    </div>
    <Tabs v-else v-model="views" :value="views">
      <Tab id="global" name="Vue général" :hidden="game.status === 3">
        <PartyQuestionState :interactive="false" />
      </Tab>
      <Tab id="stats" name="Statistiques">
        <PartyStaticticsState :name="game.name" />
      </Tab>
      <Tab id="responses" name="Réponses" :hidden="game.status !== 1">
        <PartyQuestionState
          v-if="game.status === 1"
          :interactive="false"
          :force-answer="true"
        />
      </Tab>
    </Tabs>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AnimatorPlayground',
  data() {
    return {
      views: null,
    }
  },
  computed: mapState('parties', ['game']),
}
</script>

<style lang="scss">
.animator-playground {
  display: flex;
  flex-direction: column;

  .waiting-animator {
    flex: 1;
  }

  .tabs {
    width: 100%;
  }
}
</style>
