<template>
    <div
        v-if="plano_id === 3"
        class="container-main"
    >
        <h1>Seu plano não possui Zapcenter</h1>
    </div>

    <div v-else-if="loadingPage">
        <progress-bar-screen
            :is-visible="loadingPage"
            :percents="getPercentQtd"
        />
    </div>

    <div
        v-else
        class="container-main"
    >
        <div
            class="box"
            :class="conversaAberta ? 'chatAtivo' : ''"
        >
            <div class="leftSide">
                <div class="header">
                    <button
                        id="btn-fila"
                        class="text-white"
                        @click="selecionarAba($event)"
                    >
                        <div>
                            <span class="fw-bold text-center">FILA</span>

                            <div
                                v-if="fila_qtd"
                                class="badge bg-warning badge-custom"
                            >
                                <span>
                                    {{ fila_qtd }}
                                </span>
                            </div>
                        </div>
                    </button>

                    <button
                        id="btn-atendimentos"
                        class="text-white"
                        @click="selecionarAba($event)"
                    >
                        <div>
                            <span class="fw-bold text-center">MEUS</span>

                            <div
                                v-if="meusatendimentos_qtd"
                                class="badge bg-warning badge-custom"
                            >
                                <span>
                                    {{ meusatendimentos_qtd }}
                                </span>
                            </div>
                            <br />
                        </div>

                        <span class="fw-bold text-center">ATENDIMENTOS</span>
                    </button>

                    <button
                        id="btn-todos"
                        class="text-white"
                        @click="selecionarAba($event)"
                    >
                        <span class="fw-bold text-center">TODOS</span>
                    </button>

                    <button
                        v-tooltip="{
                            title: 'Opções',
                            class: 'tooltip-modern',
                        }"
                        class="btn-opt text-white"
                        @click="dropdownAberto = !dropdownAberto"
                    >
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>

                    <div
                        v-show="dropdownAberto"
                        class="opt-modal"
                    >
                        <ul ref="dropdownContent">
                            <li>
                                <button
                                    id="btn-atendimentos-internos"
                                    @click="(selecionarAba($event), (dropdownAberto = false))"
                                >
                                    <span>Conversas Internas</span>
                                </button>
                            </li>

                            <li>
                                <button
                                    data-bs-toggle="offcanvas"
                                    data-bs-target="#settings"
                                    aria-controls="staticBackdrop"
                                >
                                    <span>Configurações</span>
                                </button>
                            </li>

                            <li>
                                <button @click="sair()">
                                    <span>Sair</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="search autocomplete d-flex flex-column">
                    <div class="d-flex align-items-center gap-2">
                        <span
                            class="icone-pesquisa"
                            :class="novaTransferenciaBanner ? 'layoutNovaTransferencia' : ''"
                        >
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </span>

                        <input
                            id="myInput"
                            v-model="pesquisa"
                            type="text"
                            placeholder="Pesquise Contato"
                            style="flex: 6; color: #4d4f5c"
                            @keyup.enter="pesquisar"
                        />

                        <button
                            v-tooltip="{
                                title: 'Adicionar contato',
                                class: 'tooltip-modern',
                            }"
                            class="btn btn-success text-uppercase fs-1"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#add_user"
                            style="flex: 1"
                        >
                            +
                        </button>
                    </div>

                    <span
                        v-if="novaTransferenciaBanner"
                        class="fw-bold text-warning text-center"
                    >
                        VOCÊ RECEBEU UMA NOVA TRANSFERÊNCIA!
                    </span>

                    <span
                        v-if="novaMensagemInternaBanner"
                        class="fw-bold text-warning text-center"
                    >
                        NOVA MENSAGEM INTERNA!
                    </span>
                </div>

                <template v-if="!listaContatosLoading">
                    <div
                        v-if="listaContatosPesquisa.length > 0"
                        class="contatos"
                    >
                        <!-- Pesquisando contatos -->
                        <lista-atendimentos
                            :lista="listaContatosPesquisa"
                            :ativado="idContatoAtivo"
                            :tipo="tipo_usuario"
                            :novo="notificacao"
                            :qtd-nova-mensagem="qtdNovaMensagem"
                            @contato-selecionado="abrirConversa"
                        />
                    </div>

                    <div
                        v-else
                        class="contatos"
                    >
                        <!-- Listagem de Contatos -->

                        <lista-atendimentos-chat-interno
                            v-if="opcaoSelecionada === 'interno'"
                            :lista="listaContatos.internos"
                            :ativado="idContatoAtivo"
                            :novo-interno="qtdmensagensinternas"
                            @contato-selecionado="abrirConversaChatInterno"
                        />

                        <lista-atendimentos
                            v-else
                            :lista="listaContatosSelecionado"
                            :ativado="idContatoAtivo"
                            :tipo="tipo_usuario"
                            :novo="notificacao"
                            :qtd-nova-mensagem="qtdNovaMensagem"
                            @contato-selecionado="abrirConversa"
                        />
                    </div>
                </template>

                <div
                    v-else
                    class="d-flex justify-content-center mt-4"
                >
                    <div
                        class="spinner-border"
                        role="status"
                    >
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>

            <div
                v-if="conversaAberta"
                class="rightSide"
            >
                <div
                    v-if="isChatInternal"
                    class="chatbox_wrapper d-flex flex-column h-100 w-100"
                >
                    <div class="headerConversation">
                        <div class="perfil-container">
                            <button @click="voltar">
                                <i class="fa-solid fa-chevron-left text-secondary"></i>
                            </button>

                            <div class="perfil-content">
                                <i
                                    v-if="hasImgError"
                                    class="fas fa-user-circle"
                                    style="font-size: 2.5rem; color: #ccc"
                                ></i>

                                <img
                                    v-else
                                    :src="contatoSelecionado.foto"
                                    alt="foto de perfil"
                                    @error="hasImgError = true"
                                />

                                <h5 class="ps-2 fs-5">{{ contatoSelecionado.nome }}</h5>
                            </div>
                        </div>

                        <div
                            class="responsive"
                            @click="responsivo()"
                        >
                            <i class="fa-solid fa-ellipsis-vertical fs-2"></i>
                            <div
                                v-show="abrirDropdown"
                                class="sub-menu"
                            >
                                <button
                                    type="button"
                                    class="btn btn-danger"
                                    @click="fecharAtendimentoContatoInterno()"
                                >
                                    <i
                                        class="fa-solid fa-arrow-right-from-bracket icon-size"
                                        aria-hidden="true"
                                    ></i>
                                </button>
                            </div>
                        </div>

                        <div
                            class="btn-group"
                            role="group"
                            aria-label="Basic mixed styles example"
                        >
                            <button
                                type="button"
                                class="btn btn-danger justify-content-center align-items-center py-1 px-2"
                                @click="fecharAtendimentoContatoInterno()"
                            >
                                <i
                                    class="fa-solid fa-arrow-right-from-bracket icon-size"
                                    aria-hidden="true"
                                ></i>
                            </button>
                        </div>
                    </div>

                    <chat-atendimento-interno
                        :mensagens="mensagens"
                        :idAtendido="foneConversa"
                    />
                </div>

                <div
                    v-else
                    class="chatbox_wrapper d-flex flex-column h-100 w-100"
                >
                    <div class="headerConversation">
                        <div class="perfil-container">
                            <button
                                v-tooltip="{ title: 'Voltar', class: 'tooltip-modern' }"
                                @click="voltar"
                            >
                                <i class="fa-solid fa-chevron-left text-secondary"></i>
                            </button>

                            <div class="perfil-content">
                                <i
                                    v-if="hasImgError"
                                    class="fas fa-user-circle"
                                    style="font-size: 2.5rem; color: #ccc"
                                ></i>

                                <img
                                    v-else
                                    :src="contatoSelecionado.foto"
                                    alt="foto de perfil"
                                    @error="hasImgError = true"
                                />
                                <h5 class="ps-2 fs-5">{{ contatoSelecionado.nome }}</h5>
                            </div>
                        </div>

                        <div
                            class="responsive"
                            @click="responsivo()"
                        >
                            <i class="fa-solid fa-ellipsis-vertical fs-2"></i>

                            <div
                                v-show="abrirDropdown"
                                class="sub-menu"
                            >
                                <button
                                    v-tooltip="{
                                        title: 'Transmissão',
                                        class: 'tooltip-modern',
                                    }"
                                    type="button"
                                    class="btn"
                                    :class="atendimentoStatus ? 'btn-success' : 'btn-danger'"
                                    @click="alternarBloqueioContato(contatoSelecionado.id)"
                                >
                                    <i
                                        v-show="atendimentoStatus"
                                        class="fa-solid fa-check"
                                        aria-hidden="true"
                                    ></i>
                                    <i
                                        v-show="!atendimentoStatus"
                                        class="fa-solid fa-ban"
                                        aria-hidden="true"
                                    ></i>
                                </button>

                                <button
                                    v-tooltip="{
                                        title: 'Editar',
                                        class: 'tooltip-modern',
                                    }"
                                    type="button"
                                    class="btn btn-secondary"
                                    data-bs-toggle="offcanvas"
                                    data-bs-target="#acao_editar"
                                >
                                    <i
                                        class="fa-solid fa-pen"
                                        aria-hidden="true"
                                    ></i>
                                </button>

                                <button
                                    v-tooltip="{
                                        title: 'Transferir',
                                        class: 'tooltip-modern',
                                    }"
                                    type="button"
                                    class="btn btn-info"
                                    data-bs-toggle="modal"
                                    data-bs-target="#transfereAtendimento"
                                >
                                    <i class="fa-solid fa-rotate"></i>
                                </button>

                                <button
                                    v-tooltip="{
                                        title: 'Encerrar atendimento',
                                        class: 'tooltip-modern',
                                    }"
                                    type="button"
                                    class="btn btn-danger"
                                    @click="encerrarAtendimento(contatoSelecionado.id_atendimento)"
                                >
                                    <i
                                        class="fa-solid fa-arrow-right-from-bracket"
                                        aria-hidden="true"
                                    ></i>
                                </button>
                            </div>
                        </div>

                        <div
                            class="btn-group"
                            role="group"
                            aria-label="Basic mixed styles example"
                        >
                            <button
                                v-tooltip="{
                                    title: 'Transmissão',
                                    class: 'tooltip-modern',
                                }"
                                type="button"
                                class="btn justify-content-center align-items-center py-1 px-2"
                                :class="atendimentoStatus ? 'btn-success' : 'btn-danger'"
                                @click="alternarBloqueioContato(contatoSelecionado.id)"
                            >
                                <i
                                    v-show="atendimentoStatus"
                                    class="fa-solid fa-check icon-size"
                                    aria-hidden="true"
                                ></i>
                                <i
                                    v-show="!atendimentoStatus"
                                    class="fa-solid fa-ban icon-size"
                                    aria-hidden="true"
                                ></i>
                            </button>

                            <button
                                v-tooltip="{
                                    title: 'Editar',
                                    class: 'tooltip-modern',
                                }"
                                type="button"
                                class="btn btn-secondary justify-content-center align-items-center py-1 px-2"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#acao_editar"
                            >
                                <i
                                    class="fa-solid fa-pen icon-size"
                                    aria-hidden="true"
                                ></i>
                            </button>

                            <button
                                v-tooltip="{
                                    title: 'Transferir',
                                    class: 'tooltip-modern',
                                }"
                                type="button"
                                class="btn btn-info justify-content-center align-items-center py-1 px-2"
                                data-bs-toggle="modal"
                                data-bs-target="#transfereAtendimento"
                            >
                                <i class="fa-solid fa-rotate icon-size"></i>
                            </button>

                            <button
                                v-tooltip="{
                                    title: 'Encerrar atendimento',
                                    class: 'tooltip-modern',
                                }"
                                type="button"
                                class="btn btn-danger justify-content-center align-items-center py-1 px-2"
                                @click="encerrarAtendimento(contatoSelecionado.id_atendimento)"
                            >
                                <i
                                    class="fa-solid fa-arrow-right-from-bracket icon-size"
                                    aria-hidden="true"
                                ></i>
                            </button>
                        </div>
                    </div>

                    <chat-atendimento
                        :mensagens="mensagens"
                        :processando="enviandoMensagem"
                        :status="status_chat"
                        :foneAtendido="foneConversa"
                        :estado-encaminhar-mensagens="modoEncaminhar"
                        :estado-responder-mensagem="modoResponder"
                        :lista-mensagens-selecionadas="mensagensSelecionadas"
                        @abrir-conversa="abrirConversaContatoEncaminhado"
                        @handle-media="handleModalMedia"
                        @responder-layout="responderLayout"
                    />
                </div>

                <div
                    v-if="listaContatos.internos && listaContatos.internos.length > 0"
                    style="background-color: #f5f1eb"
                >
                    <div
                        class="chatbox_input_interno w-100 d-flex gap-3 align-items-center justify-content-center py-3 px-2 rounded-3 shadow-sm"
                    >
                        <div class="input-group-prepend">
                            <transition
                                name="menu-slide"
                                appear
                            >
                                <div
                                    v-if="acaoMenuAberto"
                                    ref="optMenu"
                                    class="menu-escolhas"
                                >
                                    <button
                                        class="btn-menu"
                                        @click="openFileManager(1)"
                                    >
                                        <i
                                            class="fa-solid fa-file"
                                            style="color: #9141ac"
                                        ></i>

                                        <span>Documentos</span>
                                    </button>
                                </div>
                            </transition>

                            <button
                                type="button"
                                class="btn-escolhas border-0 shadow-none rounded-circle d-flex justify-content-center align-items-center"
                                @click="abrirEscolhas"
                            >
                                <i
                                    class="fa-solid fa-plus fs-4"
                                    :class="{ rotated: acaoMenuAberto }"
                                ></i>
                            </button>
                        </div>

                        <div class="input-group-prepend position-relative">
                            <button
                                type="button"
                                class="btn-emoji"
                                @click="showEmojiPicker = !showEmojiPicker"
                            >
                                <i class="fa-solid fa-face-smile fs-3"></i>
                            </button>

                            <EmojiPicker
                                v-show="showEmojiPicker"
                                ref="emojiPicker"
                                :native="true"
                                class="emoji_picker_position"
                                @select="onEmojiSelect"
                            ></EmojiPicker>
                        </div>

                        <div class="d-flex gap-2 w-100 align-items-center">
                            <textarea
                                v-model="mensagem"
                                class="input-area form-control px-2 py-1 w-100"
                                :rows="textareaRows"
                                placeholder="Mensagem"
                                @keyup.enter.exact="enviarMensagemChatInterno()"
                            ></textarea>

                            <button
                                v-if="mensagem"
                                type="button"
                                class="btn-send"
                                @click="enviarMensagemChatInterno()"
                            >
                                <img
                                    src="../assets/enviar.png"
                                    class="icon-send"
                                    alt="Enviar"
                                />
                            </button>
                        </div>
                    </div>
                </div>

                <div v-else>
                    <div
                        v-if="modoEncaminhar"
                        class="layout_encaminharMensagem bg-message position-relative chatbox_input"
                    >
                        <div class="input-group-prepend">
                            <span
                                style="padding: 10px"
                                class="cursor-pointer"
                                @click="fecharLayoutBatePapo()"
                            >
                                <img
                                    src="../assets/close.png"
                                    alt=""
                                    style="width: 16px; height: 16px"
                                />
                            </span>
                        </div>

                        <div class="input-group-prepend fs-16">
                            {{ mensagensSelecionadas.length }} Selecionadas
                        </div>

                        <span
                            v-if="mensagensSelecionadas.length !== 0"
                            style="padding: 10px"
                            class="cursor-pointer"
                            data-bs-toggle="modal"
                            data-bs-target="#encaminhaMensagens"
                        >
                            <i class="fa-solid fa-share fs-3"></i>
                        </span>

                        <span
                            v-else
                            style="padding: 10px"
                            class="cursor-pointer"
                        >
                            <i class="fa-solid fa-share fs-3"></i>
                        </span>
                    </div>

                    <div
                        v-else
                        class="d-flex flex-column justify-content-end px-2 py-2 w-100 gap-2 rounded-3 shadow-sm chatbox_input"
                    >
                        <transition
                            name="slide-bottom-top"
                            appear
                        >
                            <div
                                v-if="modoResponder"
                                class="position-relative d-flex justify-content-between align-items-center w-100 rounded-3 py-2 px-3 bg-white response-msg-wrapper"
                                :style="
                                    mensagemResponder.wook === 'onack'
                                        ? 'border-color: #27cb47'
                                        : 'border-color: #0c9fb4'
                                "
                            >
                                <dl>
                                    <dt>{{ mensagemResponder.nome }}</dt>

                                    <dd>
                                        {{ formatTextForLimited(mensagemResponder.mensagem, 80) }}
                                    </dd>
                                </dl>

                                <div class="wrapper-media-close">
                                    <div
                                        v-if="mensagemResponder.mediaUrl"
                                        class="me-4 response-msg-media"
                                    >
                                        <img-component
                                            :file-url="mensagemResponder.mediaUrl"
                                            :zoom-enabled="false"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        class="response-btn-close"
                                        @click="fecharResponderLayout"
                                    >
                                        <i class="fa-solid fa-xmark"></i>
                                    </button>
                                </div>
                            </div>
                        </transition>

                        <div class="w-100 d-flex align-items-end gap-2">
                            <div
                                v-if="!isRecorder"
                                class="input-group-prepend"
                            >
                                <!-- CSS do efeito em transitions.scss -->
                                <transition
                                    name="menu-slide"
                                    appear
                                >
                                    <div
                                        v-if="acaoMenuAberto"
                                        ref="optMenu"
                                        class="menu-escolhas"
                                    >
                                        <button
                                            type="button"
                                            class="btn-menu"
                                            @click="openFileManager()"
                                        >
                                            <i
                                                class="fa-solid fa-file"
                                                style="color: #9141ac"
                                            ></i>

                                            <span>Documentos</span>
                                        </button>

                                        <button
                                            type="button"
                                            class="btn-menu"
                                            @click="openFileManagerMidiaPreview()"
                                        >
                                            <i
                                                class="fa-solid fa-photo-film"
                                                style="color: #1c71d8"
                                            ></i>

                                            <span>Fotos e Videos</span>
                                        </button>

                                        <button
                                            type="button"
                                            class="btn-menu"
                                            data-bs-toggle="modal"
                                            data-bs-target="#compartilharContato"
                                        >
                                            <i
                                                class="fa-solid fa-address-book"
                                                style="color: #2ec27e"
                                            ></i>

                                            <span>Contatos</span>
                                        </button>

                                        <button
                                            type="button"
                                            class="btn-menu"
                                            data-bs-toggle="modal"
                                            data-bs-target="#templateMessages"
                                        >
                                            <i
                                                class="fa-solid fa-align-left"
                                                style="color: #e66100"
                                            ></i>

                                            <span>Modelo</span>
                                        </button>
                                    </div>
                                </transition>

                                <button
                                    type="button"
                                    class="btn-escolhas border-0 shadow-none rounded-circle d-flex justify-content-center align-items-center"
                                    style="padding: 10px"
                                    @click="abrirEscolhas"
                                >
                                    <i
                                        class="fa-solid fa-plus fs-4"
                                        :class="{ rotated: acaoMenuAberto }"
                                    ></i>
                                </button>
                            </div>

                            <div
                                v-if="!isRecorder"
                                class="input-group-prepend position-relative d-flex justify-content-center align-items-center"
                            >
                                <button
                                    class="btn-emoji"
                                    type="button"
                                    @click="showEmojiPicker = !showEmojiPicker"
                                >
                                    <i class="fa-solid fa-face-smile fs-3"></i>
                                </button>

                                <transition
                                    name="menu-slide"
                                    appear
                                >
                                    <EmojiPicker
                                        v-show="showEmojiPicker"
                                        ref="emojiPicker"
                                        :native="true"
                                        class="emoji_picker_position"
                                        @select="onEmojiSelect"
                                    ></EmojiPicker>
                                </transition>
                            </div>

                            <div class="d-flex gap-2 w-100 align-items-end">
                                <textarea
                                    v-if="!isRecorder"
                                    ref="textarea"
                                    v-model="mensagem"
                                    class="input-area form-control px-2 py-1 w-100"
                                    :rows="textareaRows"
                                    placeholder="Mensagem"
                                    @keyup.enter.exact="enviarMensagem"
                                    @input="verifyTextareaRowsSize"
                                ></textarea>

                                <button
                                    v-if="mensagem"
                                    type="button"
                                    class="btn-send"
                                    @click="enviarMensagem"
                                >
                                    <img
                                        src="../assets/enviar.png"
                                        class="icon-send"
                                        alt="Enviar"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                v-else
                class="rightSide bg-cinza apresentacao"
            >
                <img
                    src="@/assets/img/inzupt.webp"
                    alt="Logo inzupt"
                    class="back-logo"
                />
            </div>
        </div>

        <settings-offcanvas
            :audio-status="audioStatus"
            @ativar-notificacao="handleBtnNotification"
        />

        <editar-contato
            :user="contatoSelecionado"
            :grupos="grupos"
            @updated-atendimentos="chamarMeusAtendimentos"
        />

        <transferir-atendimento
            :id_atendimento="contatoSelecionado.id_atendimento"
            @chamar-atendimentos-fila="chamarAtendimentosFila"
            @fechar-tela-conversa="fecharTelaDeConversa"
            @atualiza-meus-atendimentos="chamarMeusAtendimentos"
        />

        <compartilhar-contato
            :fone="contatoSelecionado.fone"
            @handle-encaminhar-contato="updateMessages"
        />

        <encaminha-mensagens
            :fone="contatoSelecionado.fone"
            :name="contatoSelecionado.nome"
            :limpa-array="limparArrayMensagensSelecionadas"
            :lista-mensagens-selecionadas="mensagensSelecionadas"
        />

        <adicionar-contato
            :grupos="grupos"
            @updated-contatos="chamarMeusAtendimentos"
        />

        <display-media
            :dataMediaArray="filterMessages(mensagens)"
            :isVisible="openModalMedia"
            :dataMediaSelected="modalMediaData"
            @close-modal="handleCloseModal"
        />

        <display-document
            :isVisible="openModalDocument"
            :dataDocumentSelected="modalDocumentData"
            @close-modal="handleCloseModal"
            @update-messages="updateMessages"
        />

        <display-media-preview
            :isVisible="openModalMediaPreview"
            :data-media-selected="modalMediaPreviewData"
            @close-modal="handleCloseModal"
            @update-messages="updateMessages"
        />

        <display-template-message
            :templateData="templateData"
            @update-messages="updateMessages"
        />
    </div>
</template>

<script setup>
import { ref, computed, watch, inject, nextTick, onMounted, onBeforeUnmount } from 'vue'
import ListaAtendimentos from '@/components/atendimento/ListaAtendimentos.vue'
import ListaAtendimentosChatInterno from '@/components/atendimento/ListaAtendimentosChatInterno.vue'
import ChatAtendimento from '@/components/atendimento/ChatAtendimento.vue'
import ChatAtendimentoInterno from '@/components/atendimento/ChatAtendimentoInterno.vue'
import Api from '@/services/api.js'
import EditarContato from '@/components/atendimento/acao/editarContato.vue'
import TransferirAtendimento from '@/components/atendimento/acao/transferirAtendimento.vue'
import compartilharContato from '@/components/atendimento/acao/compartilharContato.vue'
import encaminhaMensagens from '@/components/atendimento/acao/encaminhaMensagens.vue'
import AdicionarContato from '@/components/atendimento/acao/ADDUSUARIOVUE.vue'
import AudioFila from '@/assets/audios/notifica2.mp3'
import EmojiPicker from 'vue3-emoji-picker'
import middleware from '@/services/middleware'
import Swal from 'sweetalert2'
import DisplayMedia from '@/components/modals/display-media/DisplayMedia.vue'
import DisplayDocument from '@/components/modals/display-document/DisplayDocument.vue'
import DisplayTemplateMessage from '@/components/modals/display-template-message/DisplayTemplateMessage.vue'
import { formatSize, formatTextForLimited } from '@/utils/formatters'
import DisplayMediaPreview from '@/components/modals/display-media-preview/DisplayMediaPreview.vue'
import SettingsOffcanvas from '@/components/modals/settings-offcanvas/SettingsOffcanvas.vue'
import StorageUtil from '@/utils/StorageUtil.js'
import { useListStatesStore } from '@/stores/index.js'
import ImgComponent from '@/components/ui/ImgComponent.vue'
import ProgressBarScreen from '@/components/ui/screen-overlay/ProgressBarScreen.vue'
import {
    useAtendimentoFirebase,
    useAtendimentoIDB,
    useListasContatos,
    useNotificacoesAtendimento,
} from '@/components/atendimento/composables/index.js'

defineOptions({ name: 'Atendimento' })

const database = inject('database')

const getUserId = () => StorageUtil.get('@USER_ID')
const grupos = []

const session = ref('')
const tipo_usuario = ref(null)
const contatoSelecionado = ref({})
const idContatoAtivo = ref(0)
const conversaAberta = ref(false)
const acaoMenuAberto = ref(false)
const dropdownAberto = ref(false)
const abrirDropdown = ref(false)
const mensagens = ref([])
const foneConversa = ref(null)
const status_chat = ref(false)
const atendimentoStatus = ref(null)
const notificacao = ref(false)
const qtdconversas = ref(0)
const mensagem = ref('')
const enviandoMensagem = ref(false)
const modoEncaminhar = ref(false)
const modoResponder = ref(false)
const mensagensSelecionadas = ref([])
const mensagemResponder = ref({})
const message_id = ref(null)
const opcaoSelecionada = ref('meus_atendimentos')
const showEmojiPicker = ref(false)
const isChatInternal = ref(false)
const hasImgError = ref(false)
const isRecorder = ref(false)
const textareaRows = ref(1)
const modalMediaData = ref({})
const modalMediaPreviewData = ref({})
const modalDocumentData = ref({})
const openModalMedia = ref(false)
const openModalMediaPreview = ref(false)
const openModalDocument = ref(false)
const dropdownContent = ref(null)
const optMenu = ref(null)
const emojiPicker = ref(null)
const textarea = ref(null)

const listStatesStore = useListStatesStore()

const {
    audioStatus,
    novaTransferenciaBanner,
    novaMensagemInternaBanner,
    handleBtnNotification,
    tocarSom,
    recebeuNovaTransferencia,
    recebeumensageminterna,
} = useNotificacoesAtendimento()

const {
    qtdTotal,
    processadosNestaSessao,
    loadingPage,
    qtdNovaMensagem,
    useIndexedDb,
    carregarMensagens,
    fecharIdb,
    deletarIdb,
} = useAtendimentoIDB({
    userId: getUserId,
    contatoSelecionado,
    conversaAberta,
    onConversaAtualizada: (msgs, meta) => {
        notificacao.value = false
        mensagens.value = msgs
        status_chat.value = meta.status
        qtdconversas.value = meta.qtd
        foneConversa.value = meta.fone
        idContatoAtivo.value = meta.id
        atendimentoStatus.value = meta.ativo

        marcarConversaVisualizada()
    },
    onSincronizacaoConcluida: () => carregarDadosAdicionais(),
})

const {
    listaContatos,
    listaContatosSelecionado,
    listaContatosPesquisa,
    listaContatosLoading,
    fila_qtd,
    meusatendimentos_qtd,
    qtdmensagensinternas,
    plano_id,
    pesquisa,
    chamarAtendimentosFila,
    chamarMeusAtendimentos,
    chamarTodosAtendimentos,
    pesquisar,
} = useListasContatos({ contatoSelecionado, conversaAberta, opcaoSelecionada })

const { iniciarListenersFirebase, pararListeners } = useAtendimentoFirebase({
    session,
    database,
    userId: getUserId,
    audioStatus,
    onMensagens: () => {
        useIndexedDb()
        chamarAtendimentosFila()
        chamarMeusAtendimentos()
    },
    onFila: count => {
        tocarSom(AudioFila)
        fila_qtd.value = count
        chamarAtendimentosFila()
    },
    onTransferencia: () => recebeuNovaTransferencia(),
    onChatInterno: () => {
        qtdmensagensinternas.value = 1
        recebeumensageminterna()
        atualizarConversaInterna()
    },
})

const templateData = computed(() => ({
    user_id: getUserId(),
    nome: contatoSelecionado.value.nome,
    fone: contatoSelecionado.value.fone,
    mensagem: null,
    mensagem_id: message_id.value,
    status: 1,
}))

const getPercentQtd = computed(() => {
    const requestTotal = qtdTotal.conversas

    if (requestTotal <= 0) return 100

    const resultado = Math.ceil((processadosNestaSessao.value / requestTotal) * 100)

    return Math.max(0, Math.min(resultado, 100))
})

async function carregarDadosAdicionais() {
    try {
        await Promise.all([chamarTodosAtendimentos(), getEstados()])

        loadingPage.value = false
    } catch (error) {
        console.error(error)
    }
}

async function marcarConversaVisualizada() {
    try {
        await Api.post('/conversas/ZmlsYWRlYXRlbmRpbWVudG8=', {
            id: StorageUtil.get('@USER_ID'),
            fone: contatoSelecionado.value.fone,
        })
    } catch (error) {
        console.error(error)
    }
}

async function sair() {
    try {
        await deletarIdb()

        middleware.logout()
    } catch (error) {
        console.error(error)
    }
}

async function abrirConversa(info_user) {
    try {
        mensagens.value = []
        enviandoMensagem.value = true
        contatoSelecionado.value = info_user.usuario
        const fone = info_user?.usuario?.fone ?? null

        const objConversas = {
            id: StorageUtil.get('@USER_ID'),
            fone: fone,
            nome_contato: info_user?.usuario?.nome ?? null,
        }

        const response = await Api.post(`/conversas_bd/ZmlsYWRlYXRlbmRpbWVudG8=`, objConversas)

        const isBeingAssisted = !response?.data?.qtd

        if (isBeingAssisted) {
            mensagens.value = response?.data?.mensagem ?? null
            enviandoMensagem.value = false
            conversaAberta.value = true
            return
        }

        await carregarMensagens(info_user.usuario)

        chamarAtendimentosFila()
        chamarMeusAtendimentos()

        delete qtdNovaMensagem.value[fone]

        enviandoMensagem.value = false
        isChatInternal.value = false
        conversaAberta.value = true

        opcaoSelecionada.value = 'meus_atendimentos'
        pesquisa.value = ''

        updateStyleTabs()
    } catch (error) {
        console.error(error)
    }
}

function abrirConversaContatoEncaminhado(info) {
    const fone = info.mensagem
    const nome_contato = info.contactName

    const objConversas = {
        id: StorageUtil.get('@USER_ID'),
        fone: fone,
        nome_contato: nome_contato,
    }

    Api.post('/conversas_bd/ZmlsYWRlYXRlbmRpbWVudG8=', objConversas)
        .then(response => {
            const data = response.data
            const ativo = response.data.usuario
            const qtd = data.qtd

            notificacao.value = false

            Api.post(`/busca_contatos/ZmlsYWRlYXRlbmRpbWVudG8=`, {
                id: StorageUtil.get('@USER_ID'),
                busca: info.mensagem,
            }).then(resposta => {
                const dados = resposta.data

                contatoSelecionado.value = dados.contatos.data[0]
                mensagens.value = []

                if (qtd > 0) {
                    qtdconversas.value = qtd
                    status_chat.value = true
                    mensagens.value = data.conversas.slice(0).reverse()
                    foneConversa.value = contatoSelecionado.value.fone
                    idContatoAtivo.value = contatoSelecionado.value.id
                    atendimentoStatus.value = ativo.ativo === 1
                    marcarConversaVisualizada()
                } else {
                    qtdconversas.value = qtd
                    status_chat.value = false
                    mensagens.value = data.mensagem
                    foneConversa.value = contatoSelecionado.value.fone
                    idContatoAtivo.value = contatoSelecionado.value.id
                    atendimentoStatus.value = ativo.ativo === 1
                    marcarConversaVisualizada()
                }

                chamarMeusAtendimentos()
            })
        })
        .catch(error => {
            console.error(error)
        })
}

async function abrirConversaChatInterno(info_user) {
    try {
        contatoSelecionado.value = info_user.usuario

        const objConversas = {
            id: StorageUtil.get('@USER_ID'),
            id_transferido: contatoSelecionado.value.id,
        }

        mensagens.value = []

        const response = await Api.post(
            '/conversa_chat_interno/ZmlsYWRlYXRlbmRpbWVudG8=',
            objConversas
        )

        const data = response.data

        if (typeof data.mensagem === 'string') {
            mensagens.value = []
        } else {
            mensagens.value = data?.conversas ?? []
            foneConversa.value = contatoSelecionado.value.id
            idContatoAtivo.value = contatoSelecionado.value.id
            qtdmensagensinternas.value = data.lido
        }

        isChatInternal.value = true
        conversaAberta.value = true
    } catch (error) {
        console.error(error)
    }
}

function atualizarConversaInterna() {
    const objConversas = {
        id: StorageUtil.get('@USER_ID'),
        id_transferido: contatoSelecionado.value.id,
    }

    mensagens.value = []
    Api.post('/conversa_chat_interno/ZmlsYWRlYXRlbmRpbWVudG8=', objConversas)
        .then(response => {
            const data = response.data.conversas

            if (typeof data.mensagem === 'string') {
                mensagens.value = []
            } else {
                mensagens.value = data
            }
        })
        .catch(error => console.error(error))
}

function alternarBloqueioContato(contato_id) {
    Api.post('/bloqueia_contato/ZmlsYWRlYXRlbmRpbWVudG8=', {
        id: StorageUtil.get('@USER_ID'),
        contato_id: contato_id,
    })
        .then(response => {
            atendimentoStatus.value = response.data.status
        })
        .catch(error => {
            console.error(error)
        })
}

function encerrarAtendimento(id_atendimento) {
    Swal.fire({
        title: 'Encerrar',
        text: 'Você tem certeza de que deseja encerrar este atendimento?',
        icon: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        cancelButtonColor: '#d33',
        confirmButtonColor: '#2cacbf',
        cancelButtonText: 'VOLTAR',
        confirmButtonText: 'SIM, ENCERRAR',
    }).then(result => {
        if (result.isConfirmed) {
            Api.post('/fechar_atendimento/ZmlsYWRlYXRlbmRpbWVudG8=', {
                id_atendimento: id_atendimento,
            })
                .then(() => {
                    conversaAberta.value = false
                    listaContatosSelecionado.value = []
                    listaContatosPesquisa.value = []
                    listaContatos.value.meusAtendimentos =
                        listaContatos.value?.meusAtendimentos?.filter(
                            contato => contato?.id_atendimento !== id_atendimento
                        ) ?? []
                    meusatendimentos_qtd.value = listaContatos.value?.meusAtendimentos?.length
                })
                .catch(error => {
                    console.error(error)

                    Swal.fire({
                        icon: 'error',
                        title: 'Erro ',
                        text: 'Erro ao encerrar atendimento.',
                        confirmButtonColor: '#17a2b8',

                        didOpen: () => {
                            const confirmBtn = Swal.getConfirmButton()
                            const actionsContainer = confirmBtn.parentElement

                            actionsContainer.style.width = '100%'
                            actionsContainer.style.display = 'flex'
                            actionsContainer.style.justifyContent = 'center'

                            confirmBtn.style.width = '90%'
                        },
                    })
                })
        }
    })
}

async function enviarMensagem() {
    if (mensagem.value === '') return

    textareaRows.value = 1

    const msgText = mensagem.value
    const nome = StorageUtil.get('@USER_NAME') + '\r\n\t\t' + msgText

    const novaMensagemText = {
        mensagem: nome,
        type: 'text',
    }

    mensagem.value = ''

    if (mensagens.value == 'Nao ha mensagem para esse contato') {
        mensagens.value = 'processando...'
    } else {
        mensagens.value.push(novaMensagemText)
    }

    const objEnviaMensagem = {
        user_id: getUserId(),
        fone: contatoSelecionado.value.fone,
        mensagem: msgText,
        mensagem_reply: modoResponder.value ? mensagemResponder.value?.mensagem : null,
        mensagem_id: message_id.value,
        status: modoResponder.value ? 2 : 1,
    }

    await Api.post('/envia_mensagemnova/ZmlsYWRlYXRlbmRpbWVudG8=', objEnviaMensagem)
        .then(response => {
            if (response.data.erro == 'number_incorret') {
                Swal.fire(
                    'Mensagem não enviada!',
                    response.data.retorno + 'Reconecte o celular!',
                    'error'
                )
            }

            carregarMensagens(contatoSelecionado.value)
        })
        .catch(error => {
            console.error(error)
        })

    fecharResponderLayout()
    message_id.value = null
}

function enviarMensagemChatInterno() {
    const msgText = mensagem.value
    const nova = {
        de_chat: getUserId(),
        msg_chat: msgText,
        type: 'text',
    }

    const objEnviaMensagem = {
        user_id: getUserId(),
        id_transferido: contatoSelecionado.value.id,
        mensagem: msgText,
    }

    mensagem.value = ''
    mensagens.value.push(nova)

    Api.post('/mensagem_chat_interno/ZmlsYWRlYXRlbmRpbWVudG8=', objEnviaMensagem)
        .then(() => {
            atualizarConversaInterna()
        })
        .catch(error => {
            console.error(error)
        })
}

async function getEstados() {
    try {
        const response = await Api.post(`/cidades/ZmlsYWRlYXRlbmRpbWVudG8=`, {
            id: StorageUtil.get('@USER_ID'),
        })

        listStatesStore.setStates(response.data.estados)
    } catch (error) {
        console.error(error)
    }
}

function selecionarAba(event) {
    const btnQueue = event.target.closest('#btn-fila')
    const btnServices = event.target.closest('#btn-atendimentos')
    const btnAll = event.target.closest('#btn-todos')
    const btnInternalServices = event.target.closest('#btn-atendimentos-internos')

    pesquisa.value = ''

    if (btnQueue) {
        opcaoSelecionada.value = 'fila'
    } else if (btnServices) {
        opcaoSelecionada.value = 'meus_atendimentos'
    } else if (btnInternalServices) {
        opcaoSelecionada.value = 'interno'
    } else if (btnAll) {
        opcaoSelecionada.value = 'todos'
    }

    updateStyleTabs()
}

function updateStyleTabs() {
    nextTick(() => {
        const btnQueue = document.querySelector('#btn-fila')
        const btnServices = document.querySelector('#btn-atendimentos')
        const btnAll = document.querySelector('#btn-todos')

        ;[btnQueue, btnServices, btnAll].forEach(btn => {
            if (btn) btn.classList.remove('btn-active')
        })

        switch (opcaoSelecionada.value) {
            case 'fila':
                btnQueue?.classList.add('btn-active')
                break
            case 'meus_atendimentos':
                btnServices?.classList.add('btn-active')
                break
            case 'todos':
                btnAll?.classList.add('btn-active')
                break
        }
    })
}

function voltar() {
    conversaAberta.value = !conversaAberta.value
    fecharLayoutBatePapo()
    fecharResponderLayout()
}

function responsivo() {
    abrirDropdown.value = !abrirDropdown.value
}

function fecharTelaDeConversa() {
    conversaAberta.value = false
}

function fecharAtendimentoContatoInterno() {
    conversaAberta.value = false
}

function abrirEscolhas() {
    acaoMenuAberto.value = !acaoMenuAberto.value
}

function fecharLayoutBatePapo() {
    modoEncaminhar.value = false
    mensagensSelecionadas.value = []
}

function limparArrayMensagensSelecionadas() {
    mensagensSelecionadas.value = []
    fecharLayoutBatePapo()
}

function alterarLayoutBatePapo() {
    modoEncaminhar.value = true
    modoResponder.value = false
}

function responderLayout(payload) {
    modoEncaminhar.value = false
    modoResponder.value = true
    message_id.value = payload.id

    mensagemResponder.value = {
        mensagem: payload.mensagem,
        nome: payload?.wook === 'onack' ? 'Você' : payload?.nome ? payload.nome : payload.fone,
        wook: payload?.wook,
        mediaUrl: payload?.mediaUrl,
    }
}

function fecharResponderLayout() {
    modoResponder.value = false
    mensagensSelecionadas.value = []
}

function onEmojiSelect(emoji) {
    mensagem.value += emoji.i
    showEmojiPicker.value = false
}

function handleModalMedia(value = []) {
    modalMediaData.value = {
        userPhoto: contatoSelecionado.value.foto,
        userName: value.userName,
        urlMedia: value.url,
        type: value.type,
        wook: value.wook,
    }

    openModalMedia.value = true
}

function openFileManager(isInternal) {
    isChatInternal.value = !!isInternal

    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'application/rtf',
        'text/csv',
        'application/zip',
        'application/vnd.rar',
        'application/x-rar-compressed',
        'application/x-7z-compressed',
    ]

    const maxSize = 30 * 1024 * 1024

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.doc,.docx,.xlsx,.xls,.ppt,.pptx,.txt,.rtf,.csv,.zip,.rar,.7z'

    input.addEventListener(
        'change',
        event => {
            const file = event.target.files[0]

            if (file) {
                if (!allowedMimeTypes.includes(file.type)) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro',
                        text: 'Formato de arquivo não permitido.',
                        confirmButtonColor: '#17a2b8',

                        didOpen: () => {
                            const confirmBtn = Swal.getConfirmButton()
                            const actionsContainer = confirmBtn.parentElement

                            actionsContainer.style.width = '100%'
                            actionsContainer.style.display = 'flex'
                            actionsContainer.style.justifyContent = 'center'

                            confirmBtn.style.width = '90%'
                        },
                    })

                    return
                }

                if (file.size > maxSize) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro',
                        text: `O arquivo selecionado é muito grande (${formatSize(file.size)}).
                            Por favor, selecione um arquivo de até ${formatSize(maxSize)}.`,
                        confirmButtonColor: '#17a2b8',

                        didOpen: () => {
                            const confirmBtn = Swal.getConfirmButton()
                            const actionsContainer = confirmBtn.parentElement

                            actionsContainer.style.width = '100%'
                            actionsContainer.style.display = 'flex'
                            actionsContainer.style.justifyContent = 'center'

                            confirmBtn.style.width = '90%'
                        },
                    })

                    return
                }

                modalDocumentData.value = {
                    dataFile: file ?? null,
                    recipientId: contatoSelecionado.value?.id ?? null,
                    recipientFone: contatoSelecionado.value?.fone ?? null,
                    isChatInternal: isChatInternal.value,
                    wook: 'onack',
                }

                openModalDocument.value = true
            }
        },
        { once: true }
    )

    input.click()
}

function openFileManagerMidiaPreview() {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp',
        'image/tiff',

        'video/mp4',
        'video/quicktime',
        'video/x-msvideo',
        'video/x-ms-wmv',
        'video/3gpp',
        'video/x-flv',
        'video/webm',
        'video/x-matroska',
    ]
    const maxSize = 100 * 1024 ** 2

    const input = document.createElement('input')
    input.type = 'file'
    input.accept =
        '.jpeg,.jpg,.png,.gif,.webp,.bmp,.tiff,.tif,.mp4,.mov,.avi,.wmv,.3gp,.flv,.webm,.mkv'

    input.addEventListener(
        'change',
        event => {
            const file = event.target.files[0]

            if (file) {
                if (!allowedMimeTypes.includes(file.type)) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro',
                        text: 'Formato de arquivo não permitido.',
                        confirmButtonColor: '#17a2b8',

                        didOpen: () => {
                            const confirmBtn = Swal.getConfirmButton()
                            const actionsContainer = confirmBtn.parentElement

                            actionsContainer.style.width = '100%'
                            actionsContainer.style.display = 'flex'
                            actionsContainer.style.justifyContent = 'center'

                            confirmBtn.style.width = '90%'
                        },
                    })

                    return
                }

                if (file.size > maxSize) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro',
                        text: `A mídia selecionado é muito grande (${formatSize(file.size)}).
                            Por favor, selecione uma mídia de até ${formatSize(maxSize)}.`,
                        confirmButtonColor: '#17a2b8',

                        didOpen: () => {
                            const confirmBtn = Swal.getConfirmButton()
                            const actionsContainer = confirmBtn.parentElement

                            actionsContainer.style.width = '100%'
                            actionsContainer.style.display = 'flex'
                            actionsContainer.style.justifyContent = 'center'

                            confirmBtn.style.width = '90%'
                        },
                    })

                    return
                }

                modalMediaPreviewData.value = {
                    dataFile: file ?? null,
                    recipientId: contatoSelecionado.value?.id ?? null,
                    recipientFone: contatoSelecionado.value?.fone ?? null,
                    wook: 'onack',
                }

                openModalMediaPreview.value = true
            }
        },
        { once: true }
    )

    input.click()
}

function handleCloseModal() {
    openModalMedia.value = false
    openModalDocument.value = false
    openModalMediaPreview.value = false
}

function updateMessages() {
    if (!isChatInternal.value) {
        carregarMensagens(contatoSelecionado.value)
        return
    }

    atualizarConversaInterna()
}

function filterMessages(msgs) {
    if (!msgs) return []
    if (typeof msgs === 'string') return msgs
    if (!Array.isArray(msgs) && msgs.length === 0) return []
    return msgs.filter(msg => msg.type && (msg.type === 'image' || msg.type === 'video'))
}

function verifyTextareaRowsSize() {
    textareaRows.value = 1

    nextTick(() => {
        const style = window.getComputedStyle(textarea.value)
        const lineHeight = parseInt(style.lineHeight)
        const scrollHeight = textarea.value.scrollHeight

        const requiredRows = Math.floor(scrollHeight / lineHeight)
        textareaRows.value = Math.min(requiredRows, 10)
    })
}

function handleClickOutside(event) {
    const btnOptClick = event.target.closest('.btn-opt')

    if (dropdownContent.value && !dropdownContent.value.contains(event.target) && !btnOptClick) {
        dropdownAberto.value = false
    }
}

function handleClickOutsideEmoji(event) {
    const emojiPickerElement = emojiPicker.value?.$el
    const emojiButton = event.target.closest('.input-group-prepend button')

    if (emojiPickerElement && !emojiPickerElement.contains(event.target) && !emojiButton) {
        showEmojiPicker.value = false
    }
}

function handleClickOutsideEscolha(event) {
    const btnEscolhasClick = event.target.closest('.btn-escolhas')

    if (optMenu.value && !optMenu.value.contains(event.target) && !btnEscolhasClick) {
        acaoMenuAberto.value = false
    }
}

watch(loadingPage, newVal => {
    if (!newVal) {
        updateStyleTabs()
    }
})

watch(dropdownAberto, isOpen => {
    if (isOpen) {
        nextTick(() => {
            document.addEventListener('click', handleClickOutside)
        })
    } else {
        document.removeEventListener('click', handleClickOutside)
    }
})

watch(showEmojiPicker, isOpen => {
    if (isOpen) {
        nextTick(() => {
            document.addEventListener('click', handleClickOutsideEmoji)
        })
    } else {
        document.removeEventListener('click', handleClickOutsideEmoji)
    }
})

watch(acaoMenuAberto, newValue => {
    if (newValue) {
        nextTick(() => {
            document.addEventListener('click', handleClickOutsideEscolha)
        })
    } else {
        document.removeEventListener('click', handleClickOutsideEscolha)
    }
})

watch(
    contatoSelecionado,
    newVal => {
        if (!newVal?.foto || newVal?.foto?.length === 0) {
            hasImgError.value = true
            return
        }
        hasImgError.value = false
    },
    { immediate: true, deep: true }
)

onMounted(async () => {
    session.value = StorageUtil.get('@SESSION') || ''
    const alerta = StorageUtil.get('@MENSAGEM')

    if (alerta === 'browserClose') {
        await Swal.fire(
            'Celular Desconectado!',
            'Solicite ao Administrador para reconectar o celular, mensagens não serão enviadas ou recebidas',
            'error'
        )
    }

    tipo_usuario.value = StorageUtil.get('@TIPO')

    iniciarListenersFirebase()
})

onBeforeUnmount(() => {
    fecharIdb()
    pararListeners()

    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('click', handleClickOutsideEscolha)
    document.removeEventListener('click', handleClickOutsideEmoji)
})
</script>

<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
}

img {
    max-width: 100%;
}

.container-main {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    height: 100%;
    width: 100%;

    .bg-cinza {
        background-color: #e3eaef !important;
    }

    .bg-message {
        background-color: #f0f2f5 !important;
    }

    .cursor-pointer {
        cursor: pointer;
    }

    .fs-16 {
        font-size: 16px;
    }

    .box {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;

        background-color: #fff;
        box-shadow:
            0 1px 1px 0 rgba(0, 0, 0, 0.06),
            0 2px 5px 0 rgba(0, 0, 0, 0.06);
        overflow: hidden;

        @media (max-width: 900px) {
            margin: auto;

            &.chatAtivo .leftSide {
                display: none;
            }
        }

        &::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
        }

        .leftSide {
            position: relative;
            display: flex;
            flex-direction: column;
            flex: 30%;
            background-color: #fff;

            @media (max-width: 900px) {
                width: 100%;
            }

            .header {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 0.2fr;
                width: 100%;
                padding-bottom: 1px;

                background: #2cacbf;

                @media (max-width: 1400px) {
                    font-size: 0.9em;
                }

                @media (max-width: 550px) {
                    font-size: 0.7rem;
                }

                button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px 0;

                    background: #2cacbf;
                    border-radius: 5px;

                    transition: background-color 100ms ease;

                    &:focus {
                        outline: none;
                        border: 2px solid #fcb92c !important;
                        z-index: 10;
                    }

                    &:hover {
                        background: #0c9fb4;
                        transform: scale(1.015);
                    }

                    &.btn-active {
                        border-bottom: 4px #fe9a2d solid;
                    }
                }

                #btn-fila {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    div {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;

                        gap: 0.4em;
                    }
                }

                #btn-atendimentos {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    div {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;

                        gap: 0.4em;
                    }
                }

                .badge-custom {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 1rem !important;
                    height: 1rem !important;

                    border-radius: 50%;
                    font-size: 10px;

                    @media (max-width: 550px) {
                        width: 0.9rem !important;
                        height: 0.9rem;
                        font-size: 7px;
                    }
                }

                .btn-opt {
                    i {
                        font-size: 20px;
                        padding: 1px 4px;
                    }
                }

                .opt-modal {
                    position: absolute;
                    display: flex;
                    flex-direction: column;
                    width: 12rem;
                    right: 0;
                    top: 4rem;
                    padding: 0.5rem 0;
                    z-index: 10;

                    background-color: white;
                    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
                    border-radius: 5px;

                    button {
                        display: flex;
                        width: 100%;
                        justify-content: start;
                        padding: 0.4rem 1.6rem;

                        background-color: white;
                        color: #3b4a54;
                        font-weight: bold;
                        transition: all 0.1s ease;

                        &:hover {
                            background: #f4f4f4;
                            transform: scale(1);
                            border-radius: 5px;
                        }
                    }
                }
            }

            .search {
                position: relative;
                grid-column: span 3;
                border-bottom: 2px solid #eaeaea;
                padding: 10px;

                input {
                    width: 100%;
                    position: relative;
                    padding: 10px 10px 10px 30px;

                    border-radius: 5px;
                    outline: 0;
                    border: 0;
                    background-color: #eaeaea;
                    font-size: 1.1rem;

                    &:focus {
                        border: 2px solid #c7c7c7c5;
                    }
                }

                .icone-pesquisa {
                    position: absolute;
                    left: 1rem;
                    z-index: 1;
                }

                .layoutNovaTransferencia {
                    left: 25px !important;
                    bottom: 66px !important;
                }
            }

            .contatos {
                flex: 1;
                overflow-y: auto;
                overflow-x: hidden;
                min-height: 0;
            }
        }

        .rightSide {
            position: relative;
            display: flex;
            flex-direction: column;
            flex: 70%;
            height: 100%;

            background-color: #fff;
            border-left: 3px solid #eaeaea;

            &.apresentacao {
                display: flex;
                align-items: center;
                justify-content: center;

                @media (max-width: 900px) {
                    display: none;
                }

                .back-logo {
                    width: 50%;
                }
            }

            .chatbox_wrapper {
                position: relative;
                display: flex;
                flex-direction: column;
                height: 100%;

                background-color: #f5f1eb;

                .headerConversation {
                    width: 100%;
                    padding: 10px 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    background-color: #ffff;
                    border-bottom: 2px solid #eaeaea;
                    border-radius: 5px;

                    .perfil-container {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;

                        button {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 40px;
                            height: 40px;

                            background: #ffff;
                            border-radius: 50%;
                            transition:
                                transform 100ms ease-out,
                                background-color 100ms ease-out;

                            will-change: transform;
                            backface-visibility: hidden;

                            &:hover {
                                background-color: #f4f4f4;
                                transform: scale(1.1);
                            }

                            &:focus {
                                outline: none;
                                border: 2px solid #a7a6a6;
                            }

                            i {
                                font-size: 16px;
                            }
                        }
                    }

                    .perfil-content {
                        display: flex;
                        align-items: center;
                        gap: 1px;

                        img {
                            width: 40px;
                            height: 40px;
                            border-radius: 50%;
                        }
                    }

                    .responsive {
                        display: none;
                        position: relative;

                        @media (max-width: 550px) {
                            display: block;
                        }

                        .sub-menu {
                            position: absolute;
                            width: 60px;
                            right: -10px;
                            z-index: 5;

                            button {
                                margin-top: 5px;
                            }
                        }
                    }

                    .btn-group {
                        @media (max-width: 550px) {
                            display: none;
                        }
                    }
                }
            }

            .chatbox_input_interno {
                position: absolute;
                bottom: 0.5rem;
                z-index: 10;
                padding: 10px 8px;

                background-color: #f0f2f5 !important;
            }

            .chatbox_input {
                position: absolute;
                bottom: 4px;
                z-index: 10;
                max-height: 500px;

                background-color: #f0f2f5 !important;

                .response-msg-wrapper {
                    border-left: 0.2rem solid;

                    .wrapper-media-close {
                        display: flex;
                        align-items: center;
                        gap: 1rem;

                        .response-msg-media {
                            width: 4rem;
                        }

                        .response-btn-close {
                            padding: 0.5rem;
                            border-radius: 50%;
                            color: #495057;
                            background-color: transparent;
                            transition: background-color 0.3s ease;

                            &:hover {
                                background-color: #eaeaea;
                            }
                        }
                    }
                }
            }

            .layout_encaminharMensagem {
                display: flex;
                padding: 8px;
                align-items: center;

                span {
                    margin-left: auto;
                }
            }

            .input-group-prepend {
                button {
                    background-color: transparent;

                    transition:
                        background-color 200ms ease,
                        transform 200ms ease;
                    will-change: transform;
                    backface-visibility: hidden;
                }

                .btn-escolhas {
                    padding: 6px 5px !important;

                    &:hover {
                        background-color: #e8eaee;
                        transform: scale(1.05);
                    }

                    &:focus {
                        outline: none;
                        border: 2px solid #bbb9b9 !important;
                        border-radius: 50%;
                    }

                    i {
                        color: #4d4f5c;
                        transition: all 300ms ease-out;

                        &.rotated {
                            transform: rotate(135deg);
                        }
                    }
                }
            }

            .menu-escolhas {
                position: absolute;
                left: 10px;
                bottom: 4rem;
                display: flex;
                flex-direction: column;
                z-index: 5;
                min-width: 200px;
                width: auto;
                padding: 12px 0;

                border-radius: 5px;
                border: 1px solid rgba(238, 238, 238, 0.42);
                background: #fff;
                box-shadow:
                    0 4px 6px -1px rgba(0, 0, 0, 0.1),
                    0 2px 4px -1px rgba(0, 0, 0, 0.06);

                &.on {
                    display: block !important;
                }

                @media (min-width: 900px) {
                    left: -4rem;
                }
            }

            .btn-menu {
                width: 100%;
                display: flex;
                align-items: center;
                padding: 0.7rem 1rem;
                gap: 0.5rem;

                border-radius: 5px;
                font-weight: 500;

                transition: transform 0.2s ease;
                will-change: transform;
                backface-visibility: hidden;

                &:hover {
                    background-color: #f5f2f2;
                    transform: scale(1.01);
                }

                i {
                    font-size: 24px;
                }
            }

            .btn-emoji {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 2px 0px;

                &:hover {
                    background-color: #e8eaee;
                    transform: scale(1.05);
                }

                &:focus {
                    outline: none;
                    border: 2px solid #bbb9b9 !important;
                    border-radius: 50%;
                }

                i {
                    color: #4d4f5c;
                    transition: all 300ms ease-out;
                }
            }

            .emoji_picker_position {
                position: absolute;
                bottom: 2rem;
            }

            .input-area {
                resize: none;
                min-height: 30px;
                overflow-y: hidden;
                line-height: 1.4;
                transition: height 100ms ease;

                &:focus {
                    overflow-y: auto;
                }

                &::-webkit-scrollbar {
                    width: 2px;
                }

                &::-webkit-scrollbar-track {
                    background: transparent;
                }

                &::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 4px;
                }
            }

            .btn-send {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 2.7rem;
                height: 2.6rem;

                background-color: #2cacbf;
                border-radius: 50%;
                transition: opacity 200ms ease;

                &:hover {
                    opacity: 0.9;
                }

                &:focus {
                    outline: none;
                    border: 2px solid #bbb9b9 !important;
                }

                @media (max-width: 550px) {
                    width: 3rem;
                    height: 2.6rem;
                }
            }

            .icon-send {
                width: 1rem;
                height: 1rem;
            }

            .icon-size {
                font-size: 11px;

                @media (min-width: 576px) {
                    font-size: 12px;
                }

                @media (min-width: 1400px) {
                    font-size: 14px;
                }
            }
        }
    }
}
</style>
