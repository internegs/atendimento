<template>
    <div class="chat-list">
        <div
            v-if="lista.length === 0"
            class="block pe-none"
        >
            Não há contatos a ser atendido
        </div>

        <div
            v-for="contato in lista"
            :key="contato.id"
            class="block"
            :class="{ active: ativado === contato.id }"
            @click="selecionarContato(contato)"
        >
            <div class="imgbx">
                <i
                    v-if="hasPhotoError(contato.id)"
                    class="fas fa-user-circle"
                    style="font-size: 45px; color: #ccc"
                ></i>

                <img
                    v-else
                    :src="contato.foto"
                    alt="Foto perfil"
                    @error="setPhotoError(contato.id)"
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
                        v-for="(val, key) in qtdNovaMensagem"
                        :key="key"
                    >
                        <span
                            v-if="key === contato.fone"
                            class="badge bg-warning rounded-pill"
                        >
                            {{ val }}
                        </span>
                    </span>
                </div>

                <div
                    v-if="tipo && (tipo === 1 || tipo === '1')"
                    class="name text-danger"
                    style="font-size: 0.7rem"
                >
                    {{ contato.nome_atendente }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

defineOptions({ name: 'ListaAtendimento' })

const props = defineProps({
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
    qtdNovaMensagem: {
        type: Object,
    },
})

const emit = defineEmits(['contato-selecionado'])

const errorPhotoList = ref([])

function setPhotoError(contatoId) {
    if (!errorPhotoList.value.includes(contatoId)) {
        errorPhotoList.value.push(contatoId)
    }
}

function hasPhotoError(contatoId) {
    return errorPhotoList.value.includes(contatoId)
}

function maskPhone(value) {
    if (!value || value.length === 0) return value

    if (value.length > 13) {
        if (value?.includes('+')) {
            return `${value.slice(1, 3)} (${value.slice(3, 5)}) ${value.slice(5, 6)} ${value.slice(6, 10)}-${value.slice(10)}`
        }

        return value
    }

    return `+${value.slice(0, 2)} (${value.slice(2, 4)}) ${value.slice(4, 5)} ${value.slice(5, 9)}-${value.slice(9)}`
}

function selecionarContato(contato) {
    emit('contato-selecionado', { usuario: contato })
}

watch(
    () => props.lista,
    newVal => {
        if (newVal && Array.isArray(newVal)) {
            errorPhotoList.value = newVal
                .filter(contato => !contato.foto || contato.foto === '' || contato.foto === null)
                .map(contato => contato.id)
        }
    },
    { immediate: true }
)
</script>

<style lang="scss" scoped>
img {
    max-width: 100%;
}

.chat-list {
    position: relative;
    height: 99%;
    overflow-y: auto;

    .block {
        position: relative;
        width: 100%;
        display: flex;
        align-items: center;
        padding: 10px 15px;
        gap: 0.5rem;
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

            img {
                border-radius: 50%;
            }
        }

        .details {
            margin-left: 10px;
        }
    }
}
</style>
