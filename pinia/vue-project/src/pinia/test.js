import { defineStore } from ".";

export const useTestStore = defineStore('test', {
    state: () => ({
        a: 1,
    }),
    actions: {
        changeState() {
            this.a += 1;
        }
    },
    getters: {
        b() {
            console.log('312312')
            return this.a + 1
        }
    }
})