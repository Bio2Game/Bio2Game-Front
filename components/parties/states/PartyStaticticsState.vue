<template>
  <div class="stats">
    <div v-if="room_responses.length" class="questions">
      <div
        v-for="(question, index) of questions"
        :key="index"
        class="question-stats"
      >
        <div class="infos">
          <h3>Question {{ index + 1 }}:</h3>
          <p>{{ question.description }}</p>
        </div>
        <client-only>
          <DoughnutElement class="doughnut" :chartData="question.data" />
        </client-only>
      </div>
    </div>
    <div v-else class="no-data">
      <h4>Personne n'a encore répondu aux questions</h4>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'PartyStaticticsState',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState('parties', ['room_responses']),
    questions() {
      return this.room_responses.map(question => ({
        description: question.question_desc,
        data: {
          labels: [
            question.really_wrong_answers > 1
              ? 'très mauvaises réponses'
              : 'très mauvaise réponse',
            question.wrong_answers > 1
              ? `mauvaises réponses`
              : `mauvaise réponse`,
            question.right_answers > 1 ? `bonnes réponses` : 'bonne réponse',
          ],
          datasets: [
            {
              backgroundColor: ['#f43434', '#ff1d1d', '#BCE342'],
              borderColor: ['#ffffff', '#ffffff', '#ffffff'],
              data: [
                question.really_wrong_answers,
                question.wrong_answers,
                question.right_answers,
              ],
              borderWidth: 2,
              hoverBackgroundColor: ['#f43434', '#ff1d1d', '#BCE342'],
            },
          ],
        },
      }))
    },
  },
}
</script>

<style lang="scss">
.stats {
  .questions {
    display: grid;
    gap: 32px;
    margin: 16px auto;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

    .question-stats {
      position: relative;
      width: 250px;
      margin: 0 auto;

      .infos {
        position: absolute;
        top: 20%;
        right: 20%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #585858;
        text-align: center;
        flex-direction: column;
        bottom: 20%;
        left: 20%;
        user-select: none;

        h3 {
          font-size: 18px;
          margin-bottom: 4px;
        }

        p {
          font-size: 14px;
          word-break: break-all;
        }
      }
    }
  }
}
</style>
