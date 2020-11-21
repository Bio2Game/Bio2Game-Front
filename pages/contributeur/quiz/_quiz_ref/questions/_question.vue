<template>
  <div class="container">
    <div class="block question">
      <div class="head">
        <InputElement
          :value="get('label')"
          type="text"
          name="label"
          class="white_label"
          placeholder="Libélé de la question"
          :error="filtredErrors('label')"
          @input="value => (label = value)"
        />
        <InputElement
          :value="get('time')"
          type="number"
          name="time"
          class="white_label"
          placeholder="Temps autorisé(s)"
          :error="filtredErrors('time')"
          @input="value => (time = value)"
        />
        <SelectorElement
          :selected="get('quiz_id')"
          :items="quizzes"
          :error="filtredErrors('quiz_id')"
          :defaultValue="get('quiz_id')"
          refKey="id"
          displayKey="label"
          noSelect="Quiz de la question"
          @input="quiz_id = $event"
        />
        <div class="button md equal border_white" @click="status = !status">
          {{ get('status') ? 'Publique' : 'Privé' }}
        </div>
      </div>
      <div class="content">
        <div class="section">
          <h5 class="section-title">Question</h5>
          <client-only>
            <MarkdownEditor
              :value="get('question')"
              placeholder="Intitulé de la question"
              :max="250"
              :error="filtredErrors('question')"
              @input="value => (question = value)"
            />
          </client-only>
          <InputElement
            :value="get('source')"
            type="text"
            name="source"
            placeholder="Source"
            :error="filtredErrors('source')"
            @input="value => (source = value)"
          />
          <InputElement
            :value="get('endDate')"
            type="date"
            name="endDate"
            placeholder="Date d’expiration (optionnel)"
            :error="filtredErrors('endDate')"
            @input="value => (endDate = value)"
          />
          <SelectorElement
            :selected="get('profil')"
            :items="profils"
            :error="filtredErrors('profil')"
            noSelect="Profil du joueur"
            @input="profil = $event"
          />
        </div>
        <div class="section">
          <h5 class="section-title">Réponses</h5>
          <InputElement
            :value="getResponse('response0')"
            type="text"
            name="response0"
            placeholder="Bonne réponse"
            :error="filtredErrors('responses.response0')"
            @input="value => (response0 = value)"
          />
          <InputElement
            :value="getResponse('response1')"
            type="text"
            name="response1"
            placeholder="Mauvaise réponse n°1"
            :error="filtredErrors('responses.response1')"
            @input="value => (response1 = value)"
          />
          <InputElement
            :value="getResponse('response2')"
            type="text"
            name="response2"
            placeholder="Mauvaise réponse n°2"
            :error="filtredErrors('responses.response2')"
            @input="value => (response2 = value)"
          />
          <InputElement
            :value="getResponse('response3')"
            type="text"
            name="response3"
            placeholder="Réponse improbable"
            :error="filtredErrors('responses.response3')"
            @input="value => (response3 = value)"
          />
          <h5 class="section-title">Explications</h5>
          <client-only>
            <MarkdownEditor
              :value="get('explication')"
              placeholder="Explication de la réponse"
              :max="250"
              :error="filtredErrors('explication')"
              @input="value => (explication = value)"
            />
          </client-only>
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
      <div class="button green lg" @click="createQuestion()">Sauvegarder</div>
      <div class="button green lg" @click="deleteQuestion()">Supprimer</div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

import MarkdownEditor from '@/components/elements/MarkdownEditor'

moment.locale('fr')

export default {
  name: 'QuizQuestions',
  components: {
    MarkdownEditor,
  },
  middleware: ['auth', 'contributor'],
  async asyncData({ store, error, params }) {
    if (params.quiz_ref !== 'create') {
      try {
        if (!/\d-.+/.test(params.quiz_ref)) {
          throw new Error('Match failed')
        }
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
      time: null,
      quiz_id: null,
      question: null,
      source: null,
      endDate: null,
      profil: null,
      response0: null,
      response1: null,
      response2: null,
      response3: null,
      explication: null,
      status: null,
      errors: [],
      profils: [
        {
          ref: 0,
          name: 'Informé',
        },
        {
          ref: 1,
          name: 'Consomateur',
        },
        {
          ref: 2,
          name: 'Producteur',
        },
        {
          ref: 3,
          name: 'Expert',
        },
      ],
    }
  },
  computed: {
    questionObj() {
      return this.$store.getters['quizzes/getPersonnalQuestion'](
        this.$route.params.quiz_ref,
        this.$route.params.question,
      )
    },
    quizzes() {
      return this.$store.state.quizzes.contributorQuizzes
    },
    isCreationPage() {
      return this.$route.params.question === 'create'
    },
    isDataEdited() {
      // eslint-disable-next-line prettier/prettier
      return [ 'label', 'time', 'question', 'source', 'endDate', 'profil', 'response0', 'response1', 'response2', 'response3', 'explication', 'status'
      ].some(v => this.get(v) !== this.questionObj[v])
    },
  },
  mounted() {
    this.quiz_id = parseInt(this.$route.params.quiz_ref.split('-')[0])
  },
  beforeRouteLeave(to, from, next) {
    console.log(to)
    if (
      !this.isDataEdited &&
      (!to.params.quiz_ref ||
        this.get('quiz_id') === to.params.quiz_ref.split('-')[0])
    ) {
      return next()
    }
    next(
      window.confirm(
        "Vous n'avez pas sauvegardé vos modifications, êtes vous sûr de vouloir quitter la page ?",
      ),
    )
  },
  methods: {
    getResponse(key) {
      return (
        this[key] ||
        (this.questionObj.responses
          ? JSON.parse(this.questionObj.responses)[key]
          : '')
      )
    },
    get(key) {
      return this[key] || this.questionObj[key]
    },
    filtredErrors(field) {
      return this.errors.find(error => error.field === field)
    },
    async createQuestion() {
      try {
        console.log(this.questionObj)
        const quiz = await this.$store.dispatch(
          `quizzes/${this.isCreationPage ? 'create' : 'update'}Question`,
          {
            id: this.questionObj.id,
            label: this.get('label'),
            time: this.get('time'),
            quiz_id: this.get('quiz_id'),
            question: this.get('question'),
            source: this.get('source'),
            endDate: this.get('endDate'),
            profil: this.get('profil'),
            responses: {
              response0: this.getResponse('response0'),
              response1: this.getResponse('response1'),
              response2: this.getResponse('response2'),
              response3: this.getResponse('response3'),
            },
            explication: this.get('explication') || '',
            contributorId: this.$auth.user.id,
            status: !!this.get('status') + 0,
          },
        )

        this.$notify({
          type: 'success',
          text: `Votre question a été ${
            this.questionObj.id ? 'sauvegardé' : 'créée'
          } avec succès`,
          duration: 3000,
          width: 400,
        })

        await this.$nextTick()

        return this.$router.push(`/contributeur/quiz/${quiz.id}-${quiz.url}`)
      } catch (error) {
        console.log(error)
        const messages = error.response.data.messages
        if (messages) {
          this.errors = messages.errors
        }
      }
    },
    async deleteQuestion() {
      try {
        await this.$store.dispatch(`quizzes/deleteQuestion`, {
          quiz_id: this.questionObj.quiz_id,
          question_id: this.questionObj.id,
        })

        return this.$router.push(
          `/contributeur/quiz/${this.$route.params.quiz_ref}`,
        )
      } catch (error) {
        console.log(error)
        this.$notify({
          type: 'error',
          text:
            "Une erreur s'est produite lors de la suppression de la question.",
          duration: 3000,
          width: 400,
        })
      }
    },
  },
}
</script>

<style lang="scss">
.block.question {
  .head {
    .input-container,
    .selector-container {
      margin-bottom: 8px;
      flex: 2;
      margin-right: 16px;
      &:first-child {
        flex: 3;
      }
    }
    .button {
      min-width: 120px;
    }
  }
  .content {
    display: flex;
    padding-top: 16px;
    .section {
      flex: 1;
      display: flex;
      flex-direction: column;
      &:last-child {
        margin-left: 24px;
      }
      .section-title {
        user-select: none;
        font-weight: 600;
        font-size: 15px;
        margin: 8px 0 16px;
      }
    }
  }
}
</style>
