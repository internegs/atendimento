<template>
    <teleport
        v-if="isVisible"
        :to="teleportTo"
    >
        <section class="layout-modal-container">
            <slot></slot>
        </section>
    </teleport>
</template>

<script setup>
defineOptions({
    name: 'BaseModal',
})

defineProps({
    isVisible: {
        type: Boolean,
        default: false,
    },

    teleportTo: {
        type: String,
        required: true,
    },
})
</script>

<style scoped lang="scss">
.layout-modal-container {
    @include flex-center();
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(8px);
    z-index: 5;
}
</style>
