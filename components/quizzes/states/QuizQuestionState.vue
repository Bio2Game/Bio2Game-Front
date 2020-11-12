<template>
  <div v-if="currentQuestion" class="question-interface">
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
          @click="sendResponse(0)"
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
          @click="sendResponse(1)"
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
          @click="sendResponse(2)"
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
          @click="sendResponse(3)"
        >
          <div class="cover"></div>
          {{ responses[3] }}
        </div>
      </div>
      <div v-if="status === 2" class="explication">
        <p>
          Explication:<br /><span
            v-html="markdown.render(currentQuestion.explication)"
          ></span>
        </p>
        <p v-if="currentQuestion.source" class="kown">
          <a :href="currentQuestion.source" target="black">En savoir plus</a>.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { shuffle } from 'lodash'
import { Remarkable } from 'remarkable'

import { mapState } from 'vuex'

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
    }
  },
  computed: {
    ...mapState('quiz', [
      'quiz',
      'position',
      'status',
      'equivalents',
      'responses',
      'currentQuestion',
    ]),
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
      this.$store.commit(
        'SET_CURRENT_QUESTION',
        this.quiz.questions[this.position + 1],
      )
    },
    renderNumber(position, total) {
      return position < 10 && total > 9 ? `0${position}` : position
    },
    shuffleResponses() {
      const responses = Object.values(
        JSON.parse(this.currentQuestion.responses),
      )

      this.$store.commit('quiz/RESPONSES_EQUIVALENTS', responses)
      this.$store.commit('quiz/RESPONSES_ORDER', shuffle(responses))
    },
    getColor(index) {
      return colors[this.equivalents.indexOf(this.responses[index])]
    },
    sendResponse(index) {
      this.response = index
      this.cancel()
      this.$store.dispatch('quiz/respond', {
        index,
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
          this.sendResponse(3)
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
