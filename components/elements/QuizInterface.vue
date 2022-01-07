<template>
  <div class="quiz-interface">
    <div v-if="started" class="container">
      <section class="playground">
        <QuizQuestionState
          v-if="[1, 2].includes(status)"
          :key="refKey"
          :explications="explications"
          type="formation"
        />
        <QuizResultState
          v-if="status === 3"
          :key="refKey"
          :explications="explications"
          type="formation"
        />
      </section>
    </div>
    <section v-if="!started" class="get-started">
      <PlayIcon class="play" @click.once="startQuiz()" />
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import PlayIcon from '@/assets/icons/play.svg?inline'

export default {
  name: 'QuizInterface',
  components: {
    PlayIcon,
  },
  props: {
    id: {
      type: [Number, String],
      required: true,
    },
    explications: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      refKey: null,
      started: false,
    }
  },
  computed: {
    ...mapState('quiz', ['status', 'quiz']),
  },
  watch: {
    quiz(value) {
      this.started = value.id === this.id
      if (value.id !== this.id) {
        this.generateKey()
      }
    },
  },
  mounted() {
    this.generateKey()
  },
  methods: {
    generateKey() {
      this.refKey = Math.random().toString().substring(2)
    },
    async startQuiz() {
      await this.$store.dispatch('quiz/fetchQuiz', {
        id: this.id,
        type: 'formation',
      })
    },
  },
}
</script>

<style lang="scss">
.quiz-interface {
  display: flex;
  padding: 20px 024px;
  border-radius: 16px;
  background-color: #d9d9d973;
  min-height: 200px;
  margin: 16px 0;

  .playground {
    width: 100%;

    .interface {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 700px;
      margin: 0 auto;

      .infos {
        margin-bottom: 32px;

        .title {
          display: flex;
          align-items: flex-end;

          h1 {
            margin: 10px 0 24px;
            color: #414141;
            font-size: 35px;
            font-weight: 600;
            text-transform: uppercase;
            flex: 1;
          }

          p {
            color: #484848;
            font-size: 16px;
            text-align: center;
            margin-top: -8px;
            margin-bottom: 8px;
          }
        }

        .contributor-zone {
          display: flex;
          align-items: center;
          background-color: #f8f7f7;
          border-radius: 6px;
          margin-bottom: 24px;
          padding: 8px;
          cursor: pointer;
          text-decoration: none;

          img {
            border-radius: 12px;
          }

          h4 {
            margin-left: 8px;
            color: #4f4f4f;
            font-size: 14px;
            font-weight: 600;
          }
        }

        .position {
          display: flex;
          align-items: center;

          .progress-bar {
            overflow: hidden;
            height: 20px;
            background-color: #eeeeee;
            border-radius: 10px;
            flex: 1;

            .bar {
              width: 0%;
              height: 100%;
              background-color: $green;
              transition: width 1s linear;
              border-radius: 10px;
            }
          }

          .question-position {
            font-size: 18px;
            font-weight: 600;
            margin-left: 8px;

            .total {
              color: #5e5e5e;
            }
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
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: calc(50% - 8px);
          margin-bottom: 16px;
          padding: 16px 20px;
          border: 6px solid #f8f7f7;
          background-color: #f8f7f7;
          color: #000000;
          font-size: 16px;
          font-weight: 500;
          box-shadow: 0 4px 5px rgba(0, 0, 0, 0.1);
          user-select: none;
          border-radius: 3px;
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
            background-color: #ff1d1d !important;
            border-color: #ff1d1d;
            color: white;
          }

          &.realy_wrong {
            background-color: #e01515 !important;
            border-color: #e01515;
            color: white;
          }

          &.checked {
            background-color: #c5c5c5;
            border-color: #ffffff;
          }
        }
      }

      .explication {
        margin-top: 8px;
        color: #585858;
        font-size: 15px;

        .explication-title {
          margin-bottom: 4px;
          font-weight: 600;
        }

        .source {
          margin: 12px auto 0;
          color: $green;
        }
      }

      &.question-interface {
        .question {
          box-shadow: 0 4px 5px rgba(0, 0, 0, 0.1);
          padding: 16px;
          color: #414141;
          background-color: #f8f7f7;
          margin-bottom: 24px;
          user-select: none;

          .question-content {
            width: calc(100% - 100px);

            p {
              margin: 0;
              font-size: 18px;
              font-weight: 600;
              line-height: 25px;
            }

            img {
              max-width: 100%;
              margin-top: 8px;
            }
          }
        }

        .explication {
          padding: 16px;
          background: #ffffff;
          box-shadow: 0 4px 5px rgba(0, 0, 0, 0.1);
        }

        .submit-next {
          margin-top: 8px;
          width: 100%;
          max-width: 100%;

          &.resp {
            margin-top: 24px;
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
            background-color: #ff1d1d;
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
                padding: 12px 16px;
                color: white;
                box-shadow: 0 4px 5px rgba(0, 0, 0, 0.1);
                border-radius: 3px 3px 0 0;

                &.right {
                  background-color: $green;
                }

                &.wrong {
                  background-color: #ff1d1d;
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

                  &.checked {
                    border-color: #c5c5c5;
                  }
                }
              }
            }
          }
        }

        .results {
          background: #ffffff;
          box-shadow: 0 4px 5px rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          margin-top: 16px;

          /* stylelint-disable-next-line */
          .head {
            display: flex;
            justify-content: center;
            padding: 12px 16px;
            color: white;
            box-shadow: 0 4px 5px rgba(0, 0, 0, 0.1);
            border-radius: 3px 3px 0 0;
            background-color: $green;
          }

          /* stylelint-disable-next-line */
          .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 24px;

            .stats {
              display: flex;
              width: 100%;
              padding: 8px 0 32px;

              .stat {
                display: flex;
                align-items: center;
                flex-direction: column;
                flex: 1;

                .num {
                  font-size: 64px;
                  font-weight: 900;
                  margin-bottom: 8px;

                  &.good {
                    color: $green;
                  }

                  &.bad {
                    color: #f43434;
                  }
                }

                .label {
                  font-size: 16px;
                }
              }
            }

            .submit-next {
              margin-top: 8px;
              width: 100%;
              max-width: 400px;

              &.resp {
                margin-top: 24px;
              }
            }
          }
        }
      }
    }
  }

  .get-started {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;

    .play {
      width: 90px;
      height: 90px;
      transition: transform 0.3s ease;
      cursor: pointer;

      &:hover {
        transform: scale(1.1);
      }

      &:focus {
        transform: scale(0.9);
      }
    }
  }
}
</style>
