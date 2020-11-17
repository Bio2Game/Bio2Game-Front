<template>
  <div v-if="currentQuestion" class="interface question-interface">
    <div class="infos">
      <div class="title">
        <h1>{{ currentQuestion.label }}</h1>
        <div class="question-position">
          {{ renderNumber(position + 1, quiz.questions.length)
          }}<span class="total">/{{ quiz.questions.length }}</span>
        </div>
      </div>
      <div id="progress" class="progress-bar">
        <div class="bar" :style="{ width: progress }"></div>
      </div>
    </div>
    <div class="question">
      <div
        class="question-content"
        v-html="markdown.render(currentQuestion.question)"
      ></div>
    </div>
    <div class="responses">
      <div class="separator">
        <div
          class="item"
          :class="{
            checked: response === 0,
            [getColor(0)]: status === 2,
          }"
          @click="response = 0"
        >
          <div class="cover"></div>
          {{ responses[0] }}
        </div>
        <div
          class="item"
          :class="{
            checked: response === 1,
            [getColor(1)]: status === 2,
          }"
          @click="response = 1"
        >
          <div class="cover"></div>
          {{ responses[1] }}
        </div>
      </div>
      <div class="separator">
        <div
          class="item"
          :class="{
            checked: response === 2,
            [getColor(2)]: status === 2,
          }"
          @click="response = 2"
        >
          <div class="cover"></div>
          {{ responses[2] }}
        </div>
        <div
          class="item"
          :class="{
            checked: response === 3,
            [getColor(3)]: status === 2,
          }"
          @click="response = 3"
        >
          <div class="cover"></div>
          {{ responses[3] }}
        </div>
      </div>
      <div v-if="status === 2" class="explication">
        <h6 class="explication-title">Explication:</h6>
        <span v-html="markdown.render(currentQuestion.explication)"></span>
        <p v-if="currentQuestion.source" class="kown">
          <a :href="currentQuestion.source" target="black">En savoir plus</a>.
        </p>
      </div>
      <a
        v-if="status === 1"
        class="submit-next button lg green"
        @click="sendResponse()"
        >Valider</a
      >
      <a
        v-if="status === 2"
        class="submit-next resp button lg green"
        @click="skipResponses()"
        >Question suivante</a
      >
    </div>
  </div>
</template>

<script>
import { Remarkable } from 'remarkable'

import { mapState, mapGetters } from 'vuex'

const colors = ['right', 'wrong', 'wrong', 'realy_wrong']

export default {
  name: 'QuestionState',
  data() {
    return {
      response: null,
      timer: null,
      left: 0,
      progress: '0%',
      markdown: new Remarkable(),
      sended: false,
    }
  },
  computed: {
    ...mapState('quiz', ['quiz', 'position', 'status', 'currentQuestion']),
    ...mapGetters('quiz', { responses: 'getResponses' }),
  },
  watch: {
    status(status) {
      if (status === 1) {
        this.shuffleResponses()
        this.startTimer()
      } else {
        this.progress = '100%'
      }
    },
  },
  mounted() {
    this.shuffleResponses()
    this.startTimer()
  },
  methods: {
    skipResponses() {
      this.response = null
      this.sended = false
      this.$store.dispatch('quiz/nextQuestion')
    },
    renderNumber(position, total) {
      return position < 10 && total > 9 ? `0${position}` : position
    },
    shuffleResponses() {
      const responses = Object.values(
        JSON.parse(this.currentQuestion.responses),
      )

      this.$store.commit('quiz/RESPONSES_ORDER', {
        id: this.currentQuestion.id,
        responses,
      })
    },
    getColor(index) {
      return colors[this.$store.getters['quiz/getRealIndex'](index)]
    },
    async sendResponse() {
      if (this.sended) return
      this.sended = true

      if (this.response === null) {
        this.cancel()
        this.response = this.$store.getters['quiz/getFakeIndex'](3)
        await new Promise(resolve => setTimeout(() => resolve(), 1000))
      }

      this.cancel()
      this.$store.dispatch('quiz/respond', {
        index: this.response,
        time: this.currentQuestion.time - this.left,
      })
    },
    async startTimer() {
      if (this.timer) this.cancel()

      const end = Date.now() + this.currentQuestion.time * 1000

      const loop = () => {
        const left = end - Date.now()

        if (left < 0) {
          this.cancel()
          this.sendResponse()
          return
        }

        this.progress =
          (1 - (left - 1000) / (this.currentQuestion.time * 1000)) * 100 + '%'

        this.timer = setTimeout(loop, left % 1000 || 1000)
        this.left = Math.floor(left / 1000)
      }

      await new Promise(resolve => requestAnimationFrame(resolve))
      await new Promise(resolve => requestAnimationFrame(resolve))

      loop()
    },
    cancel() {
      clearTimeout(this.timer)
      this.timer = null
    },
  },
}
</script>
