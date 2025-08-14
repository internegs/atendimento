<template>
    <Container class="mt-2">
        <div class="d-flex flex-column align-items-center">
            <h1 class="fw-bold">Meus Segmentos</h1>
        </div>

        <div class="d-flex flex-wrap usuarios text-center align-items-center p-4">
            <div class="col-12">
                <input
                    type="text"
                    class="buscar rounded pad-header m-1 w-50 text-dark bg-white"
                    style="caret-color: #333"
                    placeholder="Busque Segmentos"
                    v-model="pesquisa"
                />

                <button
                    class="m-1 bg-success text-white text-uppercase fw-bold rounded pad-header"
                    data-bs-toggle="modal"
                    data-bs-target="#gravaGrupo"
                >
                    Novo Segmento
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
            class="table-responsive"
        >
            <table class="table table-striped table-hover mb-4">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nome Segmento</th>
                        <th scope="col">Status</th>
                        <th scope="col">Ação</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(grupo, index) in grupos"
                        :key="index"
                    >
                        <td>{{ grupo.id }}</td>
                        <td>{{ grupo.nome_grupo }}</td>
                        <td :inner-html.prop="nivelFilter(grupo.ativo)"></td>
                        <td
                            class="d-flex gap-3 flex-wrap"
                            style="align-items: center; justify-content: center"
                        >
                            <button
                                class="btn btn-primary fs-3"
                                @click="editaGrupo(grupo.id)"
                            >
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button
                                class="btn btn-danger fs-3"
                                @click="deletaGrupo(grupo.id)"
                            >
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal -->
        <div
            class="modal fade"
            id="gravaGrupo"
            tabindex="-1"
            aria-labelledby="gravaGrupoLabel"
            aria-hidden="true"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1
                            class="modal-title fs-5"
                            id="staticBackdropLabel"
                        >
                            Cria novo Segmento
                        </h1>
                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label
                                for=""
                                class="fs-4"
                            >
                                Nome do Segmento:
                            </label>
                            <input
                                type="text"
                                class="form-control"
                                placeholder="Digite nome do segmento"
                                v-model="obj.nome_grupo"
                            />
                        </div>
                        <div class="form-group mt-4">
                            <label
                                for=""
                                class="fs-4"
                            >
                                Status:
                            </label>
                            <select
                                class="form-select"
                                v-model="obj.ativo"
                            >
                                <option value="1">Ativo</option>
                                <option value="0">Desativado</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-bs-dismiss="modal"
                        >
                            Fechar
                        </button>
                        <button
                            type="button"
                            class="btn btn-primary"
                            @click="gravaGrupo"
                        >
                            Gravar
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal -->
        <div
            class="modal fade"
            id="adicionaContatos"
            tabindex="-1"
            aria-labelledby="gravaGrupoLabel"
            aria-hidden="true"
        >
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1
                            class="modal-title fs-5"
                            id="staticBackdropLabel"
                        >
                            Adicionar Contatos
                        </h1>
                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div class="modal-body">
                        <h1 class="fs-4 text-center">Selecione contatos para este segmento</h1>

                        <div>
                            <input
                                class="form-control form-control-lg"
                                type="text"
                                placeholder="pesquise contato"
                                v-model="pesquisa"
                                @keyup="Pesquisar"
                                aria-label=".form-control-lg example"
                            />

                            <ul class="list-group">
                                <li class="list-group-item">
                                    <label class="conteiner">
                                        <input
                                            type="checkbox"
                                            class="form-check-input selecionarMensagens"
                                        />
                                        <span
                                            class="checkmark-encaminha-mensagem"
                                            @click="marcarTodos"
                                        ></span>
                                    </label>

                                    <span style="margin-left: 40px; font-weight: bold">
                                        Selecionar Todos os contatos
                                    </span>
                                </li>
                                <li
                                    class="list-group-item"
                                    v-for="(contato, index) in contatos"
                                    :key="index"
                                >
                                    <label class="conteiner">
                                        <input
                                            type="checkbox"
                                            class="form-check-input selecionarMensagens all"
                                            :data-id="contato.id"
                                            :checked="contato.grupo_id === grupo_id"
                                        />
                                        <span
                                            class="checkmark-encaminha-mensagem"
                                            @click="marcarUsuario"
                                            :data-id="contato.id"
                                        ></span>
                                    </label>
                                    <span style="margin-left: 40px">
                                        {{ contato.nome }} {{ contato.fone }}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            class="btn btn-success fw-bold mt-3 text-center"
                            @click="atualizaGrupo"
                        >
                            <div v-if="!btn_atualiza">Salvar</div>
                            <div
                                class="spinner-border"
                                role="status"
                                v-else
                            >
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- OffCanvas -->
        <div
            class="offcanvas offcanvas-end"
            style="width: 85%"
            tabindex="-1"
            id="editarGrupos"
            aria-labelledby="editarGrupos"
        >
            <div class="offcanvas-header">
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
                        class="offcanvas-title fs-3 fw-bold mb-4"
                        id="offcanvasRightLabel"
                    >
                        Editar Segmentos -
                        <span class="fs-4 fw-normal">
                            {{ obj.nome_grupo }}
                        </span>
                    </h2>
                    <div class="form-group col-md-8">
                        <label
                            for=""
                            class="fs-3 mb-2"
                        >
                            Nome do Segmento:
                        </label>
                        <input
                            type="text"
                            class="form-control form-pad fs-5"
                            placeholder="Digite nome do segmento"
                            v-model="obj.nome_grupo"
                        />
                    </div>
                    <div class="form-group col-md-4">
                        <label
                            for=""
                            class="fs-3 mb-2"
                        >
                            Status:
                        </label>
                        <select
                            class="form-select form-pad"
                            v-model="obj.ativo"
                        >
                            <option value="1">Ativo</option>
                            <option value="0">Desativado</option>
                        </select>
                    </div>

                    <div class="col-md-12 mt-3">
                        <button
                            class="btn btn-primary"
                            style="padding: 10px 20px"
                            data-bs-toggle="modal"
                            data-bs-target="#adicionaContatos"
                        >
                            Adicionar Contatos
                        </button>
                    </div>

                    <div class="col-md-12 mt-5">
                        <h1 class="text-center mb-1">Contatos neste Segmento</h1>

                        <div class="row gap-3 text-center justify-content-center mt-3">
                            <div
                                class="col-md-2 bloco"
                                v-for="(contatos, index) in contatosNoGrupo"
                                :key="index"
                            >
                                <h6 class="text-center">
                                    {{ contatos.nome }}
                                </h6>
                                <span>{{ contatos.fone }}</span>
                                <span
                                    class="mt-2"
                                    @click="tirarContatoGrupo(contatos.fone, contatos.grupo_id)"
                                >
                                    <i class="fa-solid fa-trash fs-3 text-danger deletar"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Container>
</template>

<script>
import Container from '../GLOBALS/container.vue'

import Api from '@/services/api'
import Swal from 'sweetalert2'
import SelecionaContatos from './acao/selecionaContatos.vue'
import { nivelFilter } from '@/utils/statusFilters'

export default {
    name: 'gruposAdm',

    components: { Container, SelecionaContatos },

    data() {
        return {
            btn_atualiza: false,
            checkedAll: false,
            grupos: [],
            selecionado: {},
            pesquisa: '',
            grupo_id: null,
            obj: {
                user_id: localStorage.getItem('@USER_ID'),
                nome_grupo: null,
                ativo: null,
            },
            contatosNoGrupo: null,
            contatos: null,
            array_id_contatos: [],

            list_page: [],
            page_active: 1,
            loadingPage: false,
        }
    },

    mounted() {
        this.chamaGrupos()
    },

    methods: {
        nivelFilter,

        tirarContatoGrupo(fone, grupo_id) {
            let user_id = localStorage.getItem('@USER_ID')

            let obj = {
                fone,
                grupo_id,
                user_id,
            }

            Swal.fire({
                title: 'Tem certeza que deseja retirar esse contato do grupo?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim, retirar!',
                cancelButtonText: 'Cancelar',
            }).then(result => {
                if (result.isConfirmed) {
                    Api.post('/grupo_excluicontato/ZmlsYWRlYXRlbmRpbWVudG8=', obj)
                        .then(() => {
                            this.atualizarPaginaGrupo()
                        })
                        .catch(erro => console.error(erro))
                }
            })
        },

        fecharOffCanvas() {
            const truck_offCanvas = document.querySelector('#editarGrupos')
            const offCanvas = bootstrap.Offcanvas.getOrCreateInstance(truck_offCanvas)
            offCanvas.hide()
        },

        abrirModal() {
            const myModal = new bootstrap.Modal('#sunflower', {
                keyboard: false,
            })

            myModal.show()
        },

        selecionarPagina(id) {
            this.page_active = id
        },

        marcarTodos() {
            const checkBoxs = document.querySelectorAll('.all')

            this.array_id_contatos = []
            for (let i = 0; i < checkBoxs.length; i++) {
                //Verificamos se é a hora de dar checked a todos ou tirar;

                if (!this.checkedAll) {
                    const user_id = checkBoxs[i].getAttribute('data-id')

                    this.array_id_contatos.push(+user_id)
                }

                checkBoxs[i].checked = this.checkedAll ? false : true
            }

            this.checkedAll = this.checkedAll ? false : true
        },

        marcarUsuario(event) {
            let span = event.target

            let elementoPai = span.parentNode

            let checkbox = elementoPai.querySelector('input')

            const user_id = checkbox.getAttribute('data-id')

            if (!checkbox.checked) {
                this.array_id_contatos.push(+user_id)
            } else {
                this.array_id_contatos.splice(this.array_id_contatos.indexOf(user_id), 1)
            }
        },

        chamaGrupos() {
            this.loadingPage = true

            Api.post('/grupos/ZmlsYWRlYXRlbmRpbWVudG8=', {
                id: localStorage.getItem('@USER_ID'),
            })
                .then(response => {
                    let data = response.data
                    this.grupos = data.grupos
                })
                .catch(erro => {
                    console.error(erro)
                    this.loadingPage = false
                })
                .finally(() => (this.loadingPage = false))
        },

        fechaModal() {
            const truck_modal = document.querySelector('#gravaGrupo')
            const modal = bootstrap.Modal.getInstance(truck_modal)
            modal.hide()
        },

        deletaGrupo(grupo_id) {
            Swal.fire({
                title: 'Tem certeza que deseja deletar este registro?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim, deletar!',
                cancelButtonText: 'Cancelar',
            }).then(result => {
                if (result.isConfirmed) {
                    Api.post('/grupo_exclui/ZmlsYWRlYXRlbmRpbWVudG8=', {
                        grupo_id: grupo_id,
                    })
                        .then(response => {
                            Swal.fire('Excluído!', response.data.mensagem, 'success')

                            this.chamaGrupos()
                        })
                        .catch(error => {
                            console.error(error)
                        })
                }
            })
        },

        async listarContatos() {
            Api.post(`/grupo_edita/ZmlsYWRlYXRlbmRpbWVudG8=?page=${this.page_active}`, {
                grupo_id: this.grupo_id,
                user_id: localStorage.getItem('@USER_ID'),
            })
                .then(response => {
                    const data = response.data

                    const links = data.contatos.links
                    this.contatos = data.contatos.data
                    this.list_page = links
                })
                .catch(error => {
                    console.error(error)
                })
        },

        atualizarPaginaGrupo() {
            Api.post('/grupo_edita/ZmlsYWRlYXRlbmRpbWVudG8=?page=1', {
                grupo_id: this.grupo_id,
                user_id: localStorage.getItem('@USER_ID'),
            })
                .then(response => {
                    const data = response.data
                    const grupo = data.grupo

                    this.listarContatos()

                    this.obj.ativo = grupo.ativo
                    this.obj.nome_grupo = grupo.nome_grupo
                    this.contatosNoGrupo = data.contatosnogrupo
                })
                .catch(error => {
                    console.error(error)
                })
        },

        editaGrupo(grupo_id) {
            this.grupo_id = grupo_id
            Api.post('/grupo_edita/ZmlsYWRlYXRlbmRpbWVudG8=?page=1', {
                grupo_id: grupo_id,
                user_id: localStorage.getItem('@USER_ID'),
            })
                .then(response => {
                    const data = response.data
                    const grupo = data.grupo

                    this.listarContatos()

                    this.obj.ativo = grupo.ativo
                    this.obj.nome_grupo = grupo.nome_grupo
                    this.contatosNoGrupo = data.contatosnogrupo

                    const truck_modal = document.querySelector('#editarGrupos')
                    const modal = bootstrap.Offcanvas.getOrCreateInstance(truck_modal)
                    modal.show()
                })
                .catch(error => {
                    console.error(error)
                })
        },

        atualizaGrupo() {
            if (this.obj.nome_grupo === null || this.obj.ativo === null) return

            const newObj = JSON.parse(JSON.stringify(this.obj))

            this.btn_atualiza = true

            newObj.id = this.grupo_id

            newObj.contato_id = this.array_id_contatos

            Api.post('/grupo_update/ZmlsYWRlYXRlbmRpbWVudG8=', newObj)
                .then(response => {
                    this.btn_atualiza = false

                    const truck_modal = document.querySelector('#adicionaContatos')
                    const modal = bootstrap.Modal.getOrCreateInstance(truck_modal)
                    modal.hide()

                    let data = response.data

                    let contatosnogrupo = data.contatosnogrupo

                    this.contatosNoGrupo = contatosnogrupo

                    Swal.fire('Atualizado!', response.data.mensagem, 'success')

                    this.obj.nome_grupo = null
                    this.obj.ativo = null
                })
                .catch(error => {
                    console.error(error)
                })
        },

        gravaGrupo() {
            if (this.obj.nome_grupo === null || this.obj.ativo === null) return

            Api.post('/grupos_grava/ZmlsYWRlYXRlbmRpbWVudG8=', this.obj)
                .then(response => {
                    this.fechaModal()

                    this.chamaGrupos()
                    Swal.fire('Gravado!', response.data.status, 'success')

                    this.obj.nome_grupo = null
                    this.obj.ativo = null
                })
                .catch(error => {
                    console.error(error)
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
                    let data = response.data.contatos.data
                    let links = response.data.contatos.links
                    this.contatos = data
                    this.list_page = links
                })
                .catch(erro => console.error(erro))
        },
    },

    watch: {
        page_active: function () {
            this.listarContatos()
        },
    },
}
</script>

<style scoped>
.pad-header {
    padding: 10px 20px;
}

.form-pad {
    padding: 10px 20px;
}

/* input.buscar {
  } */

/* .usuarios {
    background-color: #f0f0f0;
  } */

.usuarios input {
    border: 1px solid #d0d0d0;
}

.table {
    font-family: 'Roboto', sans-serif;
}

.usuarios {
    border-bottom: 2px solid #ababab;
}

@media (max-width: 680px) {
    .usuarios {
        justify-content: center;
        gap: 10px;
    }

    .offcanvas-header {
        flex-wrap: wrap;
    }

    .usuarios div {
        margin: 0;
    }
}

@media (max-width: 570px) {
    .usuarios .buscar_input,
    .buscar_button {
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
}

table th {
    position: sticky;
    top: 0;
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

.bloco {
    padding: 10px;
    background: #f2f2f2;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 5px;
}

.bloco .deletar {
    cursor: pointer;
}
</style>
