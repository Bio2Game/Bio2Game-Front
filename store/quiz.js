import shuffle from 'lodash/shuffle'

const getDefaultState = () => ({
  quiz: null,
  currentQuestion: null,
  position: 0,
  status: 0,
  responses: {},
})

export const state = getDefaultState

export const getters = {
  getRealIndex:
    state =>
    (index, questionIndex = null) => {
      const question =
        questionIndex !== null
          ? state.quiz.questions[questionIndex]
          : state.currentQuestion
      const { responses, equivalents } = state.responses[question.id] || {}
      return responses ? equivalents.indexOf(responses[index]) : index
    },

  getFakeIndex:
    state =>
    (index, questionIndex = null) => {
      const question =
        questionIndex !== null
          ? state.quiz.questions[questionIndex]
          : state.currentQuestion
      const { responses, equivalents } = state.responses[question.id] || {}
      return responses ? responses.indexOf(equivalents[index]) : index
    },

  getResponses:
    state =>
    (questionId = null) => {
      const question =
        state.responses[
          questionId === null ? state.currentQuestion.id : questionId
        ]
      return question
        ? question.responses
        : Object.values(
            questionId === null
              ? state.currentQuestion.responses
              : state.quiz.questions.find(q => q.id === questionId).responses,
          )
    },
}

export const mutations = {
  RESET_STATE(state) {
    Object.assign(state, getDefaultState)
  },

  SET_QUIZ(state, quiz) {
    state.quiz = quiz
  },

  SET_CURRENT_QUESTION(state, question) {
    state.currentQuestion = question
    state.position = state.quiz.questions.indexOf(question)
    state.status = 1
  },

  SET_QUESTION_RESPONSE(state, response) {
    state.currentQuestion.user_response = response
    state.status = 2
  },

  RESPONSES_ORDER(state, data) {
    state.responses[data.id] = {
      equivalents: data.responses,
      responses: shuffle(data.responses),
    }
  },

  SET_STATUS(state, status) {
    state.status = status
  },
}

export const actions = {
  async fetchQuiz({ commit, dispatch }, { id, type }) {
    const response = await this.$axios.$get(`/api/quiz/${id}/${type}`)
    if (!response.quiz) {
      throw new Error("Ce quiz n'existe pas")
    }
    commit('SET_QUIZ', response.quiz)
    if (!response.quiz.questions) {
      throw new Error('Ce quiz ne contient aucunes questions')
    }
    dispatch('nextQuestion')
  },

  async respond({ state, commit }, { index, time, type }) {
    if (!state.quiz || state.status !== 1) {
      return
    }

    try {
      const { responses, equivalents } =
        state.responses[state.currentQuestion.id]

      const { response } = await this.$axios.$post(
        `/api/quiz/${state.quiz.id}/${type}`,
        {
          question_id: state.currentQuestion.id,
          response_id: equivalents.indexOf(responses[index]),
          response: responses[index],
          time,
          strategy: this.$auth.strategy.name,
        },
      )

      commit('SET_QUESTION_RESPONSE', response)
    } catch (error) {
      console.error(error)
    }
  },

  nextQuestion({ state, commit }) {
    if (!state.quiz.questions.some(q => !q.user_response)) {
      return commit('SET_STATUS', 3)
    }

    commit(
      'SET_CURRENT_QUESTION',
      state.quiz.questions.find(q => !q.user_response),
    )
  },
}
