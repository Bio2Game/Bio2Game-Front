<template>
  <div class="questions-creator" @click.self="$emit('close')">
    <div class="container elements">
      <div class="block">
        <div class="head">
          <h5>Quiz</h5>
        </div>
        <div class="content">
          <SelectorElement
            v-model="quizId"
            :selected="quizId"
            :items="quizzes"
            display-key="label"
            ref-key="id"
            placeholder="Quiz"
          />
          <div class="selected-quizzes">
            <div class="title">Quizz selectionnés</div>
            <div class="quiz-elements">
              <div
                v-for="selectedQuiz of selectedQuizzes"
                :key="selectedQuiz.id"
                class="quiz-element"
                @click="quizId = selectedQuiz.id"
              >
                <img
                  class="quiz-icon"
                  :src="
                    'https://cdn.bio2game.com/icons/' +
                    selectedQuiz.domain.icon.reference
                  "
                  :alt="selectedQuiz.label"
                  :title="selectedQuiz.label"
                  :class="{ active: selectedQuiz.id === quizId }"
                />
                <label class="quiz-label">{{ selectedQuiz.label }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="block">
        <div class="head">
          <h5>Sélection de questions</h5>
        </div>
        <div class="content">
          <div class="questions-selection">
            <template v-if="quiz">
              <h5 class="quiz-name">{{ quiz.label }}</h5>
              <div v-if="splitedQuestions[0].length" class="questions">
                <div class="list">
                  <CheckboxElement
                    v-for="question of splitedQuestions[0]"
                    :id="'select-' + question.id"
                    :key="question.id"
                    :checked="!!selectedQuestions[question.id]"
                    :label="question.fakeLabel"
                    @input="$set(selectedQuestions, question.id, $event)"
                  />
                </div>
                <div class="list">
                  <CheckboxElement
                    v-for="question of splitedQuestions[1]"
                    :id="'select-' + question.id"
                    :key="question.id"
                    :checked="!!selectedQuestions[question.id]"
                    :label="question.fakeLabel"
                    @input="$set(selectedQuestions, question.id, $event)"
                  />
                </div>
              </div>
              <div v-else class="questions">
                Ce quiz ne contient aucune question publique
              </div>
            </template>
            <div v-else class="questions">Pas de quiz selectionné</div>
            <span class="count"
              >{{ count }} questions séléctionnée{{
                count > 1 ? 's' : ''
              }}</span
            >
          </div>
          <div class="buttons">
            <div class="button green md equal" @click="$emit('close')">
              Annuler
            </div>
            <div
              class="button green md equal"
              @click="$emit('questions', formatedQuestions)"
            >
              Valider
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { clone } from 'lodash'

export default {
  name: 'QuestionsSelector',
  props: {
    questions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      quizId: null,
      selectedQuestions: {},
    }
  },
  computed: {
    quizzes() {
      return [...this.$store.state.quizzes.quizzes].sort((a, b) =>
        a.label.localeCompare(b.label)
      )
    },
    globalQuestions() {
      return this.$store.getters['quizzes/questions']
    },
    quiz() {
      return this.quizzes.find((q) => q.id === this.quizId)
    },
    splitedQuestions() {
      if (!this.quiz) return [[], []]
      const questions = clone(this.quiz.questions).map((q, index) => {
        q.fakeLabel = `<b>Question ${index + 1}</b>: ${q.label}`
        return q
      })
      const index = Math.ceil(questions.length / 2)
      return [
        questions.slice(0, index),
        questions.slice(index, questions.length),
      ]
    },
    selectedQuizzes() {
      const entries = Object.entries(this.selectedQuestions)
        .filter((q) => q[1])
        .map((q) => parseInt(q[0]))
      return this.quizzes.filter((quiz) =>
        quiz.questions.some((q) => entries.includes(q.id))
      )
    },
    count() {
      return Object.values(this.selectedQuestions).filter((q) => q).length
    },
    formatedQuestions() {
      return this.globalQuestions.filter((q) => !!this.selectedQuestions[q.id])
    },
  },
  mounted() {
    this.questions.forEach((question) => {
      this.$set(this.selectedQuestions, question.id, question.active)
    })
  },
}
</script>

<style lang="scss">
.questions-creator {
  position: absolute;
  z-index: 500;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background-color: #29292980;
  left: 0;

  .elements {
    display: flex;
    flex-direction: row;
    width: 100%;

    div.block {
      flex: 1;

      &:last-child {
        margin-left: 24px;
        flex: 2;
      }

      .content {
        display: flex;
        flex-direction: column;
        min-height: 40vh;

        .selected-quizzes {
          display: flex;
          flex-direction: column;
          align-items: center;

          .title {
            margin: 8px 0 16px;
            color: #999999;
            font-size: 18px;
            font-weight: normal;
          }

          .quiz-elements {
            display: grid;
            width: 100%;
            grid-template-columns: repeat(auto-fill, minmax(55px, 1fr));
            gap: 16px;

            .quiz-element {
              display: flex;
              flex-direction: column;
              align-items: center;
              cursor: pointer;

              .quiz-icon {
                width: 48px;
                height: 48px;
                border: 2px solid transparent;
                border-radius: 24px;
                margin-bottom: 8px;
                transition: 0.3s border-color ease-out;

                &.active {
                  border-color: $green;
                }
              }

              .quiz-label {
                color: #414141;
                font-size: 12px;
                font-weight: 600;
              }
            }
          }
        }

        .questions-selection {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;

          .quiz-name {
            margin: 16px 0 24px;
            color: #4141414d;
            font-size: 20px;
            font-weight: 600;
            text-transform: uppercase;
          }

          .questions {
            display: flex;
            justify-content: center;
            width: 100%;
            flex: 1;

            .list {
              display: flex;
              flex-direction: column;
              flex: 1;

              .checkbox {
                margin-bottom: 8px;

                span {
                  color: #adadad;

                  b {
                    font-weight: 600;
                  }
                }
              }
            }
          }

          .count {
            margin: 24px 0 32px;
            color: #585858;
            font-size: 15px;
            font-weight: 500;
            line-height: 18px;
          }
        }

        .buttons {
          display: flex;
          width: 100%;
          /* stylelint-disable-next-line no-descending-specificity */
          .button {
            flex: 1;
            max-width: none;

            &:last-child {
              margin-left: 24px;
            }
          }
        }
      }
    }
  }
}
</style>
