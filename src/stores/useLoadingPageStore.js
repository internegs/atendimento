import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoadingPageStore = defineStore('loadingPage', () => {
    const loading = ref(false)

    return { loading }
})
