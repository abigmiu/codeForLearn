import Vue from 'vue'
import App from './App.vue'
import VueRouter from './router/index'
import router from './router.js'

Vue.config.productionTip = false
Vue.use(VueRouter)
new Vue({
    router:router,
  render: function (h) { return h(App) }
}).$mount('#app')
