import { ref } from 'vue'

export const piniaSymbol = Symbol('pinia');
export let activePinia;
export const setActivePinia = (pinia) => activePinia = pinia;

export function createPinia() {
    const pinia = {
        install(app) {
            setActivePinia(pinia)
            app.provide(piniaSymbol, pinia)
        },
        _s: new Map(), // 收集所有的 store，
        state: ref({}), // 存储所有的状态
    }

    return pinia;
}
