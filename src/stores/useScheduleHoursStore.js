import { defineStore } from 'pinia'
import { ref } from 'vue'
import { format, addMinutes } from 'date-fns'

export const useSchedulehoursStore = defineStore('scheduleHours', () => {
  const hours = ref([])

  function addHours(firstHour, lastHour, interval, lunchInterval = null) {

    const arrayHours = []
    let currentTime = new Date(`1970-01-01T${firstHour}`);
    const endTime = new Date(`1970-01-01T${lastHour}`);

    let lunchStart = null
    let lunchEnd = null

    if (lunchInterval && lunchInterval.start && lunchInterval.end) {
      lunchStart = new Date(`1970-01-01T${lunchInterval.start}`)
      lunchEnd = new Date(`1970-01-01T${lunchInterval.end}`)
    }

    while (currentTime <= endTime) {
      const shouldInclude = currentTime < lunchStart || currentTime > lunchEnd

      if (shouldInclude) {
        arrayHours.push(format(currentTime, 'HH:mm'))
      }

      currentTime = addMinutes(currentTime, parseInt(interval))
    }

    hours.value = arrayHours
  }

  return {hours, addHours}
})
