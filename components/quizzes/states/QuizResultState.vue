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
                    question.user_response === 0 ? 'checked' : '',
                    question.responses[0].color,
                  ]"
                >
                  <div class="cover"></div>
                  {{ question.responses[0].text }}
                </div>
                <div
                  class="item"
                  :class="[
                    question.user_response === 1 ? 'checked' : '',
                    question.responses[1].color,
                  ]"
                >
                  <div class="cover"></div>
                  {{ question.responses[1].text }}
                </div>
              </div>
              <div class="separator">
                <div
                  class="item"
                  :class="[
                    question.user_response === 2 ? 'checked' : '',
                    question.responses[2].color,
                  ]"
                >
                  <div class="cover"></div>
                  {{ question.responses[2].text }}
                </div>
                <div
                  class="item"
                  :class="[
                    question.user_response === 3 ? 'checked' : '',
                    question.responses[3].color,
                  ]"
                >
                  <div class="cover"></div>
                  {{ question.responses[3].text }}
                </div>
              </div>
            </div>
            <div v-if="explications" class="explication">
              <h6 class="explication-title">Explication:</h6>
              <span v-html="markdown(question.explication)" />
              <a
                v-if="question.source"
                class="source"
                :href="question.source"
                target="black"
              >
                En savoir plus
              </a>
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
            <span class="num good">1</span>
            <span class="label">Bonne Réponse</span>
          </div>
          <div class="stat">
            <span class="num bad">2</span>
            <span class="label">Mauvaises Réponses</span>
          </div>
          <div class="stat">
            <span class="num good">37</span>
            <span class="label">Points Collectés</span>
          </div>
        </div>
        <nuxt-link class="button green md submit-next" to="/quiz">
          Continuer
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import { parse } from '@/utils/markdown'

import { mapState } from 'vuex'

import ValidIcon from '@/assets/icons/valid.svg?inline'
import InvalidIcon from '@/assets/icons/invalid.svg?inline'

const colors = ['right', 'wrong', 'wrong', 'realy_wrong']

export default {
  name: 'ResultState',
  components: {
    ValidIcon,
    InvalidIcon,
  },
  props: {
    explications: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      markdown: parse,
    }
  },
  computed: {
    ...mapState('quiz', ['quiz', 'responses']),
    score() {
      const valides = this.quiz.questions.reduce(
        (acc, curr) =>
          acc + (curr.user_response && !curr.user_response.repons_nb ? 1 : 0),
        0,
      )
      const result = valides / this.quiz.questions.length
      if (result > 0.8) {
        return {
          color: 'right',
          text: 'Félicitation le sujet est maitrisé',
        }
      }
      if (result > 0.5) {
        return {
          color: 'wrong',
          text:
            'Bravo vous connaissez le sujet mais vous pouvez encore progresser',
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
                color: colors[equivalents.indexOf(text)],
              }))
            : Object.values(JSON.parse(question.responses)).map((text, i) => ({
                text,
                color: colors[i],
              })),
          explication: question.explication,
          source: question.source,
        }
      })
    },
  },
}
</script>
