<template>
    <section>
        <slot></slot>
    </section>
</template>

<script>
export default {
    name: 'BaseModal',

}
</script>

<style scoped>
section {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100dvh;
    z-index: 1000;

    background-color: rgba(193, 193, 193, 0.4);
    backdrop-filter: blur(20px);

}
</style>