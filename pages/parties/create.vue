<template>
  <div class="party-creation">
    <div class="container">
      <div class="infos">
        <h1>CRÉATION D’UNE PARTIE</h1>
        <p>
          Créez des parties pour répondre simultanément à des quiz intéractifs !
        </p>
      </div>
      <div class="blocks">
        <div class="block">
          <div class="head">
            <h5>Configuration du Quiz</h5>
          </div>
          <div class="content">
            <InputElement
              v-model="name"
              type="text"
              placeholder="Nom de la partie"
            />
            <div class="quizcreator">
              <SelectorElement
                class="select-quiz"
                :selected="quizId || $route.query.autoselect"
                :items="quizzes"
                placeholder="Selectionner le quiz"
                displayKey="label"
                refKey="id"
                @input="loadQuiz($event)"
              />
              <nuxt-link
                to="/contributeur/quiz/create"
                class="button md green create-quiz"
              >
                Créer un quiz
              </nuxt-link>
            </div>
            <a class="button md green" @click="startParty()"
              >Lancer la partie</a
            >
          </div>
        </div>
        <div class="block">
          <div class="head">
            <h5>Questions</h5>
            <div
              class="button white_sky sm equal"
              @click="questionPanel = true"
            >
              Séléction avancée
            </div>
          </div>
          <div class="content">
            <draggable
              v-model="questions"
              tag="ul"
              class="list-group"
              v-bind="dragOptions"
              @start="drag = true"
              @end="drag = false"
            >
              <transition-group
                class="questions-selector"
                type="transition"
                :name="!drag ? 'flip-list' : null"
              >
                <li
                  v-for="(question, index) of questions"
                  :key="question.id"
                  class="question-element list-group-item"
                >
                  <DragIcon />
                  <CheckboxElement
                    :id="question.id"
                    :checked="!!question.active"
                    :label="generateLabel(question.label, index)"
                    @input="question.active = $event"
                  />
                </li>
              </transition-group>
            </draggable>
          </div>
        </div>
      </div>
    </div>
    <QuestionsSelector
      v-if="questionPanel"
      :questions="questions"
      @close="questionPanel = false"
      @questions="loadQuestions($event)"
    />
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import DragIcon from '@/assets/icons/drag.svg?inline'

export default {
  name: 'Create',
  middleware: ['auth', 'contributor'],
  components: {
    draggable,
    DragIcon,
  },
  async fetch({ store, error }) {
    try {
      await store.dispatch('quizzes/fetchQuestionsQuizzes')
    } catch (e) {
      error({
        statusCode: 503,
        message: 'Unable to fetch quiz on the Bio2Game API',
      })
    }
  },
  data() {
    return {
      name: '',
      questions: [],
      quizId: null,
      autoselect: null,
      questionPanel: false,
      drag: false,
    }
  },
  computed: {
    quizzes() {
      return this.$store.state.quizzes.quizzes
    },
    questionsOrder() {
      return this.questions.map((q, i) => ({ order: i + 1, ...q }))
    },
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      }
    },
  },
  mounted() {
    if (!this.$socket.connected) {
      this.$socket.client.open()
    }
  },
  methods: {
    loadQuestions(questions) {
      this.questions = questions.map(q => ({ ...q, active: true }))
      this.questionPanel = false
    },
    generateLabel(label, index) {
      return `<b>Question ${index + 1}</b>: ${label}`
    },
    loadQuiz(value) {
      this.quizId = value
      const quiz = this.quizzes.find(q => q.id === value)
      this.questions = quiz.questions
    },
    startParty() {
      if (!this.name.length) {
        return this.$notify({
          type: 'error',
          text: 'Veuillez nommer votre partie.',
          duration: 3000,
          width: 400,
        })
      }

      if (this.questions.filter(q => q.active).length < 3) {
        return this.$notify({
          type: 'error',
          text: 'Veuillez selectionner au moins 3 questions.',
          duration: 3000,
          width: 400,
        })
      }

      this.$socket.client.emit('createGame', {
        name: this.name,
        questions: this.questions.filter(q => q.active),
        animatorId: this.$auth.user.id,
      })
    },
  },
  sockets: {
    game_created(gameId) {
      this.$router.push(`/parties/${gameId}`)
    },
  },
}
</script>

<style lang="scss">
.party-creation {
  .container {
    flex-direction: column;

    .infos {
      h1 {
        margin: 48px 0 24px;
        color: #414141;
        font-size: 40px;
        font-weight: 700;
        text-align: center;
        text-transform: uppercase;
        @media screen and (max-width: $md) {
          margin: 32px 0 24px;
          font-size: 32px;
        }
        @media screen and (max-width: $sm) {
          margin: 24px 0;
          font-size: 24px;
        }
      }

      p {
        font-size: 16px;
        font-weight: 500;
        text-align: center;
        margin-bottom: 16px;
      }
    }

    .blocks {
      display: flex;

      .block {
        flex: 1;

        &:first-child {
          margin-right: 24px;

          .quizcreator {
            display: flex;

            .select-quiz {
              flex: 1;
              margin-right: 16px;
            }

            .button {
              margin: 8px 0 16px;

              &:last-child {
                margin-bottom: 0;
              }
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
        }

        .questions-selector {
          display: flex;
          flex-direction: column;

          .question-element {
            display: flex;
            padding: 4px 0;
            cursor: move;

            svg {
              margin-left: -8px;
              margin-right: 8px;
              opacity: 0.6;
              transition: opacity 0.5s ease;

              &:hover {
                opacity: 0.8;
              }
            }

            .checkbox {
              margin-bottom: 8px;
            }

            &.flip-list-move {
              transition: transform 0.5s;
            }

            &.no-move {
              transition: transform 0s;
            }
          }
        }

        .head {
          min-height: 70px;
          align-items: center;
        }

        .content {
          min-height: 0;
          display: flex;
          flex-direction: column;
        }
      }
    }
  }
}
</style>
