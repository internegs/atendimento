<template>
    <div
        v-if="plano_id != 3"
        class="container-main"
    >
        <div
            class="box"
            :class="abrirMsg ? 'chatAtivo' : ''"
        >
            <div class="leftSide">
                <div class="header">
                    <button
                        id="btn-fila"
                        class="text-white"
                        @click="handleClickTabs($event)"
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
                        @click="handleClickTabs($event)"
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
                        @click="handleClickTabs($event)"
                    >
                        <span class="fw-bold text-center">TODOS</span>
                    </button>

                    <button
                        v-tooltip="{
                            title: 'Opções',
                            class: 'tooltip-modern',
                        }"
                        class="btn-opt text-white"
                        @click="openOpt = !openOpt"
                    >
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>

                    <div
                        v-show="openOpt"
                        class="opt-modal"
                    >
                        <ul ref="dropdownContent">
                            <li>
                                <button
                                    id="btn-atendimentos-internos"
                                    @click="(handleClickTabs($event), (openOpt = false))"
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
                            :class="novaTransferencia ? 'layoutNovaTransferencia' : ''"
                        >
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </span>

                        <input
                            id="myInput"
                            v-model="pesquisa"
                            type="text"
                            placeholder="Pesquise Contato"
                            style="flex: 6; color: #4d4f5c"
                            @keyup.enter="Pesquisar"
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
                        v-if="novaTransferencia"
                        class="fw-bold text-warning text-center"
                    >
                        VOCÊ RECEBEU UMA NOVA TRANSFERÊNCIA!
                    </span>

                    <span
                        v-if="mensageminterna"
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
                            :change="abrirConversa"
                            :ativado="ativado"
                            :tipo="tipo_usuario"
                            :novo="notificacao"
                            :lista_fone="lista_fones_notificados"
                            :qtdmensagens="qtdmensagens"
                        />
                    </div>

                    <div
                        v-else
                        class="contatos"
                    >
                        <!-- Listagem de Contatos -->

                        <lista-atendimentos-chat-interno
                            v-if="listaContatosInterno"
                            :lista="listaContatosInterno"
                            :change="abrirConversaChatInterno"
                            :ativado="ativado"
                            :novointerno="qtdmensagensinternas"
                        />

                        <lista-atendimentos
                            v-else
                            :lista="listaContatosSelecionado"
                            :change="abrirConversa"
                            :ativado="ativado"
                            :tipo="tipo_usuario"
                            :novo="notificacao"
                            :lista_fone="lista_fones_notificados"
                            :qtdmensagens="qtdmensagens"
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
                v-if="abrirMsg"
                class="rightSide"
            >
                <div
                    v-if="listaContatosInterno"
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
                                    :src="selecionado.foto"
                                    alt="foto de perfil"
                                    @error="hasImgError = true"
                                />

                                <h5 class="ps-2 fs-5">{{ selecionado.nome }}</h5>
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

                    <chat-atendimento-contatos-interno
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
                                    :src="selecionado.foto"
                                    alt="foto de perfil"
                                    @error="hasImgError = true"
                                />
                                <h5 class="ps-2 fs-5">{{ selecionado.nome }}</h5>
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
                                    @click="bloqueiaAtendimento(selecionado.id)"
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
                                    @click="fecharAtendimento(selecionado.id_atendimento)"
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
                                @click="bloqueiaAtendimento(selecionado.id)"
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
                                @click="fecharAtendimento(selecionado.id_atendimento)"
                            >
                                <i
                                    class="fa-solid fa-arrow-right-from-bracket icon-size"
                                    aria-hidden="true"
                                ></i>
                            </button>
                        </div>
                    </div>

                    <chat-atendimento
                        :abrir-conversa="abrirConversaContatoEncaminhado"
                        :mensagens="mensagens"
                        :processando="processando"
                        :mensagemdireta="mensagemdireta"
                        :status="status_chat"
                        :foneAtendido="foneConversa"
                        :alterarLayoutBatePapo="alterarLayoutBatePapo"
                        :estado-encaminhar-mensagens="estadoEncaminharMensagens"
                        :estado-responder-mensagem="estadoResponderMensagem"
                        :lista-mensagens-selecionadas="listaMensagensSelecionadas"
                        @abremodal_apagarmensagem="abremodal_apagarmensagem"
                        @handle-media="handleModalMedia"
                        @responder-layout="responderLayout"
                    />
                </div>

                <div
                    v-if="listaContatosInterno"
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
                                    v-if="abrirEscolha"
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
                                    :class="{ rotated: abrirEscolha }"
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

                            <emoji-picker
                                v-show="showEmojiPicker"
                                ref="emojiPicker"
                                :native="true"
                                class="emoji_picker_position"
                                @select="onEmojiSelect"
                            ></emoji-picker>
                        </div>

                        <div class="d-flex gap-2 w-100 align-items-center">
                            <textarea
                                v-model="mensagem"
                                class="input-area form-control px-2 py-1 w-100"
                                :rows="textareaRowsSize"
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
                        v-if="estadoEncaminharMensagens"
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
                            {{ listaMensagensSelecionadas.length }} Selecionadas
                        </div>

                        <span
                            v-if="listaMensagensSelecionadas.length !== 0"
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
                        class="d-flex flex-column w-100 py-3 px-2 gap-2 rounded-3 shadow-sm chatbox_input"
                    >
                        <transition
                            name="slide-bottom-top"
                            appear
                        >
                            <div
                                v-if="estadoResponderMensagem"
                                class="position-relative d-flex justify-content-between align-items-center w-100 rounded-3 py-2 px-3 bg-white response-msg-wrapper"
                                :style="
                                    mensagemResponder.wook === 'onack'
                                        ? 'border-color: #27cb47'
                                        : 'border-color: #0c9fb4'
                                "
                            >
                                <button
                                    type="button"
                                    class="response-btn-close"
                                    @click="fecharResponderLayout"
                                >
                                    <i class="fa-solid fa-xmark"></i>
                                </button>

                                <dl>
                                    <dt>{{ mensagemResponder.nome }}</dt>

                                    <dd>
                                        {{ formatTextForLimited(mensagemResponder.mensagem, 80) }}
                                    </dd>
                                </dl>

                                <div
                                    v-if="mensagemResponder.mediaUrl"
                                    class="me-4 response-msg-img"
                                >
                                    <img-component
                                        :file-url="mensagemResponder.mediaUrl"
                                        :zoom-enabled="false"
                                    />
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
                                        v-if="abrirEscolha"
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
                                        :class="{ rotated: abrirEscolha }"
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
                                    <emoji-picker
                                        v-show="showEmojiPicker"
                                        ref="emojiPicker"
                                        :native="true"
                                        class="emoji_picker_position"
                                        @select="onEmojiSelect"
                                    ></emoji-picker>
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

                                <!--                            <audio-recorder-component-->
                                <!--                                v-else-->
                                <!--                                @is-recording="viewIsRecordingEvent"-->
                                <!--                                @handle-btn-send="sendRecorderAudio"-->
                                <!--                            />-->
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
                    src="@/assets/img/inzupt.png"
                    alt=""
                    width="60%"
                />
            </div>
        </div>

        <!-- OffCanvas -->
        <div
            id="settings"
            class="offcanvas offcanvas-end"
            style="width: 35rem"
            tabindex="-1"
            aria-labelledby="settings"
        >
            <div class="offcanvas-header p-2">
                <button
                    type="button"
                    class="btn btn-danger fs-4 fw-bold ms-auto"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                >
                    Fechar
                </button>
            </div>

            <div class="offcanvas-body">
                <div class="row container-fluid text-center">
                    <h2
                        id="offcanvasRightLabel"
                        class="offcanvas-title fs-3 fw-bold mb-4"
                    >
                        Configurações Área de Atendimento
                    </h2>

                    <div class="col-md-12">
                        <h2
                            style="font-size: 1.5rem"
                            class="text-start"
                        >
                            Notificação de atendimento
                        </h2>

                        <div class="d-flex justify-content-between mt-4">
                            <h3
                                style="font-size: 1rem"
                                class="text-start"
                            >
                                Deseja Ativar notificação?
                            </h3>
                            <div class="form-check form-switch">
                                <input
                                    id="flexSwitchCheckDefault"
                                    class="form-check-input fs-2"
                                    type="checkbox"
                                    :checked="audioStatus"
                                    role="switch"
                                    @change="ativarNotificacao"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            id="settings-mobile"
            class="offcanvas offcanvas-end"
            style="width: 90%"
            tabindex="-1"
            aria-labelledby="settings-mobile"
        >
            <div class="offcanvas-body">
                <div class="row container-fluid text-center">
                    <h2
                        id="offcanvasRightLabel"
                        class="offcanvas-title fs-3 fw-bold mb-4"
                    >
                        Configurações Área de Atendimento
                    </h2>

                    <div class="col-md-12">
                        <h2
                            style="font-size: 1.5rem"
                            class="text-start"
                        >
                            Notificação de atendimento
                        </h2>

                        <div class="d-flex justify-content-between mt-4">
                            <h3
                                style="font-size: 1rem"
                                class="text-start"
                            >
                                Deseja Ativar notificação?
                            </h3>
                            <div class="form-check form-switch">
                                <input
                                    id="flexSwitchCheckDefault"
                                    class="form-check-input fs-2"
                                    type="checkbox"
                                    :checked="audioStatus"
                                    role="switch"
                                    @change="ativarNotificacao"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="offcanvas-header p-2">
                <button
                    type="button"
                    class="btn btn-danger fs-4 fw-bold ms-auto"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                >
                    Fechar
                </button>
            </div>
        </div>

        <editar-contato
            :user="selecionado"
            :grupos="grupos"
            @updated-atendimentos="chamarMeusAtendimentos"
        />

        <transferir-atendimento
            :id_atendimento="selecionado.id_atendimento"
            :chamar-dados="chamarAtendimentosFila"
            :atualizaMeusAtendimentos="chamarMeusAtendimentos"
            :Chamafirebase ="atualizaFilaFirebase"
            :fechar-tela-de-conversa="fecharTelaDeConversa"
        />

        <apagarMensagem
            :mensagemdeleta="mensagemapagar"
            :id_mensagem="message_id"
            :fone="selecionado.fone"
            :atualizarConversa="atualizarConversa"
        />

        <compartilhar-contato
            :fone="selecionado.fone"
            :atualiza-conversa="atualizarConversa"
        />

        <encaminha-mensagens
            :fone="selecionado.fone"
            :name="selecionado.nome"
            :limpa-array="limparArrayMensagensSelecionadas"
            :lista-mensagens-selecionadas="listaMensagensSelecionadas"
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

    <div
        v-else-if="plano_id == 3"
        class="container-main"
    >
        <h1>Seu plano não possui Zapcenter</h1>
    </div>
</template>

<script>
import ListaAtendimentos from '@/components/atendimento/ListaAtendimentos.vue'
import ListaAtendimentosChatInterno from '@/components/atendimento/ListaAtendimentosChatInterno.vue'
import ChatAtendimento from '@/components/atendimento/ChatAtendimento.vue'
import ChatAtendimentoContatosInterno from '@/components/atendimento/ChatAtendimentoContatosInterno.vue'
import Api from '@/services/api'
import EditarContato from '@/components/atendimento/acao/editarContato.vue'

import TransferirAtendimento from '@/components/atendimento/acao/transferirAtendimento.vue'
import apagarMensagem from '@/components/atendimento/acao/apagaMensagem.vue'

import compartilharContato from '@/components/atendimento/acao/compartilharContato.vue'
import encaminhaMensagens from '@/components/atendimento/acao/encaminhaMensagens.vue'
import AdicionarContato from '@/components/atendimento/acao/ADDUSUARIOVUE.vue'

import AudioFila from '@/assets/audios/notifica.mp3'
import EmojiPicker from 'vue3-emoji-picker'
import middleware from '@/services/middleware'
import Swal from 'sweetalert2'
import DisplayMedia from '@/components/modals/display-media/DisplayMedia.vue'
import { ref, onValue } from 'firebase/database'
import DisplayDocument from '@/components/modals/display-document/DisplayDocument.vue'
import DisplayTemplateMessage from '@/components/modals/display-template-message/DisplayTemplateMessage.vue'
import { formatSize, formatTextForLimited } from '@/utils/formatters'
import DisplayMediaPreview from '@/components/modals/display-media-preview/DisplayMediaPreview.vue'
import AudioRecorderComponent from '@/components/atendimento/acao/AudioRecorderComponent.vue'
import { mapActions } from 'pinia'
import { useListStatesStore } from '@/stores/useListStatesStore.js'
import ImgComponent from '@/components/ui/ImgComponent.vue'

export default {
    name: 'atendimento',

    components: {
        ImgComponent,
        ListaAtendimentos,
        ChatAtendimento,
        EditarContato,
        TransferirAtendimento,
        apagarMensagem,
        compartilharContato,
        AdicionarContato,
        EmojiPicker,
        ListaAtendimentosChatInterno,
        ChatAtendimentoContatosInterno,
        encaminhaMensagens,
        DisplayMedia,
        DisplayDocument,
        DisplayTemplateMessage,
        DisplayMediaPreview,
        AudioRecorderComponent,
    },

    data() {
        return {
            processando: false,
            mensagemdireta: '',
            mensagemapagar: '',
            plano_id: 0,
            mediaRecorder: null,
            chunks: [],
            mensagem: '',
            listaContatosSelecionado: [],
            listaContatos: {
                fila: [],
                meusAtendimentos: [],
                todos: [],
            },
            listaContatosPesquisa: [],
            listaContatosInterno: null,
            requisaoApi: null,
            abrirMsg: false,
            abrirEscolha: false,
            abrirDropdown: false,
            localId: null,
            mensagens: [],
            foneConversa: null,
            selecionado: {},
            status_chat: false,
            grupos: [],
            dados: {},
            atendimentoStatus: null,
            ativado: 0,
            opcaoSelecionada: 'atendimento',
            pesquisa: '',
            fila_qtd: '',
            meusatendimentos_qtd: '',
            notificacao: false,
            lista_fones_notificados: [],
            qtdmensagens: '',
            qtdconversas: 0,
            qtdmensagensinternas: 0,
            session: '',
            alerta: '',
            number: '',
            listaMensagensSelecionadas: [],
            estadoEncaminharMensagens: false,
            estadoResponderMensagem: false,
            mensagemResponder: {},
            message_id: null,
            tipo_usuario: null,
            audioStatus: null,

            recordMode: {
                audio: 'hold',
                video: 'press',
            },
            recordings: [],
            novaTransferencia: false,
            mensageminterna: false,

            mimetype: 'audio/webm',

            openOpt: false,

            modalMediaData: {},
            modalMediaPreviewData: {},
            modalDocumentData: {},
            openModalMedia: false,
            openModalMediaPreview: false,
            openModalDocument: false,

            showEmojiPicker: false,
            isChatInternal: false,
            listaContatosLoading: false,
            hasImgError: false,

            isRecorder: false,
            textareaRows: 1,
        }
    },

    computed: {
        templateData() {
            return {
                user_id: localStorage.getItem(`@USER_ID`),
                nome: this.selecionado.nome,
                fone: this.selecionado.fone,
                mensagem: null,
                mensagem_id: this.message_id,
                status: 1, // 1 - mensagem normal || 2 - responder
            }
        },
    },

    watch: {
        openOpt(isOpen) {
            if (isOpen) {
                this.$nextTick(() => {
                    document.addEventListener('click', this.handleClickOutside)
                })
            } else {
                document.removeEventListener('click', this.handleClickOutside)
            }
        },

        showEmojiPicker(isOpen) {
            if (isOpen) {
                this.$nextTick(() => {
                    document.addEventListener('click', this.handleClickOutsideEmoji)
                })
            } else {
                document.removeEventListener('click', this.handleClickOutsideEmoji)
            }
        },

        abrirEscolha(newValue) {
            if (newValue) {
                this.$nextTick(() => {
                    document.addEventListener('click', this.handleClickOutsideEscolha)
                })
            } else {
                document.removeEventListener('click', this.handleClickOutsideEscolha)
            }
        },

        pesquisa(newValue) {
            if (newValue.length === 0) {
                this.listaContatosPesquisa = []
            }
        },

        opcaoSelecionada: {
            handler(newVal) {
                switch (newVal) {
                    case 'atendimento':
                        this.listaContatosSelecionado = this.listaContatos.meusAtendimentos

                        break

                    case 'fila':
                        this.listaContatosSelecionado = this.listaContatos.fila

                        break

                    case 'todos':
                        this.listaContatosSelecionado = this.listaContatos.todos

                        break

                    case 'interno':
                        this.chamarMeusChatsInternos()

                        break

                    default:
                        console.warn('WATCH(opcaoSelecionada): Nenhuma das alternativas é válida.')

                        break
                }
            },
            immediate: true,
        },

        listaContatos: {
            handler(newVal) {
                switch (this.opcaoSelecionada) {
                    case 'atendimento':
                        this.listaContatosSelecionado = newVal.meusAtendimentos

                        break

                    case 'fila':
                        this.listaContatosSelecionado = newVal.fila

                        break

                    case 'todos':
                        this.listaContatosSelecionado = newVal.todos

                        break

                    case 'interno':
                        this.chamarMeusChatsInternos()

                        break
                }
            },
            deep: true,
        },

        selecionado: {
            handler(newVal) {
                if (!newVal?.foto || newVal?.foto?.length === 0) {
                    this.hasImgError = true

                    return
                }

                this.hasImgError = false
            },
            immediate: true,
            deep: true,
        },
    },

    async mounted() {
        await this.chamarMeusAtendimentos()
        await this.chamarAtendimentosFila()
        await this.chamarTodosAtendimentos()
        await this.getEstados()

        this.session = localStorage.getItem('@SESSION')
        this.alerta = localStorage.getItem('@MENSAGEM')

        if (this.alerta === 'browserClose') {
            await Swal.fire(
                'Celular Desconectado!',
                'Solicite ao Administrador para reconectar o celular, mensagens não serão enviadas ou recebidas',
                'error'
            )
        }

        this.number = localStorage.getItem('@NUMBER')
        this.tipo_usuario = localStorage.getItem('@TIPO')
        this.audioStatus = localStorage.getItem('@STATUS_NOTIFICACAO') !== 'false'

        this.transferenciainterna()
        this.atualizaFilaFirebase()
        this.novamensagem()
        this.novamensageminterna()
        this.chamaGrupo()
        this.updateStyleTabs()
    },

    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside)
        document.removeEventListener('click', this.handleClickOutsideEscolha)
        document.removeEventListener('click', this.handleClickOutsideEmoji)
    },

    methods: {
        formatTextForLimited,
        ...mapActions(useListStatesStore, ['setStates']),

        ativarNotificacao() {
            this.audioStatus = !this.audioStatus

            localStorage.setItem('@STATUS_NOTIFICACAO', this.audioStatus)
        },

        fecharLayoutBatePapo() {
            this.estadoEncaminharMensagens = false
            this.listaMensagensSelecionadas = []
        },

        limparArrayMensagensSelecionadas() {
            this.listaMensagensSelecionadas = []
            this.fecharLayoutBatePapo()
        },

        alterarLayoutBatePapo() {
            this.estadoEncaminharMensagens = true
            this.estadoResponderMensagem = false
        },

        responderLayout(payload) {
            this.estadoEncaminharMensagens = false
            this.estadoResponderMensagem = true
            this.message_id = payload.id

            this.mensagemResponder = {
                mensagem: payload.mensagem,
                nome:
                    payload?.wook === 'onack'
                        ? 'Você'
                        : payload?.nome
                          ? payload.nome
                          : payload.fone,
                wook: payload?.wook,
                mediaUrl: payload?.mediaUrl,
            }
        },

        abremodal_apagarmensagem(payload) {
            const abrirmodal = document.querySelector('#apagarmensagemmodal')
            const modal = bootstrap.Modal.getOrCreateInstance(abrirmodal)

            modal.show()

            this.mensagemapagar = payload.mensagem
            this.message_id = payload.id
        },

        fecharResponderLayout() {
            this.estadoResponderMensagem = false
            this.listaMensagensSelecionadas = []
        },

        async Pesquisar() {
            this.listaContatosLoading = true

            if (this.pesquisa.length === 0) return

            try {
                const response = await Api.post(`/busca_contatos/ZmlsYWRlYXRlbmRpbWVudG8=`, {
                    id: localStorage.getItem('@USER_ID'),
                    busca: this.pesquisa,
                })

                this.listaContatosPesquisa = response.data.contatos.data
            } catch (error) {
                console.error(error)

                this.listaContatosLoading = false
            } finally {
                this.listaContatosLoading = false
            }
        },

        toggle() {
            this.showRecorder = !this.showRecorder
        },
        sair() {
            middleware.logout()
        },

        onEmojiSelect(emoji) {
            this.mensagem += emoji.i

            this.showEmojiPicker = false
        },

        handleClickOutsideEmoji(event) {
            const emojiPickerElement = this.$refs.emojiPicker?.$el
            const emojiButton = event.target.closest('.input-group-prepend button')

            if (emojiPickerElement && !emojiPickerElement.contains(event.target) && !emojiButton) {
                this.showEmojiPicker = false
            }
        },

        transferenciainterna() {
            const id = localStorage.getItem('@USER_ID')
            const instancia = 'aW56YXBicmFzaWx2dWU=/' + this.session + '/TRANSFERENCIA/' + id

            const dbRef = ref(this.$database, `/${instancia}`)

            onValue(dbRef, () => this.recebeuNovaTransferencia())
        },

        atualizaFilaFirebase() {
            const instancia = 'aW56YXBicmFzaWx2dWU=/' + this.session + '/FILA'

            const dbRef = ref(this.$database, `/${instancia}`)

            onValue(dbRef, data => {
                const values = data.val()

                if (this.audioStatus) {
                    this.executaSom(AudioFila)
                }

                this.fila_qtd = values.fila

                this.chamarAtendimentosFila()
                this.chamarMeusAtendimentos()
                this.chamarTodosAtendimentos()
            })
        },

        novamensagem() {
            const instancia = 'aW56YXBicmFzaWx2dWU=/' + this.session + '/MENSAGENS'

            const dbRef = ref(this.$database, `/${instancia}`)

            onValue(dbRef, () => this.atualizarConversa())
        },

        novamensageminterna() {
            const id = localStorage.getItem('@USER_ID')

            const instancia = 'aW56YXBicmFzaWx2dWU=/' + this.session + '/CHAT_INTERNO/' + id

            const dbRef = ref(this.$database, `/${instancia}`)

            onValue(dbRef, () => {

                this.qtdmensagensinternas = 1

                this.recebeumensageminterna()
                this.atualizarConversaInterna()
            })
        },

        async enviarMensagem() {
            if (this.mensagem === '') return

            this.textareaRows = 1

            const mensagem = this.mensagem
            const nome = localStorage.getItem(`@USER_NAME`) + '\r\n\t\t' + mensagem

            const novaMensagemText = {
                mensagem: nome,
                type: 'text',
            }

            this.mensagem = ''

            if (this.mensagens == 'Nao ha mensagem para esse contato') {
                this.mensagens = 'processando...'
            } else {
                this.mensagens.push(novaMensagemText)
            }

            const objEnviaMensagem = {
                user_id: localStorage.getItem(`@USER_ID`),
                fone: this.selecionado.fone,
                mensagem: mensagem,
                mensagem_reply: this.estadoResponderMensagem
                    ? this.mensagemResponder?.mensagem
                    : null,
                mensagem_id: this.message_id,
                status: this.estadoResponderMensagem ? 2 : 1, // 1 - mensagem normal || 2 - responder
            }

            await Api.post('/envia_mensagemnova/ZmlsYWRlYXRlbmRpbWVudG8=', objEnviaMensagem)
                .then(response => {
                    if (response.data.erro == 'number_incorret') {
                        Swal.fire(
                            'Mensagem não enviada!',
                            response.data.retorno + 'Reconecte o celular!',
                            'error'
                        )

                        this.atualizarConversa()
                    }

                    if (response.data.erro == 0) {
                        this.atualizarConversa()
                    }
                })
                .catch(error => {
                    console.error(error)
                })

            this.fecharResponderLayout()

            this.message_id = null
        },

        enviarMensagemChatInterno() {
            const mensagem = this.mensagem
            const nova = {
                de_chat: localStorage.getItem(`@USER_ID`),
                msg_chat: mensagem,
                type: 'text',
            }

            const objEnviaMensagem = {
                user_id: localStorage.getItem(`@USER_ID`),
                id_transferido: this.selecionado.id,
                mensagem: mensagem,
            }

            this.mensagem = ''
            this.mensagens.push(nova)

            Api.post('/mensagem_chat_interno/ZmlsYWRlYXRlbmRpbWVudG8=', objEnviaMensagem)
                .then(() => {
                    this.atualizarConversaInterna()
                })
                .catch(error => {
                    console.error(error)
                })
        },

        chamaGrupo() {
            Api.post('/grupos/ZmlsYWRlYXRlbmRpbWVudG8=', {
                id: localStorage.getItem('@USER_ID'),
            })
                .then(response => {
                    this.grupos = response.data.grupos
                })
                .catch(err => {
                    console.log(err)
                })
        },

        fecharAtendimento(id_atendimento) {
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
                            this.abrirMsg = !this.abrirMsg

                            this.listaContatosSelecionado = []
                            this.listaContatosPesquisa = []

                            this.chamarMeusAtendimentos()
                            this.atualizaFilaFirebase()
                            
                            
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
        },

        atualizarConversa() {
            this.processando = true

            Api.post('/atualiza_conversas/ZmlsYWRlYXRlbmRpbWVudG8=', {
                id: localStorage.getItem('@USER_ID'),
                fone: this.selecionado.fone,
            })
                .then(response => {
                    this.status_chat = true

                    let data = response.data

                    if (typeof data === 'string') {
                        this.mensagens = data
                    } else {
                        let mensagensInvertidas = data.conversas.slice(0).reverse()

                        this.mensagens = mensagensInvertidas

                        let listaQtdeMensagens = data.qtdmensagens

                        this.montarNotificacoes(listaQtdeMensagens)
                    }
                })
                .catch(error => console.error(error))
                .finally(() => (this.processando = false))
        },

        abrirConversaContatoEncaminhado(info) {
            let fone = info.mensagem
            let nome_contato = info.contactName

            let objConversas = {
                id: localStorage.getItem('@USER_ID'),
                fone: fone,
                nome_contato: nome_contato,
            }

            Api.post('/conversas_bd/ZmlsYWRlYXRlbmRpbWVudG8=', objConversas)
                .then(response => {
                    let data = response.data

                    let ativo = response.data.usuario
                    let qtd = data.qtd

                    this.notificacao = false

                    Api.post(`/busca_contatos/ZmlsYWRlYXRlbmRpbWVudG8=`, {
                        id: localStorage.getItem('@USER_ID'),
                        busca: info.mensagem,
                    }).then(resposta => {
                        let dados = resposta.data

                        let contatoInfo = dados.contatos.data[0]

                        this.selecionado = contatoInfo

                        this.mensagens = []

                        if (qtd > 0) {
                            this.qtdconversas = qtd
                            this.status_chat = true
                            // pegando array de mensagens da requisição
                            let mensagensInvertidas = data.conversas.slice(0).reverse()
                            this.mensagens = mensagensInvertidas
                            this.foneConversa = this.selecionado.fone
                            this.ativado = this.selecionado.id
                            this.atendimentoStatus = ativo.ativo === 1 ? true : false

                            this.salvaConversa()
                        } else {
                            this.qtdconversas = qtd
                            this.status_chat = false

                            this.mensagens = data.mensagem
                            this.foneConversa = this.selecionado.fone
                            this.ativado = this.selecionado.id
                            this.atendimentoStatus = ativo.ativo === 1 ? true : false
                            this.salvaConversa()
                        }

                        this.chamarMeusAtendimentos()
                        this.atualizaFilaFirebase()
                    })
                })
                .catch(error => {
                    console.error(error)
                })
        },

        abrirConversa(info_user) {
            this.processando = true
            this.selecionado = info_user.usuario

            let objConversas = {
                id: localStorage.getItem('@USER_ID'),
                fone: this.selecionado.fone,
                nome_contato: this.selecionado.nome,
            }

            this.mensagens = []

            Api.post('/conversas_bd/ZmlsYWRlYXRlbmRpbWVudG8=', objConversas)
                .then(response => {
                    const data = response.data
                    const ativo = response.data?.usuario
                    const qtd = data.qtd

                    this.notificacao = false

                    if (qtd > 0) {
                        this.qtdconversas = qtd
                        this.status_chat = true

                        // pegando array de mensagens da requisição
                        let mensagensInvertidas = data.conversas.slice(0).reverse()
                        this.mensagens = mensagensInvertidas

                        this.foneConversa = this.selecionado.fone
                        this.ativado = this.selecionado.id
                        this.atendimentoStatus = Boolean(ativo.ativo)

                        this.salvaConversa()
                    } else {
                        this.qtdconversas = qtd
                        this.status_chat = false

                        this.mensagens = data.mensagem

                        this.foneConversa = this.selecionado.fone
                        this.ativado = this.selecionado.id
                        this.atendimentoStatus = Boolean(ativo.ativo)

                        this.salvaConversa()
                    }

                    this.chamarAtendimentosFila()
                    this.chamarMeusAtendimentos()
                    this.processando = false
                })
                .catch(error => {
                    console.error(error)

                    this.processando = false
                })

            this.abrirMsg = true

            this.opcaoSelecionada = 'atendimento'
            this.pesquisa = ''

            this.updateStyleTabs()
        },

        salvaConversa() {
            let objConversas = {
                id: localStorage.getItem('@USER_ID'),
                fone: this.selecionado.fone,
            }

            Api.post('/conversas/ZmlsYWRlYXRlbmRpbWVudG8=', objConversas)
                .then(() => {})
                .catch(error => console.error(error))
        },

        async chamarMeusAtendimentos() {
            try {
                if (this.listaContatosInterno) {
                    this.abrirMsg = false
                }

                this.listaContatosInterno = null
                this.pesquisa = ''

                const response = await Api.post('/meus_atendimentos/ZmlsYWRlYXRlbmRpbWVudG8=', {
                    id: localStorage.getItem('@USER_ID'),
                    setor_id: localStorage.getItem('@SETOR_ID'),
                })

                const data = response.data

                this.listaContatos.meusAtendimentos = data?.meusatendimentos ?? []
                this.fila_qtd = data?.qtdfila_atendimento ?? ''
                this.meusatendimentos_qtd = data?.qtdmeus_atendimentos ?? ''

                this.montarNotificacoes(data?.qtdmensagens)
                
            } catch (error) {
                console.error(error)
            }
        },

        async chamarTodosAtendimentos() {
            try {
                if (this.listaContatosInterno) {
                    this.abrirMsg = false
                }

                this.listaContatosInterno = null
                this.pesquisa = ''

                const response = await Api.post(
                    '/fila_atendimento_todas/ZmlsYWRlYXRlbmRpbWVudG8=?dXNlcl9pZA=MTEy',
                    {
                        dXNlcl9pZA: btoa(localStorage.getItem('@USER_ID')),
                    }
                )

                const data = response.data

                this.listaContatos.todos = data?.fila ?? []
            } catch (error) {
                console.error(error)
            }
        },

        recebeuNovaTransferencia() {
            this.novaTransferencia = true

            setTimeout(() => {
                this.novaTransferencia = false
            }, 1000)
        },

        recebeumensageminterna() {
            this.mensageminterna = true

            setTimeout(() => {
                this.mensageminterna = false
            }, 1000)
        },

        montarNotificacoes(lista_qtde_mensagens) {
            if (!lista_qtde_mensagens) return

            const fones_enviados = lista_qtde_mensagens.map(usuarios => usuarios.fone_enviado)

            this.lista_fones_notificados = []

            for (let i = 0; i < this.listaContatosSelecionado.length; i++) {
                const qtdeMensagensFone = lista_qtde_mensagens.filter(mensagem => {
                    return mensagem.fone_enviado == this.listaContatosSelecionado[i].fone
                }).length

                const index = fones_enviados.findIndex(
                    val => val.fone_enviado == this.listaContatosSelecionado[i].fone
                )

                // // so rodar quando o numero que enviou mensagem não existe dentro de algum objeto do array
                if (index < 0) {
                    const obj = {
                        fone: this.listaContatosSelecionado[i].fone,
                        qtdeMensagens: qtdeMensagensFone,
                    }

                    this.lista_fones_notificados.push(obj)
                }
            }
        },

        async chamarAtendimentosFila() {
            try {
                if (this.listaContatosInterno) {
                    this.abrirMsg = false
                }

                this.listaContatosInterno = null
                this.pesquisa = ''

                const response = await Api.post('/fila_atendimento/ZmlsYWRlYXRlbmRpbWVudG8=', {
                    id: localStorage.getItem('@USER_ID'),
                    setor_id: localStorage.getItem('@SETOR_ID'),
                })

                const data = response.data

                this.plano_id = data.plano

                this.fila_qtd = response.data.fila.length

                this.listaContatos.fila = data?.fila ?? []
            } catch (error) {
                console.error(error)
            }
        },

        bloqueiaAtendimento(contato_id) {
            Api.post('/bloqueia_contato/ZmlsYWRlYXRlbmRpbWVudG8=', {
                id: localStorage.getItem('@USER_ID'),
                contato_id: contato_id,
            })
                .then(response => {
                    this.atendimentoStatus = response.data.status
                })
                .catch(error => {
                    console.error(error)
                })
        },

        abrirEscolhas() {
            this.abrirEscolha = !this.abrirEscolha
        },

        voltar() {
            this.abrirMsg = !this.abrirMsg

            this.fecharLayoutBatePapo()
            this.fecharResponderLayout()
        },

        responsivo() {
            this.abrirDropdown = !this.abrirDropdown
        },

        fecharTelaDeConversa() {
            this.abrirMsg = false
        },

        executaSom(som) {
            if (som) {
                let audio = new Audio(som)
                audio.play()
            }
        },

        chamarMeusChatsInternos() {
            this.opcaoSelecionada = 'interno'
            this.pesquisa = ''
            this.abrirMsg = false

            Api.post('/meus_chat_interno/ZmlsYWRlYXRlbmRpbWVudG8=', {
                id: localStorage.getItem('@USER_ID'),
            })
                .then(response => {
                    const data = response.data

                    this.qtdmensagensinternas = data.lido
                    this.listaContatosInterno = data.atendentes
                })
                .catch(error => {
                    console.error(error)
                })
        },

        abrirConversaChatInterno(info_user) {
            this.selecionado = info_user.usuario
            let objConversas = {
                id: localStorage.getItem('@USER_ID'),
                id_transferido: this.selecionado.id,
            }

            this.mensagens = []
            Api.post('/conversa_chat_interno/ZmlsYWRlYXRlbmRpbWVudG8=', objConversas)
                .then(response => {
                    let data = response.data.conversas

                    // verificando se ta vindo vazio
                    if (typeof data.mensagem === 'string') {
                        this.mensagens = []
                    } else {
                        this.mensagens = data

                        this.foneConversa = this.selecionado.id

                        this.ativado = this.selecionado.id

                        this.qtdmensagensinternas = response.lido
                    }
                })
                .catch(error => console.error(error))

            this.abrirMsg = true
        },

        atualizarConversaInterna() {
            let objConversas = {
                id: localStorage.getItem('@USER_ID'),
                id_transferido: this.selecionado.id,
            }

            this.mensagens = []
            Api.post('/conversa_chat_interno/ZmlsYWRlYXRlbmRpbWVudG8=', objConversas)
                .then(response => {
                    const data = response.data.conversas

                    if (typeof data.mensagem === 'string') {
                        this.mensagens = []
                    } else {
                        this.mensagens = data
                    }
                })
                .catch(error => console.error(error))
        },

        fecharAtendimentoContatoInterno() {
            this.abrirMsg = false
        },

        async getEstados() {
            try {
                const response = await Api.post(`/cidades/ZmlsYWRlYXRlbmRpbWVudG8=`, {
                    id: localStorage.getItem('@USER_ID'),
                })

                this.setStates(response.data.estados)
            } catch (error) {
                console.error(error)
            }
        },

        handleClickOutside(event) {
            const dropdownContent = this.$refs.dropdownContent
            const btnOptClick = event.target.closest('.btn-opt')

            if (dropdownContent && !dropdownContent.contains(event.target) && !btnOptClick) {
                this.openOpt = false
            }
        },

        handleClickOutsideEscolha(event) {
            const optMenu = this.$refs.optMenu
            const btnEscolhasClick = event.target.closest('.btn-escolhas')

            if (optMenu && !optMenu.contains(event.target) && !btnEscolhasClick) {
                this.abrirEscolha = false
            }
        },

        updateStyleTabs() {
            this.$nextTick(() => {
                const btnQueue = document.querySelector('#btn-fila')
                const btnServices = document.querySelector('#btn-atendimentos')
                const btnAll = document.querySelector('#btn-todos')

                ;[btnQueue, btnServices, btnAll].forEach(btn => {
                    if (btn) btn.classList.remove('btn-active')
                })

                switch (this.opcaoSelecionada) {
                    case 'fila':
                        btnQueue?.classList.add('btn-active')
                        break
                    case 'atendimento':
                        btnServices?.classList.add('btn-active')
                        break
                    case 'todos':
                        btnAll?.classList.add('btn-active')
                        break
                }
            })
        },

        handleClickTabs(event) {
            const btnQueue = event.target.closest('#btn-fila')
            const btnServices = event.target.closest('#btn-atendimentos')
            const btnAll = event.target.closest('#btn-todos')
            const btnInternalServices = event.target.closest('#btn-atendimentos-internos')

            this.pesquisa = ''

            if (btnQueue) {
                this.opcaoSelecionada = 'fila'
            } else if (btnServices) {
                this.opcaoSelecionada = 'atendimento'
            } else if (btnInternalServices) {
                this.opcaoSelecionada = 'interno'
            } else if (btnAll) {
                this.opcaoSelecionada = 'todos'
            }

            console.log(this.listaContatosSelecionado)

            this.updateStyleTabs()
        },

        handleModalMedia(value = []) {
            this.modalMediaData = {
                userPhoto: this.selecionado.foto,
                userName: value.userName,
                urlMedia: value.url,
                type: value.type,
                wook: value.wook,
            }

            this.openModalMedia = true
        },

        openFileManager(isInternal) {
            this.isChatInternal = !!isInternal

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

            const maxSize = 30 * 1024 * 1024 // 30 MB

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

                        this.modalDocumentData = {
                            dataFile: file ?? null,
                            recipientId: this.selecionado?.id ?? null,
                            recipientFone: this.selecionado?.fone ?? null,
                            isChatInternal: this.isChatInternal,
                            wook: 'onack',
                        }

                        this.openModalDocument = true
                    }
                },
                { once: true }
            )

            input.click()
        },

        openFileManagerMidiaPreview() {
            const allowedMimeTypes = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/gif',
                'image/webp',
                'image/bmp',
                'image/tiff',

                'video/mp4',
                'video/quicktime', // .mov
                'video/x-msvideo', // .avi
                'video/x-ms-wmv', // .wmv
                'video/3gpp', // .3gp
                'video/x-flv', // .flv
                'video/webm',
                'video/x-matroska', // .mkv
            ]
            const maxSize = 100 * 1024 ** 2 // 30 MB

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

                        this.modalMediaPreviewData = {
                            dataFile: file ?? null,
                            recipientId: this.selecionado?.id ?? null,
                            recipientFone: this.selecionado?.fone ?? null,
                            wook: 'onack',
                        }

                        this.openModalMediaPreview = true
                    }
                },
                { once: true }
            )

            input.click()
        },

        handleCloseModal() {
            this.openModalMedia = false
            this.openModalDocument = false
            this.openModalMediaPreview = false
        },

        updateMessages() {
            if (!this.isChatInternal) {
                this.atualizarConversa()

                return
            }

            this.atualizarConversaInterna()
        },

        filterMessages(msgs) {
            if (typeof msgs === 'string') return msgs

            if (!msgs && !Array.isArray(msgs) && msgs.length === 0) return []

            return msgs.filter(msg => msg.type && (msg.type === 'image' || msg.type === 'video'))
        },

        viewIsRecordingEvent(isRecording) {
            this.isRecorder = isRecording
        },

        async sendRecorderAudio(audioData) {
            try {
                const obj = {
                    user_id: localStorage.getItem('@USER_ID'),
                    fone: this.selecionado?.fone,
                    midia: audioData,
                    type: 2,
                }

                console.log(audioData)

                return

                const binaryObj = new FormData()

                Object.entries(obj).forEach(([key, value]) => {
                    binaryObj.append(key, value)
                })

                await Api.post('/envia_midianovo/ZmlsYWRlYXRlbmRpbWVudG8=', binaryObj)

                this.atualizarConversa()
            } catch (error) {
                console.error(error)

                Swal.fire({
                    icon: 'error',
                    title: 'Erro ',
                    text: 'Erro ao enviar audio.',
                    confirmButtonColor: '#17a2b8',

                    didOpen: () => {
                        const confirmBtn = Swal.getConfirmButton()
                        const actionsContainer = confirmBtn.parentElement

                        actionsContainer.style.width = '100%'
                        actionsContainer.style.display = 'flex'
                        actionsContainer.style.justifyContent = 'center'

                        confirmBtn.style.width = '90%'
                    },
                }).then(() => {
                    this.isRecorder = false
                })
            } finally {
                this.isRecorder = false
            }
        },

        verifyTextareaRowsSize() {
            const textarea = this.$refs.textarea
            this.textareaRows = 1

            this.$nextTick(() => {
                const style = window.getComputedStyle(textarea)
                const lineHeight = parseInt(style.lineHeight) // altura de uma linha
                const scrollHeight = textarea.scrollHeight // altura total

                const requiredRows = Math.floor(scrollHeight / lineHeight) // número de linhas
                this.textareaRows = Math.min(requiredRows, 10)
            })
        },
    },
}
</script>

<style scoped>
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
}

.box::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
}

.box .leftSide {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 30%;
    background-color: #fff;
}

.box .rightSide {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 70%;
    height: 100%;

    background-color: #fff;
    border-left: 3px solid #eaeaea;
}

.contatos {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
}

/* Para o chat de mensagens dentro dos componentes filhos */
.chat-container {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
}

.rightSide.apresentacao {
    display: flex;
    align-items: center;
    justify-content: center;
}

.chatbox_wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;

    background-color: #f5f1eb;
}

.responsive {
    display: none;
    position: relative;
}

.settings img {
    width: 30px;
    height: 30px;
}

.settings-mobile img {
    width: 50%;
}

.sub-menu {
    position: absolute;
    width: 60px;
    right: -10px;
    z-index: 5;
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
}

@media (min-width: 900px) {
    .menu-escolhas {
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
    will-change: transform; /* tira borrão da transição do scale */
    backface-visibility: hidden; /* Evita flickering */
}

.btn-menu:hover {
    background-color: #f5f2f2;
    transform: scale(1.01);
}

.btn-menu i {
    font-size: 24px;
}

.menu-escolhas.on {
    display: block !important;
}

.sub-menu button {
    margin-top: 5px;
}

.header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 0.2fr;
    width: 100%;
    padding-bottom: 1px;

    background: #2cacbf;
}

.header button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;

    background: #2cacbf;
    border-radius: 5px;

    transition: background-color 100ms ease;
}

.header button:focus {
    outline: none;
    border: 2px solid #fcb92c !important;
    z-index: 10;
}

.headerConversation {
    width: 100%;
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    background-color: #ffff;
    border-bottom: 2px solid #eaeaea;
    border-radius: 5px;
}

#btn-fila {
    display: flex;
    justify-content: center;
    align-items: center;
}

#btn-fila div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;

    gap: 0.4em;
}

#btn-atendimentos {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

#btn-atendimentos div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;

    gap: 0.4em;
}

.badge-custom {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1rem !important;
    height: 1rem !important;

    border-radius: 50%;
    font-size: 10px;
}

.header button:hover {
    background: #0c9fb4;
    transform: scale(1.015);
}

.btn-opt i {
    font-size: 20px;
    padding: 1px 4px;
}

.header button.btn-active {
    border-bottom: 4px #fe9a2d solid;
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
}

.opt-modal button {
    display: flex;
    width: 100%;
    justify-content: start;
    padding: 0.4rem 1.6rem;

    background-color: white;
    color: #3b4a54;
    font-weight: bold;
    transition: all 0.1s ease;
}

.opt-modal button:hover {
    background: #f4f4f4;
    transform: scale(1);
    border-radius: 5px;
}

.search {
    position: relative;
    grid-column: span 3;
    border-bottom: 2px solid #eaeaea;
    padding: 10px;
}

.search input {
    width: 100%;
    position: relative;
    padding: 10px 10px 10px 30px;

    border-radius: 5px;
    outline: 0;
    border: 0;
    background-color: #eaeaea;
    font-size: 1.1rem;
}

.search input:focus {
    border: 2px solid #c7c7c7c5;
}

.search .icone-pesquisa {
    position: absolute;
    left: 1rem;
    z-index: 1;
}

.search .layoutNovaTransferencia {
    left: 25px !important;
    bottom: 66px !important;
}

.bg-message {
    background-color: #f0f2f5 !important;
}

.perfil-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.perfil-container button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;

    background: #ffff;
    transition:
        transform 100ms ease-out,
        background-color 100ms ease-out;

    will-change: transform;
    backface-visibility: hidden;
}

.perfil-container button:hover {
    background-color: #f4f4f4;
    transform: scale(1.1);
}

.perfil-container button:focus {
    outline: none;
    border: 2px solid #a7a6a6;
}

.perfil-container button i {
    font-size: 16px;
}

.perfil-content {
    display: flex;
    align-items: center;
    gap: 1px;
}

.perfil-content img {
    width: 40px;
    height: 40px;
}

.imgbx img,
.perfil-content img,
.perfil-container button {
    border-radius: 50%;
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
}

.input-group-prepend button {
    background-color: transparent;

    transition:
        background-color 200ms ease,
        transform 200ms ease;
    will-change: transform;
    backface-visibility: hidden;
}

@media (max-width: 550px) {
    .btn-group {
        display: none;
    }
}

.response-msg-wrapper {
    border-left: solid 3px;
    filter: opacity(85%);
}

.response-btn-close {
    position: absolute;
    right: 1rem;
    top: 0.5rem;
    background-color: transparent;
}

.response-btn-close i {
    color: #6c757d;

    transition: all 0.2s ease;
}

.response-btn-close i:hover {
    color: #4d5359;
}

.response-msg-wrapper dl dt {
    font-size: 0.8rem;
}

.response-msg-wrapper dl dd {
    font-size: 0.83rem;
}

.response-msg-wrapper .response-msg-img {
    width: 50px;
}

@media (min-width: 768px) {
    .response-msg-wrapper .response-msg-img {
        width: 60px;
    }
}

.btn-emoji {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2px 0px;
}

.input-group-prepend .btn-escolhas {
    padding: 6px 5px !important;
}

.input-group-prepend .btn-escolhas:hover,
.btn-emoji:hover {
    background-color: #e8eaee;
    transform: scale(1.05);
}

.input-group-prepend .btn-escolhas:focus,
.btn-emoji:focus {
    outline: none;
    border: 2px solid #bbb9b9 !important;
    border-radius: 50%;
}

.input-group-prepend .btn-escolhas i,
.btn-emoji i {
    color: #4d4f5c;
    transition: all 300ms ease-out;
}

.input-group-prepend .btn-escolhas i.rotated {
    transform: rotate(135deg);
}

.icon-size {
    font-size: 11px;
}

@media (min-width: 576px) {
    .icon-size {
        font-size: 12px;
    }
}

@media (min-width: 1400px) {
    .icon-size {
        font-size: 14px;
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
}

.input-area:focus {
    overflow-y: auto;
}

.input-area::-webkit-scrollbar {
    width: 2px;
}

.input-area::-webkit-scrollbar-track {
    background: transparent;
}

.input-area::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
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
}

.btn-send:hover {
    opacity: 0.9;
}

.btn-send:focus {
    outline: none;
    border: 2px solid #bbb9b9 !important;
}

.icon-send {
    width: 1rem;
    height: 1rem;
}

@media (max-width: 1400px) {
    .header {
        font-size: 0.9em;
    }
}

@media (max-width: 900px) {
    .box.chatAtivo .leftSide {
        display: none;
    }

    .rightSide.apresentacao {
        display: none;
    }

    .box {
        margin: auto;
    }

    .leftSide {
        width: 100%;
    }
}

@media (max-width: 550px) {
    .header {
        font-size: 0.7rem;
    }

    .badge-custom {
        width: 0.9rem !important;
        height: 0.9rem;

        font-size: 7px;
    }

    .responsive {
        display: block;
    }

    .btn-send {
        width: 3rem;
        height: 2.6rem;
    }
}

.layout_encaminharMensagem {
    display: flex;
    padding: 8px;
    align-items: center;
}

.layout_encaminharMensagem span {
    margin-left: auto;
}

.cursor-pointer {
    cursor: pointer;
}

.fs-16 {
    font-size: 16px;
}
</style>
