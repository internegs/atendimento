<template>
    <div
        ref="calendarWrapper"
        class="calendar-wrapper"
    >
        <calendar-header />
        <calendar-main />
    </div>
</template>

<script setup>
import { useAdmStore } from '@/stores/useAdmStore'
import CalendarHeader from './header/CalendarHeader.vue'
import CalendarMain from './main/CalendarMain.vue'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

defineOptions({ name: 'CalendarWrapper' })

const admStore = useAdmStore()
const calendarWrapper = ref(null)
const windowWidth = ref(window.innerWidth)

watch(
    [() => admStore.isAdm, windowWidth],
    ([isAdm, width]) => {
        if (isAdm) {
            nextTick(() => {
                if (width <= 550) {
                    calendarWrapper.value.style.setProperty('height', '60vh', 'important')

                    return
                }

                calendarWrapper.value.style.setProperty('height', '75vh', 'important')
            })
        }
    },
    { immediate: true }
)

onMounted(() => document.addEventListener('resize', updatedWindowWidth))

onUnmounted(() => document.removeEventListener('resize', updatedWindowWidth))

const updatedWindowWidth = () => (windowWidth.value = window.innerWidth)
</script>

<style scoped lang="scss">
.calendar-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 320px;
    height: 80vh;

    border-radius: 6px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    background: #ffff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);

    @media (max-width: 1028px) {
        & {
            height: 88vh;
        }
    }

    @media (max-width: 500px) {
        & {
            height: 83vh;
        }
    }

    @media (max-height: 700px) {
        & {
            height: 75dvh;
        }
    }

    @media (max-height: 576px) {
        & {
            height: 65dvh;
        }
    }
}
</style>
