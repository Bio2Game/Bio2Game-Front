<template>
  <div class="container">
    <div class="block index">
      <div class="head">
        <h5>Mes questions</h5>
        <nuxt-link
          to="/contributeur/questions/create"
          class="button white_sky sm equal"
        >
          Créer une question
        </nuxt-link>
      </div>
      <div class="content questions-list-creator">
        <client-only v-if="questions.length">
          <vuetable
            :fields="tableFields"
            :data="questions"
            :defaultSortBy="{ field: 'updated_at', direction: 'desc' }"
            @row-clicked="
              $router.push(
                `/contributeur/quiz/${$event.data.quiz.id}-${$event.data.quiz.url}/questions/${$event.data.id}`,
              )
            "
          />
        </client-only>
        <div v-else class="no-elements">
          <h3>Aucunes questions</h3>
          <p>Ce quiz ne contient pas la moindre question !</p>
          <nuxt-link
            to="/contributeur/questions/create"
            class="button md green equal"
          >
            Créer une question
          </nuxt-link>
        </div>
      </div>
    </div>
    <div class="buttons-bar">
      <nuxt-link class="button green lg" to="/contributeur/quiz">
        Mes quiz
      </nuxt-link>
      <nuxt-link class="button green lg" to="/contributeur/questions">
        Mes questions
      </nuxt-link>
      <div class="button green lg disabled">Sauvegarder</div>
      <div class="button green lg disabled">Supprimer</div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

import vuetable from 'vuetable-2'

moment.locale('fr')

export default {
  name: 'MesQuestions',
  components: {
    vuetable,
  },
  middleware: ['auth', 'contributor'],
  async fetch({ store, error }) {
    try {
      await store.dispatch('quizzes/fetchPeronnalQuizzes')
    } catch (e) {
      error({
        statusCode: 503,
        message: 'Unable to fetch your quiz on the Bio2Game API',
      })
    }
  },
  data() {
    return {
      tableFields: [
        {
          name: 'id',
          title: 'ID',
          sortField: 'id',
        },
        {
          name: 'label',
          title: 'Libélé',
          sortField: 'label',
        },
        {
          name: 'question',
          title: 'Question',
          sortField: 'question',
          titleClass: 'big',
          dataClass: 'big',
        },
        {
          name: 'quiz',
          title: 'Quiz',
          formatter: quiz => (quiz ? quiz.label : 'Aucun'),
          sortField: 'quiz',
        },
        {
          name: 'status',
          title: 'Status',
          formatter: bool => (bool ? 'Publique' : 'Privé'),
          sortField: 'status',
        },
        {
          name: 'updated_at',
          title: 'Edition',
          formatter: date => moment(date).fromNow(),
          sortField: 'updated_at',
        },
        {
          name: 'created_at',
          title: 'Création',
          formatter: date => moment(date).fromNow(),
          sortField: 'created_at',
        },
      ],
    }
  },
  computed: {
    questions() {
      return this.$store.getters['quizzes/questions']
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
    .content {
      .no-questions {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        h3 {
          color: $green;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 16px;
        }
        p {
          color: #777777;
          font-size: 16px;
          margin-bottom: 24px;
          text-align: center;
        }
      }
    }
  }
}
.questions-list-creator {
  .vuetable-td-id,
  .vuetable-th-id {
    padding-left: 16px !important;
  }
}
</style>
