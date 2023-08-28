import { getCurrentInstance, inject, reactive, toRefs, computed } from 'vue'
import { piniaSymbol, activePinia, setActivePinia } from './index'

function createOptionsStore(id, options, pinia) {
    const { state, getters, actions } = options;
    const store = reactive({})

    function setup() {
        pinia.state.value[id] = state?.() || {};
        const localState = toRefs(pinia.state.value[id]);

        return Object.assign(
            localState,
            actions,
            Object.keys(getters || {}).reduce((computedGetters, name) => {
                computedGetters[name] = computed(() => {
                    const store = pinia._s.get(id);
                    return getters[name].call(store, store);
                })
            })
        , {})
    }

    const setupStore = setup();
    function wrapAction(name, action) {
        return function () {
            let ret = action.apply(store, arguments);
            return ret;
        }
    }
    for (let key in setupStore) {
        const prop = setupStore[key];
        if (typeof prop === 'function') {
            setupStore[key] = wrapAction(key, prop)
        }
    }

    Object.assign(store, setupStore);
    pinia._s.set(id, store);
    return store;
}


export function defineStore(idOrOptions, setup) {
    let id;
    let options;

    const isSetupStore = typeof setup === 'function';
    if (typeof idOrOptions === 'string') {
        id = idOrOptions
        options = setup
    } else {
        id = idOrOptions.id;
        options = idOrOptions;
    }

    function useStore() {
        let pinia = getCurrentInstance() && inject(piniaSymbol)

        if (pinia) {
            setActivePinia(pinia)
        }

        pinia = activePinia

        if (!pinia._s.has(id)) {
            if (!isSetupStore) {
                createOptionsStore(id, options, pinia)
            }
        }

        const store = pinia._s.get(id);
        return store;
    }

    return useStore()
}
