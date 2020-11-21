<template>
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
            @input="value => (label = value)"
          />
          <InputElement
            :value="get('description')"
            type="text"
            name="name"
            class="white_label"
            placeholder="Description du quizz"
            :error="filtredErrors('description')"
            @input="value => (description = value)"
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
            @input="value => (domain_id = value)"
          />
          <InputElement
            :value="get('localisation')"
            type="text"
            name="localisation"
            class="white_label"
            placeholder="Localisation (optionnel)"
            :error="filtredErrors('localisation')"
            @input="value => (localisation = value)"
          />
        </div>
        <div class="section top-buttons">
          <div class="button md equal border_white" @click="status = !status">
            {{ get('status') ? 'Publique' : 'Privé' }}
          </div>
          <div class="button white_sky sm equal" @click="createQuiz(true)">
            Créer une question
          </div>
        </div>
      </div>
      <div class="content">
        <TableElement
          v-if="quiz.questions && quiz.questions.length"
          class="questions"
          :fields="tableFields"
          :data="quiz.questions"
          @select-row="
            $router.push(
              `/contributeur/quiz/${$route.params.quiz}/questions/${$event.data.id}`,
            )
          "
        />
        <div v-else class="no-elements">
          <h3>Aucunes questions</h3>
          <p>Ce quiz ne contient pas la moindre question !</p>
          <div class="button md green equal" @click="createQuiz(true)">
            Créer une question
          </div>
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
      <div class="button green lg" @click="createQuiz()">Sauvegarder</div>
      <div class="button green lg" @click="deleteQuiz()">Supprimer</div>
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
      status: null,
      errors: [],
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
    quiz() {
      return this.$store.getters['quizzes/getPersonnalQuiz'](
        this.$route.params.quiz,
      )
    },
    isCreationPage() {
      return this.$route.params.quiz === 'create'
    },
    isDataEdited() {
      return !!(
        this.label !== null ||
        this.description !== null ||
        this.domain_id !== null ||
        this.localisation !== null ||
        this.status !== null
      )
    },
  },
  beforeRouteLeave(to, from, next) {
    if (!this.isDataEdited) {
      return next()
    }
    next(
      window.confirm(
        "Vous n'avez pas sauvegardé vos modifications, êtes vous sûr de vouloir quitter la page ?",
      ),
    )
  },
  methods: {
    get(key) {
      return this[key] ? this[key] : this.quiz[key]
    },
    filtredErrors(field) {
      return this.errors.find(error => error.field === field)
    },
    deleteData() {
      this.label = null
      this.description = null
      this.domain_id = null
      this.localisation = null
      this.status = null
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
            language: 'fr',
            contributorId: this.$auth.user.id,
            domainId: this.get('domain_id'),
            status: !!this.get('status') + 0,
          },
        )

        if (questionCreation) {
          this.deleteData()
          return this.$router.push(
            `/contributeur/quiz/${quiz.id}-${quiz.url}/questions/create`,
          )
        }

        return this.$router.push(`/contributeur/quiz/${quiz.id}-${quiz.url}`)
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
    async deleteQuiz() {
      try {
        if (!(this.quiz && !this.quiz.questions.length)) {
          return this.$notify({
            type: 'error',
            text:
              'Vous ne pouvez pas supprimer ce quiz car il contient des questions.',
            duration: 3000,
            width: 400,
          })
        }

        await this.$store.dispatch(`quizzes/deleteQuiz`, this.quiz.id)

        return this.$router.push(`/contributeur/quiz`)
      } catch (error) {
        console.error(error)
        this.$notify({
          type: 'error',
          text: "Une erreur s'est produite lors de la suppression du quiz.",
          duration: 3000,
          width: 400,
        })
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
.block {
  .head {
    .top-buttons {
      flex: 0 !important;
      .button {
        margin-left: 0 !important;
        white-space: nowrap;
        height: 43px;
        &:last-child {
          margin-top: 24px;
        }
      }
    }
  }
}
</style>
