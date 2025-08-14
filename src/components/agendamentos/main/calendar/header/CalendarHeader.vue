<template>
    <div class="header-grid">
        <div
            v-if="loadingPage.loading"
            class="header-loading"
        ></div>

        <block-hours-main
            v-else
            hours="Horário"
        />

        <template v-if="loadingPage.loading">
            <div
                v-for="(days, index) in store.weekDays"
                :key="index"
                class="days-loading"
            ></div>
        </template>

        <block-item-header
            v-for="(days, i) in store.weekDays"
            v-else
            :key="i"
            :week="days.weekday"
            :date="days.date"
        />
    </div>
</template>

<script setup>
import { useWeekDaysStore } from '@/stores/useWeekDaysStore.js'
import BlockItemHeader from './BlockItemHeader.vue'
import BlockHoursMain from '../main/BlockHoursMain.vue'
import { useLoadingPageStore } from '@/stores/useLoadingPageStore'

defineOptions({ name: 'CalendarHeader' })

const store = useWeekDaysStore()
const loadingPage = useLoadingPageStore()
</script>

<style scoped lang="scss">
.header-grid {
    display: grid;
    grid-template-columns: 0.8fr repeat(7, 1fr);
    border-bottom: 2px solid rgba(0, 0, 0, 0.2);

    .header-loading {
        @include pulsate();
        width: 100%;
        height: 6rem;

        @media (max-width: 1400px) {
            & {
                height: 4rem;
            }
        }

        @media (max-width: 1028px) {
            & {
                height: 3rem;
            }
        }

        @media (max-width: 680px) {
            & {
                height: 2rem;
            }
        }
    }

    .days-loading {
        @include pulsate();
        width: 100%;
    }
}
</style>
