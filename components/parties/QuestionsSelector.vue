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
            displayKey="label"
            refKey="id"
            noSelect="Quiz"
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
                  src="../../assets/car.svg"
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
            <span class="count">{{ count }} questions séléctionnées</span>
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
  data() {
    return {
      quizId: null,
      selectedQuestions: {},
    }
  },
  computed: {
    quizzes() {
      return this.$store.state.quizzes.quizzes
    },
    questions() {
      return this.$store.getters['quizzes/questions']
    },
    quiz() {
      return this.quizzes.find(q => q.id === this.quizId)
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
        .filter(q => q[1])
        .map(q => parseInt(q[0]))
      return this.quizzes.filter(quiz =>
        quiz.questions.some(q => entries.includes(q.id)),
      )
    },
    count() {
      return Object.values(this.selectedQuestions).filter(q => q).length
    },
    formatedQuestions() {
      return this.questions.filter(q => !!this.selectedQuestions[q.id])
    },
  },
}
</script>

<style lang="scss">
.questions-creator {
  background-color: #29292980;
  position: absolute;
  z-index: 500;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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
            color: #999999;
            font-size: 18px;
            font-weight: normal;
            margin: 8px 0 16px;
          }
          .quiz-elements {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(55px, 1fr));
            gap: 16px;
            width: 100%;
            .quiz-element {
              display: flex;
              flex-direction: column;
              align-items: center;
              cursor: pointer;
              .quiz-icon {
                width: 48px;
                height: 48px;
                border-radius: 24px;
                margin-bottom: 8px;
                border: 2px solid transparent;
                transition: 0.3s border-color ease-out;
                &.active {
                  border-color: $green;
                }
              }
              .quiz-label {
                font-weight: 600;
                font-size: 12px;
                text-transform: uppercase;
                color: #414141;
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
            font-weight: 600;
            font-size: 20px;
            color: #4141414d;
            text-transform: uppercase;
            margin: 16px 0 24px;
          }
          .questions {
            display: flex;
            width: 100%;
            flex: 1;
            justify-content: center;
            .list {
              flex: 1;
              display: flex;
              flex-direction: column;
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
            font-weight: 500;
            font-size: 15px;
            line-height: 18px;
            margin: 24px 0 32px;
            color: #585858;
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
