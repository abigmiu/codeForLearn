import { computed, effectScope, getCurrentInstance, inject, reactive } from "vue";

let piniaInstance;

function setActivePinia(pinia) {
    piniaInstance = pinia;
}
function getActivePinia(pinia) {
    return piniaInstance;
}

const piniaSymbol = Symbol('pinia')

/**
 * pinia 是一个插件， 所以要返回一个带install的对象
 * @returns 
 */
export const createPinia = () => {
    const scope = effectScope(true);
    const state = scope.run(() => ref({}));

    // 插件列表
    let _p = [];
    // 在调用 app.use(pinia) 前需要安装的插件
    let toBeInstalled = [];

    const pinia = {
        _a: null,
        _p,
        _e: scope,
        _s: new Map(), // store 缓存，
        state,      // pinia 所有的 state 的合集，key 为 pinia 的 id，value 为 store 下所有的 state
        install(app, options) {
            pinia._a = app;
            setActivePinia(pinia);
            app.config.globalProperties.$pinia = pinia;
            app.provide(piniaSymbol, pinia);

            toBeInstalled.forEach((plugin) => _p.push(plugin));
            toBeInstalled = [];
        },
        use(plugin) {
            if (!this._a) {
                toBeInstalled.push(plugin);
            } else {
                _p.push(plugin);
            }
            return this;
        },
        cache: new Map()
    }

    return pinia;
}


function createOptionsStore(id, options, pinia) {
    const { state, actions, getters } = options;

    let store;
    function setup() {
        return Object.assign(
            state(),
            actions,
            Object.keys(getters).reduce((computedGetters, name) => {
                computedGetters[name] = computed(() => {
                    return getters[name].call(store);
                })
                return computedGetters;
            }, {})
        )
    }

    store = createSetupStore(id, setup, pinia);
    return store;
}

function createSetupStore(id, setup, pinia) {
    const store = reactive({
        $reset: () => { },
        $patch: () => { },
    })

    Object.assign(store, setup())
    pinia.cache.set(id, store);

    return store;
}

export function defineStore(id, options) {
    function useStore(pinia) {
        const currentInstance = getCurrentInstance();

        pinia = currentInstance && inject(piniaSymbol);
        if (pinia) {
            setActivePinia(pinia)
        }

        if (!pinia.cache.has(id)) {
            if (typeof options === 'function') {
                createSetupStore(id, options, pinia);
            } else {
                createOptionsStore(id, options, pinia)
            }
        }

        const store = pinia.cache.get(id);
        return store;
    }
    return useStore;
}