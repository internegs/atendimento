<template>
    <div
        v-if="status"
        ref="chatContainer"
        class="chatBox"
        :class="estadoResponderMensagem ? 'layoutResponderAlturaTeclado' : ''"
    >
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
                    @mouseenter="onBoxOpt($event, mensagem.message_id)"
                    @mouseleave="onBoxOpt($event, mensagem.message_id)"
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
                            v-if="
                                !estadoEncaminharMensagens && showBoxOptIcon === mensagem.message_id
                            "
                            class="pd-2 cursor-pointer box_abre_selecoes"
                            @click="handleBoxOpt(mensagem.message_id)"
                        >
                            <i class="fa-solid fa-chevron-down abrir-selecoes"></i>
                            <div
                                v-if="openBoxOpt === mensagem.message_id"
                                ref="boxOpt"
                                class="box-opcoes"
                            >
                                <span
                                    v-for="(opcoes, index) in option"
                                    :key="index"
                                    class="d-block"
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
                    <div
                        class="message-normal"
                        @mouseenter="onBoxOpt($event, mensagem.message_id)"
                        @mouseleave="onBoxOpt($event, mensagem.message_id)"
                    >
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
                                v-if="
                                    !estadoEncaminharMensagens &&
                                    showBoxOptIcon === mensagem.message_id
                                "
                                class="pd-2 cursor-pointer box_abre_selecoes"
                                @click="handleBoxOpt(mensagem.message_id)"
                            >
                                <i class="fa-solid fa-chevron-down abrir-selecoes"></i>

                                <div
                                    v-if="openBoxOpt === mensagem.message_id"
                                    ref="boxOpt"
                                    class="box-opcoes"
                                >
                                    <span
                                        v-for="(opcoes, index) in option"
                                        :key="index"
                                        class="d-block"
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
                    <div
                        class="message-normal"
                        @mouseenter="onBoxOpt($event, mensagem.message_id)"
                        @mouseleave="onBoxOpt($event, mensagem.message_id)"
                    >
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
                                v-if="
                                    !estadoEncaminharMensagens &&
                                    showBoxOptIcon === mensagem.message_id
                                "
                                class="pd-2 cursor-pointer box_abre_selecoes"
                                @click="handleBoxOpt(mensagem.message_id)"
                            >
                                <i class="fa-solid fa-chevron-down abrir-selecoes"></i>

                                <div
                                    v-if="openBoxOpt === mensagem.message_id"
                                    ref="boxOpt"
                                    class="box-opcoes"
                                >
                                    <span
                                        v-for="(opcoes, index) in option"
                                        :key="index"
                                        class="d-block"
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
                    @mouseenter="onBoxOpt($event, mensagem.message_id)"
                    @mouseleave="onBoxOpt($event, mensagem.message_id)"
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
                            v-if="
                                !estadoEncaminharMensagens && showBoxOptIcon === mensagem.message_id
                            "
                            class="pd-2 cursor-pointer box_abre_selecoes"
                            @click="handleBoxOpt(mensagem.message_id)"
                        >
                            <i class="fa-solid fa-chevron-down abrir-selecoes"></i>
                            <div
                                v-if="openBoxOpt === mensagem.message_id"
                                ref="boxOpt"
                                class="box-opcoes"
                            >
                                <span
                                    v-for="(opcoes, index) in option"
                                    :key="index"
                                    class="d-block"
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
                    @mouseenter="onBoxOpt($event, mensagem.message_id)"
                    @mouseleave="onBoxOpt($event, mensagem.message_id)"
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
                            v-if="
                                !estadoEncaminharMensagens && showBoxOptIcon === mensagem.message_id
                            "
                            class="pd-2 cursor-pointer box_abre_selecoes"
                            @click="handleBoxOpt(mensagem.message_id)"
                        >
                            <i class="fa-solid fa-chevron-down abrir-selecoes"></i>
                            <div
                                v-if="openBoxOpt === mensagem.message_id"
                                ref="boxOpt"
                                class="box-opcoes"
                            >
                                <span
                                    v-for="(opcoes, index) in option"
                                    :key="index"
                                    class="d-block"
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
                                v-if="
                                    !estadoEncaminharMensagens &&
                                    showBoxOptIcon === mensagem.message_id
                                "
                                class="pd-2 cursor-pointer box_abre_selecoes"
                                @click="handleBoxOpt(mensagem.message_id)"
                            >
                                <i class="fa-solid fa-chevron-down abrir-selecoes"></i>
                                <div
                                    v-if="openBoxOpt === mensagem.message_id"
                                    ref="boxOpt"
                                    class="box-opcoes"
                                >
                                    <span
                                        v-for="(opcoes, index) in option"
                                        :key="index"
                                        class="d-block"
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
                    @mouseenter="onBoxOpt($event, mensagem.message_id)"
                    @mouseleave="onBoxOpt($event, mensagem.message_id)"
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
                            v-if="
                                !estadoEncaminharMensagens && showBoxOptIcon === mensagem.message_id
                            "
                            class="pd-2 cursor-pointer box_abre_selecoes"
                            @click="handleBoxOpt(mensagem.message_id)"
                        >
                            <i class="fa-solid fa-chevron-down abrir-selecoes"></i>
                            <div
                                v-if="openBoxOpt === mensagem.message_id"
                                ref="boxOpt"
                                class="box-opcoes"
                            >
                                <span
                                    v-for="(opcoes, index) in option"
                                    :key="index"
                                    class="d-block"
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
                    @mouseenter="onBoxOpt($event, mensagem.message_id)"
                    @mouseleave="onBoxOpt($event, mensagem.message_id)"
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
                            v-if="
                                !estadoEncaminharMensagens && showBoxOptIcon === mensagem.message_id
                            "
                            class="pd-2 cursor-pointer box_abre_selecoes"
                            @click="handleBoxOpt(mensagem.message_id)"
                        >
                            <i class="fa-solid fa-chevron-down abrir-selecoes"></i>
                            <div
                                v-if="openBoxOpt === mensagem.message_id"
                                ref="boxOpt"
                                class="box-opcoes"
                            >
                                <span
                                    v-for="(opcoes, index) in option"
                                    :key="index"
                                    class="d-block"
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
                    @mouseenter="onBoxOpt($event, mensagem.message_id)"
                    @mouseleave="onBoxOpt($event, mensagem.message_id)"
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
                            v-if="
                                !estadoEncaminharMensagens && showBoxOptIcon === mensagem.message_id
                            "
                            class="pd-2 cursor-pointer box_abre_selecoes"
                            @click="handleBoxOpt(mensagem.message_id)"
                        >
                            <i class="fa-solid fa-chevron-down abrir-selecoes"></i>
                            <div
                                v-if="openBoxOpt === mensagem.message_id"
                                ref="boxOpt"
                                class="box-opcoes"
                            >
                                <span
                                    v-for="(opcoes, index) in option"
                                    :key="index"
                                    class="d-block"
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
                    @mouseenter="onBoxOpt($event, mensagem.message_id)"
                    @mouseleave="onBoxOpt($event, mensagem.message_id)"
                >
                    <span
                        v-if="mensagem.status == 'DELETED'"
                        class="cinza"
                    >
                        Vídeo apagado
                    </span>

                    <div
                        v-if="mensagem.status != 'DELETED'"
                        class="video-wrapper"
                    >
                        <button
                            type="button"
                            @click="
                                $emit('handleMedia', {
                                    url: mensagem.url_link,
                                    userName: mensagem.name,
                                    type: mensagem.type,
                                    wook: mensagem.wook,
                                })
                            "
                        >
                            <video
                                :src="mensagem.url_link"
                                muted
                                preload="metadata"
                            ></video>
                        </button>

                        <p
                            v-if="mensagem.mensagem"
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
                            v-if="
                                !estadoEncaminharMensagens && showBoxOptIcon === mensagem.message_id
                            "
                            class="pd-2 cursor-pointer box_abre_selecoes"
                            @click="handleBoxOpt(mensagem.message_id)"
                        >
                            <i class="fa-solid fa-chevron-down abrir-selecoes"></i>

                            <div
                                v-if="openBoxOpt === mensagem.message_id"
                                ref="boxOpt"
                                class="box-opcoes"
                            >
                                <span
                                    v-for="(opcoes, index) in option"
                                    :key="index"
                                    class="d-block"
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
                </div>

                <div
                    v-if="mensagem.type === 'image'"
                    class="message-normal"
                    @mouseenter="onBoxOpt($event, mensagem.message_id)"
                    @mouseleave="onBoxOpt($event, mensagem.message_id)"
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
                                    type: mensagem.type,
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
                            v-if="
                                !estadoEncaminharMensagens && showBoxOptIcon === mensagem.message_id
                            "
                            class="pd-2 cursor-pointer box_abre_selecoes"
                            @click="handleBoxOpt(mensagem.message_id)"
                        >
                            <i class="fa-solid fa-chevron-down abrir-selecoes"></i>
                            <div
                                v-if="openBoxOpt === mensagem.message_id"
                                ref="boxOpt"
                                class="box-opcoes"
                            >
                                <span
                                    v-for="(opcoes, index) in option"
                                    :key="index"
                                    class="d-block"
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
                    @mouseenter="onBoxOpt($event, mensagem.message_id)"
                    @mouseleave="onBoxOpt($event, mensagem.message_id)"
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

                        <!-- {{ teste(mensagem) }} -->

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
                            v-if="
                                !estadoEncaminharMensagens && showBoxOptIcon === mensagem.message_id
                            "
                            class="pd-2 cursor-pointer box_abre_selecoes"
                            @click="handleBoxOpt(mensagem.message_id)"
                        >
                            <i class="fa-solid fa-chevron-down abrir-selecoes"></i>

                            <div
                                v-if="openBoxOpt === mensagem.message_id"
                                ref="boxOpt"
                                class="box-opcoes"
                            >
                                <span
                                    v-for="(opcoes, index) in option"
                                    :key="index"
                                    class="d-block"
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
                    {{ mensagem.name }} {{ formatDateTime(mensagem.updated_at) }}
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
import { formatDateTime } from '@/utils/formatters'

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

    emits: ['handleMedia'],

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
            openBoxOpt: null,
            showBoxOptIcon: null,
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

    watch: {
        mensagens: {
            handler() {
                this.$nextTick(() => {
                    this.scrollToBottom()
                })
            },
            deep: true,
        },

        openBoxOpt(newValue) {
            if (newValue) {
                document.addEventListener('click', this.handleClickOutsideBoxOpt)

                return
            }

            document.removeEventListener('click', this.handleClickOutsideBoxOpt)
        },
    },

    mounted() {
        this.scrollToBottom()
    },

    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutsideBoxOpt)
    },

    methods: {
        formatDateTime,

        escolhaSelecionado(opcao, id, mensagem) {
            this.openBoxOpt = false

            switch (opcao) {
                case 2:
                    this.abremodal_apagarmensagem(id, mensagem)

                    break

                case 3:
                    this.responderLayout(mensagem, id)

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

        getMessageById(id) {
            if (!id) return null

            console.log(this.mensagens.find(msg => msg.message_id == id) || null)

            return this.mensagens.find(msg => msg.message_id === id) || null
        },

        handleBoxOpt(message_id) {
            this.openBoxOpt = !this.openBoxOpt ? message_id : null
        },

        handleClickOutsideBoxOpt(e) {
            const btnOpt = e.target.closest('.box_abre_selecoes')

            if (!btnOpt) {
                this.openBoxOpt = null
                this.showBoxOptIcon = null
            }
        },

        onBoxOpt(e, message_id) {
            if (!this.openBoxOpt) {
                if (e.type === 'mouseenter') {
                    this.showBoxOptIcon = message_id

                    return
                }

                this.showBoxOptIcon = null
            }
        },

        scrollToBottom() {
            const container = this.$refs.chatContainer

            if (container) {
                container.scrollTop = container.scrollHeight
            }
        },

        teste(value) {
            console.log(value)
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

    color: #616060;
    font-size: 16px;
}

.box-opcoes {
    z-index: 5;
    position: absolute;
    right: 0.5rem;
    top: 1.5rem;
    width: 200px;
    padding: 5px 0;

    background-color: #fff;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.box-opcoes span {
    padding: 10px 20px;
    border-radius: 5px;
    font-weight: 500;

    transition: all 0.2s ease;
}

.box-opcoes span:hover {
    background-color: #f9f9f9;
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
    height: 82%;
    padding: 20px;
    overflow-y: auto;
    background-color: #f5f1eb;
}

@media (max-width: 576px) {
    .chatBox {
        height: 82%;
    }
}

@media (min-width: 1400px) {
    .chatBox {
        height: 83%;
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

.message .message-normal {
    position: relative;
    right: 0;
    max-width: 60%;
    padding: 10px 10px 10px;
    background-color: #fff;
    border-radius: 10px;
    font-size: 0.9rem;
    white-space: pre-line;
    word-break: break-word;
}
.box-mensagens {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    width: 100%;

    margin: 10px 0;
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

.message-normal .video-wrapper {
    max-width: 240px;
    max-height: 300px;
}

.message-normal .video-wrapper video {
    width: 100%;
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
