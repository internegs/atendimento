<template>
    <router-view />
</template>

<script>
export default {
    name: 'App',
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
    max-width: 8px;
    background: transparent;
}
::-webkit-scrollbar-thumb {
    background: #a39d9a;
    border-radius: 10px;
}
</style>
