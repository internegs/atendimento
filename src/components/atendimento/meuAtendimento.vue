<template>
    <div>
        <div class="row clearfix">
            <div class="col-lg-12">
                <div class="card chat-app">
                    <div class="people-list">
                        <ListaAtendimentos
                            :change="abrirConversa"
                            :lista="listaContatos"
                        />
                    </div>

                    <div
                        class="chat"
                        v-if="abrirMsg"
                    >
                        <div class="chat-header clearfix">
                            <div class="botao_mobile">
                                <button
                                    class="btn btn-outline-dark"
                                    type="button"
                                    data-bs-toggle="offcanvas"
                                    data-bs-target="#offcanvasRight"
                                    aria-controls="offcanvasRight"
                                >
                                    <i
                                        class="fa fa-arrow-left"
                                        aria-hidden="true"
                                    ></i>
                                    open
                                </button>
                                <hr />
                            </div>
                            <div class="row">
                                <div class="col-lg-6">
                                    <a
                                        href="javascript:void(0);"
                                        data-toggle="modal"
                                        data-target="#view_info"
                                    >
                                        <img
                                            src="https://bootdey.com/img/Content/avatar/avatar2.png"
                                            alt="avatar"
                                        />
                                    </a>
                                    <div class="chat-about">
                                        <h6 class="m-b-0">Aiden Chavez</h6>
                                        <small>Last seen: 2 hours ago</small>
                                    </div>
                                </div>
                                <div class="col-lg-6 hidden-sm text-end">
                                    <div
                                        class="btn-group mt-2"
                                        role="group"
                                        aria-label="Basic mixed styles example"
                                    >
                                        <button
                                            type="button"
                                            class="btn btn-success"
                                        >
                                            <i
                                                class="fa-solid fa-check"
                                                aria-hidden="true"
                                            ></i>
                                        </button>
                                        <button
                                            type="button"
                                            class="btn btn-primary"
                                        >
                                            <i
                                                class="fa-solid fa-camera"
                                                aria-hidden="true"
                                            ></i>
                                        </button>
                                        <button
                                            type="button"
                                            class="btn btn-secondary"
                                        >
                                            <i
                                                class="fa-solid fa-plus"
                                                aria-hidden="true"
                                            ></i>
                                        </button>
                                        <button
                                            type="button"
                                            class="btn btn-info"
                                        >
                                            <i class="fa-solid fa-rotate"></i>
                                        </button>
                                        <button
                                            type="button"
                                            class="btn btn-danger"
                                        >
                                            <i
                                                class="fa-solid fa-xmark text-secondary"
                                                aria-hidden="true"
                                            ></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="chat-history">
                            <ul
                                class="m-b-0 teste"
                                style="
                                    overflow-y: auto;

                                    max-height: 380px !important ;
                                    height: 380px !important;
                                "
                            >
                                <li
                                    class="clearfix"
                                    v-for="(mensagem, index) in mensagens"
                                    :key="index"
                                >
                                    <div
                                        class="message my-message"
                                        :class="localId === mensagem.from ? 'float-right' : ''"
                                    >
                                        {{ mensagem.text }}
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div
                            class="chat-message clearfix bg-cinza d-flex align-items-center justify-content-center gap-3"
                        >
                            <div class="input-group-prepend">
                                <i class="fa-solid fa-paperclip text-secondary fs-3"></i>
                            </div>
                            <div class="input-group mb-0">
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="Mensagem"
                                />
                                <div class="input-group-prepend">
                                    <span
                                        class="input-group-text bg-primary"
                                        style="padding: 15px 30px"
                                    >
                                        <i class="fa-solid fa-paper-plane text-white fs-3"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        class="chat position-relative"
                        v-else
                    >
                        <div class="chat-header clearfix">
                            <div class="botao_mobile">
                                <button
                                    class="btn btn-outline-dark"
                                    type="button"
                                    data-bs-toggle="offcanvas"
                                    data-bs-target="#offcanvasRight"
                                    aria-controls="offcanvasRight"
                                >
                                    <i
                                        class="fa fa-arrow-left"
                                        aria-hidden="true"
                                    ></i>
                                    open
                                </button>
                            </div>
                        </div>
                        <div class="chat-history">
                            <div style="height: 500px">
                                <img
                                    src="@/assets/img/inzap.png"
                                    alt=""
                                    class="centro-position"
                                    style="max-width: 50%"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- modal -->

        <div
            class="offcanvas offcanvas-end"
            tabindex="-1"
            id="offcanvasRight"
            aria-labelledby="offcanvasRightLabel"
        >
            <div class="offcanvas-header">
                <h5
                    class="offcanvas-title"
                    id="offcanvasRightLabel"
                >
                    MENU MOBILE
                </h5>
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                ></button>
            </div>
            <div class="offcanvas-body">
                <div class="people-list-mobile">
                    <ListaAtendimentos
                        :change="abrirConversa"
                        :lista="listaContatos"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ListaAtendimentos from '@/components_calendar/atendimento/ListaAtendimentos.vue'

export default {
    name: 'menuAtendimento',
    components: { ListaAtendimentos },
    data() {
        return {
            lista: 'none',
            chat: 'block',
            mensagens: [],
            abrirMsg: false,
            localId: null,
            listaContatos: [
                {
                    id: 2,
                    avatar: 'https://pps.whatsapp.net/v/t61.24694-24/311805631_414962367496660_6249254820707104494_n.jpg?ccb=11-4&oh=01_AdRDS-wvd9ED0hvS_gJv3XX1T1yZkJwyY_A1-gjXuGpG2g&oe=63641FCC',
                    name: 'Phelipe Viana',
                    status: 1,
                },
                {
                    id: 3,
                    avatar: 'https://pps.whatsapp.net/v/t61.24694-24/171721359_349710810281059_8274190956000056554_n.jpg?ccb=11-4&oh=01_AdRBiib7X3ZbfuwzgrrjqSJljjLvgP3anQ3Xrq4OIN4_Xw&oe=63643178',
                    name: 'Alex',
                    status: 0,
                },
                {
                    id: 4,
                    avatar: 'https://pps.whatsapp.net/v/t61.24694-24/311805631_414962367496660_6249254820707104494_n.jpg?ccb=11-4&oh=01_AdRDS-wvd9ED0hvS_gJv3XX1T1yZkJwyY_A1-gjXuGpG2g&oe=63641FCC',
                    name: 'Phelipe Viana',
                    status: 1,
                },
                {
                    id: 5,
                    avatar: 'https://pps.whatsapp.net/v/t61.24694-24/171721359_349710810281059_8274190956000056554_n.jpg?ccb=11-4&oh=01_AdRBiib7X3ZbfuwzgrrjqSJljjLvgP3anQ3Xrq4OIN4_Xw&oe=63643178',
                    name: 'Alex',
                    status: 0,
                },
                {
                    id: 6,
                    avatar: 'https://pps.whatsapp.net/v/t61.24694-24/311805631_414962367496660_6249254820707104494_n.jpg?ccb=11-4&oh=01_AdRDS-wvd9ED0hvS_gJv3XX1T1yZkJwyY_A1-gjXuGpG2g&oe=63641FCC',
                    name: 'Phelipe Viana',
                    status: 1,
                },
                {
                    id: 7,
                    avatar: 'https://pps.whatsapp.net/v/t61.24694-24/171721359_349710810281059_8274190956000056554_n.jpg?ccb=11-4&oh=01_AdRBiib7X3ZbfuwzgrrjqSJljjLvgP3anQ3Xrq4OIN4_Xw&oe=63643178',
                    name: 'Alex',
                    status: 0,
                },
            ],
        }
    },
    mounted() {
        this.localId = localStorage.getItem('@USER_ID')
    },
    methods: {
        abrirConversa(id) {
            this.habilitarStatus(id)

            if (id === 2) {
                this.mensagens = [
                    {
                        from: this.localId,
                        to: id,
                        text: 'ola',
                    },
                    {
                        from: id,
                        to: this.localId,
                        text: 'boa tarde',
                    },
                    {
                        from: this.localId,
                        to: id,
                        text: 'estou com saudade',
                    },
                    {
                        from: id,
                        to: this.localId,
                        text: 'ok',
                    },
                    {
                        from: this.localId,
                        to: id,
                        text: 'você ainda gosta de mim?',
                    },
                    {
                        from: id,
                        to: this.localId,
                        text: 'não',
                    },
                    {
                        from: this.localId,
                        to: id,
                        text: 'tudo bem?',
                    },
                    {
                        from: id,
                        to: this.localId,
                        text: 'sim.',
                    },
                ]
            } else {
                this.mensagens = [
                    {
                        from: this.localId,
                        to: id,
                        text: 'bom dia',
                    },
                    {
                        from: id,
                        to: this.localId,
                        text: 'bom dia, tudo bem?',
                    },
                    {
                        from: this.localId,
                        to: id,
                        text: 'sim, e com voce?',
                    },
                    {
                        from: id,
                        to: this.localId,
                        text: 'sim.',
                    },
                ]
            }

            // alert(id)

            this.abrirMsg = true

            const divChat = document.querySelector('.chat')

            // const conversations = divChat.querySelector('.teste');
            console.log(divChat.querySelector('chat-history .teste'))
            console.log(divChat)
        },
        habilitarStatus(id) {
            const indiceContato = this.listaContatos.findIndex(contato => contato.id === id)

            //alterando valor da propriedade status

            this.listaContatos[indiceContato].status = 1
        },
    },
}
</script>

<style scoped>
.tela_none {
    display: none;
}

.bg-cinza {
    background-color: #e1e1dd;
}

.centro-position {
    position: absolute;

    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.card {
    background: #fff;
    transition: 0.5s;
    border: 0;
    margin-bottom: 30px;
    border-radius: 0.55rem;
    position: relative;
    width: 100%;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 10%);
}
.chat-app .people-list {
    width: 280px;
    position: absolute;
    left: 0;
    top: 0;
    padding: 20px;
    z-index: 7;
}
.chat-app .people-list-mobile {
    width: 280px;
    position: absolute;
    left: 0;
    top: 0;
    padding: 20px;
    z-index: 7;
}

.chat-app .chat {
    margin-left: 280px;
    border-left: 3px solid #eaeaea;
}

.people-list-mobile {
    -moz-transition: 0.5s;
    -o-transition: 0.5s;
    -webkit-transition: 0.5s;
    transition: 0.5s;
}
.people-list {
    -moz-transition: 0.5s;
    -o-transition: 0.5s;
    -webkit-transition: 0.5s;
    transition: 0.5s;
}
.people-list-mobile .chat-list li {
    padding: 10px 15px;
    list-style: none;
    border-radius: 3px;
}

.people-list-mobile .chat-list li:hover {
    background: #efefef;
    cursor: pointer;
}

.people-list-mobile .chat-list li {
    padding: 10px 15px;
    list-style: none;
    border-radius: 3px;
}

.people-list .chat-list li:hover {
    background: #efefef;
    cursor: pointer;
}

.people-list .chat-list li.active {
    background: #efefef;
}

.people-list .chat-list li .name {
    font-size: 15px;
}

.people-list .chat-list img {
    width: 45px;
    border-radius: 50%;
}

.people-list img {
    float: left;
    border-radius: 50%;
}
.people-list-mobile .chat-list li.active {
    background: #efefef;
}

.people-list-mobile .chat-list li .name {
    font-size: 15px;
}

.people-list-mobile .chat-list img {
    width: 45px;
    border-radius: 50%;
}

.people-list-mobile img {
    float: left;
    border-radius: 50%;
}
.people-list-mobile .about {
    float: left;
    padding-left: 8px;
}

.people-list-mobile .status {
    color: #999;
    font-size: 13px;
}

.people-list .about {
    float: left;
    padding-left: 8px;
}

.people-list .status {
    color: #999;
    font-size: 13px;
}

.chat .chat-header {
    padding: 15px 20px;
}

.chat .chat-header img {
    float: left;
    border-radius: 40px;
    width: 40px;
}

.chat .chat-header .chat-about {
    float: left;
    padding-left: 10px;
}

.chat .chat-history {
    padding: 20px;
    border-bottom: 2px solid #fff;
}

.chat .chat-history ul {
    padding: 0;
}

.chat .chat-history ul li {
    list-style: none;
    margin-bottom: 30px;
}

.chat .chat-history ul li:last-child {
    margin-bottom: 0px;
}

.chat .chat-history .message-data {
    margin-bottom: 15px;
}

.chat .chat-history .message-data img {
    border-radius: 40px;
    width: 40px;
}

.chat .chat-history .message-data-time {
    color: #434651;
    padding-left: 6px;
}

.chat .chat-history .message {
    color: #444;
    padding: 18px 20px;
    line-height: 26px;
    font-size: 16px;
    border-radius: 7px;
    display: inline-block;
    position: relative;
    max-width: 50%;
}

.chat .chat-history .message:after {
    bottom: 100%;
    left: 7%;
    border: solid transparent;
    content: ' ';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-bottom-color: #fff;
    border-width: 10px;
    margin-left: -10px;
}

.chat .chat-history .my-message {
    background: #efefef;
}

.chat .chat-history .my-message:after {
    bottom: 100%;
    left: 30px;
    border: solid transparent;
    content: ' ';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-bottom-color: #efefef;
    border-width: 10px;
    margin-left: -10px;
}

.chat .chat-history .other-message {
    background: #e8f1f3;
    text-align: right;
}

.chat .chat-history .other-message:after {
    border-bottom-color: #e8f1f3;
    left: 93%;
}

.chat .chat-message {
    padding: 20px;
}

.online,
.offline,
.me {
    margin-right: 2px;
    font-size: 8px;
    vertical-align: middle;
}

.online {
    color: #86c541;
}

.offline {
    color: #e47297;
}

.me {
    color: #1d8ecd;
}

.float-right {
    float: right;
}

.clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: ' ';
    clear: both;
    height: 0;
}
.botao_mobile {
    display: none;
}

@media only screen and (max-width: 767px) {
    .botao_mobile {
        display: block;
    }
    .chat-app .people-list {
        height: 465px;
        width: 100%;
        overflow-x: auto;
        background: #fff;
        /* left: -400px; */
        display: none;
    }
    .chat-app .people-list.open {
        left: 0;
    }
    .chat-app .chat {
        margin: 0;
    }
    .chat-app .chat .chat-header {
        border-radius: 0.55rem 0.55rem 0 0;
    }
    .chat-app .chat-history {
        height: 300px;
        overflow-x: auto;
    }

    .input-group-text {
        padding: 10px 20px !important;
    }

    .chat .chat-history .message {
        max-width: 100%;
    }
}

@media only screen and (min-width: 768px) and (max-width: 992px) {
    .chat-app .chat-list {
        height: 650px;
        overflow-x: auto;
    }
    .chat-app .chat-history {
        height: 600px;
        overflow-x: auto;
    }
}

@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
    .chat-app .chat-list {
        height: 480px;
        overflow-x: auto;
    }
    .chat-app .chat-history {
        height: calc(100vh - 300px);
        overflow-x: auto;
    }
}
</style>
