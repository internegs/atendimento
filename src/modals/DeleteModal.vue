<template>
    <teleport
        to=".agendamento-container"
        v-if="isModalOpen"
    >
        <BaseModal>
            <div class="delete-modal">
                <header>
                    <div
                        v-if="hasBtnClose"
                        class="wrapper-btn-close"
                    >
                        <button @click="$emit('handle-close')">
                            <i class="fa-solid fa-xmark text-secondary"></i>
                        </button>
                    </div>

                    <i class="fa-solid fa-trash-alt"></i>
                </header>

                <div class="modal-content">
                    <h1>Cancelar</h1>
                    <p>Deseja cancelar esse agendamento?</p>
                </div>

                <footer>
                    <DefaultBtn
                        bg="#00D5DD"
                        txtColor="white"
                        width="100%"
                        @handleClick="$emit('handle-close')"
                    >
                        Não
                    </DefaultBtn>
                    <DefaultBtn
                        bg="red"
                        txtColor="white"
                        width="100%"
                        @handleClick="$emit('handle-confirm')"
                    >
                        <template v-if="!isBtnLoading">Sim</template>

                        <span
                            v-if="isBtnLoading"
                            class="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    </DefaultBtn>
                </footer>

                <span
                    v-if="msgError"
                    class="msg-error"
                    v-text="msgError"
                ></span>
            </div>
        </BaseModal>
    </teleport>
</template>

<script setup>
import DefaultBtn from '../agendamentos/ui/DefaultBtn.vue'
import { ref, watch } from 'vue'
import BaseModal from './templates/BaseModal.vue'

defineOptions({
    name: 'DeleteModal',
})

const props = defineProps({
    hasBtnClose: {
        type: Boolean,
        default: true,
    },

    openModal: {
        type: Boolean,
        default: false,
    },

    isBtnLoading: {
        type: Boolean,
        default: false,
    },

    msgError: String,
})

const emits = defineEmits(['handle-close', 'handle-confirm'])

const isModalOpen = ref(false)

watch(
    () => props.openModal,
    newValue => {
        isModalOpen.value = newValue
    }
)
</script>

<style scoped lang="scss">
.delete-modal {
    @include flex-center();
    flex-direction: column;
    width: 400px;
    padding: 2rem;
    gap: 2rem;

    border-radius: 10px;
    border: 1px solid #dadada;
    background: #fff;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

    @media (max-width: 460px) {
        width: 90%;
    }

    header {
        @include flex-center();
        width: 100%;
        position: relative;

        .wrapper-btn-close {
            position: absolute;
            top: -1rem;
            right: -1rem;

            button {
                @include flex-center();
                width: 2rem;
                height: 2rem;
                border: none;
                background-color: #fff;
                border-radius: 50%;
                box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
                transition: transform 100ms ease;
                cursor: pointer;

                &:hover {
                    transform: scale(1.05);
                }

                &:active {
                    background-color: #fafafa;
                }

                i {
                    font-size: 1rem;
                    color: #666;
                }
            }
        }

        .fa-trash-alt {
            font-size: 3rem;
            color: #e41313;
        }
    }

    .modal-content {
        @include flex-center();
        flex-direction: column;
        text-align: center;
        gap: 0.5rem;

        h1 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #333;
            margin: 0;

            @media (max-width: 650px) {
                & {
                    font-size: 1.2rem;
                }
            }
        }

        p {
            font-size: 1rem;
            color: #666;
            margin: 0;

            @media (max-width: 650px) {
                & {
                    font-size: 0.9rem;
                }
            }
        }
    }

    footer {
        @include flex-center();
        width: 100%;
        gap: 1rem;
    }

    .msg-error {
        color: #e41313;
    }
}
</style>
