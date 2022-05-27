<template>
  <div class="quiz-next">
    <div class="left-part">
      <div class="icon">
        <img
          :src="`https://cdn.bio2game.com/icons/${
            quiz.domain && quiz.domain.icon && quiz.domain.icon.reference
          }`"
          :alt="quiz.domain && quiz.domain.name"
        />
      </div>
    </div>
    <div class="right-part">
      <div class="text">
        <h6 class="title">{{ quiz.label }}</h6>
        <p>{{ quiz.description }}</p>
      </div>
      <div class="buttons">
        <nuxt-link :to="url" class="jouer"> Jouer </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuizNext',
  props: {
    id: {
      type: [Number, String],
      required: true,
    },
  },
  computed: {
    quizzes() {
      return this.$store.getters['formations/quizzesFormation']
    },
    quiz() {
      return this.quizzes.find((quiz) => quiz.id === Number(this.id)) || {}
    },
    url() {
      return `/quiz/${this.id}-${this.quiz.url}`
    },
  },
}
</script>
