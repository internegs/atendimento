<template>
    <div
        v-if="plano_id != 3"
        class="container-main"
    >
        <div
            v-if="abrirEscolha"
            class="fundo-transparente"
            @click="fecharEscolhas"
        ></div>

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
                        <ul ref="modalContent">
                            <li>
                                <button
                                    id="btn-atendimentos-internos"
                                    @click="handleClickTabs($event)"
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
                    <div class="input d-flex align-items-center gap-2">
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

                    <div
                        v-if="novaTransferencia"
                        class="fw-bold text-warning text-center"
                    >
                        VOCÊ RECEBEU UMA NOVA TRANSFERÊNCIA!
                    </div>

                    <div
                        v-if="mensageminterna"
                        class="fw-bold text-warning text-center"
                    >
                        NOVA MENSAGEM INTERNA!
                    </div>
                </div>

                <span
                    v-if="pesquisa"
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
                </span>

                <span
                    v-else
                    class="contatos"
                >
                    <!-- Listagem de Contatos -->

                    <span v-if="listaContatosInterno">
                        <lista-atendimentos-chat-interno
                            :lista="listaContatosInterno"
                            :change="abrirConversaChatInterno"
                            :ativado="ativado"
                            :novointerno="qtdmensagensinternas"
                        />
                    </span>

                    <span v-else>
                        <lista-atendimentos
                            :lista="listaContatos"
                            :change="abrirConversa"
                            :ativado="ativado"
                            :tipo="tipo_usuario"
                            :novo="notificacao"
                            :lista_fone="lista_fones_notificados"
                            :qtdmensagens="qtdmensagens"
                        />
                    </span>
                </span>
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
                                <img
                                    :src="selecionado.foto"
                                    alt="foto de perfil"
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
                                <img
                                    :src="selecionado.foto"
                                    alt="foto de perfil"
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
                        :responder-layout="responderLayout"
                        :abremodal_apagarmensagem="abremodal_apagarmensagem"
                        :estado-encaminhar-mensagens="estadoEncaminharMensagens"
                        :estado-responder-mensagem="estadoResponderMensagem"
                        :lista-mensagens-selecionadas="listaMensagensSelecionadas"
                        @handleMedia="handleModalMedia"
                    />
                </div>

                <div
                    v-if="estadoResponderMensagem"
                    class="chat-message-label position-relative"
                    style="background-color: #f0f2f5 !important"
                >
                    <div class="caixa">{{ mensagemResponder }}</div>
                    <div class="input-group-prepend">
                        <span
                            style="padding: 10px; margin-left: auto"
                            class="cursor-pointer"
                            @click="fecharResponderLayout()"
                        >
                            <img
                                src="../assets/close.png"
                                alt=""
                                style="width: 16px; height: 16px"
                            />
                        </span>
                    </div>
                </div>

                <div
                    v-if="listaContatosInterno"
                    style="background-color: #f5f1eb"
                >
                    <div
                        class="chat-message chatbox_input_interno w-100 d-flex gap-3 align-items-center justify-content-center py-3 px-2 rounded-3 shadow-sm"
                    >
                        <div class="input-group-prepend">
                            <transition
                                name="menu-slide"
                                appear
                            >
                                <div
                                    v-if="abrirEscolha"
                                    class="menu-escolhas"
                                >
                                    <button
                                        class="btn-menu"
                                        data-bs-toggle="modal"
                                        data-bs-target="#mandarArquivoChatInterno"
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
                                style="padding: 10px"
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
                                rows="1"
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
                        class="chat-message layout_encaminharMensagem chatbox_input bg-message position-relative"
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
                        class="chat-message chatbox_input w-100 d-flex gap-2 align-items-center py-3 px-2 rounded-3 shadow-sm"
                    >
                        <div class="input-group-prepend">
                            <!-- CSS do efeito em transitions.scss -->
                            <transition
                                name="menu-slide"
                                appear
                            >
                                <div
                                    v-if="abrirEscolha"
                                    class="menu-escolhas"
                                >
                                    <button
                                        class="btn-menu"
                                        data-bs-toggle="modal"
                                        data-bs-target="#mandarArquivo"
                                    >
                                        <i
                                            class="fa-solid fa-file"
                                            style="color: #9141ac"
                                        ></i>

                                        <span>Documentos</span>
                                    </button>

                                    <button
                                        class="btn-menu"
                                        data-bs-toggle="modal"
                                        data-bs-target="#mandarArquivo"
                                    >
                                        <i
                                            class="fa-solid fa-photo-film"
                                            style="color: #1c71d8"
                                        ></i>

                                        <span>Fotos e Videos</span>
                                    </button>

                                    <button
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

                        <div class="input-group-prepend position-relative">
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

                        <div class="d-flex gap-2 w-100 align-items-center">
                            <textarea
                                v-model="mensagem"
                                class="input-area form-control px-2 py-1 w-100"
                                rows="1"
                                placeholder="Mensagem"
                                @keyup.enter.exact="enviarMensagem(1)"
                            ></textarea>

                            <button
                                v-if="mensagem"
                                type="button"
                                class="btn-send"
                                @click="enviarMensagem(1)"
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
            :fechar-tela-de-conversa="fecharTelaDeConversa"
        />

        <apagarMensagem
            :mensagemdeleta="mensagemapagar"
            :id_mensagem="message_id"
            :fone="selecionado.fone"
            :atualizarConversa="atualizarConversa"
        />

        <mandar-arquivo
            :nome-selecionado="selecionado.nome"
            :fone="selecionado.fone"
            :atualiza-conversa="atualizarConversa"
        />

        <abreFoto />

        <mandar-arquivo-chat-interno
            :nome-selecionado="selecionado.nome"
            :id_transferido="selecionado.id"
            :atualiza-conversa="atualizarConversInterna"
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

import abreFoto from '@/components/atendimento/acao/abrefoto.vue'
import TransferirAtendimento from '@/components/atendimento/acao/transferirAtendimento.vue'
import apagarMensagem from '@/components/atendimento/acao/apagaMensagem.vue'
import mandarArquivo from '@/components/atendimento/acao/mandarArquivo.vue'
import mandarArquivoChatInterno from '@/components/atendimento/acao/mandarArquivoChatInterno.vue'

import compartilharContato from '@/components/atendimento/acao/compartilharContato.vue'
import encaminhaMensagens from '@/components/atendimento/acao/encaminhaMensagens.vue'
import AdicionarContato from '@/components/atendimento/acao/ADDUSUARIOVUE.vue'

import AudioFila from '@/assets/audios/notifica.mp3'
import EmojiPicker from 'vue3-emoji-picker'
import middleware from '@/services/middleware'
import Swal from 'sweetalert2'
import DisplayMedia from '@/components/modals/display-media/DisplayMedia.vue'
import { ref, onValue } from 'firebase/database'

export default {
    name: 'atendimento',

    components: {
        ListaAtendimentos,
        ChatAtendimento,
        EditarContato,
        abreFoto,
        TransferirAtendimento,
        apagarMensagem,
        mandarArquivo,
        mandarArquivoChatInterno,
        compartilharContato,
        AdicionarContato,
        EmojiPicker,
        ListaAtendimentosChatInterno,
        ChatAtendimentoContatosInterno,
        encaminhaMensagens,
        DisplayMedia,
    },

    data() {
        return {
            processando: false,
            mensagemdireta: '',
            mensagemapagar: '',
            plano_id: 0,
            mediaRecorder: null,
            chunks: [],
            base64: '',
            mensagem: '',
            listaContatos: [],
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
            mensagemResponder: '',
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
            tooltipStates: {
                transmissao: false,
                editar: false,
                transferir: false,
                fechar: false,

                adicionarContato: false,
            },
            tooltipTimeout: null,
            modalMediaData: {},
            openModalMedia: false,

            showEmojiPicker: false,
        }
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
    },

    mounted() {
        this.$validateTokenPage.start(this.$router)

        this.session = localStorage.getItem('@SESSION')
        this.alerta = localStorage.getItem('@MENSAGEM')

        if (this.alerta === 'browserClose') {
            Swal.fire(
                'Celular Desconectado!',
                'Solicite ao Administrador para reconectar o celular, mensagens não serão enviadas ou recebidas',
                'error'
            )
        }

        this.number = localStorage.getItem('@NUMBER')
        this.tipo_usuario = localStorage.getItem('@TIPO')
        this.audioStatus = localStorage.getItem('@STATUS_NOTIFICACAO') === 'false' ? false : true

        this.transferenciainterna()
        this.atualizafila()
        this.novamensagem()
        this.novamensageminterna()
        this.chamarMeusAtendimentos()
        this.chamaGrupo()
        this.updateStyleTabs()
    },

    beforeUnmount() {
        this.$validateTokenPage.start(this.$router)

        document.removeEventListener('click', this.handleClickOutside)
        document.removeEventListener('click', this.handleClickOutsideEmoji)
    },

    methods: {
        startRecording() {
            navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                this.mediaRecorder = new MediaRecorder(stream)

                this.mediaRecorder.ondataavailable = data => {}

                this.mediaRecorder.start()

                setTimeout(() => {
                    this.mediaRecorder.stop()
                }, 3000)
            })
        },

        stopRecording() {
            this.mediaRecorder.stop()
            const blob = new Blob(this.chunks, { type: 'audio/ogg; codecs=opus' })
            const reader = new window.FileReader()
            reader.readAsDataURL(blob)
            reader.onloadend = () => {
                console.log(reader.result)
            }
            const audioURL = URL.createObjectURL(blob)
            this.$refs.audio.src = audioURL
            console.log(audioURL)
        },

        onStream(stream) {
            this.mediaRecorder = new MediaRecorder(stream)

            this.mediaRecorder.start()

            this.mediaRecorder.ondataavailable = event => {
                this.chunks.push(event.data)
            }
        },

        onResult(data) {
            this.recordings.push({
                src: window.URL.createObjectURL(data),
            })

            this.mediaRecorder.stop()

            const blob = new Blob(this.chunks, { type: 'audio/mpeg' })
            const reader = new window.FileReader()

            reader.readAsDataURL(blob)
            reader.onloadend = () => {
                this.base64 = reader.result
                console.log(this.base64)
            }
        },

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

        responderLayout(mensagem, id) {
            this.estadoEncaminharMensagens = false
            this.message_id = id
            this.estadoResponderMensagem = true
            this.mensagemResponder = mensagem
        },

        abremodal_apagarmensagem(id, mensagem) {
            const abrirmodal = document.querySelector('#apagarmensagemmodal')
            const modal = bootstrap.Modal.getOrCreateInstance(abrirmodal)

            modal.show()
            this.mensagemapagar = mensagem
            this.message_id = id
        },

        fecharResponderLayout() {
            this.estadoResponderMensagem = false
            this.listaMensagensSelecionadas = []
        },

        async Pesquisar() {
            Api.post(`/busca_contatos/ZmlsYWRlYXRlbmRpbWVudG8=`, {
                id: localStorage.getItem('@USER_ID'),
                busca: this.pesquisa,
            })
                .then(response => {
                    let data = response.data

                    this.listaContatosPesquisa = data.contatos.data
                })
                .catch(erro => console.error(erro))
        },

        callback(msg) {
            console.debug('Event: ', msg)
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
                console.log(emojiPickerElement)

                this.showEmojiPicker = false
            }
        },

        transferenciainterna() {
            const id = localStorage.getItem('@USER_ID')
            const instancia = 'aW56YXBicmFzaWx2dWU=/' + this.session + '/TRANSFERENCIA/' + id

            const dbRef = ref(this.$database, `/${instancia}`)

            onValue(dbRef, data => {
                const values = data.val()

                this.recebeuNovaTransferencia()
            })
        },

        atualizafila() {
            const instancia = 'aW56YXBicmFzaWx2dWU=/' + this.session + '/FILA'

            const dbRef = ref(this.$database, `/${instancia}`)

            onValue(dbRef, data => {
                const values = data.val()

                if (this.audioStatus) {
                    this.executaSom(AudioFila)
                }

                this.fila_qtd = values.fila
            })
        },

        novamensagem() {
            const instancia = 'aW56YXBicmFzaWx2dWU=/' + this.session + '/MENSAGENS'

            const dbRef = ref(this.$database, `/${instancia}`)

            onValue(dbRef, data => {
                const values = data.val()
                this.atualizarConversa()

                this.atualizarFilaMeusAtendimentos()
            })
        },

        novamensageminterna() {
            const id = localStorage.getItem('@USER_ID')

            const instancia = 'aW56YXBicmFzaWx2dWU=/' + this.session + '/CHAT_INTERNO/' + id

            const dbRef = ref(this.$database, `/${instancia}`)

            onValue(dbRef, data => {
                const values = data.val()

                this.qtdmensagensinternas = 1

                this.recebeumensageminterna()
                this.atualizarConversInterna()
            })
        },

        enviarMensagem(status) {
            if (this.mensagem === '') return
            // 1 - mensagem normal || 2 - responder

            const mensagem = this.mensagem
            const nome = localStorage.getItem(`@USER_NAME`) + '\r\n\t\t' + mensagem
            const nova = { mensagem: nome, type: 'text' }

            this.mensagem = ''

            if (this.mensagens == 'Nao ha mensagem para esse contato') {
                this.mensagens = 'processando...'
            } else {
                this.mensagens.push(nova)
            }

            const objEnviaMensagem = {
                user_id: localStorage.getItem(`@USER_ID`),
                fone: this.selecionado.fone,
                mensagem: mensagem,
                mensagem_id: this.message_id,
                status: status,
            }

            Api.post('/envia_mensagemnova/ZmlsYWRlYXRlbmRpbWVudG8=', objEnviaMensagem)
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
                    this.atualizarConversInterna()
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

                            this.listaContatos = []
                            this.listaContatosPesquisa = []

                            this.chamarMeusAtendimentos()
                        })
                        .catch(error => {
                            console.error(error)

                            Swal.fire({
                                icon: 'error',
                                title: 'Erro ',
                                titleText: 'Erro ao encerrar atendimento.',
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
                    })
                })
                .catch(error => {
                    console.error(error)
                })
        },

        abrirConversa(info_user) {
            this.selecionado = info_user.usuario

            console.log(info_user)

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
                        this.atendimentoStatus = ativo.ativo === 1 ? true : false

                        this.salvaConversa()
                    } else {
                        this.qtdconversas = qtd
                        this.status_chat = false

                        this.mensagens = data.mensagem

                        this.foneConversa = this.selecionado.fone
                        this.ativado = this.selecionado.id
                        this.atendimentoStatus = ativo?.ativo && ativo.ativo === 1 ? true : false
                        this.salvaConversa()
                    }

                    this.chamarMeusAtendimentos()
                })
                .catch(error => console.error(error))

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

        atualizarFilaMeusAtendimentos() {
            Api.post('/meus_atendimentos/ZmlsYWRlYXRlbmRpbWVudG8=', {
                id: localStorage.getItem('@USER_ID'),
                setor_id: localStorage.getItem('@SETOR_ID'),
            })
                .then(response => {
                    const data = response.data
                    this.listaContatos = data.meusatendimentos
                    // this.notificacao = false;
                    this.fila_qtd = data.qtdfila_atendimento

                    const listaQtdeMensagens = data.qtdmensagens

                    this.montarNotificacoes(listaQtdeMensagens)
                })
                .catch(error => console.error(error))
        },

        async chamarMeusAtendimentos() {
            if (this.listaContatosInterno) {
                this.abrirMsg = false
            }

            this.listaContatosInterno = null
            this.pesquisa = ''

            Api.post('/meus_atendimentos/ZmlsYWRlYXRlbmRpbWVudG8=', {
                id: localStorage.getItem('@USER_ID'),
                setor_id: localStorage.getItem('@SETOR_ID'),
            })
                .then(response => {
                    let data = response.data
                    this.listaContatos = data.meusatendimentos

                    this.fila_qtd = data.qtdfila_atendimento
                    this.meusatendimentos_qtd = data.qtdmeus_atendimentos
                    let listaQtdeMensagens = data.qtdmensagens

                    this.montarNotificacoes(listaQtdeMensagens)
                })
                .catch(error => console.error(error))
        },

        async chamarTodosAtendimentos() {
            if (this.listaContatosInterno) {
                this.abrirMsg = false
            }

            this.listaContatosInterno = null
            this.pesquisa = ''

            Api.post('/fila_atendimento_todas/ZmlsYWRlYXRlbmRpbWVudG8=?dXNlcl9pZA=MTEy', {
                dXNlcl9pZA: btoa(localStorage.getItem('@USER_ID')),
                // setor_id: localStorage.getItem("@SETOR_ID"),
            })
                .then(response => {
                    let data = response.data

                    this.listaContatos = data.fila
                })
                .catch(error => console.error(error))
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
            const fones_enviados = lista_qtde_mensagens.map(usuarios => usuarios.fone_enviado)

            this.lista_fones_notificados = []

            for (let i = 0; i < this.listaContatos.length; i++) {
                let qtdeMensagensFone = lista_qtde_mensagens.filter(mensagem => {
                    return mensagem.fone_enviado == this.listaContatos[i].fone
                }).length

                let index = fones_enviados.findIndex(
                    val => val.fone_enviado == this.listaContatos[i].fone
                )

                // // so rodar quando o numero que enviou mensagem não existe dentro de algum objeto do array
                if (index < 0) {
                    let obj = {
                        fone: this.listaContatos[i].fone,
                        qtdeMensagens: qtdeMensagensFone,
                    }

                    this.lista_fones_notificados.push(obj)
                }
            }
        },

        chamarAtendimentosFila() {
            // this.opcaoSelecionada = "fila";

            if (this.listaContatosInterno) {
                this.abrirMsg = false
            }

            this.listaContatosInterno = null
            this.pesquisa = ''

            Api.post('/fila_atendimento/ZmlsYWRlYXRlbmRpbWVudG8=', {
                id: localStorage.getItem('@USER_ID'),
                setor_id: localStorage.getItem('@SETOR_ID'),
            })
                .then(response => {
                    let data = response.data

                    this.plano_id = data.plano

                    this.fila_qtd = response.data.fila.length

                    this.listaContatos = data.fila
                })

                .catch(error => console.error(error))
        },

        atualizaPerfil() {
            let objConversas = {
                id: localStorage.getItem('@USER_ID'),
            }

            Api.post('/atualiza_perfil/ZmlsYWRlYXRlbmRpbWVudG8=', objConversas)
                .then(() => {})
                .catch(error => console.error(error))
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

        fecharEscolhas() {
            this.abrirEscolha = false
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
                    let data = response.data

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

        atualizarConversInterna() {
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
                    }
                })
                .catch(error => console.error(error))
        },

        fecharAtendimentoContatoInterno() {
            this.abrirMsg = false
        },

        handleClickOutside(event) {
            const modalContent = this.$refs.modalContent
            const btnOptClick = event.target.closest('.btn-opt')

            if (modalContent && !modalContent.contains(event.target) && !btnOptClick) {
                this.openOpt = false
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

            if (btnQueue) {
                this.opcaoSelecionada = 'fila'
                this.pesquisa = ''

                this.chamarAtendimentosFila()
            } else if (btnServices) {
                this.opcaoSelecionada = 'atendimento'
                this.pesquisa = ''

                this.chamarMeusAtendimentos()
            } else if (btnInternalServices) {
                this.opcaoSelecionada = 'atendimento-interno'
                this.pesquisa = ''

                this.chamarMeusChatsInternos()
            } else if (btnAll) {
                this.opcaoSelecionada = 'todos'
                this.pesquisa = ''

                this.chamarTodosAtendimentos()
            }

            this.updateStyleTabs()
        },

        handleModalMedia(value) {
            this.modalMediaData = {
                userPhoto: this.selecionado.foto,
                userName: value.userName,
                urlImage: value.url,
                wook: value.wook,
            }

            this.openModalMedia = true
        },

        handleCloseModal() {
            this.openModalMedia = false
        },

        filterMessages(msgs) {
            if (typeof msgs === 'string') return msgs

            if (!msgs && !Array.isArray(msgs) && msgs.length === 0) return []

            return msgs.filter(msg => msg.type && msg.type === 'image')
        },

        teste(value) {
            console.log(value)
        },
    },
}
</script>

<style scoped>
.responsive {
    display: none;
    position: relative;
}

.bola {
    border-radius: 50%;
    display: inline-block;
    height: 100px;
    width: 100px;
    border: 1px solid #000000;
    background-color: #ffff00;
}

.settings {
    position: absolute;
    top: 0;
    cursor: pointer;
    right: 0;
    padding: 1%;
}

.settings-mobile {
    display: none;
    position: absolute;
    top: -2px;
    left: 10px;
    cursor: pointer;
    padding: 5px;
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
    bottom: 60px;
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

.fundo-transparente {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
}

.sub-menu button {
    margin-top: 5px;
}

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
    background-color: #fff;
    overflow: hidden;
    box-shadow:
        0 1px 1px 0 rgba(0, 0, 0, 0.06),
        0 2px 5px 0 rgba(0, 0, 0, 0.06);
    display: flex;
}

.box .leftSide {
    position: relative;
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

.header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 0.2fr;
    width: 100%;
    padding-bottom: 1px;

    background: #2cacbf;
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

.header button {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 10px 0;
    background: #2cacbf;
    transition: background-color 100ms ease;
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
    padding: 10px;
    padding-left: 30px;

    border-radius: 5px;
    outline: 0;
    border: 0;
    background-color: #eaeaea;
    font-size: 1.1rem;
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

.deletar-audio {
    margin-right: auto;
}

.bg-cinza-claro {
    background-color: #e3eaef !important;
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
    transition: all 100ms ease-out;
}

.perfil-container button:hover {
    background-color: #f4f4f4;
    transform: scale(1.1);
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

.details {
    margin-left: 10px;
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
    bottom: 0;
    z-index: 10;

    background-color: #f0f2f5 !important;
}

.input-group-prepend button {
    background-color: transparent;
    transition: all 200ms ease;
    will-change: transform;
    backface-visibility: hidden;
}

@media (max-width: 550px) {
    .btn-group {
        display: none;
    }
}

.input-group-prepend .btn-escolhas:hover,
.btn-emoji:hover {
    background-color: #e8eaee;
    transform: scale(1.05);
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

.tamanho-3 {
    font-size: 2rem;
}

.input-area {
    resize: none;
    min-height: 30px;
    max-height: 120px;
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

    .settings-mobile {
        display: block;
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

    .emoji-picker {
        max-width: 17rem !important;
        max-height: 10rem !important;
        overflow-x: hidden;
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

.chat-message-label {
    display: flex;
    margin: auto;
    align-items: center;
    background-color: #e3eaef;
    padding: 15px;
    justify-content: center;
}

.caixa {
    width: 90%;
    height: 50px;
    padding: 10px;
    border-radius: 2px;
    background-color: #e5e7ea;
    color: #7994a4;
}

.ml-auto {
    margin-left: auto;
}
</style>
