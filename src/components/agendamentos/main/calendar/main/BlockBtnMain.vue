<template>
    <div
        v-no-select
        class="block-wrapper"
    >
        <!--DIRETIVA PERSONALIZADA-->
        <button
            type="button"
            class="btn-block"
            :disabled="validateDisabled"
            @click="(handleClick(), onActiveTooltip($event))"
            @mouseenter="onActiveTooltip($event)"
            @mouseleave="onActiveTooltip($event)"
        >
            <span
                v-if="!isMobile"
                :style="statusColor"
                v-text="isStatus"
            ></span>

            <i
                v-if="isMobile"
                :class="isStatusMobile.icon"
                :style="`color: ${isStatusMobile.color}; font-size: 12px`"
            ></i>
        </button>

        <scheduled-tooltips
            v-if="isMobile && admStore.isAdm"
            :showtooltip="isTooltipOpen"
            right="90%"
            top="20%"
            :name="tooltipData.nome_paciente"
            :plan="tooltipData.plano"
            @mouseenter="isHoveringTooltip = true"
            @mouseleave="handleTooltipLeave"
        />
    </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { format } from 'date-fns'

import { getDayWeek } from '@/utils/formatterValueUtil.js'

import { useAdmStore } from '@/stores/useAdmStore'
import { useWeekDaysStore } from '@/stores/useWeekDaysStore'
import ScheduledTooltips from '@/components/agendamentos/ui/ScheduledTooltips.vue'
import { useDoctorInfoStore } from '@/stores/useDoctorInfoStore'

defineOptions({
    name: 'BlockBtnMain',
})

const props = defineProps({
    hours: {
        type: String,
        required: true,
    },

    day: {
        type: String,
        required: true,
    },

    schedulingData: {
        type: [Array, Object],
        required: true,
    },

    paciente: {
        type: Object,
    },

    medico: {
        type: Object,
        required: true,
    },
})

const emits = defineEmits(['handleBtnBlock'])

/*VARIABLES*/

const admStore = useAdmStore()
const weekDaysStore = useWeekDaysStore()
const doctorInfoStore = useDoctorInfoStore()

const isTooltipOpen = ref(false)
const isHoveringTooltip = ref(false)
const tooltipTimeout = ref(null)
const windowWidth = ref(window.innerWidth)

onMounted(() => {
    window.addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
    window.removeEventListener('resize', updateWindowWidth)
})

/*COMPUTEDS*/

const isScheduled = computed(() => {
    if (Array.isArray(props.schedulingData)) {
        return props.schedulingData.some(
            schedule => schedule.data === props.day && schedule.horario === props.hours
        )
    }

    return false
})

const isMobile = computed(() => windowWidth.value <= 800)

const createData = computed(() => {
    if (admStore.isAdm) {
        const data = props.schedulingData.find(
            schedule => schedule.data === props.day && schedule.horario === props.hours
        )

        return {
            id: data?.id ?? null,
            atendente_id: data?.atendente_id ?? null,
            paciente_id: data?.paciente_id ?? null,
            nome_paciente: data?.paciente_nome ?? null,
            nome_plano: data?.convenio ?? null,
            medico_id: props.medico?.id ?? null,
            nome_medico: props.medico?.nome ?? null,
            data_agendada: props?.day ?? null,
            horario: props?.hours ?? null,
            agendado: data?.agendado ?? null,
            dia_semana: '',
            tipo_atendimento: 1,
        }
    }

    return {
        paciente_id: props.paciente?.id ?? null,
        nome_paciente: props.paciente?.nome ?? null,
        nome_plano: props.paciente?.nome_plano ?? null,
        medico_id: props.medico?.id ?? null,
        nome_medico: props.medico?.nome ?? null,
        data_agendada: props?.day ?? null,
        horario: props?.hours ?? null,
        dia_semana: '',
        tipo_atendimento: 1,
    }
})

const tooltipData = computed(() => {
    if (admStore.isAdm) {
        const data = props.schedulingData.find(
            schedule => schedule.data === props.day && schedule.horario === props.hours
        )

        return {
            nome_paciente: data?.paciente_nome ?? null,
            plano: data?.convenio ?? null,
        }
    }

    return null
})

const getNamePaciente = computed(() => {
    if (admStore.isAdm) {
        const data = props.schedulingData.find(
            schedule => schedule.data === props.day && schedule.horario === props.hours
        )

        return data?.paciente_nome ?? null
    }

    return null
})

const daysAvailable = computed(() => {
    const day = getDayWeek(props.day)

    return weekDaysStore.weekDays.find(item => day === item.weekday).isActive
})

const validateDaysBeforeNow = computed(() => {
    const dayNow = format(new Date(), 'yyyy-MM-dd')

    return props.day < dayNow
})

const validateDaysAfterFinal = computed(() => {
    return props.day > doctorInfoStore.finalDateSchedule
})

const validateHoursBeforeNow = computed(() => {
    const dayNow = format(new Date(), 'yyyy-MM-dd')

    if (props.day === dayNow) {
        const hourNow = format(new Date(), 'HH:mm')

        return props.hours < hourNow
    }

    return false
})

// A func abaixo controla a disponibilidade de cada bloco de agendamento
const validateDisabled = computed(() => {
    if (admStore.isAdm) {
        if (
            !daysAvailable.value ||
            validateDaysBeforeNow.value ||
            validateHoursBeforeNow.value ||
            validateDaysAfterFinal.value
        ) {
            return !isScheduled.value
        }

        return false
    }

    return (
        isScheduled.value ||
        !daysAvailable.value ||
        validateDaysBeforeNow.value ||
        validateHoursBeforeNow.value ||
        validateDaysAfterFinal.value
    )
})

const isStatus = computed(() => {
    if (validateDisabled.value) {
        return 'Indisponível'
    } else if (!validateDisabled.value && isScheduled.value) {
        return getNamePaciente.value ?? 'Não definido'
    }

    return 'Disponível'
})

const isStatusMobile = computed(() => {
    if (validateDisabled.value) {
        return {
            icon: 'fa-solid fa-ban',
            color: '#2c3e50',
        }
    } else if (isScheduled.value && admStore.isAdm) {
        return {
            icon: 'fa-solid fa-clipboard-list',
            color: '#d38100',
        }
    }

    return {
        icon: 'fa-solid fa-check',
        color: '#198754',
    }
})

const statusColor = computed(() => {
    if (validateDisabled.value) {
        return { color: '#A4A4A4' } // agendado ou desativado
    } else if (admStore.isAdm && isScheduled.value) {
        return { color: '#d38100' } // agendado (visto somente pelo adm)
    }

    return { color: '#039450' } // Disponivel
})

/*METHODS*/

const onActiveTooltip = event => {
    if (isMobile.value && isScheduled.value) {
        if (tooltipTimeout.value) {
            clearTimeout(tooltipTimeout.value)

            tooltipTimeout.value = null
        }

        if (event.type === 'mouseenter') {
            tooltipTimeout.value = setTimeout(() => {
                isTooltipOpen.value = true
            }, 500)
        } else if (event.type === 'mouseleave') {
            tooltipTimeout.value = setTimeout(() => {
                if (!isHoveringTooltip.value) {
                    isTooltipOpen.value = false
                }
            }, 500)
        } else if (event.type === 'click') {
            clearTimeout(tooltipTimeout.value)

            if (!isHoveringTooltip.value) {
                isTooltipOpen.value = null
            }
        }
    }
}

const handleTooltipLeave = () => {
    if (isMobile.value && isScheduled.value) {
        isHoveringTooltip.value = false

        setTimeout(() => {
            if (!isHoveringTooltip.value) {
                isTooltipOpen.value = false
            }
        }, 500)
    }
}

const updateWindowWidth = () => (windowWidth.value = window.innerWidth)

const handleClick = () => {
    if (!validateDisabled.value) {
        emits('handleBtnBlock', createData.value)
    }
}

const teste = value => console.log(value)
</script>

<style scoped lang="scss">
.block-wrapper {
    position: relative;
    @include flex-col-center();
    border-left: 2px solid rgba(0, 0, 0, 0.2);

    .btn-block {
        width: 100%;
        height: 100%;

        border: none;
        background-color: inherit;
        border-radius: 4px;
        transition: all 200ms ease-out;
        outline: none;

        span {
            transition: all 200ms ease-out;
        }

        &:hover {
            background-color: #fafafa;

            span {
                font-weight: 600;
            }
        }

        &:focus {
            outline: 2px solid #00d5dd;
            box-shadow: none;
        }

        &:active {
            box-shadow: 0 0 0 3px #f3f3f3;
            background-color: #f3f3f3;
            transform: scaleX(0.94) scaleY(0.8);

            span {
                font-weight: 500;
            }
        }

        &:disabled {
            cursor: not-allowed;
            background: #ededed;
            color: #a4a4a4;
            opacity: 0.5;

            transform: none;

            span {
                font-weight: 400;
            }
        }

        & span {
            font-weight: 500;
            color: #4d4f5c;

            @media (max-width: 1400px) {
                & {
                    font-size: 14px;
                }
            }

            @media (max-width: 1028px) {
                & {
                    font-size: 10px;
                }
            }

            @media (max-width: 640px) {
                & {
                    font-size: 6px;
                }
            }
        }
    }
}
</style>
