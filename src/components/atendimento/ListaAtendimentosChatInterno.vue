<template>
    <div class="chat-list">
        <div
            v-if="lista.length === 0"
            class="block pe-none"
        >
            Não há contatos a ser atendido
        </div>

        <div
            v-for="(contato, index) in lista"
            :key="index"
            class="block"
            :class="{ active: ativado === contato.id }"
            @click="
                change({
                    usuario: contato,
                })
            "
        >
            <div
                class="details"
                :class="contato.online === 1 ? 'online' : 'offline'"
            >
                <div class="name fw-bold text-dark">
                    {{ contato.name }}
                </div>

                <div class="name fw-bold text-dark">
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
        novointerno: {
            type: Number,
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
    display: flex;
    align-items: center;
    margin: 10px 0 10px 20px;
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

.online::before {
    margin-right: 10px;

    content: '';
    display: inline-block;
    background-color: #00ff00;
    height: 5px;
    width: 5px;
    border-radius: 50%;
}
.offline::before {
    margin-right: 10px;

    content: '';
    display: inline-block;
    background-color: #ff2800;
    height: 10px;
    width: 10px;
    border-radius: 50%;
}
</style>
