import { removeSpecialCharacters } from '@/utils/formatterValueUtil'
import  { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useWeekDaysStore = defineStore('weekDays', () => {
  const weekDays = ref([])
  const availableWeekDays = ref({})

  watch([weekDays, availableWeekDays],
  ([newWeekDays, newAvailable], [oldWeekDays, oldAvailable]) => {
    if (
      JSON.stringify(newWeekDays) !== JSON.stringify(oldWeekDays) ||
      JSON.stringify(newAvailable) !== JSON.stringify(oldAvailable)
    ) {
      addKeyValidate()
    }
  },
  { deep: true }
)

  const addKeyValidate = () => {
    if (!weekDays?.value.length) return

    if (!Object.keys(availableWeekDays.value).length) return

    weekDays.value = weekDays.value.map(date => ({
      ...date,
      isActive: availableWeekDays.value[removeSpecialCharacters(date.weekday)] === 1
    }))

  }


  return {weekDays, availableWeekDays, addKeyValidate}
})
