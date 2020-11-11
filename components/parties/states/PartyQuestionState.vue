<template>
  <div class="question-interface">
    <div class="infos">
      <div class="title">
        <h1>{{ questionState.label }}</h1>
        <div class="question-position">
          {{
            renderNumber(
              game.currentQuestion.position + 1,
              game.questions.length,
            )
          }}<span class="total">/{{ game.questions.length }}</span>
        </div>
      </div>
      <div id="progress" class="progress-bar">
        <div class="bar" :style="{ width: progress }"></div>
      </div>
    </div>
    <div class="question">
      <div
        class="question-content"
        v-html="markdown.render(questionState.question)"
      ></div>
    </div>
    <div class="responses">
      <div class="separator">
        <div
          class="item"
          :class="{
            checked: response === 0,
            animator: you.animator,
            [getColor(0)]: game.status === 2 || forceAnswer,
            interactive,
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
            animator: you.animator,
            [getColor(1)]: game.status === 2 || forceAnswer,
            interactive,
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
            animator: you.animator,
            [getColor(2)]: game.status === 2 || forceAnswer,
            interactive,
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
            animator: you.animator,
            [getColor(3)]: game.status === 2 || forceAnswer,
            interactive,
          }"
          @click="sendResponse(3)"
        >
          <div class="cover"></div>
          {{ responses[3] }}
        </div>
      </div>
      <div v-if="game.status === 2 || forceAnswer" class="explication">
        <p>
          Explication:<br /><span
            v-html="markdown.render(questionState.explication)"
          ></span>
        </p>
        <p v-if="questionState.source" class="kown">
          <a :href="questionState.source" target="black">En savoir plus</a>.
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
  props: {
    interactive: {
      type: Boolean,
      default: true,
    },
    forceAnswer: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      response: null,
      timer: null,
      progress: '0%',
      markdown: new Remarkable(),
    }
  },
  computed: {
    ...mapState('parties', ['game', 'you', 'responses', 'equivalents']),
    questionState() {
      return this.game.currentQuestion.question
    },
  },
  watch: {
    game(game, oldGame) {
      if (game.status !== oldGame.status) {
        this.cancel()
        this.progress = '0%'
        if (game.status === 1) {
          this.shuffleResponses()
          this.response = null
        }
        this.startTimer()
      }
    },
  },
  sockets: {
    progress({ timeLeft, timeTotal }) {
      this.$store.commit('parties/SET_PAUSE', false)
      this.start(timeLeft, timeTotal)
    },
    pause() {
      this.$store.commit('parties/SET_PAUSE', true)
      this.cancel()
    },
  },
  mounted() {
    if (!this.forceAnswer) {
      this.shuffleResponses()
    }
    this.startTimer()
  },
  methods: {
    startTimer() {
      const timer = this.game.currentQuestion.timer
      if (!timer) {
        return
      }
      this.start(timer.timeLeft, timer.timeTotal)
    },
    renderNumber(position, total) {
      return position < 10 && total > 9 ? `0${position}` : position
    },
    shuffleResponses() {
      const responses = Object.values(JSON.parse(this.questionState.responses))

      this.$store.commit('parties/RESPONSES_EQUIVALENTS', responses)
      this.$store.commit('parties/RESPONSES_ORDER', shuffle(responses))
    },
    getColor(index) {
      return colors[this.equivalents.indexOf(this.responses[index])]
    },
    sendResponse(index) {
      if (!this.interactive || this.response !== null || this.you.animator) {
        return
      }
      this.response = index

      return this.$socket.client.emit('responseGiven', {
        id: this.questionState.id,
        response: this.equivalents.indexOf(this.responses[index]),
      })
    },
    async start(time, initial) {
      if (time < 0) return
      if (this.timer) this.cancel()

      const end = Date.now() + time

      const loop = () => {
        const left = end - Date.now()

        if (left < 0) return this.cancel()

        this.progress = (1 - (left - 1000) / initial) * 100 + '%'

        if (this.game.pause) {
          return
        }
        this.timer = setTimeout(loop, left % 1000 || 1000)
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
