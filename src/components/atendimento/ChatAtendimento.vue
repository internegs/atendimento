<template>
    <div
        v-if="status"
        ref="chatContainer"
        class="chatBox"
        :class="estadoResponderMensagem ? 'layoutResponderAlturaTeclado' : ''"
    >
        <div
            v-if="abrirBoxOpcoes"
            class="fundo-transparente"
            @click="limparBoxOpcoes"
        ></div>

        <div v-if="processando">Atualizando mensagens...</div>

        <div
            v-for="(mensagem, index) in mensagens"
            :key="index"
            class="message"
            :class="{ my_message: mensagem.fone_enviado !== foneAtendido }"
        >
            <label
                v-if="estadoEncaminharMensagens"
                class="conteiner"
            >
                <input
                    type="checkbox"
                    class="form-check-input selecionarMensagens"
                />
                <span
                    class="checkmark"
                    :data-id="mensagem.message_id"
                    :data-type="mensagem.type"
                    @click="marcarMensagem"
                ></span>
            </label>

            <div class="box-mensagens">
                <div
                    v-if="mensagem.type === 'text'"
                    class="message-normal"
                >
                    <span
                        v-if="mensagem.status == 'DELETED'"
                        class="cinza"
                    >
                        Mensagem apagada
                    </span>

                    <span v-if="mensagem.status != 'DELETED'">
                        {{ mensagem.mensagem }}

                        <div
                            v-if="mensagem.wook == 'onack'"
                            class="alinhadireita"
                        >
                            <i
                                v-if="mensagem.status == 'RECEIVED'"
                                class="fa-solid fa-check-double cinza"
                            ></i>
                            <i
                                v-if="mensagem.status == 'SENT'"
                                class="fa-solid fa-check"
                            ></i>
                            <i
                                v-if="mensagem.status == 'READ'"
                                class="fa-solid fa-check-double text-success"
                            ></i>
                        </div>

                        <div
                            v-if="!estadoEncaminharMensagens"
                            class="pd-2 cursor-pointer box_abre_selecoes"
                            @click="abreSelecoes"
                        >
                            <i class="fa-solid fa-chevron-down abrir-selecoes"></i>
                            <div class="box-opcoes">
                                <span
                                    v-for="(opcoes, index) in option"
                                    :key="index"
                                    class="d-block mb-2"
                                    @click="
                                        escolhaSelecionado(
                                            opcoes.id,
                                            mensagem.message_id,
                                            mensagem.mensagem
                                        )
                                    "
                                >
                                    {{ opcoes.msg }}
                                </span>
                            </div>
                        </div>
                    </span>
                </div>

                <div
                    v-if="mensagem.type === 'button'"
                    class="message-wrapper"
                >
                    <div class="message-normal">
                        <span
                            v-if="mensagem.status == 'DELETED'"
                            class="cinza"
                        >
                            Mensagem apagada
                        </span>

                        <span v-if="mensagem.status != 'DELETED'">
                            <div>
                                <!-- {{ mensagem.message_id }}<br><br> -->
                            </div>

                            {{
                                parsedMessage(mensagem)?.interactive?.body?.text ||
                                'Mensagem inválida'
                            }}

                            <div
                                v-if="mensagem.wook == 'onack'"
                                class="alinhadireita"
                            >
                                <i
                                    v-if="mensagem.status == 'RECEIVED'"
                                    class="fa-solid fa-check-double cinza"
                                ></i>
                                <i
                                    v-if="mensagem.status == 'SENT'"
                                    class="fa-solid fa-check"
                                ></i>
                                <i
                                    v-if="mensagem.status == 'READ'"
                                    class="fa-solid fa-check-double text-success"
                                ></i>
                            </div>

                            <div
                                v-if="!estadoEncaminharMensagens"
                                class="pd-2 cursor-pointer box_abre_selecoes"
                                @click="abreSelecoes"
                            >
                                <i class="fa-solid fa-chevron-down abrir-selecoes"></i>

                                <div class="box-opcoes">
                                    <span
                                        v-for="(opcoes, index) in option"
                                        :key="index"
                                        class="d-block mb-2"
                                        @click="
                                            escolhaSelecionado(
                                                opcoes.id,
                                                mensagem.message_id,
                                                mensagem.mensagem
                                            )
                                        "
                                    >
                                        {{ opcoes.msg }}
                                    </span>
                                </div>
                            </div>
                        </span>
                    </div>

                    <div class="message-buttons">
                        <button
                            v-for="(btn, index) in parsedMessage(mensagem)?.interactive?.action
                                ?.buttons || []"
                            :key="index"
                            @click="getMessageById(mensagem)"
                        >
                            <span v-text="btn.reply.title"></span>
                        </button>
                    </div>
                </div>

                <div
                    v-if="mensagem.type === 'list'"
                    class="message-wrapper-list"
                >
                    <div class="message-normal">
                        <span
                            v-if="mensagem.status == 'DELETED'"
                            class="cinza"
                        >
                            Mensagem apagada
                        </span>

                        <span v-if="mensagem.status != 'DELETED'">
                            {{
                                parsedMessage(mensagem)?.interactive?.body?.text ||
                                'Mensagem inválida'
                            }}

                            <div
                                v-if="mensagem.wook == 'onack'"
                                class="alinhadireita"
                            >
                                <i
                                    v-if="mensagem.status == 'RECEIVED'"
                                    class="fa-solid fa-check-double cinza"
                                ></i>
                                <i
                                    v-if="mensagem.status == 'SENT'"
                                    class="fa-solid fa-check"
                                ></i>
                                <i
                                    v-if="mensagem.status == 'READ'"
                                    class="fa-solid fa-check-double text-success"
                                ></i>
                            </div>

                            <div
                                v-if="!estadoEncaminharMensagens"
                                class="pd-2 cursor-pointer box_abre_selecoes"
                                @click="abreSelecoes"
                            >
                                <i class="fa-solid fa-chevron-down abrir-selecoes"></i>

                                <div class="box-opcoes">
                                    <span
                                        v-for="(opcoes, index) in option"
                                        :key="index"
                                        class="d-block mb-2"
                                        @click="
                                            escolhaSelecionado(
                                                opcoes.id,
                                                mensagem.message_id,
                                                mensagem.mensagem
                                            )
                                        "
                                    >
                                        {{ opcoes.msg }}
                                    </span>
                                </div>
                            </div>
                        </span>
                    </div>

                    <div class="message-container">
                        <div class="message-select">
                            <select
                                id="option-list"
                                name="optionSelected"
                            >
                                <option
                                    class="opt-default"
                                    value="#"
                                    disabled
                                    selected
                                >
                                    Escolha uma opção
                                </option>

                                <option
                                    v-for="(opt, i) in parsedMessage(mensagem)?.interactive?.action
                                        ?.sections[0]?.rows || []"
                                    :key="i"
                                    :value="opt.id"
                                >
                                    {{ opt.title }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                <div
                    v-if="mensagem.type === 'button_reply'"
                    class="message-normal"
                >
                    <!-- <div class="message-replied">
                        {{
                            parsedMessage(mensagem)?.entry[0]?.changes[0]?.value?.messages[0]
                                ?.context?.id || 'Mensagem inválida'
                        }}
                    </div> -->

                    <span
                        v-if="mensagem.status == 'DELETED'"
                        class="cinza"
                    >
                        Mensagem apagada
                    </span>

                    <span v-if="mensagem.status != 'DELETED'">
                        {{
                            parsedMessage(mensagem)?.entry[0]?.changes[0]?.value?.messages[0]
                                ?.interactive?.button_reply?.title || 'Mensagem inválida'
                        }}

                        <div
                            v-if="mensagem.wook == 'onack'"
                            class="alinhadireita"
                        >
                            <i
                                v-if="mensagem.status == 'RECEIVED'"
                                class="fa-solid fa-check-double cinza"
                            ></i>
                            <i
                                v-if="mensagem.status == 'SENT'"
                                class="fa-solid fa-check"
                            ></i>
                            <i
                                v-if="mensagem.status == 'READ'"
                                class="fa-solid fa-check-double text-success"
                            ></i>
                        </div>

                        <div
                            v-if="!estadoEncaminharMensagens"
                            class="pd-2 cursor-pointer box_abre_selecoes"
                            @click="abreSelecoes"
                        >
                            <i class="fa-solid fa-chevron-down abrir-selecoes"></i>
                            <div class="box-opcoes">
                                <span
                                    v-for="(opcoes, index) in option"
                                    :key="index"
                                    class="d-block mb-2"
                                    @click="
                                        escolhaSelecionado(
                                            opcoes.id,
                                            mensagem.message_id,
                                            mensagem.mensagem
                                        )
                                    "
                                >
                                    {{ opcoes.msg }}
                                </span>
                            </div>
                        </div>
                    </span>
                </div>

                <div
                    v-if="mensagem.type === 'list_reply'"
                    class="message-normal"
                >
                    <span
                        v-if="mensagem.status == 'DELETED'"
                        class="cinza"
                    >
                        Mensagem apagada
                    </span>

                    <span v-if="mensagem.status != 'DELETED'">
                        {{
                            parsedMessage(mensagem)?.entry[0]?.changes[0]?.value?.messages[0]
                                ?.interactive?.list_reply?.title || 'Mensagem inválida'
                        }}

                        <div
                            v-if="mensagem.wook == 'onack'"
                            class="alinhadireita"
                        >
                            <i
                                v-if="mensagem.status == 'RECEIVED'"
                                class="fa-solid fa-check-double cinza"
                            ></i>
                            <i
                                v-if="mensagem.status == 'SENT'"
                                class="fa-solid fa-check"
                            ></i>
                            <i
                                v-if="mensagem.status == 'READ'"
                                class="fa-solid fa-check-double text-success"
                            ></i>
                        </div>

                        <div
                            v-if="!estadoEncaminharMensagens"
                            class="pd-2 cursor-pointer box_abre_selecoes"
                            @click="abreSelecoes"
                        >
                            <i class="fa-solid fa-chevron-down abrir-selecoes"></i>
                            <div class="box-opcoes">
                                <span
                                    v-for="(opcoes, index) in option"
                                    :key="index"
                                    class="d-block mb-2"
                                    @click="
                                        escolhaSelecionado(
                                            opcoes.id,
                                            mensagem.message_id,
                                            mensagem.mensagem
                                        )
                                    "
                                >
                                    {{ opcoes.msg }}
                                </span>
                            </div>
                        </div>
                    </span>
                </div>

                <div
                    v-if="mensagem.type === 'vcard'"
                    class="vcard message-normal"
                >
                    <span
                        v-if="mensagem.status == 'DELETED'"
                        class="cinza"
                    >
                        Mensagem apagada
                    </span>

                    <span v-if="mensagem.status != 'DELETED'">
                        <div class="vcard-header">
                            <img
                                src="@/assets/default.png"
                                alt=""
                                class="user_foto"
                            />
                            {{ mensagem.contactName }}
                            <br />
                            {{ mensagem.mensagem }}
                            <div
                                v-if="mensagem.wook == 'onack'"
                                class="alinhadireita"
                            >
                                <i
                                    v-if="mensagem.status == 'RECEIVED'"
                                    class="fa-solid fa-check-double cinza"
                                ></i>
                                <i
                                    v-if="mensagem.status == 'SENT'"
                                    class="fa-solid fa-check"
                                ></i>
                                <i
                                    v-if="mensagem.status == 'READ'"
                                    class="fa-solid fa-check-double text-success"
                                ></i>
                            </div>

                            <div
                                v-if="!estadoEncaminharMensagens"
                                class="pd-2 cursor-pointer box_abre_selecoes"
                                @click="abreSelecoes"
                            >
                                <i class="fa-solid fa-chevron-down abrir-selecoes"></i>
                                <div class="box-opcoes">
                                    <span
                                        v-for="(opcoes, index) in option"
                                        :key="index"
                                        class="d-block mb-2"
                                        @click="
                                            escolhaSelecionado(
                                                opcoes.id,
                                                mensagem.message_id,
                                                mensagem.mensagem
                                            )
                                        "
                                    >
                                        {{ opcoes.msg }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="vcard-body">
                            <button
                                class="conversar"
                                @click="abrirConversa(mensagem)"
                            >
                                Conversar
                            </button>
                        </div>
                    </span>
                </div>

                <div
                    v-if="mensagem.type === 'audio' || mensagem.type === 'ptt'"
                    class="message-normal"
                >
                    <span
                        v-if="mensagem.status == 'DELETED'"
                        class="cinza"
                    >
                        Audio apagado
                    </span>

                    <span v-if="mensagem.status != 'DELETED'">
                        <audio
                            controls="controls"
                            style="max-width: 100%"
                        >
                            <source
                                id="audiobase64"
                                :src="mensagem.url_link"
                                controls
                                autoplay
                            />
                        </audio>

                        <div
                            v-if="mensagem.wook == 'onack'"
                            class="alinhadireita"
                        >
                            <i
                                v-if="mensagem.status == 'RECEIVED'"
                                class="fa-solid fa-check-double cinza"
                            ></i>
                            <i
                                v-if="mensagem.status == 'SENT'"
                                class="fa-solid fa-check"
                            ></i>
                            <i
                                v-if="mensagem.status == 'READ'"
                                class="fa-solid fa-check-double text-success"
                            ></i>
                        </div>

                        <div
                            v-if="!estadoEncaminharMensagens"
                            class="pd-2 cursor-pointer box_abre_selecoes"
                            @click="abreSelecoes"
                        >
                            <i class="fa-solid fa-chevron-down abrir-selecoes"></i>
                            <div class="box-opcoes">
                                <span
                                    v-for="(opcoes, index) in option"
                                    :key="index"
                                    class="d-block mb-2"
                                    @click="
                                        escolhaSelecionado(
                                            opcoes.id,
                                            mensagem.message_id,
                                            mensagem.mensagem
                                        )
                                    "
                                >
                                    {{ opcoes.msg }}
                                </span>
                            </div>
                        </div>
                    </span>
                </div>

                <div
                    v-if="mensagem.type === 'sticker'"
                    class="message-normal"
                >
                    <span
                        v-if="mensagem.status == 'DELETED'"
                        class="cinza"
                    >
                        Mensagem apagada
                    </span>

                    <span v-if="mensagem.status != 'DELETED'">
                        <img
                            :src="mensagem.url_link"
                            class="img-thumbnail"
                        />
                        <div
                            v-if="mensagem.wook == 'onack'"
                            class="alinhadireita"
                        >
                            <i
                                v-if="mensagem.status == 'RECEIVED'"
                                class="fa-solid fa-check-double cinza"
                            ></i>
                            <i
                                v-if="mensagem.status == 'SENT'"
                                class="fa-solid fa-check"
                            ></i>
                            <i
                                v-if="mensagem.status == 'READ'"
                                class="fa-solid fa-check-double text-success"
                            ></i>
                        </div>

                        <div
                            v-if="!estadoEncaminharMensagens"
                            class="pd-2 cursor-pointer box_abre_selecoes"
                            @click="abreSelecoes"
                        >
                            <i class="fa-solid fa-chevron-down abrir-selecoes"></i>
                            <div class="box-opcoes">
                                <span
                                    v-for="(opcoes, index) in option"
                                    :key="index"
                                    class="d-block mb-2"
                                    @click="
                                        escolhaSelecionado(
                                            opcoes.id,
                                            mensagem.message_id,
                                            mensagem.mensagem
                                        )
                                    "
                                >
                                    {{ opcoes.msg }}
                                </span>
                            </div>
                        </div>
                    </span>
                </div>

                <div
                    v-if="mensagem.type === 'link'"
                    class="message-normal"
                >
                    <span
                        v-if="mensagem.status == 'DELETED'"
                        class="cinza"
                    >
                        Mensagem apagada
                    </span>
                    <span v-if="mensagem.status != 'DELETED'">
                        >{{ mensagem.mensagem }}
                        <div
                            v-if="mensagem.wook == 'onack'"
                            class="alinhadireita"
                        >
                            <i
                                v-if="mensagem.status == 'RECEIVED'"
                                class="fa-solid fa-check-double cinza"
                            ></i>
                            <i
                                v-if="mensagem.status == 'SENT'"
                                class="fa-solid fa-check"
                            ></i>
                            <i
                                v-if="mensagem.status == 'READ'"
                                class="fa-solid fa-check-double text-success"
                            ></i>
                        </div>

                        <div
                            v-if="!estadoEncaminharMensagens"
                            class="pd-2 cursor-pointer box_abre_selecoes"
                            @click="abreSelecoes"
                        >
                            <i class="fa-solid fa-chevron-down abrir-selecoes"></i>
                            <div class="box-opcoes">
                                <span
                                    v-for="(opcoes, index) in option"
                                    :key="index"
                                    class="d-block mb-2"
                                    @click="
                                        escolhaSelecionado(
                                            opcoes.id,
                                            mensagem.message_id,
                                            mensagem.mensagem
                                        )
                                    "
                                >
                                    {{ opcoes.msg }}
                                </span>
                            </div>
                        </div>
                    </span>
                </div>

                <div
                    v-if="mensagem.type === 'video'"
                    class="message-normal"
                >
                    <span
                        v-if="mensagem.status == 'DELETED'"
                        class="cinza"
                    >
                        Vídeo apagado
                    </span>
                    <span v-if="mensagem.status != 'DELETED'">
                        <video
                            width="50%"
                            controls
                        >
                            <source
                                type="video/mp4"
                                :src="mensagem.url_link"
                            />
                        </video>

                        <p
                            style="padding-top: 1rem"
                            v-text="mensagem.mensagem"
                        ></p>

                        <div
                            v-if="mensagem.wook == 'onack'"
                            class="alinhadireita"
                        >
                            <i
                                v-if="mensagem.status == 'RECEIVED'"
                                class="fa-solid fa-check-double cinza"
                            ></i>
                            <i
                                v-if="mensagem.status == 'SENT'"
                                class="fa-solid fa-check"
                            ></i>
                            <i
                                v-if="mensagem.status == 'READ'"
                                class="fa-solid fa-check-double text-success"
                            ></i>
                        </div>
                        <div
                            v-if="!estadoEncaminharMensagens"
                            class="pd-2 cursor-pointer box_abre_selecoes"
                            @click="abreSelecoes"
                        >
                            <i class="fa-solid fa-chevron-down abrir-selecoes"></i>
                            <div class="box-opcoes">
                                <span
                                    v-for="(opcoes, index) in option"
                                    :key="index"
                                    class="d-block mb-2"
                                    @click="
                                        escolhaSelecionado(
                                            opcoes.id,
                                            mensagem.message_id,
                                            mensagem.mensagem
                                        )
                                    "
                                >
                                    {{ opcoes.msg }}
                                </span>
                            </div>
                        </div>
                    </span>
                </div>

                <div
                    v-if="mensagem.type === 'image'"
                    class="message-normal"
                >
                    <span
                        v-if="mensagem.status == 'DELETED'"
                        class="cinza"
                    >
                        Imagem apagada
                    </span>

                    <span v-if="mensagem.status != 'DELETED'">
                        <button
                            @click="
                                $emit('handleMedia', {
                                    url: mensagem.url_link,
                                    userName: mensagem.name,
                                    wook: mensagem.wook,
                                })
                            "
                        >
                            <img
                                :src="mensagem.url_link"
                                alt=""
                                class="img-thumbnail"
                            />
                        </button>

                        <br />

                        <div
                            v-if="mensagem.wook == 'onack'"
                            class="alinhadireita"
                        >
                            <i
                                v-if="mensagem.status == 'RECEIVED'"
                                class="fa-solid fa-check-double cinza"
                            ></i>
                            <i
                                v-if="mensagem.status == 'SENT'"
                                class="fa-solid fa-check"
                            ></i>
                            <i
                                v-if="mensagem.status == 'READ'"
                                class="fa-solid fa-check-double text-success"
                            ></i>
                        </div>

                        <div
                            v-if="!estadoEncaminharMensagens"
                            class="pd-2 cursor-pointer box_abre_selecoes"
                            @click="abreSelecoes"
                        >
                            <i class="fa-solid fa-chevron-down abrir-selecoes"></i>
                            <div class="box-opcoes">
                                <span
                                    v-for="(opcoes, index) in option"
                                    :key="index"
                                    class="d-block mb-2"
                                    @click="
                                        escolhaSelecionado(
                                            opcoes.id,
                                            mensagem.message_id,
                                            mensagem.mensagem
                                        )
                                    "
                                >
                                    {{ opcoes.msg }}
                                </span>
                            </div>
                        </div>
                    </span>
                </div>

                <div
                    v-if="mensagem.type === 'document'"
                    class="message-normal"
                >
                    <span
                        v-if="mensagem.status == 'DELETED'"
                        class="cinza"
                    >
                        Documento deletado
                    </span>
                    <span v-if="mensagem.status != 'DELETED'">
                        <a
                            :href="mensagem.url_link"
                            target="_blank"
                            :download="mensagem.url_link"
                        >
                            <button class="btn btn-danger btn-block">
                                Baixar documento
                                <i class="fa fa-download"></i>
                            </button>
                        </a>
                        <div
                            v-if="mensagem.wook == 'onack'"
                            class="alinhadireita"
                        >
                            <i
                                v-if="mensagem.status == 'RECEIVED'"
                                class="fa-solid fa-check-double cinza"
                            ></i>
                            <i
                                v-if="mensagem.status == 'SENT'"
                                class="fa-solid fa-check"
                            ></i>
                            <i
                                v-if="mensagem.status == 'READ'"
                                class="fa-solid fa-check-double text-success"
                            ></i>
                        </div>
                        <div
                            v-if="!estadoEncaminharMensagens"
                            class="pd-2 cursor-pointer box_abre_selecoes"
                            @click="abreSelecoes"
                        >
                            <i class="fa-solid fa-chevron-down abrir-selecoes"></i>
                            <div class="box-opcoes">
                                <span
                                    v-for="(opcoes, index) in option"
                                    :key="index"
                                    class="d-block mb-2"
                                    @click="
                                        escolhaSelecionado(
                                            opcoes.id,
                                            mensagem.message_id,
                                            mensagem.mensagem
                                        )
                                    "
                                >
                                    {{ opcoes.msg }}
                                </span>
                            </div>
                        </div>
                    </span>
                </div>

                <span
                    class="info mt-2"
                    style="font-size: 0.7rem"
                >
                    {{ mensagem.name }} {{ mensagem.updated_at }}
                </span>
            </div>
        </div>
    </div>

    <div
        v-else
        ref="chatContainer"
        class="chatBox"
    >
        <h1>
            {{ mensagens }}
        </h1>
    </div>
</template>

<script>
export default {
    name: 'ChatAtendimento',

    props: {
        mensagens: {
            type: [Array, String],
        },
        processando: {
            type: Boolean,
        },
        status: {
            type: Boolean,
        },
        foneAtendido: {
            type: [String, Number],
        },
        conversa: {
            type: String,
        },
        estadoEncaminharMensagens: {
            type: Boolean,
        },
        alterarLayoutBatePapo: {
            type: Function,
        },

        abremodal_apagarmensagem: {
            type: Function,
        },
        estadoResponderMensagem: {
            type: Boolean,
        },
        responderLayout: {
            type: Function,
        },
        listaMensagensSelecionadas: {
            type: Array,
        },
        abrirConversa: {
            type: Function,
        },
    },

    data() {
        return {
            mostrar: '',

            option: [
                {
                    id: 2,
                    msg: 'Apagar mensagem',
                },
                {
                    id: 3,
                    msg: 'Responder ',
                },
            ],

            id_mensagem: '',

            fone: '',

            abrirBoxOpcoes: false,
        }
    },

    computed: {
        parsedMessage() {
            return mensagem => {
                if (
                    mensagem.status !== 'DELETED' &&
                    mensagem.mensagem &&
                    typeof mensagem.mensagem === 'string'
                ) {
                    try {
                        return JSON.parse(mensagem.mensagem)
                    } catch (error) {
                        return null
                    }
                }

                return null
            }
        },
    },

    emits: ['handleMedia'],

    mounted() {
        this.scrollToBottom()
    },

    updated() {
        this.$nextTick(() => {
            this.scrollToBottom()
        })
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

    methods: {
        abreSelecoes(e) {
            this.limparBoxOpcoes()

            this.abrirBoxOpcoes = true

            let elemento = e.target
            let elementoPai = elemento.parentNode
            this.boxElementoPai = elementoPai

            if (!elementoPai.classList.contains('box_abre_selecoes')) {
                let NovoElementoPai = elementoPai.parentNode

                elementoPai = NovoElementoPai
                this.boxElementoPai = NovoElementoPai
            }

            let box_opcoes = elementoPai.querySelector('.box-opcoes')

            box_opcoes.classList.add('on')
        },

        escolhaSelecionado(opcao, id, mensagem) {
            this.abrirBoxOpcoes = false

            switch (opcao) {
                case 2:
                    this.abremodal_apagarmensagem(id, mensagem)
                    this.limparBoxOpcoes()

                    break

                case 3:
                    // console.log("responder");
                    this.responderLayout(mensagem, id)
                    this.limparBoxOpcoes()

                    break

                default:
                    break
            }
        },

        marcarMensagem(e) {
            const labelCheckBox = e.target
            const elementoPai = labelCheckBox.parentNode
            const checkbox = elementoPai.querySelector('.selecionarMensagens')

            const message_id = labelCheckBox.getAttribute('data-id')

            if (checkbox.checked) {
                this.listaMensagensSelecionadas.splice(
                    this.listaMensagensSelecionadas.indexOf(message_id),
                    1
                )
            } else {
                this.listaMensagensSelecionadas.push(message_id)
            }
        },

        limparBoxOpcoes() {
            const box_opcoes = document.querySelectorAll('.box-opcoes')

            for (let i = 0; i < box_opcoes.length; i++) {
                box_opcoes[i].classList.remove('on')
            }
            this.abrirBoxOpcoes = false
        },

        getMessageById(id) {
            if (!id) return null

            console.log(this.mensagens.find(msg => msg.message_id == id) || null)

            return this.mensagens.find(msg => msg.message_id === id) || null
        },

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
.cinza {
    color: darkgray;
}

.alinhadireita {
    text-align: right;
}

.box-opcoes {
    display: none !important;
    background-color: #fff;
    z-index: 5;
    position: absolute;
    right: 0;
    top: 1rem;
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

.layoutResponderAlturaTeclado {
    height: calc(100% - 200px) !important;
}

.selecionarMensagens {
    display: block;
}

.message {
    position: relative;
    display: flex;
    align-items: center;
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
    background-color: #fff;
    border-radius: 10px;
    font-size: 0.9rem;
    white-space: pre-line;
    word-break: break-word;
}

.message .message-wrapper,
.message .message-wrapper-list {
    display: flex;
    flex-direction: column;
    width: 70%;
    gap: 0.5rem;
}

.message-wrapper .message-normal,
.message-wrapper-list .message-normal {
    position: relative;
    right: 0;
    max-width: 100%;
    padding: 15px;
    background-color: #efefef;
    border-radius: 10px;
    font-size: 0.9rem;
    white-space: pre-line;
    word-break: break-word;
}

.message-wrapper .message-buttons,
.message-wrapper-list .message-container {
    display: flex;
    flex-direction: column;
    max-width: 90%;
    gap: 0.5rem;
}

.message-buttons button,
.message-container #option-list {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30%;
    min-width: 230px;
    padding: 0.4rem 0;

    color: #2d3135;
    font-weight: 500;
    border-radius: 0.4rem;
    cursor: pointer;
    transition: transform 150ms ease-in-out;
}

.message-buttons button:hover,
.message-buttons button span:hover {
    transform: scale(1.03);
}

.message-buttons button:active,
.message-buttons button span:active {
    transform: scale(1) translateY(1px);
}

.message-container .message-select {
    display: flex;
    width: fit-content;
    padding: 0 0.5rem;

    background-color: #efefef;
    border-radius: 10px;
}

.message-container .message-select select {
    border: none;
}

#option-list:hover,
.message-select:hover {
    transform: scale(1.01);
}

#option-list option {
    pointer-events: none;
    color: #2d3135;
    border: none;
    background-color: #f9f9f9;
}

.message .select {
    background-color: #efefef;
    border: none;
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

.my_message .box-mensagens,
.my_message .message-wrapper,
.my_message .message-wrapper-list {
    align-items: flex-end;
}

.my_message .message-normal,
.message-wrapper .message-buttons button,
.message-wrapper-list .message-select,
.message-wrapper-list .message-select #option-list {
    background-color: #d9fdd3;
}

.my_message .select {
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

.conteiner {
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.conteiner input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #eee;
    border: solid #68737a;
    cursor: pointer;
}

.conteiner:hover input ~ .checkmark {
    background-color: #ccc;
}

.conteiner input:checked ~ .checkmark {
    background-color: #f58634;
}

.checkmark:after {
    content: '';
    position: absolute;
    display: none;
}

.conteiner input:checked ~ .checkmark:after {
    display: block;
}

.conteiner .checkmark:after {
    left: 5px;
    width: 8px;
    height: 15px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
}

.fundo-transparente {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
}

.conversar {
    background-color: transparent;
    font-size: 1rem;
    font-weight: bold;
}
</style>
