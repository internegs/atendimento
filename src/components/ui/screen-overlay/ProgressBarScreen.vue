<template>
    <base-modal
        :is-visible="isVisible"
        teleport-to="#app"
    >
        <div class="progress-bar-wrapper">
            <div class="wrapper-img">
                <img
                    src="../../../assets/img/inzupt.png"
                    alt="inzupt"
                    class="w-100"
                />
            </div>

            <div class="progress">
                <div
                    class="progress-bar progress-bar-striped progress-bar-animated bg-info"
                    :style="progress"
                ></div>
            </div>
        </div>
    </base-modal>
</template>

<script setup>
import BaseModal from '@/components/modals/BaseModal.vue'
import { computed } from 'vue'

defineOptions({
    name: 'ProgressBarScreen',
})

const props = defineProps({
    isVisible: {
        type: Boolean,
        default: false,
    },
    percents: {
        type: Number,
        default: 0,
    },
})

const progress = computed(() => `width: ${props.percents}%`)
</script>

<style scoped lang="scss">
.progress-bar-wrapper {
    @include flex-col-center;
    gap: 1rem;

    .wrapper-img {
        @include flex-center();
        width: 70%;

        @media (min-width: 420px) {
            width: 15rem;
        }
    }

    .progress {
        width: 70%;
        height: 0.5rem;

        @media (min-width: 420px) {
            width: 20rem;
        }

        .progress-bar {
            transition: width 0.2s ease-in-out;
        }
    }
}
</style>
