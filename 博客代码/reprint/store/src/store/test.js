import myVuex from './index'
import Vue from 'vue'

Vue.use(myVuex)

const store = new myVuex.Store({
  state: {
    a: 1,
    b: 2,
    c: 3
  },
  getters: {
    count: (state) => {
      return state.b + 123
    }
  },
  mutations: {
    add (state, a, b) {
      state.b += a + b
    }
  },

  actions: {
    asyncAdd ({ commit }, payload) {
      setTimeout(() => {
        console.log('asyncAdd')
        commit('add', 10, 20)
      }, 2000)
    }
  }
})

export default store
