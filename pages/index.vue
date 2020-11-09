<template>
  <div class="features-page">
    <div class="features">
      <div v-for="(feature, index) in features" :key="index" class="feature">
        <div class="container">
          <div class="image-container">
            <img :src="feature.image" alt="feature.name" />
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
        :autoplay="true"
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
              <div class="quizs-title">Quiz créés</div>
              <div class="quizs-list">
                <div
                  v-for="quiz in contributor.quizzes"
                  :key="quiz.id"
                  class="quiz"
                >
                  <div class="icon">
                    <img
                      :src="
                        'https://www.bio2game.com/images/icons/' +
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
                </div>
              </div>
            </div>
          </div>
        </slide>
      </carousel>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Features',
  data() {
    return {
      contributors: [],
      //       {
      //   id: 5,
      //   name: 'DraftMan',
      //   description:
      //     'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
      //   avatar: 'https://www.draftman.fr/images/me.png',
      //   quizs: [
      //     {
      //       id: 1,
      //       name: 'Devoirs de vigilance',
      //       description: `Qu'est ce que le devoir de vigilance des entreprises`,
      //       icon: 'https://www.draftman.fr/images/me.png',
      //     },
      //     {
      //       id: 2,
      //       name: `Efficacité énergétique de l'aviation`,
      //       description: `Baisse anticipée de la consommation des avions sur les terrains`,
      //       icon: 'https://www.draftman.fr/images/me.png',
      //     },
      //     {
      //       id: 3,
      //       name: 'Climatoseptiques',
      //       description: `Comment le DD est perçu par l'opinion publique en France`,
      //       icon: 'https://www.draftman.fr/images/me.png',
      //     },
      //   ],
      // },
      features: [
        {
          name: 'Moderne et Ergonomique',
          description:
            'Nous vous proposons une interface moderne et intéractive afin de proposer la meilleure experience !',
          image: '/images/features/ui.svg',
        },
        {
          name: 'Education',
          description:
            'Utilisez Bio2Game dans l’éducation afin de tester, créer des quizzs adaptés aux profil de vos élèves et étudiez leurs résultats et statistiques.',
          image: '/images/features/education.svg',
        },
        {
          name: 'Vie privée',
          description:
            'La nature est aussi importante que votre vie privée. C’est pour cela que vos informations privées resteront privées !',
          image: '/images/features/private.svg',
        },
        {
          name: 'Communautaire',
          description:
            "Un lieu de rencontre et de partage d'informations innovantes entre tous ceux qui cherchent des solutions au quotidien.",
          image: '/images/features/community.svg',
        },
        {
          name: 'Une API',
          description:
            'Bio2Game vous propose une API pour pouvoir accéder à vos données depuis vos sites ou projets.',
          image: '/images/features/api.svg',
        },
      ],
    }
  },
  async mounted() {
    const { contributors } = await this.$axios.$get('/api/contributors')
    this.contributors = contributors
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
        align-items: center;
        justify-content: space-between;
        height: 220px;
        @media screen and (max-width: $sm) {
          height: 200px;
        }

        .image-container {
          margin: 0 64px;
          display: flex;
          height: 100%;
          @media screen and (max-width: $md) {
            display: none;
          }
          img {
            display: flex;
            width: 100%;
          }
        }
        .content {
          max-width: 450px;
          margin: 0 64px;
          @media screen and (max-width: $sm) {
            margin: 0 24px;
          }
          h3 {
            font-weight: 800;
            font-size: 36px;
            line-height: 44px;
            margin-bottom: 16px;
            color: $green;
            @media screen and (max-width: $sm) {
              font-size: 30px;
              line-height: 40px;
            }
          }
          p {
            font-size: 18px;
            line-height: 26px;
            color: #414141;
          }
        }
      }
      &:nth-child(2n + 1) {
        background-color: #bce443;
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
    display: flex;
    justify-content: center;
    flex-direction: column;
    background-color: white;
    position: relative;
    .title {
      display: flex;
      justify-content: center;
      position: relative;
      margin: 60px 0 50px;
      h2 {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-weight: 700;
        font-size: 35px;
        text-transform: uppercase;
        color: $green;
      }
    }

    .carousel {
      .contributor {
        background: #ffffff;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
        border-radius: 12px;
        padding: 24px;
        margin: 32px 16px;
        &:last-child {
          margin-right: 32px 0;
        }
        .content-contributor {
          display: flex;
          margin-bottom: 16px;
          .avatar {
            min-width: 72px;
            width: 72px;
            height: 72px;
            img {
              width: 100%;
              border-radius: 36px;
            }
          }
          .content-text {
            margin-left: 12px;
            .contributor-name {
              font-weight: 600;
              font-size: 20px;
              line-height: 29px;
              color: #000000;
            }
            .contributor-description {
              font-size: 14px;
              line-height: 17px;
              color: #4d4d4d;
            }
          }
        }
        .quizs-title {
          font-weight: 600;
          font-size: 18px;
          line-height: 22px;
          color: #000000;
          margin-bottom: 12px;
        }
        .quizs-list {
          .quiz {
            display: flex;
            background: #f1f1f1;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
            border-radius: 6px;
            padding: 8px 16px 8px 8px;
            margin-bottom: 16px;
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
                font-weight: 500;
                font-size: 16px;
                line-height: 18px;
                margin-bottom: 5px;
                color: #000000;
              }
              .quiz-description {
                font-weight: 500;
                font-size: 12px;
                line-height: 14px;
                color: #494949;
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
        transform: none;
        position: relative;
        font-size: 42px;
        outline: 0;
        cursor: pointer;
        color: $green;
        text-shadow: 0 2px 4px #00000040;
        height: 40px;
        &.VueCarousel-navigation--disabled {
          opacity: 1;
          color: #afafaf;
        }
      }
    }
  }
}
</style>
