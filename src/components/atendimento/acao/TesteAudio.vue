<template>
    <div>
        <div class="d-flex gap-2">
            <button
                :disabled="gravando"
                @click="iniciarGravacao"
            >
                <span v-text="pausado ? 'Retomar Gravação' : 'Iniciar Gravação'"></span>
            </button>

            <button
                :disabled="!gravando"
                @click="pausarGravacao"
            >
                Pausar Gravação
            </button>

            <button
                :disabled="!gravando"
                @click="pararGravacao"
            >
                Parar Gravação
            </button>
        </div>

        <p>Status: {{ gravando ? 'Gravando...' : 'Parado' }}</p>
        <p>Timer: {{ timerComp }}</p>

        <div class="d-flex gap-3">
            <audio
                v-if="audioUrl"
                :src="audioUrl"
                controls
                controlslist="nodownload"
            ></audio>
        </div>
    </div>
</template>

<script setup>
import useAudioRecorder from '@/utils/useAudioRecorder.js'

defineOptions({
    name: 'TesteAudio',
})

const audioRecorder = useAudioRecorder()

const gravando = audioRecorder.isRecording
const pausado = audioRecorder.isPaused
const timerComp = audioRecorder.timerCounter
const audioUrl = audioRecorder.audioUrl

const iniciarGravacao = () => {
    audioRecorder.start()
}
const pausarGravacao = () => {
    audioRecorder.pause()
}
const pararGravacao = () => audioRecorder.stop()

</script>
