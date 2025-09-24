import { ref, readonly } from 'vue'

export default function useTimerControl() {
    const time = ref('0:00')
    const seconds = ref(0)
    const minutes = ref(0)
    let timerInterval = null

    const timer = {
        get time() {
            return time.value
        },

        start(totalTimeInSeconds = null) {
            if (!timerInterval) {
                timerInterval = setInterval(() => {
                    const totalSeconds = minutes.value * 60 + seconds.value

                    if (totalTimeInSeconds && totalSeconds >= totalTimeInSeconds) {
                        timer.stop()

                        return
                    }

                    seconds.value++

                    if (seconds.value === 60) {
                        seconds.value = 0
                        minutes.value++
                    }

                    const secFormatted = seconds.value.toString().padStart(2, '0')
                    time.value = `${minutes.value}:${secFormatted}`
                }, 1000)
            }
        },

        pause() {
            if (timerInterval) {
                clearInterval(timerInterval)

                timerInterval = null
            }
        },

        stop() {
            if (timerInterval) {
                clearInterval(timerInterval)

                timerInterval = null
            }

            minutes.value = 0
            seconds.value = 0
            time.value = '0:00'
        },
    }

    return {
        timer,
        time: readonly(time),
    }
}
