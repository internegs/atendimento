<template>
    <teleport
        v-if="isModalOpen"
        to=".agendamento-container"
    >
        <base-modal>
            <div
                v-if="!isModalSuccessOpen"
                class="modal-wrapper"
            >
                <form
                    class="modal-container"
                    @submit.prevent="createSchedule()"
                >
                    <header>
                        <span>Criar Cronograma</span>

                        <button
                            v-if="hasSchedule"
                            type="button"
                            @click="closeModal()"
                        >
                            <i class="fa-solid fa-xmark text-secondary"></i>
                        </button>
                    </header>

                    <div class="modal-main">
                        <default-input
                            ref="inputMes"
                            v-model="dataInputs.mes"
                            placeholder="Mês"
                            :maxLength="2"
                            type="number"
                        />
                    </div>

                    <footer>
                        <default-btn
                            btnType="submit"
                            bg="#00D5DD"
                            txtColor="white"
                            width="50%"
                        >
                            <span v-if="!isBtnLoading">Salvar</span>

                            <span
                                v-if="isBtnLoading"
                                class="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                            ></span>
                        </default-btn>
                    </footer>
                </form>
            </div>
        </base-modal>
    </teleport>
</template>

<script setup>
import { watch, ref, nextTick, computed, onUpdated, onBeforeUpdate } from 'vue'

import BaseModal from '@/components/agendamentos/templates/BaseModal.vue'
import DefaultBtn from '@/components/agendamentos/ui/DefaultBtn.vue'
import DefaultInput from '@/components/ui/DefaultInput.vue'
import { geraAgenda } from '@/services/apiAgenda'
import { useHasSchedulingStore } from '@/stores/useHasSchedulingStore'
import Swal from 'sweetalert2'

defineOptions({
    name: 'CreateTimelineModal',
})

const props = defineProps({
    openModal: {
        type: Boolean,
        default: false,
    },
})

const emits = defineEmits(['handle-close-modal'])

const hasSchedulingStore = useHasSchedulingStore()

const [isModalOpen, isBtnLoading] = Array(3)
    .fill()
    .map(() => ref(false)) // Criando 3 variaveis com msm valor

const dataInputs = ref({
    mes: '',
})

const inputMes = ref(null)

const hasSchedule = computed(() => {
    if (localStorage.getItem('@USER_ID') && !Object.hasOwn(hasSchedulingStore.data, 'result')) {
        return true
    }

    return false
})

watch(
    () => props.openModal,
    async newValue => {
        isModalOpen.value = newValue

        await nextTick()
        inputMes.value?.focus()
    }
)

onUpdated(() => {
    if (hasSchedule.value) {
        window.addEventListener('keyup', handleKeyUp)
    }
})

onBeforeUpdate(() => {
    window.removeEventListener('keyup', handleKeyUp)
})

const handleKeyUp = e => {
    if (e.key === 'Escape') closeModal()
}

const createSchedule = async () => {
    isBtnLoading.value = true

    const data = {
        Y2xpZW50ZV9pZA: btoa(localStorage.getItem('@USER_ID')),
        mes: dataInputs.value.mes,
    }

    try {
        const response = await geraAgenda(data)

        if (Object.hasOwn(response.data, 'result')) {
            if (!response.data.result) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Alerta',
                    text: response.data.message,
                    showConfirmButton: true,
                })
            }
        }

        Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: response.data.message,
            showConfirmButton: false,
            timer: 3000,
        }).then(() => window.location.reload())
    } catch (error) {
        console.error(error)

        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Erro ao realizar a criação do cronograma da agenda.',

            didOpen: () => {
                const confirmBtn = Swal.getConfirmButton()
                const actionsContainer = confirmBtn.parentElement

                actionsContainer.style.width = '100%'
                actionsContainer.style.display = 'flex'
                actionsContainer.style.justifyContent = 'center'

                confirmBtn.style.width = '90%'
            },
        })

        isBtnLoading.value = false
    } finally {
        isBtnLoading.value = false
    }
}

const closeModal = () => {
    emits('handle-close-modal')
}
</script>

<style scoped lang="scss">
.modal-wrapper {
    @include flex-center();
    width: 500px;
    height: auto;

    border-radius: 10px;
    border: 1px solid #dadada;
    background: #fff;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

    @media (max-width: 700px) {
        & {
            width: 400px;
        }
    }

    @media (max-width: 460px) {
        & {
            width: 90%;
        }
    }

    .modal-container {
        @include horizontal-col-center();
        width: 90%;
        height: 100%;
        padding: 1rem 0;
        gap: 2rem;

        & header {
            display: flex;
            justify-content: space-between;
            width: 100%;
            padding: 1rem 0;

            border-bottom: 2px solid #dadada;

            @media (max-width: 1400px) {
                & {
                    padding: 0.5rem 0;
                }
            }

            & span {
                padding-left: 1rem;

                font-weight: 500;
                font-size: 20px;

                @media (max-width: 1400px) {
                    & {
                        font-size: large;
                    }
                }

                @media (max-width: 700px) {
                    & {
                        font-size: 16px;
                    }
                }
            }

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
            }
        }

        .modal-main {
            @include horizontal-col-center();
            width: 100%;
            gap: 1.4rem;
        }

        & footer {
            @include horizontal-col-center();
            width: 100%;
            gap: 1rem;

            .msg-error {
                color: #e41313;
            }
        }
    }
}
</style>
