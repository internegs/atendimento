<template>
    <container class="mt-5">
        <div class="d-flex flex-column align-items-center">
            <h1 class="fw-bold">Contatos</h1>
        </div>

        <div class="botoes container d-flex flex-wrap justify-content-center gap-3">
            <button
                class="btn btn-primary"
                style="padding: 10px 20px; flex-basis: 20%"
            >
                Ativos {{ ativos }}
            </button>
            <button
                class="btn btn-danger"
                style="padding: 10px 20px; flex-basis: 20%"
            >
                Bloqueados {{ bloqueados }}
            </button>
            <button
                class="btn btn-success"
                style="padding: 10px 20px; flex-basis: 20%"
            >
                Com Zap {{ comZap }}
            </button>
            <button
                class="btn btn-primary"
                style="padding: 10px 20px; flex-basis: 20%"
            >
                Sem Zap {{ semZap }}
            </button>
        </div>

        <div class="d-flex flex-wrap usuarios text-center p-1">
            <div class="col-12 mb-5">
                <input
                    v-model="pesquisa"
                    type="text"
                    class="buscar rounded pad-header m-1 w-50 text-dark bg-white"
                    style="caret-color: #333"
                    placeholder="Busque por nome ou número..."
                    aria-label="Recipient's username"
                    aria-describedby="button-addon2"
                    @keyup="Pesquisar"
                />

                <button
                    class="m-1 bg-success text-white text-uppercase fw-bold rounded pad-header"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#add_user"
                >
                    Cadastrar Contato
                </button>
            </div>
        </div>

        <div
            v-if="loadingPage"
            class="w-100 d-flex justify-content-center align-items-center mt-4"
        >
            <div
                class="spinner-border spinner-border-md"
                role="status"
            ></div>
        </div>

        <div
            v-else
            class="table-responsive mt-5"
        >
            <div class="mt-2 d-flex flex-column align-items-center gap-2">
                <nav aria-label="Page navigation example">
                    <ul class="pagination text-center">
                        <li class="page-item">
                            <button
                                class="page-link"
                                aria-label="Previous"
                                @click="decrementar()"
                            >
                                <span aria-hidden="true">&laquo;</span>
                            </button>
                        </li>

                        <template
                            v-for="(list, index) in list_page"
                            :key="index"
                        >
                            <li class="page-item">
                                <button
                                    class="page-link"
                                    :class="{ active: list.active }"
                                    href="#"
                                    @click="SelecionarPagina(list.label)"
                                >
                                    {{ list.label }}
                                </button>
                            </li>
                        </template>

                        <li class="page-item">
                            <button
                                class="page-link"
                                href="#"
                                aria-label="Next"
                                @click="incrementar()"
                            >
                                <span aria-hidden="true">&raquo;</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            <table class="table table-striped table-hover mb-4">
                <thead>
                    <tr>
                        <th scope="col">Nome</th>
                        <th scope="col">Telefone</th>

                        <th scope="col">Ação</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(contato, index) in contatos"
                        :key="index"
                    >
                        <td>
                            {{ contato.nome }}
                            <br />
                            {{ contato.banco }}
                            {{ contato.agencia_nome }}
                        </td>
                        <td>
                            {{ contato.fone }}
                            <br />
                            <span v-if="contato.ativo == 1">Ativo</span>
                            <span v-if="contato.ativo == 0">Bloqueado</span>
                            <br />
                            <span
                                v-if="contato.temzap == 1"
                                class="text-warning"
                            >
                                Tem WhatsApp
                            </span>
                            <span v-if="contato.temzap == 0">WhatsApp incorreto</span>
                        </td>

                        <td
                            class="d-flex gap-3 flex-wrap"
                            style="align-items: center; justify-content: center"
                        >
                            <div class="row">
                                <div class="col-md-6">
                                    <button
                                        title="Editar"
                                        class="btn btn-primary fs-3"
                                        data-bs-toggle="offcanvas"
                                        data-bs-target="#acao_editar"
                                        @click="Selecionar(contato)"
                                    >
                                        <i class="fa-solid fa-pen"></i>
                                    </button>
                                </div>
                                <div class="col-md-6">
                                    <button
                                        title="Excluir"
                                        class="btn btn-danger fs-3"
                                        @click="Deleta(contato.id)"
                                    >
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="mt-5 d-flex flex-column align-items-center gap-2">
                <nav aria-label="Page navigation example">
                    <ul class="pagination text-center">
                        <li class="page-item">
                            <button
                                class="page-link"
                                aria-label="Previous"
                                @click="decrementar()"
                            >
                                <span aria-hidden="true">&laquo;</span>
                            </button>
                        </li>

                        <template
                            v-for="(list, index) in list_page"
                            :key="index"
                        >
                            <li class="page-item">
                                <button
                                    class="page-link"
                                    :class="{ active: list.active }"
                                    href="#"
                                    @click="SelecionarPagina(list.label)"
                                >
                                    {{ list.label }}
                                </button>
                            </li>
                        </template>

                        <li class="page-item">
                            <button
                                class="page-link"
                                href="#"
                                aria-label="Next"
                                @click="incrementar()"
                            >
                                <span aria-hidden="true">&raquo;</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <EDITARUSUARIO
            :user="selecionado"
            :grupos="grupos"
            @updated-contatos="listarContatos"
        />

        <ADDUSUARIOVUE
            :grupos="grupos"
            @updated-contatos="listarContatos"
        />
    </container>
</template>

<script>
import Container from '../GLOBALS/container.vue'
import EDITARUSUARIO from './acao/EDITARUSUARIO.vue'
import ADDUSUARIOVUE from './acao/ADDUSUARIOVUE.vue'
import Swal from 'sweetalert2'
import Api from '@/services/api'

export default {
    name: 'ContatosAdm',

    components: { Container, EDITARUSUARIO, ADDUSUARIOVUE },

    data() {
        return {
            contatos: [],
            list_page: [],
            page_active: 1,
            selecionado: {},
            pesquisa: '',
            grupos: [],
            ativos: null,
            bloqueados: null,
            comZap: null,
            semZap: null,
            loadingPage: false,
        }
    },

    watch: {
        page_active: function () {
            this.listarContatos()
        },
    },

    created() {
        this.listarContatos()
        this.chamaGrupo()
    },

    methods: {
        incrementar() {
            if (this.page_active >= this.last_page) return

            this.page_active++
        },

        decrementar() {
            if (this.page_active <= 0) return

            this.page_active--
        },

        Selecionar(user) {
            this.selecionado = user
        },

        SelecionarPagina(id) {
            this.page_active = id
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

        Deleta(id) {
            Swal.fire({
                title: 'DESEJA DELETAR?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim, deletar!',
            }).then(result => {
                if (result.isConfirmed) {
                    Api.post(`/contatos_exclui/ZmlsYWRlYXRlbmRpbWVudG8=`, {
                        id: localStorage.getItem('@USER_ID'),
                        contato_id: id,
                    })
                        .then(response => {
                            if (response.data.status) {
                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    title: 'DELETADO COM SUCESSO!',
                                    showConfirmButton: false,
                                    timer: 1500,
                                })
                                this.listarContatos()
                                this.pesquisa = ''
                            } else {
                                alert('Erro ao deletar usuario')
                            }
                        })
                        .catch(erro => console.error(erro))
                }
            })
        },

        limparPesquisa() {
            if (this.pesquisa == '') {
                this.listarContatos()
            }
        },

        async Pesquisar() {
            Api.post(`/busca_contatos/ZmlsYWRlYXRlbmRpbWVudG8=`, {
                id: localStorage.getItem('@USER_ID'),
                busca: this.pesquisa,
            })
                .then(response => {
                    this.contatos = response.data.contatos.data
                    this.list_page = response.data.contatos.links.filter(
                        link => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;'
                    )
                })
                .catch(erro => console.error(erro))
        },

        async listarContatos() {
            this.loadingPage = true

            Api.post(`contatos/ZmlsYWRlYXRlbmRpbWVudG8=?page=${this.page_active}`, {
                id: localStorage.getItem('@USER_ID'),
            })
                .then(response => {
                    this.contatos = response.data.contatos.data
                    this.list_page = response.data.contatos.links.filter(
                        link => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;'
                    )

                    this.ativos = response.data.ativos
                    this.bloqueados = response.data.bloqueados
                    this.comZap = response.data.comwhatsapp
                    this.semZap = response.data.semwhatsapp
                })
                .catch(erro => {
                    console.error(erro)
                    this.loadingPage = false
                })
                .finally(() => (this.loadingPage = false))
        },
    },
}
</script>

<style scoped>
.pad-header {
    padding: 10px;
}

.usuarios input {
    border: 1px solid #d0d0d0;
}

.table {
    font-family: 'Roboto', sans-serif;
}

.usuarios {
    border-bottom: 2px solid #ababab;
}

@media (max-width: 645px) {
    .usuarios {
        justify-content: center;
        gap: 10px;
    }

    .usuarios div {
        margin: 0;
    }
}

@media (max-width: 430px) {
    .usuarios button,
    input {
        width: 100%;
    }
}

.table_section {
    overflow: auto;
    height: auto;
}

table {
    width: 100%;
    margin: auto;
    table-layout: fixed;
    min-width: 1000px;
}

table th {
    position: sticky;
    top: 0;
    background-color: #f6f9fc;
    color: #8493a5;
    font-size: 1.12rem;
}

th,
td {
    border-bottom: 1px solid #dddd;
    padding: 10px 20px;
    word-break: break-all;
    text-align: center;
}

td {
    font-size: 1.2rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

tr:hover td {
    cursor: pointer;
    background-color: #f6f9fc;
}

td img {
    height: 60px;
    width: 60px;
    object-fit: cover;
    border-radius: 50%;
}
</style>
