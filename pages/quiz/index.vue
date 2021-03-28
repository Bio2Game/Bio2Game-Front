<template>
  <div class="quiz-page">
    <div class="top">
      <h1>QUIZ</h1>
      <p>Choisissez les quiz succeptibles de vous intéresser.</p>
    </div>
    <LevelSelector v-model="selectedLevels" />
    <div class="filters">
      <InputElement
        v-model="search"
        class="white_label"
        type="text"
        placeholder="Rechercher"
      />
      <InputElement
        v-model="places"
        class="white_label"
        type="text"
        placeholder="Lieux"
      />
    </div>
    <div class="container quizzes">
      <div
        v-for="quiz of filtredQuizzes"
        :key="quiz.id"
        class="quiz"
        :class="{ enter: enter === quiz.id, leave: leave === quiz.id }"
        @mouseenter="trigger('in', quiz.id)"
        @mouseleave="trigger('out', quiz.id)"
      >
        <div class="top-part">
          <div class="icon">
            <img
              :src="
                'https://cdn.bio2game.com/icons/' + quiz.domain.icon.reference
              "
              :alt="quiz.domain.name"
            />
          </div>
        </div>
        <div class="bottom-part">
          <div class="text">
            <p>{{ quiz.description }}</p>
            <p class="creator"><b>Créateur :</b> {{ quiz.author.username }}</p>
          </div>
          <div class="buttons">
            <!--
              <template v-if="$auth.loggedIn">
              <Favorite class="favorite" />
              <FavoriteBorder class="favorite" />
            </template>
            -->
            <nuxt-link :to="getURL(quiz)" class="jouer">Jouer</nuxt-link>
          </div>
          <span class="quiz-id">#{{ quiz.id }}</span>
        </div>
        <div class="title">
          <h6 class="name">{{ quiz.label }}</h6>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Favorite from '@/assets/icons/favorite.svg?inline'
// import FavoriteBorder from '@/assets/icons/favorite_border.svg?inline'

export default {
  name: 'Quiz',
  components: {
    // Favorite,
    // FavoriteBorder,
  },
  async fetch({ store, error }) {
    try {
      await store.dispatch('quizzes/fetchQuizzes')
    } catch (e) {
      error({
        statusCode: 503,
        message: 'Unable to fetch quiz on the Bio2Game API',
      })
    }
  },
  data() {
    return {
      enter: null,
      leave: null,
      selectedLevels: [0, 1, 2, 3, 4],
      search: '',
      places: '',
      levels: [
        {
          name: 'Non validé',
          icon: require('@/assets/images/levels/level1.png'),
        },
        {
          name: 'Niveau primaire',
          icon: require('@/assets/images/levels/level2.png'),
        },
        {
          name: 'Niveau secondaire',
          icon: require('@/assets/images/levels/level3.png'),
        },
        {
          name: 'Niveau universitaire',
          icon: require('@/assets/images/levels/level4.png'),
        },
        {
          name: 'Niveau expert',
          icon: require('@/assets/images/levels/level5.png'),
        },
      ],
    }
  },
  computed: {
    quizzes() {
      return this.$store.state.quizzes.quizzes
    },
    filtredQuizzes() {
      const search = this.search.toLowerCase()
      const places = this.places.toLowerCase()
      return this.quizzes.filter(
        quiz =>
          this.selectedLevels.includes(quiz.level) &&
          (!search ||
            quiz.label.toLowerCase().includes(search) ||
            quiz.description.toLowerCase().includes(search) ||
            quiz.id.toString() === search ||
            quiz.author.username.toLowerCase().includes(search) ||
            quiz.domain.label.toLowerCase().includes(search) ||
            (quiz.author.name
              ? quiz.author.name.toLowerCase().includes(search)
              : false)) &&
          (!places || quiz.localisation.toLowerCase().includes(places)),
      )
    },
  },
  methods: {
    levelSelect(level) {
      if (this.selectedLevels.includes(level)) {
        if (this.selectedLevels.length === 5) {
          this.selectedLevels = [level]
          return
        }
        this.$delete(this.selectedLevels, this.selectedLevels.indexOf(level))
      } else {
        this.selectedLevels.push(level)
      }
    },
    trigger(type, quizId) {
      if (type === 'in') {
        if (this.leave === quizId) {
          this.leave = null
        }
        this.enter = quizId
      } else {
        if (this.enter === quizId) {
          this.enter = null
        }
        this.leave = quizId
      }
    },
    getURL(quiz) {
      return `/quiz/${quiz.id}-${quiz.url}`
    },
  },
}
</script>

<style lang="scss">
.fade-move {
  transition: transform 1s;
}

.quiz-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  .nature {
    width: 350px;
    height: 293.5px;
    margin: 24px 0 16px;
  }
  .top {
    h1 {
      margin: 32px 0 24px;
      color: #292929;
      font-size: 36px;
      font-weight: 700;
      text-align: center;
    }
    p {
      color: #292929;
      font-size: 18px;
      text-align: center;
    }
  }
  .filters {
    display: flex;
    .input-container {
      border-radius: 22px;
      input {
        border-radius: 22px;
        &:focus ~ .placeholder,
        &.has-content ~ .placeholder {
          left: 14px;
        }
      }
      .focus-bg {
        border-radius: 22px;
      }
      &:last-child {
        margin-left: 32px;
        margin-bottom: auto;
      }
    }
  }
  .quizzes {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 32px;
    margin-top: 32px;
    .quiz {
      position: relative;
      display: flex;
      overflow: hidden;
      height: 220px;
      margin: 0;
      cursor: default;
      flex-direction: column;
      transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
      box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14),
        0 1px 7px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -1px rgba(0, 0, 0, 0.2);
      background-color: $green;
      user-select: none;
      border-radius: 16px;
      .top-part {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: calc(100% - 50px);
        transition: 0.4s min-height ease;
        .icon {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 0;
          transition: 0.4s margin-left ease;
          img {
            position: relative;
            z-index: 2;
            width: 106px;
            height: 106px;
            margin: 4px;
            transition: 0.4s width ease, 0.4s height ease;
          }
          &::after {
            position: absolute;
            z-index: 1;
            width: 40px;
            height: 40px;
            content: '';
            background-color: white;
            border-radius: 20px;
          }
        }
      }
      .bottom-part {
        background-color: #ffffff;
        flex: 1;
        .text {
          width: 80%;
          margin: 11px 0 11px 16px;
          color: #484848;
          font-size: 15px;
          opacity: 0;
          transition: opacity 0.3s;

          .creator {
            margin: 16px 0 0;
            color: $green;
            b {
              font-weight: 600;
            }
          }
        }

        .quiz-id {
          position: absolute;
          color: #dedede;
          font-size: 20px;
          font-weight: 600;
          bottom: 16px;
          left: 16px;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .buttons {
          position: absolute;
          right: 16px;
          display: flex;
          justify-content: flex-end;
          bottom: 16px;

          &.two {
            justify-content: space-between;
          }

          .favorite {
            width: 30px;
            height: 30px;
            color: $green;
            cursor: pointer;
            margin-right: 10px;
            opacity: 0;
          }

          .jouer {
            padding: 6px 24px;
            color: #ffffff;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            text-transform: uppercase;
            border-radius: 15px;
            text-decoration: none;
            background-color: $green;
            opacity: 0;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
            transition: opacity 0.3s, background-color 0.3s, color 0.3s;
          }
        }
      }
      .title {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 50px;
        padding: 0 16px;
        color: $green;
        font-size: 18px;
        text-align: center;
        overflow-y: hidden;
        bottom: 0;
        h6 {
          overflow: hidden;
          font-weight: 600;
          text-transform: uppercase;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      &.enter {
        .top-part {
          min-height: 68px;
          .icon {
            margin-left: calc(100% - 64px);
            img {
              width: 32px;
              height: 32px;
            }
          }
        }
        .title {
          animation: 0.4s title_enter ease forwards;
        }

        .buttons .jouer,
        .buttons .favorite {
          opacity: 1;
          transition: opacity 0.6s 0.3s;
        }
        .quiz-id {
          opacity: 1;
          transition: opacity 0.6s 0.3s;
        }

        .text {
          opacity: 1;
          transition: opacity 0.6s 0.3s;
        }
      }
      &.leave {
        .title {
          animation: 0.4s title_leave ease forwards;
        }
      }
      @keyframes title_enter {
        0% {
          justify-content: center;
          height: 50px;
          padding: 0 16px;
          color: $green;
          font-size: 18px;
          margin-left: 0;
          bottom: 0;
        }
        49% {
          justify-content: center;
          height: 50px;
          padding: 0 16px;
          color: $green;
          font-size: 18px;
          bottom: 0;
          margin-left: 110%;
        }
        50% {
          top: 0;
          justify-content: flex-start;
          height: 68px;
          padding: 0 56px 0 16px;
          color: #ffffff;
          font-size: 15px;
          bottom: auto;
          margin-left: -110%;
        }
        100% {
          top: 0;
          justify-content: flex-start;
          height: 68px;
          padding: 0 56px 0 16px;
          color: #ffffff;
          font-size: 15px;
          margin-left: 0;
          bottom: auto;
        }
      }
      @keyframes title_leave {
        100% {
          justify-content: center;
          height: 50px;
          padding: 0 16px;
          color: $green;
          font-size: 18px;
          margin-left: 0;
          bottom: 0;
        }
        50% {
          justify-content: center;
          height: 50px;
          padding: 0 16px;
          color: $green;
          font-size: 18px;
          bottom: 0;
          margin-left: 110%;
        }
        49% {
          top: 0;
          justify-content: flex-start;
          height: 68px;
          padding: 0 56px 0 16px;
          color: #ffffff;
          font-size: 15px;
          bottom: auto;
          margin-left: -110%;
        }
        0% {
          top: 0;
          justify-content: flex-start;
          height: 68px;
          padding: 0 56px 0 16px;
          color: #ffffff;
          font-size: 15px;
          margin-left: 0;
          bottom: auto;
        }
      }
    }
  }
}
</style>
