<template>
    <div class="chat-list">
        <div
            v-if="lista.length === 0"
            class="block"
        >
            Não há contatos a ser atendido
        </div>

        <div
            v-for="contato in lista"
            :key="contato.id_atendimento"
            class="block"
            :class="{ active: ativado === contato.id }"
            @click="
                change({
                    usuario: contato,
                })
            "
        >
            <div class="imgbx">
                <img
                    :src="contato.foto"
                    alt=""
                />
            </div>
            <div class="details">
                <div
                    v-if="contato.nome_setor != null"
                    class="name text-info"
                >
                    Setor {{ contato.nome_setor }}
                </div>

                <div
                    v-if="contato.hasOwnProperty('transferido') && contato.transferido != 0"
                    class="name text-info"
                >
                    Tranferido por {{ contato.transferido }}
                </div>

                <div class="name fw-bold text-dark">{{ contato.nome }}</div>

                <div class="name fw-bold text-dark">
                    {{ maskPhone(contato.fone) }}

                    <span
                        v-for="(fones, index) in lista_fone"
                        :key="index"
                    >
                        <span
                            v-if="fones.fone == contato.fone && fones.qtdeMensagens != 0"
                            class="badge bg-warning rounded-pill"
                        >
                            {{ fones.qtdeMensagens }}
                        </span>
                    </span>
                </div>

                <div
                    v-if="tipo == 1"
                    class="name text-danger"
                    style="font-size: 0.7rem"
                >
                    {{ contato.nome_atendente }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ListaAtendimento',

    props: {
        change: {
            type: Function,
        },
        lista: {
            type: Array,
        },
        ativado: {
            type: Number,
        },
        novo: {
            type: Boolean,
        },
        tipo: {
            type: [String, Number],
        },
        lista_fone: {
            type: Array,
        },
    },

    data() {
        return {
            novo1: '',
            cont: 0,
        }
    },

    methods: {
        maskPhone(value) {
            if (!value || value.lenght === 0) return value

            if (value.length > 13) {
                if (value?.includes('+')) {
                    return `+${value.slice(1, 3)} (${value.slice(3, 5)}) ${value.slice(5, 6)} ${value.slice(6, 10)}-${value.slice(10)}`
                }

                return value
            }

            return `+${value.slice(0, 2)} (${value.slice(2, 4)}) ${value.slice(4, 5)} ${value.slice(5, 9)}-${value.slice(9)}`
        },

        teste(value) {
            console.log(value)
        },
    },
}
</script>

<style scoped>
img {
    max-width: 100%;
}

.chat-list {
    position: relative;
    overflow-y: auto;
    height: calc(100% - 110px);
}

.chat-list .block {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 10px 15px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    cursor: pointer;
}

.block .imgbx {
    position: relative;
    width: 45px;
    height: 45px;
}

.img-text {
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
}

.details {
    margin-left: 10px;
}

.imgbx img,
.img-text img {
    border-radius: 50%;
}

.block.active {
    background-color: #ebebeb;
}

.block:hover {
    background-color: #f5f5f5;
}
</style>
