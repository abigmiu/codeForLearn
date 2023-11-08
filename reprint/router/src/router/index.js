import { createMatcher } from './create-matcher'
import install from './install'
import HashHistory from './history/hash'

export default class VueRouter {
  constructor (options) {
    this.app = null
    this.apps = []

    this.options = options

    this.matcher = createMatcher(options.routes || [], this)

    this.mode = options.mode || 'hash'

    this.history = new HashHistory(this)
  }

  init(app) {
    const history = this.history;

    const setupHashListener = () => {
        history.setupListener();
    }

    history.transitionTo(history.getCurrentLocation(), setupHashListener)

    history.listen((route) => {
        console.log(app, route);
        debugger
        app._route = route;
    })
  }

  match(location) {
    return this.matcher.match(location)
  }
}

VueRouter.install = install
