export const state = () => ({
  quizzes: [],
  contributor_quizzes: [],
})

export const mutations = {
  SET_QUIZZES(state, quizzes) {
    state.quizzes = quizzes
  },
  SET_CONTRIBUTOR_QUIZZES(state, quizzes) {
    state.contributor_quizzes = quizzes
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
}
