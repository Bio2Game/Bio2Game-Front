const getDefaultState = () => ({
  game: null,
  you: null,
  room_responses: [],
  responses: [],
  equivalents: [],
})

export const state = getDefaultState

export const mutations = {
  RESET_STATE(state) {
    Object.assign(state, getDefaultState)
  },

  // State migrations

  SOCKET_GAME(state, game) {
    state.game = game
  },
  SOCKET_YOU(state, you) {
    state.you = you
  },

  // All users migrations

  SOCKET_PLAYER_JOIN(state, player) {
    if (!state.game) return
    state.game.players.push(player)
  },
  SOCKET_PLAYER_LEAVE(state, player) {
    if (!state.game) return
    const playerIndex = state.game.players.findIndex(p => p.id === player.id)
    if (playerIndex === -1) return
    state.game.players.splice(playerIndex, 1)
  },

  SET_PAUSE(state, status) {
    if (!state.game && state.game.pause !== status) return
    state.game.pause = status
  },

  RESPONSES_ORDER(state, responses) {
    state.responses = responses
  },
  RESPONSES_EQUIVALENTS(state, equivalents) {
    state.equivalents = equivalents
  },

  // Player migrations

  SOCKET_SHOW_RESPONSE(state, response) {
    state.you.responses.push(response)
    state.game.status = 2
  },

  // Animator migrations

  SOCKET_STATS(state, responses) {
    if (!state.you || !state.you.animator) return
    state.room_responses = responses
  },

  SOCKET_BAN_LIST(state, bannedPlayers) {
    if (!state.you || !state.you.animator) return
    state.game.bannedPlayers = bannedPlayers
  },
}
