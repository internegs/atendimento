<template>
    <div class="modal-wrapper">
        <div class="modal-container">
            <header>
                <div
                    v-if="hasBtnClose"
                    class="wrapper-btn-close"
                >
                    <button @click="$emit('handleCloseSuccessModal')">
                        <i class="fa-solid fa-xmark text-secondary"></i>
                    </button>
                </div>

                <div class="header-icon">
                    <CheckIcon
                        v-if="responseData.result"
                        :size="sizeResponsive"
                    />
                    <AlertIcon
                        v-if="!responseData.result"
                        :size="sizeResponsive"
                    />
                </div>
            </header>

            <div class="modal-main">
                <h1 v-text="validateTitle"></h1>
                <p v-text="responseData.message"></p>
            </div>

            <footer v-if="responseData.result">
                <div>
                    <DefaultBtn
                        bg="#4caf50"
                        txtColor="white"
                        width="100%"
                        @handleClick="handleClickConfirm()"
                    >
                        OK
                    </DefaultBtn>
                </div>
            </footer>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

import CheckIcon from '@/components/ui/CheckIcon.vue'
import AlertIcon from '@/components/ui/AlertIcon.vue'
import DefaultBtn from '@/components/agendamentos/ui/DefaultBtn.vue'

defineOptions({
    name: 'ValidateSchedule',
})

const props = defineProps({
    responseData: {
        type: Object,
        required: true,
    },
    hasBtnClose: {
        type: Boolean,
        default: true,
    },
})

const emits = defineEmits(['handleCloseSuccessModal', 'handleConfirm'])

const windowWidth = ref(window.innerWidth)

const validateTitle = computed(() => (props.responseData.result ? 'Sucesso!' : 'Alerta!'))

onMounted(() => {
    addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
    removeEventListener('resize', updateWindowWidth)
})

const updateWindowWidth = () => {
    windowWidth.value = window.innerWidth
}

const isResponsive = computed(() => ({
    xxl: windowWidth.value <= 1400,
    xl: windowWidth.value <= 1200,
    lg: windowWidth.value <= 992,
    md: windowWidth.value <= 768,
    sm: windowWidth.value <= 576,
}))

const sizeResponsive = computed(() => {
    if (isResponsive.value.xxl) return 100
})

const handleClickConfirm = () => emits('handleConfirm')
</script>

<style scoped lang="scss">
.modal-wrapper {
    @include flex-center();
    width: 100%;
    max-width: 400px;
    height: auto;

    border-radius: 10px;
    border: 1px solid #dadada;
    background: #fff;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

    @media (max-width: 460px) {
        & {
            width: 90%;
        }
    }

    .modal-container {
        @include horizontal-col-center();
        width: 90%;
        height: 100%;
        padding: 2rem 0;
        gap: 3rem;

        & header {
            @include horizontal-col-center();
            justify-content: space-between;
            width: 100%;
            gap: 1rem;

            @media (max-width: 500px) {
                & {
                    gap: 0;
                }
            }

            .wrapper-btn-close {
                width: 100%;
                text-align: right;

                & button {
                    width: 2rem;
                    height: 2rem;

                    border: none;
                    background-color: transparent;
                    border-radius: 50%;
                    transition: transform 100ms ease;

                    &:hover {
                        transform: scale(1.05);
                    }

                    &:active {
                        background-color: #fafafa;
                    }

                    & i {
                        color: #4d4f5c;
                    }
                }
            }

            .header-icon {
                padding-top: 2rem;
            }
        }

        .modal-main {
            @include horizontal-col-center();
            width: 100%;
            align-items: center;
            gap: 1rem;

            & h1 {
                font-size: 1.8em;
                text-align: center;

                @media (max-width: 1400px) {
                    & {
                        font-size: 1.6em;
                    }
                }

                @media (max-width: 700px) {
                    & {
                        font-size: 1.4em;
                    }
                }
            }

            & p {
                font-size: 1rem;
                font-weight: 500;
                text-align: center;

                @media (max-width: 1400px) {
                    & {
                        font-size: 0.9em;
                    }
                }

                @media (max-width: 700px) {
                    & {
                        font-size: 0.7em;
                    }
                }
            }
        }

        & footer {
            @include flex-col-center();
            width: 100%;

            & div {
                width: 40%;
            }
        }
    }
}
</style>
