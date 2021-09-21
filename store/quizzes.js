import Vue from 'vue'

const getDefaultState = () => ({
  quizzes: [],
  quizzesFetched: false,
  quizzesQuestionsFetched: false,
  contributorQuizzes: [],
  contributorQuizzesFetched: false,
})

export const state = getDefaultState

export const getters = {
  getPersonnalQuiz: state => query => {
    const quizId =
      typeof query === 'string' ? parseInt(query.split('-')[0]) : query
    return state.contributorQuizzes.find(quiz => quiz.id === quizId) || {}
  },
  getPersonnalQuestion:
    ({ contributorQuizzes }) =>
    (quizQ, questionQ) => {
      const quizId = parseInt(quizQ.split('-')[0])
      const questionId = parseInt(questionQ)
      const quiz = contributorQuizzes.find(quiz => quiz.id === quizId) || {}
      if (!quiz.questions) return {}
      return quiz.questions.find(question => question.id === questionId) || {}
    },
  questions: ({ contributorQuizzes }) => {
    return contributorQuizzes
      .map(quiz =>
        quiz.questions
          ? quiz.questions.map(question => ({ ...question, quiz }))
          : [],
      )
      .flat()
  },
}

export const mutations = {
  RESET_STATE(state) {
    Object.assign(state, getDefaultState)
  },

  SET_QUIZZES(state, quizzes) {
    state.quizzes = quizzes
  },
  SET_CONTRIBUTOR_QUIZZES(state, quizzes) {
    state.contributorQuizzes = quizzes
  },

  SET_QUIZZES_FETCHED(state) {
    state.quizzesFetched = true
  },
  SET_QUESTIONS_QUIZZES_FETCHED(state) {
    state.quizzesQuestionsFetched = true
  },
  SET_CONTRIBUTOR_QUIZZES_FETCHED(state) {
    state.contributorQuizzesFetched = true
  },

  ADD_CONTRIBUTOR_QUIZZ(state, quiz) {
    state.contributorQuizzes.push(quiz)
  },
  UPDATE_CONTRIBUTOR_QUIZZ(state, quiz) {
    const quizIndex = state.contributorQuizzes.findIndex(q => q.id === quiz.id)
    Vue.set(
      state.contributorQuizzes,
      quizIndex,
      Object.assign({}, state.contributorQuizzes[quizIndex], quiz),
    )
  },
  UPDATE_CONTRIBUTOR_QUESTIONS(state, data) {
    const quizIndex = state.contributorQuizzes.findIndex(
      q => q.id === data.quiz_id,
    )
    Vue.set(
      state.contributorQuizzes,
      quizIndex,
      Object.assign({}, state.contributorQuizzes[quizIndex], {
        questions: data.questions,
      }),
    )
  },
  DELETE_CONTRIBUTOR_QUIZZ(state, quiz) {
    const quizIndex = state.contributorQuizzes.findIndex(q => q.id === quiz.id)
    Vue.delete(state.contributorQuizzes, quizIndex)
  },

  ADD_CONTRIBUTOR_QUESTION(state, question) {
    const quiz = state.contributorQuizzes.find(q => q.id === question.quiz_id)
    if (!quiz) return
    if (!quiz.questions) quiz.questions = []
    quiz.questions.push(question)
  },
  UPDATE_CONTRIBUTOR_QUESTION(state, question) {
    const quiz = state.contributorQuizzes.find(q => q.id === question.quiz_id)
    if (!quiz) return
    if (!quiz.questions.some(q => q.id === question.id)) {
      const oldQuiz = state.contributorQuizzes.find(quiz =>
        quiz.questions.some(q => q.id === question.id),
      )
      const oldQuestionIndex = oldQuiz.questions.findIndex(
        q => q.id === question.id,
      )
      oldQuiz.questions.splice(oldQuestionIndex, 1)
      quiz.questions.push(question)
      return
    }
    const questionIndex = quiz.questions.findIndex(q => q.id === question.id)
    Vue.set(quiz.questions, questionIndex, question)
  },
  DELETE_CONTRIBUTOR_QUESTION(state, question) {
    const quiz = state.contributorQuizzes.find(q => q.id === question.quiz_id)
    if (!quiz) return
    const questionIndex = quiz.questions.findIndex(q => q.id === question.id)
    quiz.questions.splice(questionIndex, 1)
  },
}

export const actions = {
  async fetchQuizzes({ state, commit }) {
    if (state.quizzesFetched) {
      return
    }
    const response = await this.$axios.$get('/api/quizzes')
    commit('SET_QUIZZES_FETCHED')
    commit('SET_QUIZZES', response.quizzes)
  },

  async fetchQuestionsQuizzes({ state, commit }) {
    if (state.quizzesFetched && state.quizzesQuestionsFetched) {
      return
    }
    const response = await this.$axios.$get('/api/quizzes/questions')
    commit('SET_QUIZZES_FETCHED')
    commit('SET_QUESTIONS_QUIZZES_FETCHED')
    commit('SET_QUIZZES', response.quizzes)
  },

  async fetchPeronnalQuizzes({ state, commit }) {
    if (state.contributorQuizzesFetched) {
      return
    }
    const response = await this.$axios.$get('/api/contributor/quizzes')
    commit('SET_CONTRIBUTOR_QUIZZES_FETCHED')
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
    commit('SET_QUIZZES', [])
    return response.quiz
  },

  async updateQuestionsOrder({ commit }, payload) {
    const response = await this.$axios.$patch(
      `/api/contributor/quizzes/${payload.quizId}/order`,
      payload,
    )
    commit('UPDATE_CONTRIBUTOR_QUESTIONS', response)
    commit('SET_QUIZZES', [])
  },

  async deleteQuiz({ commit }, quizId) {
    const response = await this.$axios.$delete(
      `/api/contributor/quizzes/${quizId}`,
    )
    commit('DELETE_CONTRIBUTOR_QUIZZ', response.quiz)
    commit('SET_QUIZZES', [])
  },

  async createQuestion({ commit, getters }, payload) {
    const response = await this.$axios.$post(
      '/api/contributor/questions',
      payload,
    )
    commit('ADD_CONTRIBUTOR_QUESTION', response.question)
    commit('SET_QUIZZES', [])
    return getters.getPersonnalQuiz(response.question.quiz_id)
  },

  async updateQuestion({ commit, getters }, payload) {
    const response = await this.$axios.$patch(
      `/api/contributor/questions/${payload.id}`,
      payload,
    )
    commit('UPDATE_CONTRIBUTOR_QUESTION', response.question)
    commit('SET_QUIZZES', [])
    return getters.getPersonnalQuiz(response.question.quiz_id)
  },

  async deleteQuestion({ commit }, payload) {
    const response = await this.$axios.$delete(
      `/api/contributor/questions/${payload.questionId}`,
    )
    commit('DELETE_CONTRIBUTOR_QUESTION', response.question)
    commit('SET_QUIZZES', [])
  },
}
