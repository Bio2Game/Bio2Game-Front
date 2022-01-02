<template>
  <div class="interface result-interface">
    <div class="infos">
      <div class="title">
        <h1>{{ quiz.label }}</h1>
        <p>{{ quiz.description }}</p>
      </div>
    </div>
    <div class="appreciation" :class="score.color">
      {{ score.text }}
    </div>
    <div class="questions">
      <div v-for="(question, index) of questions" :key="index" class="element">
        <div class="question-name">
          <b>Question n°{{ index + 1 }} :</b> {{ question.label }}
        </div>
        <div class="question">
          <div
            class="head"
            :class="{
              right: question.user_response === 0,
              wrong: [1, 2].includes(question.user_response),
              realy_wrong: question.user_response === 3,
            }"
          >
            <div class="question-text" v-html="markdown(question.question)" />
            <ValidIcon
              v-if="question.user_response === 0"
              class="result-icon"
            />
            <InvalidIcon v-else class="result-icon" />
          </div>
          <div class="content">
            <div class="responses">
              <div class="separator">
                <div
                  class="item"
                  :class="[
                    question.user_response === getRealIndex(0, index)
                      ? 'checked'
                      : '',
                    colors[getRealIndex(0, index)],
                  ]"
                >
                  <div class="cover"></div>
                  <span>{{ getResponses(question.id)[0] }}</span>
                </div>
                <div
                  class="item"
                  :class="[
                    question.user_response === getRealIndex(1, index)
                      ? 'checked'
                      : '',
                    colors[getRealIndex(1, index)],
                  ]"
                >
                  <div class="cover"></div>
                  <span>{{ getResponses(question.id)[1] }}</span>
                </div>
              </div>
              <div class="separator">
                <div
                  class="item"
                  :class="[
                    question.user_response === getRealIndex(2, index)
                      ? 'checked'
                      : '',
                    colors[getRealIndex(2, index)],
                  ]"
                >
                  <div class="cover"></div>
                  <span>{{ getResponses(question.id)[2] }}</span>
                </div>
                <div
                  class="item"
                  :class="[
                    question.user_response === getRealIndex(3, index)
                      ? 'checked'
                      : '',
                    colors[getRealIndex(3, index)],
                  ]"
                >
                  <div class="cover"></div>
                  <span>{{ getResponses(question.id)[3] }}</span>
                </div>
              </div>
            </div>
            <div v-if="explications" class="explication">
              <h6 class="explication-title">Explication:</h6>
              <span v-html="markdown(question.explication)" />
              <a
                v-if="question.source"
                class="source"
                :href="formatSource(question.source)"
                target="black"
                >En savoir plus</a
              >
              <a
                class="source"
                :href="`mailto:${quiz.author.email}?cc=contact@bio2game.com`"
                target="black"
                >Contacter le créateur</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="results">
      <div class="head">Résultats</div>
      <div class="content">
        <div class="stats">
          <div class="stat">
            <span class="num good">{{ validCount }}</span>
            <span class="label">Bonne Réponse</span>
          </div>
          <div class="stat">
            <span class="num bad">{{
              quiz.questions.length - validCount
            }}</span>
            <span class="label">Mauvaises Réponses</span>
          </div>
        </div>
        <nuxt-link
          v-if="type !== 'formation'"
          class="button green md submit-next"
          to="/quiz"
        >
          Continuer
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { parse } from '@/utils/markdown'

import ValidIcon from '@/assets/icons/valid.svg?inline'
import InvalidIcon from '@/assets/icons/invalid.svg?inline'

export default {
  name: 'QuizResultState',
  components: {
    ValidIcon,
    InvalidIcon,
  },
  props: {
    explications: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: 'quiz',
    },
  },
  data() {
    return {
      markdown: parse,
      colors: ['right', 'wrong', 'wrong', 'realy_wrong'],
    }
  },
  computed: {
    ...mapState('quiz', ['quiz', 'responses']),
    ...mapGetters('quiz', ['getResponses', 'getRealIndex']),
    validCount() {
      return this.quiz.questions.reduce(
        (acc, curr) =>
          acc + (curr.user_response && !curr.user_response.repons_nb ? 1 : 0),
        0,
      )
    },
    score() {
      const result = this.validCount / this.quiz.questions.length
      if (result > 0.8) {
        return {
          color: 'right',
          text: 'Félicitation le sujet est maitrisé',
        }
      }
      if (result > 0.5) {
        return {
          color: 'wrong',
          text: 'Bravo vous connaissez le sujet mais vous pouvez encore progresser',
        }
      }
      return {
        color: 'realy_wrong',
        text: 'Il faut persévérer si ce sujet vous intéresse',
      }
    },
    questions() {
      return this.quiz.questions.map(question => {
        const { responses, equivalents } =
          this.$store.state.quiz.responses[question.id] || {}
        return {
          id: question.id,
          label: question.label,
          question: question.question,
          user_response: question.user_response
            ? question.user_response.repons_nb
            : 3,
          responses: responses
            ? responses.map(text => ({
                text,
                color: this.colors[equivalents.indexOf(text)],
              }))
            : Object.values(question.responses).map((text, i) => ({
                text,
                color: this.colors[i],
              })),
          explication: question.explication,
          source: question.source,
        }
      })
    },
  },
  methods: {
    formatSource(source) {
      return source.startsWith('http') ? source : `https://${source}`
    },
  },
}
</script>
