import { ref, onUnmounted, computed } from 'vue'
import useTimerControl from '@/utils/useTimerControl.js'

export default function useAudioRecorder() {
    const { timer, time } = useTimerControl()

    const isRecording = ref(false)
    const isPaused = ref(false)
    const audioUrl = ref(null)
    const audioData = ref(null)
    let mediaRecorder = null
    let audioChunks = []
    let audioStream = null

    const mimeTypes = computed(() => {
        const mimes = [
            'audio/ogg;codecs=opus',
            'audio/ogg;codecs=vorbis',
            'audio/ogg',
            'audio/webm;codecs=opus',
            'audio/webm',
            'audio/mp4',
        ]

        for (const type of mimes) {
            if (MediaRecorder.isTypeSupported(type)) {
                return type
            }
        }

        console.error('Nenhum formato de audio válido')

        return null
    })

    const timerCounter = computed(() => {
        return time.value
    })

    onUnmounted(() => {
        if (mediaRecorder && isRecording.value) {
            stop()
        }

        if (audioUrl.value) {
            URL.revokeObjectURL(audioUrl.value)
        }
    })

    const start = async () => {
        if (isPaused.value) {
            isPaused.value = false
            mediaRecorder.resume()
            timer.start()
            isRecording.value = true

            return
        }

        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaRecorder = new MediaRecorder(audioStream, { mimeType: mimeTypes.value })
        audioChunks = []

        mediaRecorder.ondataavailable = e => {
            audioChunks.push(e.data)
        }

        mediaRecorder.onstop = () => {
            audioProcess()
        }

        mediaRecorder.start()
        isRecording.value = true
        timer.start()
    }

    const stop = () => {
        if (mediaRecorder && isRecording.value) {
            mediaRecorder.stop()
            isRecording.value = false

            audioStream.getTracks().forEach(track => {
                track.stop()
            })

            timer.stop()
        }
    }

    const pause = () => {
        timer.pause()
        mediaRecorder.pause()
        isRecording.value = false
        isPaused.value = true
    }

    const audioProcess = () => {
        if (audioUrl.value) {
            URL.revokeObjectURL(audioUrl.value)
        }

        const blob = new Blob(audioChunks, { type: mimeTypes.value })

        audioData.value = blob
        audioUrl.value = URL.createObjectURL(blob)
    }

    const cancelRecording = async () => {
        timer.stop()

        if (mediaRecorder && isRecording.value) {
            mediaRecorder.stop()
        }

        if (audioStream) {
            audioStream.getTracks().forEach(track => {
                track.stop()
            })
        }

        isRecording.value = false
        isPaused.value = false

        if (audioUrl.value) {
            URL.revokeObjectURL(audioUrl.value)
            audioUrl.value = null
        }

        mediaRecorder = null
        audioChunks = []
        audioStream = null
    }

    return {
        isRecording,
        isPaused,
        audioUrl,
        audioData,
        timerCounter,

        start,
        stop,
        pause,
        cancelRecording,
    }
}
