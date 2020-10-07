export const state = () => ({
  quizzes: [],
  contributorQuizzes: [],
})

export const getters = {
  getPersonnalQuiz: state => query => {
    const quizId = parseInt(query.split('-')[0])
    return state.contributorQuizzes.find(quiz => quiz.id === quizId) || {}
  },
  getPersonnalQuestion: ({ contributorQuizzes }) => (quizQ, questionQ) => {
    const quizId = parseInt(quizQ.split('-')[0])
    const questionId = parseInt(questionQ)
    const quiz = contributorQuizzes.find(quiz => quiz.id === quizId) || {}
    if (!quiz.questions) return {}
    return quiz.questions.find(question => question.id === questionId) || {}
  },
}

export const mutations = {
  SET_QUIZZES(state, quizzes) {
    state.quizzes = quizzes
  },
  SET_CONTRIBUTOR_QUIZZES(state, quizzes) {
    state.contributorQuizzes = quizzes
  },

  ADD_CONTRIBUTOR_QUIZZ(state, quiz) {
    state.contributorQuizzes.push(quiz)
  },
  UPDATE_CONTRIBUTOR_QUIZZ(state, quiz) {
    const quizIndex = state.contributorQuizzes.findIndex(q => q.id === quiz.id)
    state.contributorQuizzes[quizIndex] = quiz
  },

  ADD_CONTRIBUTOR_QUESTION(state, question) {
    const quiz = state.contributorQuizzes.find(q => q.id === question.quiz_id)
    if (!quiz) return
    quiz.questions.push(question)
  },
  UPDATE_CONTRIBUTOR_QUESTION(state, question) {
    const quiz = state.contributorQuizzes.find(q => q.id === question.quiz_id)
    if (!quiz) return
    const questionIndex = quiz.questions.findIndex(q => q.id === question.id)
    quiz.questions[questionIndex] = question
  },
}

export const actions = {
  async fetchQuizzes({ commit }) {
    const response = await this.$axios.$get('/api/quizzes')
    commit('SET_QUIZZES', response.quizzes)
  },

  async fetchPeronnalQuizzes({ commit }) {
    const response = await this.$axios.$get('/api/contributor/quizzes')
    commit('SET_CONTRIBUTOR_QUIZZES', response.quizzes)
  },

  async createQuiz({ commit }, payload) {
    const response = await this.$axios.$post(
      '/api/contributor/quizzes',
      payload,
    )
    commit('ADD_CONTRIBUTOR_QUIZZ', response.quiz)
    return response.quiz
  },

  async updateQuiz({ commit }, payload) {
    const response = await this.$axios.$patch(
      `/api/contributor/quizzes/${payload.id}`,
      payload,
    )
    commit('UPDATE_CONTRIBUTOR_QUIZZ', response.quiz)
    return response.quiz
  },

  async createQuestion({ commit }, payload) {
    const response = await this.$axios.$post(
      '/api/contributor/questions',
      payload,
    )
    commit('ADD_CONTRIBUTOR_QUESTION', response.question)
    return response.question
  },

  async updateQuestion({ commit }, payload) {
    const response = await this.$axios.$patch(
      `/api/contributor/questions/${payload.id}`,
      payload,
    )
    commit('UPDATE_CONTRIBUTOR_QUESTION', response.question)
    return response.question
  },
}
