<template>
  <div class="features-page">
    <div class="features">
      <div v-for="(feature, index) in features" :key="index" class="feature">
        <div class="container">
          <div class="image-container">
            <Lottie
              class="image"
              :animationData="feature.data"
              :play="true"
            ></Lottie>
          </div>
          <div class="content">
            <h3>{{ feature.name }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="contributors">
      <div class="title">
        <h2>Contributeurs</h2>
      </div>

      <carousel
        :perPage="3"
        :autoplay="false"
        :navigationEnabled="true"
        paginationPosition="top"
        :navigationClickTargetSize="0"
        :paginationEnabled="false"
        class="container carousel"
      >
        <slide v-for="contributor in contributors" :key="contributor.id">
          <div class="contributor">
            <div class="content-contributor">
              <div class="avatar">
                <AvatarElement
                  :email="contributor.email"
                  :path="contributor.avatar_path"
                  :name="contributor.name || contributor.username"
                  :size="72"
                />
              </div>
              <div class="content-text">
                <div class="contributor-name">
                  {{ contributor.name || contributor.username }}
                </div>
                <div class="contributor-description">
                  {{ contributor.description }}
                </div>
              </div>
            </div>
            <div class="quizs">
              <div class="quizs-title">Derniers quizs créés</div>
              <div class="quizs-list">
                <nuxt-link
                  v-for="quiz in contributor.quizzes"
                  :key="quiz.id"
                  :to="`/quiz/${quiz.id}-${quiz.url}`"
                  class="quiz"
                >
                  <div class="icon">
                    <img
                      :src="
                        'https://cdn.bio2game.com/icons/' +
                        quiz.domain.icon.reference
                      "
                      :alt="quiz.label"
                    />
                  </div>
                  <div class="quiz-content">
                    <div class="quiz-name">
                      {{ quiz.label }}
                    </div>
                    <div class="quiz-description">
                      {{ quiz.description }}
                    </div>
                  </div>
                </nuxt-link>
              </div>
            </div>
          </div>
        </slide>
      </carousel>
    </div>
  </div>
</template>

<script>
// import api from '@/assets/data/api.json'
import book from '@/assets/data/book.json'
import ergo from '@/assets/data/ergo.json'
import couronne from '@/assets/data/couronne.json'
// import discu from '@/assets/data/discu.json'

import meta from '@/mixins/meta.js'

export default {
  name: 'Features',
  data() {
    return {
      contributors: [],
      features: [
        {
          name: 'Moderne et Ergonomique',
          description:
            'Nous vous proposons une interface moderne et intéractive afin de proposer la meilleure experience !',
          data: ergo,
        },
        {
          name: 'Education',
          description:
            'Utilisez Bio2Game dans l’éducation afin de tester, créer des quizzs adaptés aux profil de vos élèves et étudiez leurs résultats.',
          data: couronne,
        },
        {
          name: 'Vie privée',
          description:
            'La nature est aussi importante que votre vie privée. C’est pour cela que vos informations privées resteront privées !',
          data: book,
        },
        // {
        //   name: 'Communautaire',
        //   description:
        //     "Un lieu de rencontre et de partage d'informations innovantes entre tous ceux qui cherchent des solutions au quotidien.",
        //   data: discu,
        // },
        // {
        //   name: 'Une API',
        //   description:
        //     'Bio2Game vous propose une API pour pouvoir accéder au quiz depuis vos sites ou projets.',
        //   data: api,
        // },
      ],
    }
  },
  async mounted() {
    const { contributors } = await this.$axios.$get('/api/contributors')
    this.contributors = contributors.sort(
      (a, b) => b.quizzes.length - a.quizzes.length,
    )
  },
  head() {
    return meta.get({
      description:
        'Jeu pour apprendre à consommer de façon responsable en testant vos connaissances dans le développement durable. En adhérant à BIO2GAME vous partagerez vos préoccupations environnementales.',
    })
  },
}
</script>

<style lang="scss">
.features-page {
  padding: 0 !important;

  .features {
    display: flex;
    flex-direction: column;
    .feature {
      background-color: #ffffff;
      padding: 80px 0;
      @media screen and (max-width: $md) {
        padding: 48px 0;
      }
      @media screen and (max-width: $sm) {
        padding: 24px 0;
      }
      .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 220px;
        @media screen and (max-width: $sm) {
          height: 200px;
        }

        .image-container {
          display: flex;
          height: 100%;
          margin: 0 64px;
          @media screen and (max-width: $md) {
            display: none;
          }
          img {
            display: flex;
            width: 100%;
          }
        }
        .content {
          margin: 0 64px;
          max-width: 450px;
          @media screen and (max-width: $sm) {
            margin: 0 24px;
          }
          h3 {
            color: $green;
            font-size: 36px;
            font-weight: 800;
            line-height: 44px;
            margin-bottom: 16px;
            @media screen and (max-width: $sm) {
              font-size: 30px;
              line-height: 40px;
            }
          }
          p {
            color: #414141;
            font-size: 18px;
            line-height: 26px;
          }
        }
      }
      &:nth-child(2n + 1) {
        background-color: $green;
        .container {
          flex-direction: row-reverse;
          .content {
            text-align: right;
            h3 {
              color: white;
            }
          }
        }
      }
    }
  }
  .contributors {
    position: relative;
    display: flex;
    justify-content: center;
    flex-direction: column;
    background-color: white;
    .title {
      position: relative;
      display: flex;
      justify-content: center;
      margin: 60px 0 50px;
      h2 {
        display: flex;
        align-items: center;
        color: $green;
        font-size: 35px;
        font-weight: 700;
        flex-direction: column;
        text-transform: uppercase;
      }
    }

    .carousel {
      .contributor {
        padding: 24px;
        margin: 32px 16px;
        background: #ffffff;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
        border-radius: 12px;
        &:last-child {
          margin-right: 32px 0;
        }
        .content-contributor {
          display: flex;
          margin-bottom: 16px;
          .avatar {
            width: 72px;
            height: 72px;
            min-width: 72px;
            img {
              width: 100%;
              border-radius: 36px;
            }
          }
          .content-text {
            margin-left: 12px;
            .contributor-name {
              color: #000000;
              font-size: 20px;
              font-weight: 600;
              line-height: 29px;
            }
            .contributor-description {
              color: #4d4d4d;
              font-size: 14px;
              line-height: 17px;
            }
          }
        }
        .quizs-title {
          color: #000000;
          font-size: 18px;
          font-weight: 600;
          line-height: 22px;
          margin-bottom: 12px;
        }
        .quizs-list {
          .quiz {
            display: flex;
            padding: 8px 16px 8px 8px;
            background: #f1f1f1;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
            border-radius: 6px;
            margin-bottom: 16px;
            text-decoration: none;
            .icon {
              width: 48px;
              min-width: 48px;
              min-height: 48px;
              margin-right: 16px;
              img {
                width: 100%;
                border-radius: 24px;
              }
            }
            .quiz-content {
              display: flex;
              flex-direction: column;
              .quiz-name {
                color: #000000;
                font-size: 16px;
                font-weight: 500;
                line-height: 18px;
                margin-bottom: 5px;
              }
              .quiz-description {
                color: #494949;
                font-size: 12px;
                font-weight: 500;
                line-height: 14px;
              }
            }
          }
        }
      }
      .VueCarousel-navigation {
        position: absolute;
        bottom: 100%;
        margin-left: 16px;
      }
      .VueCarousel-navigation-button {
        position: relative;
        height: 40px;
        color: $green;
        font-size: 42px;
        cursor: pointer;
        transform: none;
        outline: 0;
        text-shadow: 0 2px 4px #00000040;
        user-select: none;
        &.VueCarousel-navigation--disabled {
          color: #afafaf;
          opacity: 1;
        }
      }
    }
  }
}
</style>
