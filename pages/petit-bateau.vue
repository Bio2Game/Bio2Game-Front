<template>
  <div class="container petit-bateau-event">
    <div v-if="!status && !askAuth" class="wrapper">
      <div class="logo">
        <PetitBateau />
      </div>
      <h1 class="title">Water Family & Bio2Game</h1>
      <div class="description">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque
        necessitatibus a molestias velit fuga. Nemo repudiandae aperiam
        deserunt. Pariatur ducimus sunt eaque provident cumque eveniet fugit
        saepe incidunt officiis ipsa.
      </div>
      <div class="languages">
        <div class="lang" @click="play('fr')">
          <LangFR />
          <div class="overlay">Jouer en français</div>
        </div>
        <div class="lang" @click="play('en')">
          <LangEN />
          <div class="overlay">Play in english</div>
        </div>
        <div class="lang" @click="play('de')">
          <LangDE />
          <div class="overlay">Auf deutsch spielen</div>
        </div>
        <div class="lang" @click="play('it')">
          <LangIT />
          <div class="overlay">Gioca in italiano</div>
        </div>
        <div class="lang" @click="play('mar')">
          <LangMAR />
          <div class="overlay">العب بالعربية</div>
        </div>
      </div>
    </div>
    <div v-else-if="status" class="container">
      <section class="playground">
        <QuizQuestionState v-if="[1, 2].includes(status)" />
        <QuizResultState v-if="status === 3" />
      </section>
    </div>
    <section v-else class="simpleAuth">
      <div class="block">
        <div class="head">
          <h5>Identification</h5>
        </div>
        <div class="content">
          <p v-if="lang === 'fr'">
            Afin de vous distinguer des autres joueurs dans la partie, veuillez
            remplir ces informations.
          </p>
          <p v-if="lang === 'en'">
            In order to distinguish yourself from other players in the game,
            please fill in this information.
          </p>
          <p v-if="lang === 'de'">
            Um sich von anderen Spielern im Spiel abzuheben, füllen Sie bitte
            diese Informationen aus.
          </p>
          <p v-if="lang === 'it'">
            Per distinguerti dagli altri giocatori nel gioco, compila queste
            informazioni.
          </p>
          <p v-if="lang === 'mar'">
            من أجل تمييز نفسك عن اللاعبين الآخرين في اللعبة ، يرجى ملء هذه
            المعلومات.
          </p>
          <InputElement
            :value="firstname"
            type="text"
            placeholder="First name"
            @input="firstname = $event"
          />
          <InputElement
            :value="lastname"
            type="text"
            placeholder="Last name"
            @input="lastname = $event"
          />
          <InputElement
            :value="website"
            type="text"
            placeholder="Website"
            @input="website = $event"
          />
          <button
            class="button green lg"
            :class="{ disabled: !firstname || !lastname || !website }"
            @click="registerSimpleAuth()"
          >
            Start quiz !
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import PetitBateau from '@/assets/images/petit-bateau-event.svg?inline'

import LangFR from '@/assets/images/lang/fr.svg?inline'
import LangEN from '@/assets/images/lang/en.svg?inline'
import LangDE from '@/assets/images/lang/de.svg?inline'
import LangIT from '@/assets/images/lang/it.svg?inline'
import LangMAR from '@/assets/images/lang/mar.svg?inline'

export default {
  components: {
    PetitBateau,

    // Langs
    LangFR,
    LangEN,
    LangDE,
    LangIT,
    LangMAR,
  },
  data() {
    return {
      firstname: '',
      lastname: '',
      website: '',
      askAuth: false,
      lang: null,
      quizzesLangs: {
        fr: 318,
        en: 321,
        de: 319,
        it: 320,
        mar: 317,
      },
      started: false,
    }
  },
  computed: mapState('quiz', ['status']),
  destroyed() {
    this.$store.commit('quiz/RESET_STATE')
  },
  methods: {
    async play(lang) {
      if (this.lang) return

      this.lang = lang

      if (!this.$auth.loggedIn) {
        this.askAuth = true
      }

      try {
        await this.$store.dispatch('quiz/fetchQuiz', {
          id: this.quizzesLangs[this.lang],
          type: 'quiz',
        })
      } catch (error) {
        console.error(error)
        return this.$notify({
          type: 'error',
          text: "Une erreur s'est produite lors du chargement du quiz.",
          duration: 3000,
          width: 400,
        })
      }
    },
    async registerSimpleAuth() {
      if (!this.firstname || !this.lastname || !this.website) return

      await this.$auth.loginWith('guest', {
        data: {
          username: `${this.firstname}:${this.lastname}:${this.website}`,
        },
      })

      this.askAuth = false
    },
  },
}
</script>

<style lang="scss">
.petit-bateau-event {
  display: flex;

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 70px 16px;
  }

  .logo {
    display: flex;
    max-width: 300px;
    max-height: 300px;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  .title {
    display: flex;
    align-items: center;
    color: #ffffff;
    font-size: 32px;
    line-height: 39px;
    text-align: center;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
    margin-bottom: 16px;
  }

  .description {
    color: #3d3f38;
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
    text-align: center;
    max-width: 800px;
    margin-bottom: 32px;
  }

  .languages {
    display: flex;
    justify-content: center;
    gap: 32px;
    flex-wrap: wrap;
    max-width: 1200px;

    .lang {
      position: relative;
      display: flex;
      width: 200px;
      border: 5px solid $green;
      cursor: pointer;
      border-radius: 5px;
      filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.25));
      min-width: 200px;
      transition: transform 0.3s ease;

      svg {
        width: 100%;
        height: 100%;
      }

      .overlay {
        position: absolute;
        top: -1px;
        right: -1px;
        bottom: -1px;
        left: -1px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: $green;
        color: white;
        opacity: 0;
        font-weight: 600;
        transition: opacity 0.3s ease;
      }

      &:hover {
        transform: scale(1.1);

        .overlay {
          opacity: 1;
          transition: opacity 0.3s ease 0.6s;
        }
      }

      // .placeholder {
      //   padding-bottom: 65.4296875%;
      // }
    }
  }

  .playground {
    width: 100%;

    .interface {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 700px;
      margin: 32px auto 0;

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
        flex-direction: column;
        justify-content: space-between;
        flex-wrap: wrap;

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
          border: 6px solid transparent;
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

          &.checked {
            border-color: $green;
          }

          &.animator {
            background-color: #c7c7c7;
            color: #6d6d6d;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
            cursor: not-allowed;
          }

          &.right {
            background-color: $green !important;
            color: white;

            &.checked {
              border-color: white;
            }
          }

          &.wrong {
            background-color: #ff2c2c !important;
            color: white;

            &.checked {
              border-color: white;
            }
          }

          &.realy_wrong {
            background-color: #c10d0d !important;
            color: white;

            &.checked {
              border-color: white;
            }
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
        .infos {
          display: flex;
          justify-content: space-between;

          .title {
            flex-direction: column;
            align-items: flex-start;
          }
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
                flex-direction: column;
                align-items: center;
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

  .simpleAuth {
    max-width: 500px;
    margin: auto;

    .block {
      margin-top: 0;
      // stylelint-disable-next-line no-descending-specificity
      .content {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        // stylelint-disable-next-line no-descending-specificity
        p {
          line-height: 24px;
          margin-bottom: 16px;
        }

        .input-container {
          width: 100%;
        }
        // stylelint-disable-next-line no-descending-specificity
        .button {
          width: 100%;
          max-width: 100%;
        }
      }
    }
  }
}
</style>
