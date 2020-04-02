import Vue from "vue"
import Vuex from "vuex"
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  state: {
    loginState: "",
  },
  mutations: {
    setLoginState(state, payload): void {
      state.loginState = payload.loginState
    },
  },
  actions: {
    setLoginState({ commit }, payload): void {
      commit("setLoginState", payload)
    },
  },
  getters: {
    getLoginState(state): string {
      return state.loginState
    },
  },
  modules: {},
})
