<template>
    <div
        ref="chatContainer"
        class="chatBox"
    >
        <div
            v-for="(mensagem, index) in mensagens"
            :key="index"
            class="message"
            :class="{ my_message: mensagem.de_chat !== idAtendido }"
        >
            <div
                v-if="mensagem.type === 'text'"
                class="message-normal mb-2"
            >
                {{ mensagem.msg_chat }}
            </div>

            <div
                v-if="mensagem.type === 'sendVideo'"
                class="message-normal"
            >
                <video
                    width="50%"
                    controls
                >
                    <source
                        type="video/mp4"
                        :src="mensagem.link_url"
                    />
                </video>
            </div>

            <div
                v-if="mensagem.type === 'sendAudio'"
                class="message-normal"
            >
                <audio
                    controls="controls"
                    style="max-width: 100%"
                >
                    <source
                        id="audiobase64"
                        :src="mensagem.link_url"
                        controls
                        autoplay
                    />
                </audio>
            </div>

            <div
                v-if="mensagem.type === 'sendFile'"
                class="message-normal"
            >
                <a
                    :href="mensagem.link_url"
                    target="_blank"
                >
                    <button class="btn btn-danger btn-block">
                        Baixar documento
                        <i class="fa fa-download"></i>
                    </button>
                </a>
            </div>

            <div
                v-if="mensagem.type === 'sendImage'"
                class="message-normal mb-2"
            >
                <a
                    :href="mensagem.link_url"
                    target="_blank"
                >
                    <img
                        :src="mensagem.link_url"
                        alt=""
                        class="img-thumbnail"
                    />
                </a>
            </div>

            <div class="tempo">{{ mensagem.nome }} {{ mensagem.data }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUpdated } from 'vue'

defineOptions({ name: 'ChatAtendimentoInterno' })

const props = defineProps({
    mensagens: {
        type: Array,
    },
    idAtendido: {
        type: [Number, String],
    },
    abrirConversa: {
        type: String,
    },
    conversa: {
        type: String,
    },
})

const chatContainer = ref(null)

function scrollToBottom() {
    const container = chatContainer.value

    if (container) {
        container.scrollTop = container.scrollHeight
    }
}

watch(
    () => props.mensagens,
    () => {
        nextTick(() => scrollToBottom())
    },
    { deep: true }
)

onMounted(() => scrollToBottom())

onUpdated(() => {
    nextTick(() => scrollToBottom())
})
</script>

<style lang="scss" scoped>
.user_foto {
    border-radius: 50%;
    width: 45px !important;
    height: 45px !important;
}

.cursor-pointer {
    cursor: pointer;
}

.chatBox {
    position: relative;
    width: 100%;
    height: 84%;
    padding: 20px;
    overflow-y: auto;
    background-color: #f5f1eb;

    @media (max-width: 576px) {
        height: 82.6%;
    }

    @media (min-width: 1400px) {
        height: 86%;
    }

    .message {
        margin-top: 10px;
        display: flex;
        flex-direction: column;

        .message-normal {
            position: relative;
            right: 0;
            max-width: 60%;
            padding: 15px;
            background-color: #efefef;
            border-radius: 10px;
            font-size: 0.9rem;
            white-space: pre-line;
            word-break: break-all;
        }

        .select {
            background-color: #efefef;
            position: absolute;
            right: 1%;
            top: 2%;
            overflow: hidden;
            width: 50%;
            font-size: 0.9rem;
        }

        div img {
            object-fit: contain;
            width: 200px;
            height: 150px;
        }

        audio {
            max-width: 90%;
        }

        .box_abre_selecoes {
            position: absolute;
            right: 0;
            top: 0;

            .abrir-selecoes {
                position: absolute;
                top: 4px;
                right: 8px;
            }
        }

        .vcard-header {
            width: 100%;
            display: flex;
            gap: 20px;
            align-items: center;
            justify-content: space-around;
        }

        .vcard-body {
            text-align: center;
            margin-top: 10px;
        }
    }

    .box-mensagens {
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        margin: 10px 0;
    }

    .my_message {
        align-self: flex-end;

        .message-normal,
        .tempo {
            align-self: flex-end;
        }

        .message-normal {
            background-color: #d9fdd3;
        }
    }

    .box-opcoes {
        display: none !important;
        background-color: #fff;
        z-index: 5;
        position: absolute;
        right: 1%;
        top: -130px;
        width: 200px;
        padding: 20px;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

        &.on {
            display: block !important;
        }
    }
}
</style>
