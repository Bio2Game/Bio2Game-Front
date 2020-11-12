const getDefaultState = () => ({
  quiz: null,
  currentQuestion: null,
  position: 0,
  status: 0,
  responses: [],
  equivalents: [],
})

export const state = getDefaultState

export const mutations = {
  RESET_STATE(state) {
    Object.assign(state, getDefaultState)
  },

  SET_QUIZ(state, quiz) {
    state.quiz = quiz
  },

  SET_CURRENT_QUESTION(state, question) {
    state.currentQuestion = {
      ...question,
      position: state.quiz.questions.indexOf(question) + 1,
    }
    state.status = 1
  },

  RESPONSES_ORDER(state, responses) {
    state.responses = responses
  },
  RESPONSES_EQUIVALENTS(state, equivalents) {
    state.equivalents = equivalents
  },

  SET_STATUS(state, status) {
    state.status = status
  },
}

export const actions = {
  async fetchQuiz({ state, commit }, id) {
    const response = await this.$axios.$get('/api/quiz/' + id)
    if (!response.quiz) {
      throw new Error("Ce quiz n'existe pas")
    }
    commit('SET_QUIZ', response.quiz)
    if (!response.quiz.questions) {
      throw new Error('Ce quiz ne contient aucunes questions')
    }
    if (!response.quiz.questions.some(q => !q.user_response)) {
      return commit('SET_STATUS', 3)
    }
    commit(
      'SET_CURRENT_QUESTION',
      response.quiz.questions.find(q => !q.user_response),
    )
  },

  async respond({ state, commit }, { index, time }) {
    if (!state.quiz || state.status !== 1) {
      return
    }

    try {
      await this.$axios.$post('/api/quiz/' + state.quiz.id, {
        question_id: state.currentQuestion.id,
        response_id: state.equivalents.indexOf(state.responses[index]),
        response: state.responses[index],
        time,
      })

      commit('SET_STATUS', 2)
    } catch (error) {
      console.error(error)
    }
  },
}
