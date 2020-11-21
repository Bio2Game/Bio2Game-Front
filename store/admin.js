const getDefaultState = () => ({
  users: [],
  users_fetched: false,
  domains: [],
  domains_fetched: false,
  icons: [],
  icons_fetched: false,
})

export const state = getDefaultState

export const mutations = {
  RESET_STATE(state) {
    Object.assign(state, getDefaultState)
  },

  // Assignations

  SET_USERS(state, users) {
    state.users = users
  },

  SET_USERS_FETCHED(state) {
    state.users_fetched = true
  },

  SET_DOMAINS(state, domains) {
    state.domains = domains
  },

  SET_DOMAINS_FETCHED(state) {
    state.domains_fetched = true
  },

  SET_ICONS(state, icons) {
    state.icons = icons
  },

  SET_ICONS_FETCHED(state) {
    state.icons_fetched = true
  },

  // Updates

  UPDATE_USER(state, user) {
    const index = state.users.findIndex(u => u.id === user.id)
    state.users[index] = user
  },

  ADD_DOMAIN(state, domain) {
    state.domains.push(domain)
  },

  UPDATE_DOMAIN(state, domain) {
    const domainIndex = state.domains.findIndex(q => q.id === domain.id)
    state.domains[domainIndex] = Object.assign(
      {},
      state.domains[domainIndex],
      domain,
    )
  },
}

export const actions = {
  async fetchUsers({ state, commit }) {
    if (state.users_fetched) {
      return
    }
    const response = await this.$axios.$get('/api/admin/users')
    commit('SET_USERS_FETCHED')
    commit('SET_USERS', response.users)
  },

  async fetchDomains({ state, commit }) {
    if (state.domains_fetched) {
      return
    }
    const response = await this.$axios.$get('/api/admin/domains')
    commit('SET_DOMAINS_FETCHED')
    commit('SET_DOMAINS', response.domains)
  },

  async fetchIcons({ state, commit }) {
    if (state.icons_fetched) {
      return
    }
    const response = await this.$axios.$get('/api/admin/icons')
    commit('SET_ICONS_FETCHED')
    commit('SET_ICONS', response.icons)
  },

  async updateUser({ commit }, payload) {
    const response = await this.$axios.$patch(
      `/api/admin/users/${payload.id}`,
      payload,
    )
    commit('UPDATE_USER', response.user)
    return response.user
  },

  async createDomain({ commit }, payload) {
    const response = await this.$axios.$post(`/api/admin/domains`, payload)
    commit('ADD_DOMAIN', response.domain)
    return response.domain
  },

  async updateDomain({ commit }, payload) {
    const response = await this.$axios.$patch(
      `/api/admin/domains/${payload.id}`,
      payload,
    )
    commit('UPDATE_DOMAIN', response.domain)
    return response.domain
  },
}
