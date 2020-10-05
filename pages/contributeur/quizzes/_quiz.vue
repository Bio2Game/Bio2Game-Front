<template>
  <div class="quiz-creation create">
    <div class="container">
      <div class="block">
        <div class="head">
          <div class="section">
            <InputElement
              :value="get('label')"
              type="text"
              name="label"
              class="white_label"
              placeholder="Libélé du quizz"
              :error="filtredErrors('label')"
              @input="(value) => (label = value)"
            />
            <InputElement
              :value="get('description')"
              type="text"
              name="name"
              class="white_label"
              placeholder="Description du quizz"
              :error="filtredErrors('description')"
              @input="(value) => (description = value)"
            />
          </div>
          <div class="section">
            <InputElement
              :value="get('domain_id')"
              type="number"
              name="domain_id"
              class="white_label"
              placeholder="domain_id"
              :error="filtredErrors('domainId')"
              @input="(value) => (domain_id = value)"
            />
            <InputElement
              :value="get('localisation')"
              type="text"
              name="localisation"
              class="white_label"
              placeholder="Localisation (optionnel)"
              :error="filtredErrors('localisation')"
              @input="(value) => (localisation = value)"
            />
          </div>
        </div>
        <div class="content">
          <TableElement
            v-if="questions.length"
            class="questions"
            :fields="tableFields"
            :data="questions"
            @selectRow="
              $router.push(
                `/contributeur/quizzes/${$route.params.quiz}/questions/${$event.data.id}`
              )
            "
          />
          <div v-else class="no-questions">
            <h3>Aucunes questions</h3>
            <p>Ce quiz ne contient pas la moindre question !</p>
            <div class="button md green equal" @click="createQuiz(true)">
              Créer une question
            </div>
          </div>
        </div>
      </div>
      <div class="buttons-bar">
        <nuxt-link class="button green lg" to="/contributeur/quizzes">
          Mes quizzes
        </nuxt-link>
        <nuxt-link class="button green lg" to="/contributeur/questions">
          Mes questions
        </nuxt-link>
        <div class="button green lg" @click="createQuiz()">Sauvegarder</div>
        <nuxt-link class="button green lg" to="/contributeur/quizzes">
          Supprimer
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

moment.locale('fr')

export default {
  name: 'Quiz',
  middleware: ['auth', 'contributor'],
  async asyncData({ store, error, params }) {
    if (params.quiz !== 'create') {
      try {
        await store.dispatch('quizzes/fetchPeronnalQuizzes')
      } catch (e) {
        error({
          statusCode: 503,
          message: 'Unable to fetch your quiz on the Bio2Game API',
        })
      }
    }
  },
  data() {
    return {
      label: null,
      description: null,
      domain_id: null,
      localisation: null,
      errors: [],
      questions: [],
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
          name: 'status',
          title: 'Status',
          formatter: (bool) => (bool ? 'Publique' : 'Privé'),
          sortField: 'status',
        },
        {
          name: 'updated_at',
          title: 'Edition',
          formatter: (date) => moment(date).fromNow(),
          sortField: 'updated_at',
        },
        {
          name: 'created_at',
          title: 'Création',
          formatter: (date) => moment(date).fromNow(),
          sortField: 'created_at',
        },
      ],
    }
  },
  computed: {
    quiz() {
      return this.$store.getters['quizzes/getPersonnalQuiz'](
        this.$route.params.quiz
      )
    },
    isCreationPage() {
      return this.$route.params.quiz === 'create'
    },
  },
  methods: {
    get(key) {
      return this[key] ? this[key] : this.quiz[key]
    },
    filtredErrors(field) {
      return this.errors.find((error) => error.field === field)
    },
    async createQuiz(questionCreation = false) {
      try {
        const quiz = await this.$store.dispatch(
          `quizzes/${this.isCreationPage ? 'create' : 'update'}Quiz`,
          {
            id: this.quiz.id,
            label: this.get('label'),
            url: this.generateURL(this.get('label')),
            description: this.get('description'),
            localisation: this.get('localisation'),
            status: this.get('status'),
            contributorId: this.$auth.user.id,
            domainId: this.get('domain_id'),
          }
        )

        if (questionCreation) {
          return this.$router.push(
            `/contributeur/quizzes/${quiz.id}-${quiz.url}/questions/create`
          )
        }

        return this.$router.push(`/contributeur/quizzes/${quiz.id}-${quiz.url}`)
      } catch (error) {
        const messages = error.response.data.messages
        if (messages) {
          this.errors = messages.errors
        }
        if (questionCreation) {
          this.$notify({
            type: 'error',
            text:
              'Veuillez résoudre les erreurs au niveau du quiz avant de vouloir créer une question.',
            duration: 3000,
            width: 400,
          })
        }
      }
    },
    generateURL(label = '') {
      /* eslint-disable no-control-regex */
      return label
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^\x00-\x7F]+/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
    },
  },
}
</script>

<style lang="scss">
.quiz-creation {
  .container {
    flex-direction: column;
    .block .head .section {
      display: flex;
      flex-direction: column;
      flex: 1 0;
      &:last-child {
        margin-left: 24px;
      }
    }
    .buttons-bar {
      display: flex;
      justify-content: space-between;
      margin: 24px -12px 0;
      .button {
        flex: 1;
        margin: 0 12px;
        max-width: none;
      }
    }
  }
  .block {
    flex: 1;
    flex-direction: column;
    margin-top: 32px;
    .content {
      min-height: calc(50vh);
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
      .big {
        width: 45%;
      }
    }
  }
}
</style>
