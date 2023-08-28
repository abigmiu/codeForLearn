// 路径状态

class HistoryRoute {
  constructor () {
    this.current = null
  }
}

class Router {
  constructor (options) {
    this.mode = options.mode || 'hash'
    this.routes = options.routes || []
    this.routesMap = this.createMap(this.routes)
    this.history = new HistoryRoute()
  }

  init () {
    // 处理路由模式
    if (this.mode === 'hash') {
      if (!location.hash) {
        location.hash = '/'
      }
      window.addEventListener('load', () => {
        this.history.current = location.hash.slice(1)
      })
      window.addEventListener('hashchange', () => {
        this.history.current = location.hash.slice(1)
      })
    } else {
      if (!location.pathname) {
        location.pathname = '/'
      }
      window.addEventListener('load', () => {
        this.history.current = location.pathname
      })
      window.addEventListener('popstate', () => {
        this.history.current = location.pathname
      })
    }
  }

  createMap (routes) {
    return routes.reduce((pre, cur) => {
      pre[cur.path] = cur.component
      return pre
    }, {})
  }

  install (Vue) {
    Vue.mixin({
      beforeCreate () {
        if (this.$options && this.$options.router) {
          this._root = this
          this.$router = this.$options.router

          // 响应式化
          Vue.util.defineReactive(this, 'xxxx', this._router.history)
        } else if (this.$parent && this.$parent.$router) {
          this._root = this.$parent._root
        }

        Object.defineProperty(this, '$router', {
          get () {
            return this._root.$router
          }
        })

        Object.defineProperty(this, '$route', {
          get () {
            return this._root._router.history.current
          }
        })
      }
    })

    Vue.component('router-link', {
      props: {
        to: String
      },
      render (h) {
        const mode = this._self._root._router.mode
        const to = mode === 'hash' ? '#' + this.to : this.to
        return h('a', {
          attrs: {
            href: to
          }

        }, this.$slots.default)
      }
    })
    Vue.component('router-view', {
      render (h) {
        const current = this._self._root._router.history.current
        const routeMap = this._self._root._router.routesMap
        return h(routeMap[current])
      }
    })
  }
}

export default Router()
