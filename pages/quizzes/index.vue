<template>
  <div class="quiz-page">
    <NatureImage class="nature" />
    <div class="top">
      <h1>QUIZZES</h1>
      <p>Choisissez les quizzes succeptibles de vous intéresser.</p>
    </div>
    <div class="levels">
      <div class="level_switch">
        <div
          v-for="(level, index) of levels"
          :key="index"
          class="level"
          :class="{ active: selectedLevels.includes(index) }"
          @click="levelSelect(index)"
        >
          <img :src="level.icon" :alt="level.name" />
          <span class="label">{{ level.name }}</span>
        </div>
      </div>
    </div>
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
                'https://www.bio2game.com/images/icons/' +
                quiz.domain.icon.reference
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
            <a :href="getURL(quiz)" class="jouer">Jouer</a>
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
  name: 'Quizzes',
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
        message: 'Unable to fetch quizzes on the Bio2Game API',
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
      return this.places || this.search
        ? this.quizzes.filter(quiz =>
            quiz.name.includes(this.search) ||
            quiz.description.includes(this.search) ||
            quiz.id === this.search ||
            quiz.user.username.includes(this.search) ||
            quiz.domain.name.includes(this.search) ||
            quiz.localisation.includes(this.places) ||
            quiz.user.name
              ? quiz.user.name.includes(this.search)
              : false,
          )
        : this.quizzes
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
      return `/quiz/play/${quiz.id}-${quiz.url}`
    },
  },
}
</script>

<style lang="scss">
.quiz-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  .nature {
    margin: 24px 0 16px;
    width: 350px;
    height: 293.5px;
  }
  .top {
    h1 {
      color: #292929;
      font-size: 36px;
      font-weight: 700;
      margin: 32px 0 24px;
      text-align: center;
    }
    p {
      text-align: center;
      font-size: 18px;
      color: #292929;
    }
  }
  .levels {
    display: flex;
    justify-content: center;
    max-width: 800px;
    width: 100%;
    padding: 32px;
    .level_switch {
      height: 64px;
      display: flex;
      justify-content: space-between;
      position: relative;
      padding: 0 16px;
      width: 80%;
      &::after {
        content: '';
        position: absolute;
        top: 20px;
        background-color: $green;
        left: -8px;
        right: -8px;
        height: 24px;
        border-radius: 12px;
        z-index: 1;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
      }
      .level {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        border-radius: 32px;
        background-color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
        z-index: 2;
        cursor: pointer;
        width: 64px;
        height: 64px;
        transition: 0.1s border ease;
        img {
          user-select: none;
        }
        &.active {
          border: 4px solid $green;
        }
      }
      .label {
        position: absolute;
        opacity: 0;
      }
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
      height: 220px;
      display: flex;
      flex-direction: column;
      margin: 0;
      transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
      box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14),
        0 1px 7px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -1px rgba(0, 0, 0, 0.2);
      background-color: $green;
      user-select: none;
      cursor: default;
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      .top-part {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: calc(100% - 50px);
        transition: 0.4s min-height ease;
        .icon {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 0;
          transition: 0.4s margin-left ease;
          img {
            width: 106px;
            height: 106px;
            position: relative;
            z-index: 2;
            transition: 0.4s width ease, 0.4s height ease;
            margin: 4px;
          }
          &::after {
            content: '';
            position: absolute;
            background-color: white;
            width: 40px;
            height: 40px;
            z-index: 1;
            border-radius: 20px;
          }
        }
      }
      .bottom-part {
        background-color: #ffffff;
        flex: 1;
        .text {
          color: #484848;
          font-size: 15px;
          margin: 11px 0 11px 16px;
          opacity: 0;
          width: 80%;
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
          display: flex;
          justify-content: flex-end;
          position: absolute;
          bottom: 16px;
          right: 16px;

          &.two {
            justify-content: space-between;
          }

          .favorite {
            color: $green;
            width: 30px;
            height: 30px;
            margin-right: 10px;
            opacity: 0;
            cursor: pointer;
          }

          .jouer {
            color: #ffffff;
            font-size: 18px;
            font-weight: 600;
            text-transform: uppercase;
            padding: 6px 24px;
            cursor: pointer;
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
        width: 100%;
        height: 50px;
        overflow-y: hidden;
        bottom: 0;
        color: $green;
        text-align: center;
        display: flex;
        align-items: center;
        font-size: 18px;
        justify-content: center;
        padding: 0 16px;
        h6 {
          font-weight: 600;
          text-transform: uppercase;
          text-overflow: ellipsis;
          overflow: hidden;
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
          margin-left: 0;
          bottom: 0;
          color: $green;
          justify-content: center;
          font-size: 18px;
          height: 50px;
          padding: 0 16px;
        }
        49% {
          bottom: 0;
          margin-left: 110%;
          color: $green;
          justify-content: center;
          font-size: 18px;
          height: 50px;
          padding: 0 16px;
        }
        50% {
          bottom: auto;
          top: 0;
          margin-left: -110%;
          color: #ffffff;
          justify-content: flex-start;
          font-size: 15px;
          height: 68px;
          padding: 0 56px 0 16px;
        }
        100% {
          margin-left: 0;
          color: #ffffff;
          top: 0;
          bottom: auto;
          justify-content: flex-start;
          font-size: 15px;
          height: 68px;
          padding: 0 56px 0 16px;
        }
      }
      @keyframes title_leave {
        100% {
          margin-left: 0;
          bottom: 0;
          color: $green;
          justify-content: center;
          font-size: 18px;
          height: 50px;
          padding: 0 16px;
        }
        50% {
          bottom: 0;
          margin-left: 110%;
          color: $green;
          justify-content: center;
          font-size: 18px;
          height: 50px;
          padding: 0 16px;
        }
        49% {
          bottom: auto;
          top: 0;
          margin-left: -110%;
          color: #ffffff;
          justify-content: flex-start;
          font-size: 15px;
          height: 68px;
          padding: 0 56px 0 16px;
        }
        0% {
          margin-left: 0;
          color: #ffffff;
          top: 0;
          bottom: auto;
          justify-content: flex-start;
          font-size: 15px;
          height: 68px;
          padding: 0 56px 0 16px;
        }
      }
    }
  }
}
</style>
