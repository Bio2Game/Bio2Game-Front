<template>
  <div class="quiz-creation question">
    <div class="container">
      <div class="block">
        <div class="head">
          <InputElement
            :value="get('label')"
            type="text"
            name="label"
            class="white_label"
            placeholder="Libélé de la question"
            :error="filtredErrors('label')"
            @input="(value) => (label = value)"
          />
          <InputElement
            :value="get('description')"
            type="number"
            name="time"
            class="white_label"
            placeholder="Temps autorisé(s)"
            :error="filtredErrors('time')"
            @input="(value) => (time = value)"
          />
          <InputElement
            :value="get('quizId')"
            type="number"
            name="quizId"
            class="white_label"
            placeholder="Quiz de la question"
            :error="filtredErrors('quizId')"
            @input="(value) => (quizId = value)"
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
                @input="(value) => (question = value)"
              />
            </client-only>
            <InputElement
              :value="get('source')"
              type="text"
              name="source"
              placeholder="Source"
              :error="filtredErrors('source')"
              @input="(value) => (source = value)"
            />
            <InputElement
              :value="get('endDate')"
              type="date"
              name="endDate"
              placeholder="Date d’expiration (optionnel)"
              :error="filtredErrors('endDate')"
              @input="(value) => (endDate = value)"
            />
            <InputElement
              :value="get('profil')"
              type="number"
              name="profil"
              placeholder="Profil du joueur"
              :error="filtredErrors('profil')"
              @input="(value) => (profil = value)"
            />
          </div>
          <div class="section">
            <h5 class="section-title">Réponses</h5>
            <InputElement
              :value="getResponse('response0')"
              type="text"
              name="response0"
              placeholder="Bonne réponse"
              :error="filtredErrors('response0')"
              @input="(value) => (response0 = value)"
            />
            <InputElement
              :value="getResponse('response1')"
              type="text"
              name="response1"
              placeholder="Mauvaise réponse n°1"
              :error="filtredErrors('response1')"
              @input="(value) => (response1 = value)"
            />
            <InputElement
              :value="getResponse('response2')"
              type="text"
              name="response2"
              placeholder="Mauvaise réponse n°2"
              :error="filtredErrors('response2')"
              @input="(value) => (response2 = value)"
            />
            <InputElement
              :value="getResponse('response2')"
              type="text"
              name="response2"
              placeholder="Réponse improbable"
              :error="filtredErrors('response2')"
              @input="(value) => (response2 = value)"
            />
            <h5 class="section-title">Explications</h5>
            <client-only>
              <MarkdownEditor
                :value="get('explication')"
                placeholder="Explication de la réponse"
                @input="(value) => (explication = value)"
              />
            </client-only>
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
        <div class="button green lg">Sauvegarder</div>
        <nuxt-link class="button green lg" to="/contributeur/quizzes">
          Supprimer
        </nuxt-link>
      </div>
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
      time: null,
      quizId: null,
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
    }
  },
  computed: {
    questionObj() {
      return this.$store.getters['quizzes/getPersonnalQuestion'](
        this.$route.params.quiz_ref,
        this.$route.params.question
      )
    },
    isCreationPage() {
      return this.$route.params.question === 'create'
    },
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
      return this.errors.find((error) => error.field === field)
    },
    async createQuestion() {
      try {
        const quiz = await this.$store.dispatch(
          `quizzes/${this.isCreationPage ? 'create' : 'update'}Question`,
          {
            id: this.questionObj.id,
            label: this.get('label'),
            time: this.generateURL(this.get('label')),
            quizId: this.get('quizId'),
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
            explication: this.get('explication'),
            contributorId: this.$auth.user.id,
            status: this.get('status'),
          }
        )

        return this.$router.push(`/contributeur/quizzes/${quiz.id}-${quiz.url}`)
      } catch (error) {
        const messages = error.response.data.messages
        if (messages) {
          this.errors = messages.errors
        }
      }
    },
  },
}
</script>

<style lang="scss">
.quiz-creation {
  .container {
    flex-direction: column;
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
      .big {
        width: 45%;
      }
    }
  }
  &.question {
    .block {
      .head {
        .input-container {
          margin-bottom: 8px;
          flex: 2;
          margin-right: 16px;
          &:first-child {
            flex: 3;
          }
        }
        .button {
          margin-top: 8px;
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
  }
}
</style>
