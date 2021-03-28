<template>
  <div class="container">
    <div
      class="block right-data"
      :right-data="quiz.id ? 'Quiz N°' + quiz.id : ''"
    >
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
          <DomainsSelector
            :selected="get('domain_id')"
            class="white_label"
            placeholder="Domaine"
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
          <div
            class="button md equal border_white"
            @click="status = !get('status')"
          >
            {{ get('status') ? 'Publique' : 'Privé' }}
          </div>
          <div class="button white_sky sm equal" @click="createQuiz(true)">
            Créer une question
          </div>
        </div>
      </div>
      <div class="content questions-list-edit">
        <client-only v-if="quiz.questions && quiz.questions.length">
          <vuetable
            :fields="tableFields"
            class="questions"
            :data="quiz.questions"
            :draggable="editOrder"
            defaultSortBy="order"
            @row-clicked="
              !editOrder &&
                $router.push(
                  `/contributeur/quiz/${$route.params.quiz}/questions/${$event.data.id}`,
                )
            "
            @input="saveTempQuestionsOrder"
          />
        </client-only>
        <div v-else class="no-elements">
          <h3>Aucunes questions</h3>
          <p>Ce quiz ne contient pas la moindre question !</p>
          <div class="button md green equal" @click="createQuiz(true)">
            Créer une question
          </div>
        </div>
        <div v-if="quiz.questions && quiz.questions.length" class="options-bar">
          <div
            v-if="!editOrder"
            class="button green lg"
            @click="editOrder = true"
          >
            Modifier l'ordre
          </div>
          <template v-else>
            <div class="button green lg" @click="saveOrder()">Sauvegarder</div>
            <div class="button white lg right" @click="cancelOrder()">
              Annuler
            </div>
          </template>
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
      <div
        class="button green lg"
        :class="{ disabled: isCreationPage }"
        @click="deleteQuiz()"
      >
        Supprimer
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import vuetable from 'vuetable-2'

import VuetableFieldHandle from 'vuetable-2/src/components/VuetableFieldHandle.vue'

moment.locale('fr')

export default {
  name: 'Quiz',
  components: {
    vuetable,
  },
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
      questions: null,
      editOrder: false,
      errors: [],
    }
  },
  computed: {
    quiz() {
      return this.$store.getters['quizzes/getPersonnalQuiz'](
        this.$route.params.quiz,
      )
    },
    tableFields() {
      return [
        {
          name: !this.editOrder ? 'order' : VuetableFieldHandle,
          title: 'Ordre',
          formatter: index => index + 1,
          sortField: !this.editOrder ? 'order' : null,
        },
        {
          name: 'id',
          title: 'ID',
          sortField: !this.editOrder ? 'id' : null,
        },
        {
          name: 'label',
          title: 'Libélé',
          sortField: !this.editOrder ? 'label' : null,
        },
        {
          name: 'question',
          title: 'Question',
          sortField: !this.editOrder ? 'question' : null,
          titleClass: 'big',
          dataClass: 'big',
        },
        {
          name: 'status',
          title: 'Status',
          formatter: bool => (bool ? 'Publique' : 'Privé'),
          sortField: !this.editOrder ? 'status' : null,
        },
        {
          name: 'updated_at',
          title: 'Edition',
          formatter: date => moment(date).fromNow(),
          sortField: !this.editOrder ? 'updated_at' : null,
        },
        {
          name: 'created_at',
          title: 'Création',
          formatter: date => moment(date).fromNow(),
          sortField: !this.editOrder ? 'created_at' : null,
        },
      ]
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
      return this[key] !== null ? this[key] : this.quiz[key]
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
    saveTempQuestionsOrder(data) {
      this.questions = data.map((d, index) => ({ ...d, order: index }))
    },
    cancelOrder() {
      this.editOrder = false
      this.questions = null
    },
    async saveOrder() {
      this.editOrder = false

      if (!this.questions) return

      await this.$store.dispatch(`quizzes/updateQuestionsOrder`, {
        quiz_id: this.quiz.id,
        questions: this.questions,
      })
      this.questions = null
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
        console.log(error)
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
      if (this.isCreationPage) return
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
  .questions-list-edit {
    display: flex;
    flex-direction: column;
    .questions,
    .no-elements {
      flex: 1;
    }
    .vuetable-td-order,
    .vuetable-th-order,
    .vuetable-th-component-handle,
    .vuetable-td-component-handle {
      padding-left: 16px !important;
    }
    .options-bar {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }
  }
  &.right-data {
    position: relative;
    &::after {
      position: absolute;
      top: -24px;
      right: 10px;
      color: #353535;
      font-weight: 600;
      content: attr(right-data);
    }
  }
}
</style>
