<template>
    <section
        id="planos"
        class="mt-2 mb-5"
    >
        <h1
            class="text-center bg-laranja text-light fw-bold p-3 font-oswald"
            style="font-size: 2.5rem"
        >
            Escolha o INZUPT do seu jeito
        </h1>

        <div class="container mt-5">
            <div class="precos">
                <div
                    v-for="dados in planosData"
                    :key="dados.id"
                    :class="dados.destaque ? 'destaque' : ''"
                    class="preco p-3 sombra"
                >
                    <div class="header">
                        <h1 class="text-justify fw-bold fs-3">
                            Plano
                            <br />
                            {{ dados.nome }}
                        </h1>
                    </div>

                    <div class="formatedConteudo">
                        <p class="text-center">
                            {{ dados.conteudo }}
                        </p>

                        <p>Planos à partir de</p>

                        <h2 class="valor">
                            {{ formatMoney(dados.valor_inicial) }}
                        </h2>

                        <button
                            class="botao-personalizado mt-3 fw-bold text-white"
                            @click="((loading = dados.id), handleBtnSelect(dados.id))"
                        >
                            <div
                                v-if="loading === dados.id"
                                class="spinner-border spinner-border-sm"
                                role="status"
                            ></div>

                            <span v-else>Selecione</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div
            v-if="showSubplanos"
            id="planosPrecos"
            class="container mt-6"
        >
            <h1 class="text-center mb-5 font-oswald">Plano {{ planoNome }}</h1>

            <banner-planos-price :subplanos="subplanosData" />
        </div>
    </section>
</template>

<script>
import BannerPlanosPrice from './BannerPlanosPrice.vue'
import Api from '@/services/api'
import { formatBrMoney } from '@/utils/formatters'

export default {
    name: 'BannerPlanos',

    components: { BannerPlanosPrice },

    data() {
        return {
            showSubplanos: false,
            planoNome: '',
            planosData: [],
            allSubplanosData: {},
            subplanosData: {},
            loading: null,
        }
    },

    mounted() {
        this.getPlanos()
        this.getSubplanos()
    },

    methods: {
        formatMoney(value) {
            if (value === 0) return 'Consulte-nos'

            return formatBrMoney(value)
        },

        async getPlanos() {
            await Api.get('/planos')
                .then(response => {
                    this.planosData = response.data
                })
                .catch(error => {
                    console.error(error)
                })
        },

        async getSubplanos() {
            await Api.post('/subplanos')
                .then(response => {
                    this.allSubplanosData = response.data
                })
                .catch(error => {
                    console.error(error)
                })
        },

        isEmpty(obj) {
            return Object.keys(obj).length === 0
        },

        scrollAnimation(element) {
            const to = document.querySelector(`${element}`).offsetTop

            window.scroll({
                top: to - 200,
                behavior: 'smooth',
            })
        },

        handleBtnSelect(planoId) {
            this.planoNome = this.planosData.find(plano => plano.id === planoId).nome

            this.subplanosData = this.allSubplanosData?.subplanos
                .filter(subplanos => subplanos.plano_id === planoId)
                .map(subplano => {
                    let formatedConteudo = []

                    try {
                        formatedConteudo = JSON.parse(subplano.conteudo)
                    } catch (error) {
                        console.error('Erro ao converter conteúdo. Erro: ', error)

                        formatedConteudo = []
                    }

                    return {
                        ...subplano,
                        plano_nome: this.planoNome,
                        conteudo: formatedConteudo,
                    }
                })

            this.showSubplanos = true
            this.loading = null

            this.$nextTick(() => this.scrollAnimation('#planosPrecos'))
        },
    },
}
</script>

<style scoped>
.mt-10 {
    margin-top: 200px;
}

.sombra {
    box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.2);
}

.botao-personalizado {
    padding: 12px 30px;
    background-color: #ce5800;
    font-size: 1.2rem;
    border-radius: 30px;
}

.verde {
    color: #36b37e;
}

.precos {
    margin: auto;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
}

.preco {
    height: 400px;
    padding: 4px;
}
.preco,
.formatedConteudo {
    display: flex;

    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 30px;
}

.destaque {
    background-color: #f58634;
}

.destaque h1,
.destaque p,
.destaque .valor {
    color: #fff;
}

.plano:nth-child(2) {
    border: 2px solid #f58634;
}

button {
    font-family: 'Fira Sans', sans-serif;
}

@media (max-width: 1000px) {
    .planos {
        gap: 20px;
        grid-template-columns: 1fr;
    }
}

.bg-azul {
    background-color: #00308f;
}

@media (max-width: 600px) {
    .precos {
        grid-template-columns: 1fr;
    }
}
</style>
