export const state = () => ({
  formations: [],
  formationsFetched: false,
  formation: null,
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
}
