<template>
  <div class="quiz-creation index">
    <div class="container">
      <div class="block">
        <div class="head">
          <h5>Configuration du Quiz</h5>
          <nuxt-link
            to="/contributeur/quizzes/create"
            class="button white_sky sm equal"
          >
            Créer un quizz
          </nuxt-link>
        </div>
        <div class="content">
          <client-only placeholder="Loading...">
            <vuetable
              :apiMode="false"
              :data="quizzes"
              :fields="tableFields"
              :perPage="20"
              data-path=""
              paginationPath=""
            ></vuetable>
          </client-only>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vuetable from 'vuetable-2'

export default {
  name: 'MesQuizzes',
  components: {
    Vuetable,
  },
  middleware: ['auth', 'contributor'],
  async fetch({ store, error }) {
    try {
      await store.dispatch('quizzes/fetchPeronnalQuizzes')
    } catch (e) {
      error({
        statusCode: 503,
        message: 'Unable to fetch your quizzes on the Bio2Game API',
      })
    }
  },
  data() {
    return {
      tableFields: [
        {
          name: 'id',
          title: 'ID',
        },
        {
          name: 'label',
          title: 'Nom',
        },
        {
          name: 'domain.name',
          title: 'Domaine',
        },
        {
          name: 'language',
          title: 'Langue',
        },
        {
          name: 'public',
          title: 'Publique',
        },
        {
          name: 'user_id',
          title: 'Contributeur',
        },
        {
          name: 'id',
          title: 'Questions',
        },
        {
          name: 'updated_at',
          title: 'Edition',
        },
        {
          name: 'created_at',
          title: 'Création',
        },
      ],
    }
  },
  computed: {
    quizzes() {
      return this.$store.state.quizzes.contributor_quizzes
    },
  },
}
</script>

<style lang="scss">
.quiz-creation.index {
  .block {
    flex-direction: column;
    .head {
      align-items: center;
    }
  }
}
</style>
