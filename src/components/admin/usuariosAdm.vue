<template>
    <Container class="mt-2">
        <div class="d-flex flex-column align-items-center">
            <h1 class="fw-bold">Atendentes</h1>
        </div>

        <div class="d-flex flex-wrap usuarios text-center align-items-center p-2">
            <div class="col-12">
                <button
                    class="m-1 bg-success text-white text-uppercase fw-bold rounded pad-header"
                    data-bs-toggle="modal"
                    data-bs-target="#cadastrarModal"
                >
                    Novo Atendente
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
                        <th scope="col">Nome</th>
                        <th scope="col">Email</th>
                        <th scope="col">Nível</th>
                        <th scope="col">Ação</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(atendente, index) in atendentes"
                        :key="index"
                    >
                        <td>{{ atendente.name }}</td>
                        <td>{{ atendente.email }}</td>
                        <td :inner-html.prop="filterTipoUsuario(atendente.grupo_id)"></td>
                        <td
                            class="d-flex gap-3 flex-wrap"
                            style="align-items: center; justify-content: center"
                        >
                            <div class="row">
                                <div class="col-md-6">
                                    <button
                                        class="btn btn-primary fs-3"
                                        @click="editarAtendente(atendente.id)"
                                    >
                                        <i class="fa-solid fa-pen"></i>
                                    </button>
                                </div>
                                <div class="col-md-6">
                                    <button
                                        class="btn btn-danger fs-3"
                                        @click="deletaAtendente(atendente.id)"
                                    >
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- Modal -->
        <div
            class="modal fade"
            id="cadastrarModal"
            tabindex="-1"
            aria-labelledby="cadastrarModalLabel"
            aria-hidden="true"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1
                            class="modal-title fs-2"
                            id="staticBackdropLabel"
                        >
                            Cadastrar novo Atendente
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
                                class="fs-3"
                            >
                                Nome:
                            </label>
                            <input
                                type="text"
                                class="form-control input-pad"
                                placeholder="Digite o Nome"
                                v-model="obj.name"
                            />
                        </div>
                        <div class="form-group mt-4">
                            <label
                                for=""
                                class="fs-3"
                            >
                                Email:
                            </label>
                            <input
                                type="email"
                                class="form-control input-pad"
                                placeholder="Digite o Email"
                                v-model="obj.email"
                                autocomplete="of"
                            />
                            <p
                                class="text-danger mt-2 fw-bold"
                                v-show="error"
                            >
                                {{ error }}
                            </p>
                        </div>
                        <div class="form-group mt-4">
                            <label
                                for=""
                                class="fs-3"
                            >
                                Senha:
                            </label>
                            <input
                                type="password"
                                class="form-control input-pad"
                                placeholder="Digite a Senha"
                                v-model="obj.password"
                                autocomplete="new-password"
                            />
                        </div>
                        <div class="form-group mt-4">
                            <label
                                for=""
                                class="fs-3"
                            >
                                Setor:
                            </label>
                            <select
                                class="form-control"
                                v-model="obj.setor_id"
                            >
                                <option
                                    v-for="(setor, index) in setores"
                                    :key="index"
                                    :value="setor.id"
                                >
                                    {{ setor.nome }}
                                </option>
                            </select>

                            <p
                                class="text-danger mt-2 fw-bold"
                                v-show="error"
                            >
                                {{ error }}
                            </p>
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
                            @click="gravaAtendente"
                        >
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div
            class="modal fade"
            id="editModal"
            tabindex="-1"
            aria-labelledby="editModalLabel"
            aria-hidden="true"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1
                            class="modal-title fs-2"
                            id="staticBackdropLabel"
                        >
                            Editar Atendente
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
                                class="fs-3"
                            >
                                Nome:
                            </label>
                            <input
                                type="text"
                                class="form-control input-pad"
                                placeholder="Digite o Nome"
                                v-model="obj.name"
                            />
                        </div>
                        <div class="form-group mt-4">
                            <label
                                for=""
                                class="fs-3"
                            >
                                Email:
                            </label>
                            <input
                                type="email"
                                class="form-control input-pad"
                                placeholder="Digite o Email"
                                v-model="obj.email"
                            />
                            <p
                                class="text-danger mt-2 fw-bold"
                                v-show="error"
                            >
                                {{ error }}
                            </p>
                        </div>
                        <div class="form-group mt-4">
                            <label
                                for=""
                                class="fs-3"
                            >
                                Senha:
                            </label>
                            <input
                                type="password"
                                class="form-control input-pad"
                                placeholder="Digite a Senha"
                                v-model="obj.password"
                            />
                        </div>
                        <div class="form-group mt-4">
                            <label
                                for=""
                                class="fs-3"
                            >
                                Setor:
                            </label>
                            <select
                                class="form-control"
                                v-model="obj.setor_id"
                            >
                                <option
                                    v-for="(setor, index) in setores"
                                    :key="index"
                                    :value="setor.id"
                                    :selected="obj.setor_id == setor.id"
                                >
                                    {{ setor.nome }}
                                </option>
                            </select>

                            <p
                                class="text-danger mt-2 fw-bold"
                                v-show="error"
                            >
                                {{ error }}
                            </p>
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
                            @click="atualizarAtendente"
                        >
                            <div v-if="!btn_atendente">Editar</div>
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
    </Container>
</template>

<script>
import { filterTipoUsuario } from '@/utils/statusFilters'
import Container from '../GLOBALS/container.vue'

import Api from '@/services/api'
import Swal from 'sweetalert2'

export default {
    name: 'usuariosAdm',

    components: { Container },

    data() {
        return {
            atendentes: [],
            setores: [],
            selecionado: {},
            pesquisa: '',
            obj: {
                user_id: localStorage.getItem('@USER_ID'),
                name: null,
                email: null,
                password: null,
                setor_id: null,
            },
            error: null,
            atendente_id: null,
            btn_atendente: false,
            loadingPage: false,
        }
    },

    mounted() {
        this.chamarAtendentes()
        this.chamarSetores()
    },

    methods: {
        filterTipoUsuario,

        Selecionar(user) {
            this.selecionado = user
        },

        chamarAtendentes() {
            this.loadingPage = true

            Api.post('/atendentes/ZmlsYWRlYXRlbmRpbWVudG8=', {
                id: localStorage.getItem('@USER_ID'),
            })
                .then(response => {
                    let data = response.data
                    this.atendentes = data.atendentes
                })
                .catch(erro => {
                    console.error(erro)

                    this.loadingPage = false
                })
                .finally(() => (this.loadingPage = false))
        },

        chamarSetores() {
            Api.post('/setores/ZmlsYWRlYXRlbmRpbWVudG8=', {
                id: localStorage.getItem('@USER_ID'),
            })
                .then(response => {
                    let data = response.data
                    this.setores = data.setores
                })
                .catch(erro => console.error(erro))
        },

        fechaModal() {
            const truck_modal = document.querySelector('#cadastrarModal ')
            const modal = bootstrap.Modal.getInstance(truck_modal)
            modal.hide()
        },

        gravaAtendente() {
            if (this.obj.name === null || this.obj.email === null || this.obj.password === null)
                return

            Api.post('/atendentes_grava/ZmlsYWRlYXRlbmRpbWVudG8=', this.obj)
                .then(response => {
                    this.fechaModal()

                    this.chamarAtendentes()
                    Swal.fire('Gravado!', response.data.message, 'success')

                    this.obj.name = null
                    this.obj.email = null
                    this.obj.password = null
                    this.error = null
                })
                .catch(error => {
                    const apiError = error.response.data.message
                    this.error = apiError
                })
        },

        deletaAtendente(atendente_id) {
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
                    Api.post('/atendente_exclui/ZmlsYWRlYXRlbmRpbWVudG8=', {
                        id: atendente_id,
                    })
                        .then(response => {
                            Swal.fire('Excluído!', response.data.mensagem, 'success')

                            this.chamarAtendentes()
                        })
                        .catch(error => {
                            console.error(error)
                        })
                }
            })
        },

        editarAtendente(atendente_id) {
            this.atendente_id = atendente_id
            Api.post('/atendente_edita/ZmlsYWRlYXRlbmRpbWVudG8=', {
                atendente_id: atendente_id,
            })
                .then(response => {
                    const data = response.data
                    const atendente = data.atendente

                    this.obj.name = atendente.name
                    this.obj.email = atendente.email
                    this.obj.setor_id = atendente.setor_id
                    this.obj.password = null
                    const truck_modal = document.querySelector('#editModal')
                    const modal = bootstrap.Modal.getOrCreateInstance(truck_modal)

                    modal.show()
                })
                .catch(error => {
                    console.error(error)
                })
        },

        atualizarAtendente() {
            if (this.obj.name === null || this.obj.email === null) return
            this.btn_atendente = true
            const newObj = JSON.parse(JSON.stringify(this.obj))

            newObj.atendente_id = this.atendente_id

            Api.post('/atendente_update/ZmlsYWRlYXRlbmRpbWVudG8=', newObj)
                .then(response => {
                    this.chamarAtendentes()
                    this.btn_atendente = false

                    Swal.fire('Atualizado!', response.data.message, 'success')

                    this.obj.name = null
                    this.obj.email = null

                    const truck_modal = document.querySelector('#editModal')
                    const modal = bootstrap.Modal.getOrCreateInstance(truck_modal)
                    modal.hide()
                })
                .catch(error => {
                    this.btn_atendente = false
                    console.error(error)
                })
        },
    },
}
</script>

<style scoped>
.pad-header {
    padding: 10px;
}

.input-pad {
    padding: 10px 20px;
    font-size: 1.1rem;
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
