import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useListStatesStore = defineStore('listStates', () => {
    const states = ref([])

    const setStates = newStates => {
        states.value = newStates
    }

    return { states, setStates }
})
