<template>
    <teleport
        v-if="isModalOpen"
        to=".agendamento-container"
    >
        <base-modal>
            <div
                id="scheduling-modal"
                class="modal-wrapper"
            >
                <form
                    class="modal-container"
                    @submit.prevent="handleClickConfirm()"
                >
                    <header>
                        <span>{{ titleSchedule }}</span>

                        <button
                            type="button"
                            @click="closeModal()"
                        >
                            <i class="fa-solid fa-xmark text-secondary"></i>
                        </button>
                    </header>

                    <div class="modal-main">
                        <select-searchable
                            v-if="admStore.isAdm"
                            v-model="scheduleData.nome_paciente"
                            placeholder="Nome do paciente"
                            :list="listPacientes"
                            :disabled="!isEditable"
                            :required="true"
                            @obj-value="fillPaciente"
                        />

                        <default-input
                            v-if="!admStore.isAdm"
                            v-model="scheduleData.nome_paciente"
                            placeholder="Nome do paciente"
                            :disabled="!isEditable"
                        />
                        <default-input
                            v-model="scheduleData.nome_plano"
                            placeholder="Convênio"
                            :disabled="true"
                        />
                        <default-input
                            v-model="scheduleData.nome_medico"
                            placeholder="Médico"
                            :disabled="true"
                        />
                        <default-input
                            v-model="dateComputed"
                            placeholder="Data"
                            :disabled="true"
                        />
                        <default-input
                            v-model="scheduleData.horario"
                            placeholder="Horário"
                            :disabled="true"
                        />
                    </div>

                    <span
                        v-if="msgError.create"
                        class="msg-error"
                        v-text="msgError.create"
                    ></span>

                    <footer>
                        <default-btn
                            v-if="isScheduled"
                            bg="red"
                            txtColor="white"
                            width="100%"
                            @handleClick="handleClickCancel()"
                        >
                            {{ isEditable ? 'Cancelar' : 'Excluir' }}
                        </default-btn>

                        <default-btn
                            type="submit"
                            bg="#00D5DD"
                            txtColor="white"
                            width="100%"
                        >
                            <template v-if="!isBtnLoading">{{ btnLabel }}</template>

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

            <delete-modal
                :openModal="openModalDelete"
                :isBtnLoading="isBtnLoadingDelete"
                :msgError="msgError.delete"
                @handle-close="closeModalDelete"
                @handle-confirm="deleteSchedule"
            />
        </base-modal>
    </teleport>
</template>

<script setup>
import { watch, ref, onMounted, onUpdated, onUnmounted, computed } from 'vue'
import { formatDate, getDayWeek } from '@/utils/formatterValueUtil.js'

import BaseModal from '@/components/agendamentos/templates/BaseModal.vue'
import DefaultBtn from '@/components/agendamentos/ui/DefaultBtn.vue'
import DefaultInput from '@/components/ui/DefaultInput.vue'
import { useAdmStore } from '@/stores/useAdmStore'
import DeleteModal from '@/components/modals/DeleteModal.vue'
import { buscarPacientes, deleteAgenda, editaAgenda, enviaAgenda } from '@/services/apiAgenda'
import SelectSearchable from '@/components/ui/SelectSearchable.vue'
import { debounce } from 'lodash-es'
import Swal from 'sweetalert2'

defineOptions({
    name: 'CreateSchedulingModal',
})

const props = defineProps({
    openModal: {
        type: Boolean,
        default: false,
    },

    data: {
        type: Object,
        required: true,
    },
})

const emits = defineEmits(['handleCloseModal'])

const admStore = useAdmStore()

const [isModalOpen, isBtnLoading, isEditable, openModalDelete, isBtnLoadingDelete] = Array(6)
    .fill()
    .map(() => ref(false)) // Criando 6 variaveis com msm valor

const [scheduleData, selectedPaciente] = Array(3)
    .fill()
    .map(() => ref({}))

const msgError = ref({
    create: '',
    delete: '',
})

const listPacientes = ref([])
let abortController = null
const CLIENTE_ID = localStorage.getItem('@USER_ID')

const dateComputed = computed(() => formatDate(scheduleData.value.data_agendada))

const titleSchedule = computed(() => {
    if (isScheduled.value) {
        return 'Consulta Agendada'
    }

    return 'Agendar Consulta'
})

const isScheduled = computed(() => {
    if (admStore.isAdm) {
        return scheduleData.value?.agendado
    }

    return false
})

const btnLabel = computed(() => {
    if (admStore.isAdm && isScheduled.value) {
        if (isEditable.value) {
            return 'Salvar'
        }

        return 'Editar'
    }

    return 'Agendar'
})

watch(
    () => props.openModal,
    newValue => {
        isModalOpen.value = newValue
    }
)

watch(
    () => props.data,
    newValue => {
        scheduleData.value = { ...newValue }
    },
    { deep: true }
)

onMounted(() => {
    window.addEventListener('keyup', handleKeyUp)
})

onUpdated(() => {
    isDisabled()

    openModalDelete.value = false
})

onUnmounted(() => {
    window.removeEventListener('keyup', handleKeyUp)
})

const createOrEditSchedule = async () => {
    isBtnLoading.value = true

    try {
        let response

        if (!scheduleData.value) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Dados inválidos.',

                didOpen: () => {
                    const confirmBtn = Swal.getConfirmButton()
                    const actionsContainer = confirmBtn.parentElement

                    actionsContainer.style.width = '100%'
                    actionsContainer.style.display = 'flex'
                    actionsContainer.style.justifyContent = 'center'

                    confirmBtn.style.width = '90%'
                },
            })
        }

        if (isScheduled.value && isEditable.value) {
            let {
                agendado,
                data_agendada,
                dia_semana,
                horario,
                medico_id,
                tipo_atendimento,
                nome_paciente,
                nome_plano,
                nome_medico,
                ...requestData
            } = scheduleData.value

            if (scheduleData.value.agendado && isEditable.value && selectedPaciente?.value?.id) {
                requestData.paciente_id = selectedPaciente.value.id
            }

            requestData = {
                YWdlbmRhX2lk: btoa(requestData.id),
                Y2xpZW50ZV9pZA: btoa(CLIENTE_ID),
                cGFjaWVudGVfaWQ: btoa(requestData.paciente_id),
            }

            response = await editaAgenda(requestData)
        } else {
            let { agendado, id, nome_paciente, nome_plano, nome_medico, ...requestData } =
                scheduleData.value

            requestData.dia_semana = getDayWeek(scheduleData.value.data_agendada)

            if (admStore.isAdm) {
                if (scheduleData.value.agendado && isEditable.value) {
                    if (selectedPaciente?.value?.id) {
                        requestData.paciente_id = selectedPaciente.value.id
                    }
                } else {
                    requestData.paciente_id = selectedPaciente.value.id
                    requestData.atendente_id = admStore.id
                }
            }

            requestData = {
                Y2xpZW50ZV9pZA: btoa(requestData.medico_id),
                cGFjaWVudGVfaWQ: btoa(requestData.paciente_id),
                ZGF0YV9hZ2VuZGFkYQ: btoa(requestData.data_agendada),
                aG9yYXJpbw: btoa(requestData.horario),
                dGlwb19hdGVuZGltZW50bw: btoa(requestData.tipo_atendimento),
                ZGlhX3NlbWFuYQ: btoa(requestData.dia_semana),
                YXRlbmRlbnRlX2lk: btoa(requestData.atendente_id),
            }

            response = await enviaAgenda(requestData)
        }

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
            text: 'Erro ao realizar o agendamento.',

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

const deleteSchedule = async () => {
    isBtnLoadingDelete.value = true

    try {
        if (!scheduleData.value) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Dados inválidos ou inexistentes.',

                didOpen: () => {
                    const confirmBtn = Swal.getConfirmButton()
                    const actionsContainer = confirmBtn.parentElement

                    actionsContainer.style.width = '100%'
                    actionsContainer.style.display = 'flex'
                    actionsContainer.style.justifyContent = 'center'

                    confirmBtn.style.width = '90%'
                },
            })
        }

        const data = {
            YWdlbmRhX2lk: btoa(scheduleData.value.id),
            Y2xpZW50ZV9pZA: btoa(scheduleData.value.atendente_id),
        }

        await deleteAgenda(data)

        window.location.reload()
    } catch (error) {
        console.error(error)

        msgError.value.delete = 'Erro ao realizar o agendamento.'

        isBtnLoadingDelete.value = false
    } finally {
        isBtnLoadingDelete.value = false
    }
}

const searchPacientes = async () => {
    try {
        if (scheduleData.value?.nome_paciente && scheduleData.value?.nome_paciente.length < 3) {
            listPacientes.value = []

            return
        }

        if (abortController) {
            abortController.abort()
        }

        abortController = new AbortController()

        const data = {
            Y2xpZW50ZV9pZA: btoa(admStore.id),
            busca: scheduleData.value?.nome_paciente ?? '',
        }

        const response = await buscarPacientes(data, {
            signal: abortController.signal,
        })

        if (response.data?.pacientes?.data.length === 0) {
            listPacientes.value = ['Paciente não encontrado']

            return
        }

        listPacientes.value = response.data?.pacientes?.data.map(paciente => ({
            id: paciente.id,
            nome: paciente.nome,
            convenio: paciente.nome_plano,
        }))
    } catch (error) {
        console.error(error)

        msgError.value.delete = 'Erro ao listar pacientes.'
    }
}

const debouncedSearchPacientes = debounce(searchPacientes, 500)

watch(() => scheduleData.value.nome_paciente, debouncedSearchPacientes)

const handleKeyUp = e => {
    if (e.key === 'Escape') closeModal()
}

const closeModal = () => {
    emits('handleCloseModal')

    openModalDelete.value = false
    msgError.value.create = ''

    admStore.isAdm ? (isEditable.value = true) : (isEditable.value = false)
    scheduleData.value = { ...props.data }
    selectedPaciente.value = {}
}

const handleClickConfirm = () => {
    if (isScheduled.value && !isEditable.value) {
        isEditable.value = true

        return
    }

    createOrEditSchedule()
}

const handleClickCancel = () => {
    if (isScheduled.value && isEditable.value) {
        isEditable.value = false
        scheduleData.value = { ...props.data }
        selectedPaciente.value = {}

        return
    }

    openModalDelete.value = true
    return
}

const isDisabled = () => {
    if (admStore.isAdm && !isScheduled.value) {
        isEditable.value = true

        return
    }

    isEditable.value = false
}

const closeModalDelete = () => {
    openModalDelete.value = false
    msgError.value.create = ''
}

const fillPaciente = obj => {
    if (!obj) return

    selectedPaciente.value = obj
    scheduleData.value.nome_plano = obj?.convenio

    return
}
</script>

<style scoped lang="scss">
.modal-wrapper {
    @include flex-center();
    width: 500px;
    height: auto;
    min-height: 34rem;

    border-radius: 10px;
    border: 1px solid #dadada;
    background: #fff;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

    @media (max-width: 700px) {
        & {
            width: 400px;
            min-height: 30rem;
        }
    }

    @media (max-width: 460px) {
        & {
            width: 90%;
        }
    }

    @media (max-height: 575px) {
        & {
            height: 30rem;
        }
    }

    .modal-container {
        @include horizontal-col-center();
        width: 90%;
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
            @include flex-center();
            width: 90%;
            gap: 1rem;
        }

        .msg-error {
            color: #e41313;
        }
    }
}
</style>
