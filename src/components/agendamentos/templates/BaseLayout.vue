<template>
    <div class="layout">
        <header v-if="$slots.header">
            <slot name="header"></slot>
        </header>

        <main>
            <slot></slot>
        </main>
    </div>
</template>

<script setup>
defineOptions({ name: 'BaseLayout' })
</script>

<style scoped lang="scss">
.layout {
    display: flex;
    flex-direction: column;
    width: 98%;
    max-width: 1600px;
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;

    @media (max-width: 1400px) {
        & {
            max-width: 1120px;
        }
    }

    header {
        flex-shrink: 0;
        @include flex-center();
        padding: 1rem 0;

        @media (max-width: 640px) {
            & {
                padding: 0.5rem 0;
            }
        }
    }

    main {
        flex: 1;
        width: 100%;
    }
}
</style>
