import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDoctorInfoStore = defineStore('doctorInfo', () => {
    const name = ref('')
    const initDateSchedule = ref(null)
    const finalDateSchedule = ref(null)

    return { name, initDateSchedule, finalDateSchedule }
})
