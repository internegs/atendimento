<template>
    <div
        class="d-flex justify-content-end group-hover"
        :style="isRecording && 'width: 100%; padding: 0 10px'"
    >
        <button
            v-if="!isRecording"
            type="button"
            class="d-flex justify-content-center align-items-center rounded-circle btn-recorder group-btn"
            @click="audioRecorder.start()"
        >
            <i class="fa-solid fa-microphone fs-3 group-icon"></i>
        </button>

        <div
            v-else
            class="d-flex gap-4 align-items-center recording-start"
        >
            <button
                class="recording-stop-btn"
                @click="audioRecorder.cancelRecording()"
            >
                <i class="fa-solid fa-trash fs-4"></i>
            </button>

            <div class="d-flex gap-2 align-items-center justify-content-center timer-recording">
                <i class="fa-solid fa-circle text-danger pulse"></i>

                <span class="fs-4 fw-semibold">{{ audioRecorder.timerCounter }}</span>
            </div>

            <div class="d-flex gap-2 gap-sm-4 align-items-center opt-recording">
                <button
                    class="controls-recording-btn"
                    @click="handleControlsBtn"
                >
                    <i
                        v-if="!audioRecorder.isPaused.value"
                        class="fa-regular fa-circle-pause fs-3"
                    ></i>

                    <i
                        v-else
                        class="fa-solid fa-play fs-3"
                    ></i>
                </button>

                <button
                    type="button"
                    class="btn-send"
                    @click="handleSendAudio"
                >
                    <img
                        src="../../../assets/enviar.png"
                        class="icon-send"
                        alt="Enviar"
                    />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import useAudioRecorder from '@/utils/useAudioRecorder.js'
import { computed, watch } from 'vue'

defineOptions({
    name: 'AudioRecorderComponent',
})

const emits = defineEmits(['handle-btn-send', 'is-recording'])

const audioRecorder = useAudioRecorder()

const isRecording = computed(() => {
    return audioRecorder.isRecording.value || audioRecorder.isPaused.value
})

const handleControlsBtn = () => {
    if (audioRecorder.isPaused.value) {
        audioRecorder.start()

        return
    }

    audioRecorder.pause()
}

const handleSendAudio = async () => {
    audioRecorder.stop()

    await new Promise(resolve => setTimeout(resolve, 100))

    emits('handle-btn-send', audioRecorder.audioData.value)
}

watch(
    isRecording,
    newValue => {
        emits('is-recording', newValue)
    },
    { immediate: true }
)
</script>

<style scoped lang="scss">
button {
    background: transparent;
}

.btn-recorder {
    padding: 12px 10px;
}

.group-hover {
    .group-btn {
        transition: all 0.3s ease-in;
    }

    .group-icon {
        transition: all 0.15s ease-in;
    }

    &:hover {
        .group-btn {
            background-color: #2cacbf;
        }

        .group-icon {
            color: white;
        }
    }
}

.recording-start {
    .recording-stop-btn {
        display: flex;
        justify-content: center;
        align-items: center;

        i {
            font-size: 12px;
            color: #495057;
        }
    }

    .opt-recording {
        .controls-recording-btn {
            display: flex;
            justify-content: center;
            align-items: center;

            i {
                color: #495057;
            }
        }

        .btn-send {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 4.8rem;
            height: 2.6rem;

            background-color: #2cacbf;
            border-radius: 50%;
            transition: opacity 200ms ease;

            &:hover {
                opacity: 0.9;
            }

            &:focus {
                outline: none;
                border: 2px solid #bbb9b9 !important;
            }

            @media (min-width: 578px) {
                & {
                    width: 5.3rem;
                    height: 2.6rem;
                }
            }

            @media (min-width: 600px) {
                & {
                    width: 2.7rem;
                    height: 2.6rem;
                }
            }

            .icon-send {
                width: 1rem;
                height: 1rem;
            }
        }
    }
}

.pulse {
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}
</style>
