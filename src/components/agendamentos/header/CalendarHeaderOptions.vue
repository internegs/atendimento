<template>
    <header>
        <nav aria-label="Barra de navegação do calendário">
            <default-btn
                v-if="!isMobile && !loadingPage.loading"
                :disabled="disabledBtnNow"
                @handleClick="handleToday()"
            >
                Hoje
            </default-btn>

            <div
                v-if="!isMobile && loadingPage.loading"
                class="btn-today-loading"
            ></div>

            <div
                v-if="loadingPage.loading"
                class="controls-loading"
            >
                <div class="content-loading"></div>
            </div>

            <div
                v-else
                class="calendar-controls"
            >
                <default-btn
                    width="5rem"
                    class="btn-controls"
                    :disabled="disabledBtnPrev"
                    @handleClick="prevWeek()"
                >
                    <i class="fa-solid fa-chevron-left"></i>
                </default-btn>

                <button
                    class="btn-week"
                    v-text="monthView"
                ></button>

                <default-btn
                    width="5rem"
                    class="btn-controls"
                    :disabled="disabledBtnNext"
                    @handleClick="nextWeek()"
                >
                    <i class="fa-solid fa-chevron-right"></i>
                </default-btn>
            </div>

            <default-btn
                v-if="isMobile && !loadingPage.loading"
                :disabled="disabledBtnNow"
                @handleClick="handleToday()"
            >
                Hoje
            </default-btn>

            <div
                v-if="isMobile && loadingPage.loading"
                class="btn-today-loading"
            ></div>

            <!--APARECE SÓ NA RESPONSIVIDADE-->

            <div
                v-if="loadingPage.loading"
                class="btn-create-loading"
            ></div>

            <default-btn
                v-if="!loadingPage.loading && admStore.isAdm"
                classbtn-create-loading=""
                @handleClick="openModalCreate = true"
            >
                Criar Agenda
            </default-btn>

            <div v-if="!admStore.isAdm"></div>
        </nav>

        <create-timeline-modal
            :openModal="openModalCreate"
            @handle-close-modal="closeModal()"
        />
    </header>
</template>

<script setup>
import { useWeekDaysStore } from '@/stores/useWeekDaysStore.js'
import DefaultBtn from '../ui/DefaultBtn.vue'
import { format, startOfWeek, addDays, addWeeks, subWeeks, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useLoadingPageStore } from '@/stores/useLoadingPageStore'
import CreateTimelineModal from './modal/CreateTimelineModal.vue'
import { useAdmStore } from '@/stores/useAdmStore'
import { useDoctorInfoStore } from '@/stores/useDoctorInfoStore'
import { useHasSchedulingStore } from '@/stores/useHasSchedulingStore'

defineOptions({ name: 'CalendarHeaderOptions' })

const referenceDate = ref(new Date())
const windowWidth = ref(window.innerWidth)
const openModalCreate = ref(false)

const store = useWeekDaysStore()
const loadingPage = useLoadingPageStore()
const admStore = useAdmStore()
const doctorInfoStore = useDoctorInfoStore()
const weekDaysStore = useWeekDaysStore()
const hasSchedulingStore = useHasSchedulingStore()

onMounted(() => {
    addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
    removeEventListener('resize', updateWindowWidth)
})

watch(
    () => hasSchedulingStore.data,
    newValue => {
        if (!newValue.result && localStorage.getItem('@USER_ID')) {
            setTimeout(() => {
                openModalCreate.value = true
            }, 2000)
        }
    }
)

const getWeekDays = date => {
    const start = startOfWeek(date, { locale: ptBR })

    return Array.from({ length: 7 }, (_, i) => {
        const current = addDays(start, i)

        return {
            date: format(current, 'yyyy-MM-dd'),
            weekday: format(current, 'EEE', { locale: ptBR }),
        }
    })
}

store.weekDays = getWeekDays(referenceDate.value)

const nextWeek = () => {
    if (disabledBtnNext.value) return

    referenceDate.value = addWeeks(referenceDate.value, 1)
    store.weekDays = getWeekDays(referenceDate.value)
}

const prevWeek = () => {
    if (disabledBtnPrev.value) return

    referenceDate.value = subWeeks(referenceDate.value, 1)
    store.weekDays = getWeekDays(referenceDate.value)
}

const handleToday = () => {
    referenceDate.value = new Date()
    store.weekDays = getWeekDays(referenceDate.value)
}

const disabledBtnPrev = computed(() => {
    if (admStore.isAdm) {
        const isInitialDate =
            weekDaysStore.weekDays
                .map(item => item.date === doctorInfoStore.initDateSchedule)
                .find(Boolean) ?? false

        return isInitialDate
    }

    return format(referenceDate.value, 'd') === format(new Date(), 'd')
})

const disabledBtnNext = computed(() => {
    const isFinalDate =
        weekDaysStore.weekDays
            .map(item => item.date === doctorInfoStore.finalDateSchedule)
            .find(Boolean) ?? false

    return isFinalDate
})

const disabledBtnNow = computed(() => {
    return format(referenceDate.value, 'd') === format(new Date(), 'd')
})

const monthView = computed(() => {
    const weeksYear = store.weekDays.map(day => {
        const monthYear = format(parseISO(day.date), 'MMMM-yyyy', { locale: ptBR })

        return firstToUpperCase(monthYear.replace('-', ' - '))
    })

    const weeksYearFiltered = Array.from(new Set(weeksYear))

    if (weeksYearFiltered.length > 1) {
        return `${weeksYearFiltered[0]} / ${weeksYearFiltered[1]}`
    }

    return weeksYearFiltered[0]
})

const updateWindowWidth = () => {
    windowWidth.value = window.innerWidth
}

const isMobile = computed(() => {
    return windowWidth.value <= 550
})

const firstToUpperCase = str => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const closeModal = () => {
    openModalCreate.value = false
}
</script>

<style scoped lang="scss">
$blackLight: rgb(77, 79, 92);

header {
    @include flex-center();
    margin: 1rem 0;

    @media (max-width: 1028px) {
        & {
            margin: 0.5rem 0;
        }
    }

    @media (max-width: 550px) {
        & {
            margin-top: 0.4rem;
        }
    }

    nav {
        display: flex;
        justify-content: space-between;
        width: 95%;

        .btn-today-loading {
            @include pulsate();
            width: 6%;
            height: 2.5rem;

            @media (max-width: 550px) {
                & {
                    width: 100%;
                }
            }
        }

        .controls-loading {
            @include flex-center();
            width: 100%;
            height: 2.5rem;

            .content-loading {
                @include pulsate();
                width: 40%;
                height: 100%;
            }
        }

        .calendar-controls {
            @include flex-center();
            gap: 4rem;

            .btn-week {
                padding: 0.5rem 1rem;
                white-space: nowrap;

                border: none;
                border-radius: 6px;
                font-size: 16px;
                font-weight: 600;
                color: $blackLight;
                background-color: transparent;
                transition: all 150ms ease-in-out;

                &:active {
                    transform: translateY(1px);
                    background-color: #e0e0e0;
                    box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.05);
                }

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
                        font-size: 8px;
                    }
                }
            }

            .btn-controls i {
                color: $blackLight;
            }

            @media (max-width: 1028px) {
                & {
                    gap: 1rem;
                }
            }
        }

        @media (max-width: 550px) {
            & {
                flex-direction: column;
                gap: 0.5rem;
            }
        }

        & .btn-create-loading {
            @include pulsate();
            width: 10%;
            height: 2.5rem;

            @media (max-width: 550px) {
                & {
                    width: 100%;
                }
            }
        }
    }
}
</style>
