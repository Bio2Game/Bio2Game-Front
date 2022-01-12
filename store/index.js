export const state = () => ({
  donatorStatus: false
})

export const mutations = {
  SET_DONATION_STATUS(state, status) {
    state.donatorStatus = status
  }
}
