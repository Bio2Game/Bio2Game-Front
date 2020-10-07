<template>
  <div class="quiz-creation">
    <div class="infos">
      <h1>CRÉATION D’UNE PARTIE</h1>
    </div>
    <div class="container content">
      <div class="item quiz">
        <div class="head">
          <h5>Configuration du Quiz</h5>
        </div>
        <div class="item_content">
          <InputElement
            v-model="name"
            type="text"
            placeholder="Nom de la partie"
          />
          <div class="quizcreator">
            <SelectorElement
              class="select-quiz"
              :selected="$route.query.autoselect || null"
              :items="quizzes"
              noSelect="Selectionner le quiz"
              @input="changeQuiz($event.target)"
            />
            <nuxt-link to="/" class="button md green create-quiz">
              Créer un quiz
            </nuxt-link>
          </div>
          <a class="button md green" @click="startParty()">Lancer la partie</a>
        </div>
      </div>
      <div class="item questions">
        <div class="head">
          <h5>Choix des questions</h5>
        </div>
        <div class="item_content">
          <label
            v-for="(question, index) in questions"
            :key="question.id"
            class="question"
          >
            <input
              name="1"
              type="checkbox"
              class="filled-in"
              :checked="question.active !== false"
              @input="checkQuestion(question.id, $event.target.checked)"
            />
            <span>Question n°{{ index + 1 }}: {{ question.label }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Create',
  middleware: ['auth', 'contributor'],
  async fetch({ store, error }) {
    try {
      await store.dispatch('quizzes/fetchQuizzes')
    } catch (e) {
      error({
        statusCode: 503,
        message: 'Unable to fetch quizzes on the Bio2Game API',
      })
    }
  },
  data() {
    return {
      name: '',
      questions: [],
      quizId: null,
      autoselect: null,
    }
  },
  computed: {
    quizzes() {
      return this.$store.state.quizzes.quizzes
    },
  },
  methods: {
    checkQuestion(id, checked) {
      this.questions.find(q => q.id === id).active = checked
    },
    changeQuiz(target) {
      this.quizId = target.value
      const quiz = this.quizzes.find(q => q.id === target.value)
      this.questions = quiz.questions
    },
    startParty() {
      if (!this.quizId) {
        return this.$notify({
          type: 'error',
          text: 'Veuillez selectionner un quiz !',
          duration: 3000,
          width: 400,
        })
      }

      if (this.questions.filter(q => q.active).length < 3) {
        return this.$notify({
          type: 'error',
          text: 'Veuillez selectionner au moins 3 questions !',
          duration: 3000,
          width: 400,
        })
      }

      this.$socket.emit('createGame', {
        quizId: this.quizId,
        name: this.name,
        questions: this.questions.filter(q => q.active),
        animatorId: this.user.id,
      })
    },
  },
  sockets: {
    game_created(game) {
      this.$router.push(`/parties/${game.id}`)
    },
  },
}
</script>

<style lang="scss">
.quiz-creation {
  .infos {
    margin-bottom: 25px;
    h1 {
      font-weight: 700;
      font-size: 40px;
      text-transform: uppercase;
      text-align: center;
      margin: 64px 0 32px;
      color: #414141;
      @media screen and (max-width: $md) {
        font-size: 32px;
        margin: 32px 0;
      }
      @media screen and (max-width: $sm) {
        font-size: 24px;
        margin: 24px 0;
      }
    }
  }
  p {
    text-align: center;
    font-weight: 500;
    font-size: 15px;
    margin-bottom: 32px;
  }
  .content {
    margin-bottom: 20px;

    @media screen and (max-width: $md) {
      flex-direction: column;
      .item {
        margin: 0 0 25px 0 !important;
      }
    }
    .item {
      display: flex;
      flex: 1;
      flex-direction: column;
      .head {
        padding: 16px 24px;
        background-color: $green;
        color: #ffffff;
        border-radius: 8px 8px 0 0;
        h5 {
          font-weight: 400;
          font-size: 18px;
        }
      }
      .item_content {
        padding: 24px 24px 32px;
        background-color: white;
        border-radius: 0 0 8px 8px;
        flex: 1;
      }
      &.quiz {
        margin-right: 10px;
        .quizcreator {
          display: flex;
          .select-quiz {
            flex: 1;
            margin-right: 16px;
          }

          @media screen and (max-width: $lg) {
            .select-quiz {
              margin-right: 0;
            }
            .create-quiz {
              display: none;
            }
          }
        }
        .button {
          margin: 8px 0 16px;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
      &.questions {
        margin-left: 10px;
        .questions_content {
          display: flex;
          flex-direction: column;
        }
        .question {
          margin-bottom: 10px;
          span {
            font-size: 18px;
          }
        }
      }
    }
  }
}
</style>
