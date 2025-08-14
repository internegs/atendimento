<template>
    <main>
        <header>
            <h1>{{ errorMessage.status || '404' }}</h1>
        </header>

        <div>
            <p>{{ errorMessage.status == 403 ? 'Acesso negado' : 'Página não encontrada' }}</p>
        </div>
    </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
    name: 'ErrosPage',
})

const route = useRoute()
const errorMessage = ref({})

onMounted(() => {
    if (route.query.error) {
        try {
            errorMessage.value.message = decodeURIComponent(atob(route.query.error))
            errorMessage.value.status = route.query.code
        } catch (error) {
            errorMessage.value.message = 'Erro ao decifrar mensagem.'
            errorMessage.value.status = 400
        }
    }

    console.error(errorMessage.value)
})
</script>

<style scoped lang="scss">
main {
    @include flex-col-center();
    width: 100%;
    height: 100%;

    & header h1 {
        font-weight: bold;
        font-size: 7em;

        @media (min-width: 768px) {
            & {
                font-size: 10em;
            }
        }
    }

    & div {
        @include flex-col-center();

        & p {
            font-size: 1.2em;

            @media (min-width: 768px) {
                & {
                    font-size: 1.4em;
                }
            }
        }

        & button {
            @include flex-center();
            padding: 2% 3%;

            border: none;
            transition: transform 100ms ease-in-out;

            &:active {
                border-radius: 50%;
                background-color: #e4e4e4;
                transform: translateY(1px);
            }

            & i {
                font-size: 1.8em;
                color: #4d4f5c;
                transition: transform 100ms ease-in;

                @media (min-width: 768px) {
                    & {
                        font-size: 2em;
                    }
                }

                &:hover {
                    transform: scale(1.05);
                }
            }
        }
    }
}
</style>
