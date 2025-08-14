import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHasSchedulingStore = defineStore('hasScheduling', () => {
    const data = ref({})

    return { data }
})
