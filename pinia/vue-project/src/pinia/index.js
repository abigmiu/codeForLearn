import { computed, reactive } from "vue";

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
    const pinia = {
        install(app, options) {
            setActivePinia(pinia);
            app.config.globalProperties.$pinia = pinia;
            app.provide(piniaSymbol, pinia)
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

    store =  createSetupStore(id, setup, pinia);
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
    function useStore() {
        const pinia = getActivePinia();

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