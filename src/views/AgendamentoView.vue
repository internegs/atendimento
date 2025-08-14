<template>
    <div class="agendamento-container">
        <base-layout>
            <template
                v-if="!admStore.isAdm"
                #header
            >
                <div
                    v-if="loadingPage.loading"
                    class="header-loading"
                ></div>

                <div v-else>
                    <span
                        class="title"
                        v-text="getDoctorName"
                    ></span>
                </div>
            </template>

            <calendar-header-opt />
            <calendar-wrapper />
        </base-layout>
    </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import BaseLayout from '@/components/agendamentos/templates/BaseLayout.vue'
import CalendarHeaderOpt from '@/components/agendamentos/header/CalendarHeaderOptions.vue'
import CalendarWrapper from '@/components/agendamentos/main/calendar/CalendarWrapper.vue'
import { useDoctorInfoStore } from '@/stores/useDoctorInfoStore'
import { useLoadingPageStore } from '@/stores/useLoadingPageStore'
import { useHasSchedulingStore } from '@/stores/useHasSchedulingStore'
import { useAdmStore } from '@/stores/useAdmStore'
import Swal from 'sweetalert2'

defineOptions({ name: 'AgendamentoView' })

const doctorInfoStore = useDoctorInfoStore()
const loadingPage = useLoadingPageStore()
const hasSchedulingStore = useHasSchedulingStore()
const admStore = useAdmStore()

const getDoctorName = computed(() => {
    if (!admStore.isAdm && doctorInfoStore.name) {
        return doctorInfoStore.name
    }

    return ''
})

watch(
    () => hasSchedulingStore.data,
    newValue => {
        if (Object.hasOwn(newValue, 'result')) {
            Swal.fire({
                icon: 'warning',
                title: 'Aviso',
                text: newValue.message || 'Ocorreu um erro.',
                showConfirmButton: false,
                allowEscapeKey: false,
                allowOutsideClick: false,
            })

            hasSchedulingStore.data = {}
        }
    }
)
</script>

<style scoped lang="scss">
.agendamento-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;

    .header-loading {
        @include pulsate();
        width: 30%;
        height: 3vh;
    }

    .title {
        font-weight: bold;
        font-size: 1.3em;

        @media (max-width: 1400px) {
            & {
                font-size: 1.1em;
            }
        }

        @media (max-width: 1028px) {
            & {
                font-size: 1em;
            }
        }

        @media (max-width: 640px) {
            & {
                font-size: 0.8em;
            }
        }
    }
}
</style>
