<template>
    <div
        ref="container"
        class="main-container"
    >
        <template v-if="loadingPageStore.loading">
            <div class="main-loading"></div>
        </template>

        <template v-else-if="scheduleHours && scheduleHours.length > 0 && scheduleData">
            <template
                v-for="(hours, i) in scheduleHours"
                :key="i"
            >
                <div
                    :ref="el => registerRowRef(el, hours)"
                    class="row-grid"
                >
                    <block-hours-main
                        :hours="hours"
                        :closest="findClosestHorario()"
                    />

                    <template
                        v-for="(day, j) in days"
                        :key="j"
                    >
                        <block-btn-main
                            :hours="hours"
                            :day="day.date"
                            :schedulingData="scheduleData"
                            :paciente="paciente"
                            :medico="medico"
                            @handleBtnBlock="updateOpenModal"
                        />
                    </template>
                </div>
            </template>

            <create-scheduling-modal
                :openModal="openModal"
                :data="createData"
                @handleCloseModal="closeModal"
            />
        </template>

        <template v-else>
            <div class="not-schedule">
                <p>Não há horarios disponíveis</p>
            </div>
        </template>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { format } from 'date-fns'

import BlockHoursMain from './BlockHoursMain.vue'
import BlockBtnMain from './BlockBtnMain.vue'
import CreateSchedulingModal from '../modal/CreateSchedulingModal.vue'

import { getAgenda } from '@/services/apiAgenda'

import { useWeekDaysStore } from '@/stores/useWeekDaysStore.js'
import { useSchedulehoursStore } from '@/stores/useScheduleHoursStore.js'
import { useDoctorInfoStore } from '@/stores/useDoctorInfoStore.js'
import { useLoadingPageStore } from '@/stores/useLoadingPageStore'
import { useHasSchedulingStore } from '@/stores/useHasSchedulingStore'
import { useAdmStore } from '@/stores/useAdmStore'

defineOptions({ name: 'CalendarMain' })

const emits = defineEmits(['doctor-name'])

const weekDaysStore = useWeekDaysStore()
const scheduleHoursStore = useSchedulehoursStore()
const doctorInfoStore = useDoctorInfoStore()
const loadingPageStore = useLoadingPageStore()
const hasScheduleStore = useHasSchedulingStore()
const admStore = useAdmStore()

const [rowRefs, scheduleData, paciente, medico, createData] = Array(5)
    .fill()
    .map(() => ref({}))

const openModal = ref(false)

onMounted(async () => {
    await scheduleRequest()

    const closest = findClosestHorario()

    if (closest && rowRefs.value[closest]) {
        rowRefs.value[closest].scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
})

const days = computed(() => weekDaysStore.weekDays)

const registerRowRef = (el, horario) => {
    if (el && horario) {
        rowRefs.value[horario] = el
    }
}

function findClosestHorario() {
    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    const horarios = Object.keys(rowRefs.value)

    let closest = null // valor mais proximo
    let minDiff = Infinity

    for (const horario of horarios) {
        const [h, m] = horario.split(':').map(Number)
        const totalMinutes = h * 60 + m
        const diff = Math.abs(totalMinutes - currentMinutes)

        if (diff < minDiff) {
            minDiff = diff
            closest = horario
        }
    }

    return closest
}

const scheduleRequest = async () => {
    try {
        loadingPageStore.loading = true

        const response = await getAgenda()

        if (response.data && typeof response.data !== 'string') {
            admStore.isAdm = !!localStorage.getItem('@USER_ID')

            if (Object.hasOwn(response.data, 'result')) {
                hasScheduleStore.data = response.data

                throw new Error(response.data.message)
            }

            const formattedData = response.data?.agenda
                .map(item => {
                    if (item.agendado) {
                        if (admStore.isAdm) {
                            return {
                                id: item?.id ?? null,
                                atendente_id: response?.data?.atendente ?? null,
                                paciente_id: item?.paciente_id ?? null,
                                paciente_nome: item?.nome_paciente ?? null,
                                convenio: item?.convenio ?? null,
                                medico_id: item?.medico_id ?? null,
                                data: item?.data
                                    ? format(new Date(`${item.data}T00:00:00`), 'yyyy-MM-dd')
                                    : null,
                                horario: item?.horario
                                    ? format(new Date(`2025-01-01T${item.horario}`), 'HH:mm')
                                    : null,
                                agendado: item?.agendado ?? null,
                            }
                        }

                        return {
                            atendente_id: response?.data?.atendente ?? null,
                            paciente_id: item?.paciente_id ?? null,
                            medico_id: item?.medico_id ?? null,
                            data: item?.data
                                ? format(new Date(`${item.data}T00:00:00`), 'yyyy-MM-dd')
                                : null,
                            horario: item?.horario
                                ? format(new Date(`2025-01-01T${item.horario}`), 'HH:mm')
                                : null,
                            agendado: item?.agendado ?? null,
                        }
                    }

                    return null
                })
                .filter(Boolean)

            const lunchInterval = {
                start: response.data?.horario.almoco_i ?? null,
                end: response.data?.horario.almoco_f ?? null,
            }

            admStore.id = response?.data?.atendente ?? null
            doctorInfoStore.initDateSchedule = response?.data?.data_inicial ?? null
            doctorInfoStore.finalDateSchedule = response?.data?.data_final ?? null

            scheduleData.value = formattedData

            doctorInfoStore.name = response.data.medico.nome ?? null
            scheduleHoursStore.addHours(
                response.data.horario.h_i,
                response.data.horario.h_f,
                String(response.data.horario.intervalo),
                lunchInterval
            )
            paciente.value = response.data?.paciente ?? null
            medico.value = response.data?.medico ?? null

            const weekDays = {
                domingo: response.data?.horario?.domingo ?? null,
                segunda: response.data?.horario?.segunda ?? null,
                terca: response.data?.horario?.terca ?? null,
                quarta: response.data?.horario?.quarta ?? null,
                quinta: response.data?.horario?.quinta ?? null,
                sexta: response.data?.horario?.sexta ?? null,
                sabado: response.data?.horario?.sabado ?? null,
            }

            weekDaysStore.availableWeekDays = weekDays

            return
        }

        const objData = {
            message: response.data,
            result: false,
        }

        hasScheduleStore.data = objData

        throw new Error(objData.message)
    } catch (error) {
        if (error.message) {
            return console.error(error.message)
        }

        return console.error(error)
    } finally {
        if (!Object.hasOwn(hasScheduleStore.data, 'result')) {
            // doctorInfoStore confirmará se response.data passou na verificação do try
            if (doctorInfoStore.name.trim().length > 0) {
                loadingPageStore.loading = false
            }
        }
    }
}

const scheduleHours = computed(() => {
    return scheduleHoursStore.hours
})

const updateOpenModal = objectData => {
    if (objectData) {
        createData.value = objectData
    }

    return (openModal.value = true)
}

const closeModal = () => {
    return (openModal.value = false)
}
</script>

<style scoped lang="scss">
.main-container {
    width: 100%;
    height: 100%;
    overflow-y: auto;

    .main-loading {
        @include flex-center();
        @include pulsate();
        width: 100%;
        height: 100%;
    }

    .row-grid {
        display: grid;
        grid-template-columns: 0.8fr repeat(7, 1fr);
        border-bottom: 2px solid rgba(0, 0, 0, 0.2);
    }

    .not-schedule {
        @include flex-center();
        width: 100%;
        height: 100%;
    }
}
</style>
