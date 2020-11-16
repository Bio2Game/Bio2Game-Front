<template>
  <div class="quiz-page">
    <div class="container">
      <section class="playground">
        <QuizQuestionState v-if="[1, 2].includes(status)" />
        <QuizResultState v-if="status === 3" />
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Quiz',
  validate({ params }) {
    return /^\d+-\S+$/.test(params.quiz)
  },
  async fetch({ params, $axios, store, error }) {
    try {
      const [, id] = params.quiz.match(/^(\d+)-\S+$/)
      await store.dispatch('quiz/fetchQuiz', id)
    } catch (e) {
      error({ statusCode: 404, message: e.message })
    }
  },
  computed: mapState('quiz', ['status']),
}
</script>

<style lang="scss">
.quiz-page {
  display: flex;
  min-height: 0;
  .playground {
    width: 100%;
    .interface {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
      .infos {
        margin-bottom: 25px;
        .title {
          display: flex;
          align-items: flex-end;
          h1 {
            font-weight: 600;
            font-size: 35px;
            text-transform: uppercase;
            margin: 10px 0 24px;
            color: #414141;
            flex: 1;
          }
          p {
            color: #484848;
            text-align: center;
            font-weight: 600;
            font-size: 16px;
            margin-top: -8px;
            margin-bottom: 16px;
          }
          .question-position {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 24px;
            .total {
              color: $green;
            }
          }
        }
        .progress-bar {
          height: 20px;
          overflow: hidden;
          background-color: #eeeeee;
          border-radius: 10px;
          .bar {
            width: 0%;
            height: 100%;
            background-color: $green;
            transition: width 1s linear;
            border-radius: 10px;
          }
        }
      }
      .responses {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        flex-direction: column;
        .separator {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
        }
        .item,
        .response {
          width: calc(50% - 8px);
          justify-content: center;
          align-items: center;
          display: flex;
          margin-bottom: 16px;
          padding: 16px 20px;
          font-size: 16px;
          color: #000000;
          font-weight: 500;
          box-shadow: 0 4px 5px rgba(0, 0, 0, 0.1);
          position: relative;
          user-select: none;
          border-radius: 3px;
          background-color: #f8f7f7;
          border: 5px solid #f8f7f7;
          transition: 0.3s background-color ease-out, 0.3s border-color ease-out;
          cursor: pointer;
          @media screen and (max-width: 480px) {
            width: 100%;
          }
          &.animator {
            background-color: #c7c7c7;
            color: #6d6d6d;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
            cursor: not-allowed;
          }
          &.right {
            background-color: $green !important;
            border-color: $green;
            color: white;
          }
          &.wrong {
            background-color: #ff6060 !important;
            border-color: #ff6060;
            color: white;
          }
          &.realy_wrong {
            background-color: #e01515 !important;
            border-color: #e01515;
            color: white;
          }
          &.checked {
            background-color: #c5c5c5;
            border-color: #c5c5c5;
          }
        }
      }
      &.question-interface {
        .question {
          box-shadow: 0 4px 5px rgba(0, 0, 0, 0.1);
          color: #414141;
          background-color: #f8f7f7;
          padding: 16px;
          margin-bottom: 16px;
          user-select: none;
          .question-content {
            width: calc(100% - 100px);
            p {
              margin: 0;
              line-height: 25px;
              font-size: 18px;
              font-weight: 600;
            }
            img {
              max-width: 100%;
            }
          }
        }
      }
      &.result-interface {
        .infos .title {
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .appreciation {
          padding: 14px;
          color: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
          text-align: center;
          &.right {
            background-color: $green;
          }
          &.wrong {
            background-color: #ff6060;
          }
          &.realy_wrong {
            background-color: #e01515;
          }
        }
        .questions {
          display: flex;
          flex-direction: column;
          .element {
            margin-top: 32px;
            .question-name {
              color: #292929;
              font-size: 18px;
            }
            .question {
              background: #ffffff;
              box-shadow: 0 4px 5px rgba(0, 0, 0, 0.1);
              border-radius: 4px;
              margin-top: 16px;
              .head {
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: white;
                box-shadow: 0 4px 5px rgba(0, 0, 0, 0.1);
                border-radius: 3px 3px 0 0;
                padding: 12px 16px;
                &.right {
                  background-color: $green;
                }
                &.wrong {
                  background-color: #ff6060;
                }
                &.realy_wrong {
                  background-color: #e01515;
                }
                .question-text {
                  max-width: calc(100% - 64px);
                }
                .result-icon {
                  width: 32px;
                  height: 32px;
                }
              }
              .content {
                padding: 24px;
                .responses .item {
                  cursor: default;
                }
                .explication {
                  margin-top: 16px;
                  color: #585858;
                  .source {
                    color: $green;
                    margin: 12px auto 0;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
