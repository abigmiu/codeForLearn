import Vue from 'vue'

class Store {
  constructor (options = {}) {
    // State
    const state = options.state || {}
    this.vm = new Vue({
      data: {
        state
      }
    })

    // Getters
    const getters = options.getters || {}
    this.getters = {}
    Object.keys(getters).forEach((key) => {
      Object.defineProperty(this.getters, key, {
        get () {
          return getters[key](state)
        }
      })
    })

    // Mutations
    const mutations = options.mutations || {}
    this.mutations = {}
    Object.keys(mutations).forEach((keyName) => {
      this.mutations[keyName] = (...args) => {
        return mutations[keyName](state, ...args)
      }
    })

    // Actions
    const actions = options.actions || {}
    this.actions = {}
    Object.keys(actions).forEach((keyName) => {
      this.actions[keyName] = (...args) => {
        return actions[keyName](this, ...args)
      }
    })
  }

  dispatch (actionName, ...payload) {
    this.actions[actionName](...payload)
  }

  commit = (mutationName, ...payload) => {
    console.log(mutationName)
    console.log(this)
    this.mutations[mutationName](...payload)
  }

  get state () {
    return this.vm.state
  }
}

function install (vue) {
  vue.mixin({
    beforeCreate () {
      console.log(this)
      if (this.$options && this.$options.store) { // new Vue 的时候传入的
        this.$store = this.$options.store
      } else if (this.$parent) { // 子组件
        this.$store = this.$parent.$store
      }
    }
  })
}

const myVuex = {
  Store,
  install
}

export default myVuex
