import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        info: {}
    }),
    actions: {
        setUser(info) {
            this.info = info
        },
        resetUser() {
            this.info = {}
        }
    }
})