export const state = () => ({
  donatorStatus: false,
})

export const mutations = {
  SET_DONATION_STATUS(state, status) {
    state.donatorStatus = status
  },
  UPDATE_USER_AVATAR(state, avatar) {
    state.auth.user.avatar_path = avatar
  },
}
