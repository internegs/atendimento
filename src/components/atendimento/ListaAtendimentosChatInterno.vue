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
            @click="selecionarContato(contato)"
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
                        v-for="(fone, idx) in listaFone"
                        :key="idx"
                    >
                        <span
                            v-if="fone.fone == contato.fone && fone.qtdeMensagens != 0"
                            class="badge bg-warning rounded-pill"
                        >
                            {{ fone.qtdeMensagens }}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineOptions({ name: 'ListaAtendimentoChatInterno' })

defineProps({
    lista: {
        type: Array,
    },
    ativado: {
        type: Number,
    },
    novoInterno: {
        type: Number,
    },
    listaFone: {
        type: Array,
    },
})

const emit = defineEmits(['contato-selecionado'])

function selecionarContato(contato) {
    emit('contato-selecionado', { usuario: contato })
}
</script>

<style lang="scss" scoped>
img {
    max-width: 100%;
}

.chat-list {
    position: relative;
    overflow-y: auto;
    height: calc(100% - 110px);

    .block {
        position: relative;
        width: 100%;
        display: flex;
        align-items: center;
        padding: 10px 15px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        cursor: pointer;

        &.active {
            background-color: #ebebeb;
        }

        &:hover {
            background-color: #f5f5f5;
        }

        .imgbx {
            position: relative;
            width: 45px;
            height: 45px;
        }
    }
}

.img-text {
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
}

.imgbx img,
.img-text img {
    border-radius: 50%;
}

.details {
    display: flex;
    align-items: center;
    margin: 10px 0 10px 20px;

    &.online::before {
        margin-right: 10px;
        content: '';
        display: inline-block;
        background-color: #00ff00;
        height: 5px;
        width: 5px;
        border-radius: 50%;
    }

    &.offline::before {
        margin-right: 10px;
        content: '';
        display: inline-block;
        background-color: #ff2800;
        height: 10px;
        width: 10px;
        border-radius: 50%;
    }
}
</style>
