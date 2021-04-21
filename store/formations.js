import Vue from 'vue'

export const state = () => ({
  formations: [],
  formationsFetched: false,
  formation: null,

  contributorFormations: [],
  contributorFormationsFetched: false,
})

export const mutations = {
  SET_FORMATIONS(state, formations) {
    state.formations = formations
  },
  SET_FORMATION(state, formation) {
    state.formation = formation
  },
  SET_FORMATIONS_FETCHED(state) {
    state.formationsFetched = true
  },

  SET_CONTRIBUTOR_FORMATIONS(state, formations) {
    state.formations = formations
  },

  SET_CONTRIBUTOR_FORMATIONS_FETCHED(state) {
    state.formations_fetched = true
  },

  ADD_CONTRIBUTOR_FORMATION(state, formation) {
    state.formations.push(formation)
  },

  UPDATE_CONTRIBUTOR_FORMATION(state, formation) {
    const formationIndex = state.formations.findIndex(
      q => q.id === formation.id,
    )
    Vue.set(
      state.formations,
      formationIndex,
      Object.assign({}, state.formations[formationIndex], formation),
    )
  },
  DELETE_CONTRIBUTOR_FORMATION(state, formation) {
    const formationIndex = state.formations.findIndex(
      q => q.id === formation.id,
    )
    Vue.delete(state.formations, formationIndex)
  },
}

export const actions = {
  async fetchFormations({ state, commit }) {
    if (state.formationsFetched) {
      return
    }
    const response = await this.$axios.$get('/api/formations')
    commit('SET_FORMATIONS_FETCHED')
    commit('SET_FORMATIONS', response.formations)
  },

  async fetchFormation({ commit }, id) {
    const response = await this.$axios.$get(`/api/formations/${id}`)
    commit('SET_FORMATION', response.formation)
  },

  async fetchPersonnalFormations({ state, commit }) {
    if (state.contributorFormationsFetched) {
      return
    }
    const response = await this.$axios.$get('/api/contributor/formations')
    commit('SET_CONTRIBUTOR_FORMATIONS_FETCHED')
    commit('SET_CONTRIBUTOR_FORMATIONS', response.formations)
  },

  async createFormation({ commit }, payload) {
    const response = await this.$axios.$post(
      `/api/contributor/formations`,
      payload,
    )
    commit('ADD_CONTRIBUTOR_FORMATION', response.formation)
    return response.formation
  },

  async updateFormation({ commit }, payload) {
    const response = await this.$axios.$patch(
      `/api/contributor/formations/${payload.id}`,
      payload,
    )
    commit('UPDATE_CONTRIBUTOR_FORMATION', response.formation)
    return response.formation
  },

  async deleteFormation({ commit }, id) {
    const response = await this.$axios.$delete(
      `/api/contributor/formations/${id}`,
    )
    commit('DELETE_CONTRIBUTOR_FORMATION', response.formation)
    return response.formation
  },
}
