<template>
  <div class="quiz-creation index">
    <div class="container">
      <div class="block">
        <div class="head">
          <h5>Mes questions</h5>
          <nuxt-link to="/contributeur/questions/create" class="button white_sky sm equal">
            Créer une question
          </nuxt-link>
        </div>
        <div class="content">
          <TableElement
            v-if="questions.length"
            :fields="tableFields"
            :data="questions"
            @selectRow="
              $router.push(
                `/contributeur/quizzes/${$event.data.quiz.id}-${$event.data.quiz.url}/questions/${$event.data.id}`,
              )
            "
          />
          <div v-else class="no-questions">
            <h3>Aucunes questions</h3>
            <p>Ce quiz ne contient pas la moindre question !</p>
            <nuxt-link to="/contributeur/questions/create" class="button md green equal">
              Créer une question
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

moment.locale('fr')

export default {
  name: 'MesQuestions',
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
      return this.$store.state.quizzes.contributorQuizzes
        .map(quiz => quiz.questions.map(question => ({ ...question, quiz })))
        .flat()
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
          font-weight: 700;
          font-size: 32px;
          color: $green;
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
</style>
