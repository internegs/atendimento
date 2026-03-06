<template>
    <router-view />
</template>

<script>
export default {
    name: 'App',

    mounted() {
        document.querySelectorAll('[data-bs-togle="tooltip"]').forEach(el => {
            // eslint-disable-next-line no-undef
            new bootstrap.Tooltip(el, { trigger: 'hover' })
        })
    },
}
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html,
body {
    height: 100%;
}

#app {
    height: 100dvh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    font-family: 'Montserrat';
}

.content {
    background-color: #fff !important;
}

button {
    border: none;
}

.font-oswald {
    font-family: 'Oswald', sans-serif;
}

.font-roboto {
    font-family: 'Roboto', sans-serif;
}

::-webkit-scrollbar-track {
    background-color: transparent;
}
::-webkit-scrollbar {
    max-width: 4px;
    max-height: 4px;
    background: transparent;
}
::-webkit-scrollbar-thumb {
    background: #a39d9a;
    border-radius: 10px;
}
</style>
