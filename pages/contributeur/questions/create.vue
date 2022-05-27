<template>
  <div class="container">
    <div class="block question">
      <div class="head">
        <InputElement
          :value="label"
          type="text"
          name="label"
          class="white_label"
          placeholder="Libélé de la question"
          :max="30"
          :error="filtredErrors('label')"
          @input="label = $event"
        />
        <InputElement
          :value="time"
          type="number"
          name="time"
          class="white_label"
          placeholder="Temps autorisé(s)"
          :error="filtredErrors('time')"
          @input="time = $event"
        />
        <SelectorElement
          :selected="quiz_id"
          :items="quizzes"
          :error="filtredErrors('quiz_id')"
          ref-key="id"
          display-key="label"
          placeholder="Quiz de la question"
          @input="quiz_id = $event"
        />
        <div class="button md equal border_white" @click="status = !status">
          {{ status ? 'Publique' : 'Privé' }}
        </div>
      </div>
      <div class="content">
        <div class="section">
          <h5 class="section-title">Question</h5>
          <client-only>
            <MarkdownEditor
              :value="question"
              placeholder="Intitulé de la question"
              :error="filtredErrors('question')"
              @input="question = $event"
            />
          </client-only>
          <InputElement
            :value="source"
            type="text"
            name="source"
            placeholder="Source"
            :error="filtredErrors('source')"
            @input="source = $event"
          />
          <InputElement
            :value="endDate"
            type="date"
            name="endDate"
            placeholder="Date d’expiration (optionnel)"
            :error="filtredErrors('endDate')"
            @input="endDate = $event"
          />
          <SelectorElement
            :selected="profil"
            :items="profils"
            :error="filtredErrors('profil')"
            placeholder="Profil du joueur"
            @input="profil = $event"
          />
        </div>
        <div class="section">
          <h5 class="section-title">Réponses</h5>
          <InputElement
            :value="response0"
            type="text"
            name="response0"
            placeholder="Bonne réponse"
            :max="30"
            :error="filtredErrors('responses.response0')"
            @input="response0 = $event"
          />
          <InputElement
            :value="response1"
            type="text"
            name="response1"
            placeholder="Mauvaise réponse n°1"
            :max="30"
            :error="filtredErrors('responses.response1')"
            @input="response1 = $event"
          />
          <InputElement
            :value="response2"
            type="text"
            name="response2"
            placeholder="Mauvaise réponse n°2"
            :max="30"
            :error="filtredErrors('responses.response2')"
            @input="response2 = $event"
          />
          <InputElement
            :value="response3"
            type="text"
            name="response3"
            placeholder="Réponse improbable"
            :max="30"
            :error="filtredErrors('responses.response3')"
            @input="response3 = $event"
          />
          <h5 class="section-title">Explications</h5>
          <client-only>
            <MarkdownEditor
              :value="explication"
              placeholder="Explication de la réponse"
              :error="filtredErrors('explication')"
              @input="explication = $event"
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
      <div class="button green lg disabled">Supprimer</div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

import MarkdownEditor from '@/components/elements/MarkdownEditor'

moment.locale('fr')

export default {
  name: 'Question',
  components: {
    MarkdownEditor,
  },
  beforeRouteLeave(_to, _from, next) {
    if (!this.isDataEdited()) {
      return next()
    }
    next(
      window.confirm(
        "Vous n'avez pas sauvegardé vos modifications, êtes vous sûr de vouloir quitter la page ?"
      )
    )
  },
  middleware: ['auth', 'contributor'],
  async asyncData({ store, error }) {
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
      label: '',
      time: '',
      quiz_id: '',
      question: '',
      source: '',
      endDate: '',
      profil: '',
      response0: '',
      response1: '',
      response2: '',
      response3: '',
      explication: '',
      status: '',
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
    quizzes() {
      return [...this.$store.state.quizzes.contributorQuizzes].sort((a, b) =>
        a.label.localeCompare(b.label)
      )
    },
  },
  methods: {
    deleteData() {
      this.label = ''
      this.time = ''
      this.quiz_id = ''
      this.question = ''
      this.source = ''
      this.endDate = ''
      this.profil = ''
      this.response0 = ''
      this.response1 = ''
      this.response2 = ''
      this.response3 = ''
      this.explication = ''
      this.status = ''
    },
    filtredErrors(field) {
      return this.errors.find((error) => error.field === field)
    },
    async createQuestion() {
      try {
        const quiz = await this.$store.dispatch(`quizzes/createQuestion`, {
          label: this.label,
          time: this.time,
          quizId: this.quiz_id,
          question: this.question,
          source: this.source,
          endDate: this.endDate,
          profil: this.profil,
          responses: {
            response0: this.response0,
            response1: this.response1,
            response2: this.response2,
            response3: this.response3,
          },
          explication: this.explication || '',
          contributorId: this.$auth.user.id,
          status: !!this.status + 0,
        })

        this.$notify({
          type: 'success',
          text: `Votre question a été créée avec succès`,
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
    isDataEdited() {
      return [
        'label',
        'time',
        'quiz_id',
        'question',
        'source',
        'endDate',
        'profil',
        'response0',
        'response1',
        'response2',
        'response3',
        'explication',
        'status',
      ].some((v) => this[v])
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
        margin: 8px 0 16px;
        font-size: 15px;
        font-weight: 600;
        user-select: none;
      }
    }
  }
}
</style>
