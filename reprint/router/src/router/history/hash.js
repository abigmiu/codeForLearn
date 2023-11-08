import History from './base.js'

function getHash() {
    return window.location.hash.slice(1);
}

function ensureSlash() {
    if (window.location.hash) {
        return;
    }
    window.location.hash = '/'
}

class HashHistory extends History {
    constructor(router) {
        super(router)
        ensureSlash()
    }

    getCurrentLocation() {
        return getHash();
    }

    setupListener() {
        window.addEventListener('hashchange', () => {
            console.log('hashChange')
            this.transitionTo(getHash())
        })
    }
}

export default HashHistory;
