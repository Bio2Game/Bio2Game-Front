import Vue from 'vue'
import { io } from 'socket.io-client'
import VueSocketIOExt from 'vue-socket.io-extended'

const socket = io({ path: '/socket', autoConnect: false })

export default ({ store }) => {
  Vue.use(VueSocketIOExt, socket, {
    store,
  })
}
