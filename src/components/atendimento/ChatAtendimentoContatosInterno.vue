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

<script>
export default {
    name: 'ChatAtendimento',

    props: {
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
    },

    data() {
        return {
            id_mensagem: '',
            fone: '',
        }
    },

    watch: {
        mensagens: {
            handler() {
                this.$nextTick(() => {
                    this.scrollToBottom()
                })
            },

            deep: true,
        },
    },

    mounted() {
        this.scrollToBottom()
    },

    updated() {
        this.$nextTick(() => {
            this.scrollToBottom()
        })
    },

    methods: {
        scrollToBottom() {
            const container = this.$refs.chatContainer

            if (container) {
                container.scrollTop = container.scrollHeight
            }
        },
    },
}
</script>

<style scoped>
.box-opcoes {
    display: none !important;
    background-color: #fff;
    z-index: 5;
    position: absolute;
    right: 1%;
    top: -130px;
    width: 200px;
    padding: 20px;
    /* gap: 20px; */
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.box-opcoes.on {
    display: block !important;
}

.user_foto {
    border-radius: 50%;

    width: 45px !important;
    height: 45px !important;
}
.cursor-pointer {
    cursor: pointer;
}
.message .vcard {
    position: relative;
    right: 0;
    padding: 15px 20px;
    background-color: #efefef;
    border-radius: 10px;
    font-size: 0.9rem;
    word-break: break-all;

    display: flex;
    flex-direction: column;
}
.box_abre_selecoes {
    position: absolute;
    right: 0;
    top: 0;
}
.abrir-selecoes {
    position: absolute;
    top: 4px;

    right: 8px;
}

/* .pd-2 {
  cursor: pointer;
  padding: 5px;
} */

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

.chatBox {
    position: relative;
    width: 100%;
    height: 84%;
    padding: 20px;
    overflow-y: auto;
    background-color: #f5f1eb;
}

@media (max-width: 576px) {
    .chatBox {
        height: 82.6%;
    }
}

@media (min-width: 1400px) {
    .chatBox {
        height: 86%;
    }
}

.message {
    margin-top: 10px;
    /* position: relative; */
    display: flex;
    flex-direction: column;
}

.my_message .message-normal,
.my_message .tempo {
    align-self: flex-end;
}

.box-mensagens {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;

    margin: 10px 0;
}
.message .message-normal {
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

.message .select {
    background-color: #efefef;
    position: absolute;
    right: 1%;
    top: 2%;
    overflow: hidden;
    width: 50%;
    font-size: 0.9rem;
}
.message div img {
    object-fit: contain;
    width: 200px;
    height: 150px;
}

.message audio {
    max-width: 90%;
}

.my_message {
    align-self: flex-end;
}

.my_message .message-normal {
    background-color: #d9fdd3;
}

/* .my_message .select {
  background-color: #d9fdd3;
  position: absolute;
  right: 0px;
  top: 2%;
  overflow: hidden;
  width: 50%;
  font-size: 0.9rem;
}
.frnd_message {
  align-items: flex-start;
}
.frnd_message div {
  text-align: left;
} */
</style>
