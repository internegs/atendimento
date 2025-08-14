<template>
    <Container class="mt-2">
        <div class="d-flex flex-column align-items-center">
            <h1 class="fw-bold">Setores internos</h1>
        </div>

        <div class="d-flex flex-wrap usuarios text-center align-items-center p-2">
            <div class="col-12">
                <button
                    class="m-1 bg-success text-white text-uppercase fw-bold rounded pad-header"
                    data-bs-toggle="modal"
                    data-bs-target="#cadastrarModal"
                >
                    Cadastrar novo setor
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
                        <th scope="col">id</th>
                        <th scope="col">Nome</th>

                        <th scope="col">Ação</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(setor, index) in setores"
                        :key="index"
                    >
                        <td>{{ setor.vinculo_id }}</td>
                        <td>{{ setor.nome }}</td>

                        <td
                            class="d-flex gap-3 flex-wrap"
                            style="align-items: center; justify-content: center"
                        >
                            <div class="row">
                                <div class="col-md-6">
                                    <button
                                        class="btn btn-primary fs-3"
                                        @click="editarSetor(setor.id)"
                                    >
                                        <i class="fa-solid fa-pen"></i>
                                    </button>
                                </div>
                                <div class="col-md-6">
                                    <button
                                        class="btn btn-danger fs-3"
                                        @click="deletaSetor(setor.id)"
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
                            Cadastrar novo Setor
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
                                v-model="obj.nome"
                            />
                        </div>
                        <div class="form-group mt-4">
                            <label
                                for=""
                                class="fs-3"
                            >
                                Resposta vinculada:
                            </label>
                            <select
                                class="form-control"
                                v-model="obj.vinculo_id"
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
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
                            @click="gravaSetor"
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
                            Editar Setor
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
                                v-model="obj.nome"
                            />
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
                            @click="atualizarSetor"
                        >
                            <div v-if="!btn_setor">Editar</div>
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
import Container from '../GLOBALS/container.vue'

import Api from '@/services/api'
import Swal from 'sweetalert2'

export default {
    name: 'setorAdm',

    components: { Container },

    data() {
        return {
            setores: [],
            selecionado: {},
            pesquisa: '',
            obj: {
                user_id: localStorage.getItem('@USER_ID'),
                nome: null,
                vinculo_id: null,
            },
            error: null,
            setor_id: null,
            btn_setor: false,
            loadingPage: false,
        }
    },

    mounted() {
        this.chamarSetores()
    },

    methods: {
        Selecionar(user) {
            this.selecionado = user
        },

        chamarSetores() {
            this.loadingPage = true

            Api.post('/setores/ZmlsYWRlYXRlbmRpbWVudG8=', {
                id: localStorage.getItem('@USER_ID'),
            })
                .then(response => {
                    let data = response.data
                    this.setores = data.setores
                })
                .catch(erro => {
                    console.error(erro)
                    this.loadingPage = false
                })
                .finally(() => (this.loadingPage = false))
        },

        fechaModal() {
            const truck_modal = document.querySelector('#cadastrarModal ')
            const modal = bootstrap.Modal.getInstance(truck_modal)
            modal.hide()
        },

        gravaSetor() {
            if (this.obj.nome === null || this.obj.vinculo_id === null) return

            Api.post('/setores_grava/ZmlsYWRlYXRlbmRpbWVudG8=', this.obj)
                .then(response => {
                    this.fechaModal()

                    this.chamarSetores()
                    Swal.fire('Gravado com Sucesso!', response.data.message, 'success')

                    this.obj.nome = null

                    this.error = null
                })
                .catch(error => {
                    const apiError = error.response.data.message
                    this.error = apiError
                })
        },

        deletaSetor(setor_id) {
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
                    Api.post('/setor_exclui/ZmlsYWRlYXRlbmRpbWVudG8=', {
                        id: setor_id,
                    })
                        .then(response => {
                            if (response.data.status == true) {
                                Swal.fire('Setor Excluído!', response.data.mensagem, 'success')
                            } else {
                                Swal.fire('Erro!', response.data.mensagem, 'error')
                            }
                            this.chamarSetores()
                        })
                        .catch(error => {
                            console.error(error)
                        })
                }
            })
        },

        editarSetor(setor_id) {
            this.setor_id = setor_id
            Api.post('/setor_edita/ZmlsYWRlYXRlbmRpbWVudG8=', {
                setor_id: setor_id,
            })
                .then(response => {
                    const data = response.data
                    const setor = data.setor

                    // console.log(setor.nome);
                    this.obj.nome = setor.nome

                    const truck_modal = document.querySelector('#editModal')
                    const modal = bootstrap.Modal.getOrCreateInstance(truck_modal)

                    modal.show()
                    // modal.show();
                })
                .catch(error => {
                    console.error(error)
                })
        },

        atualizarSetor() {
            if ((this.obj.nome === null) === null) return
            this.btn_setor = true
            const newObj = JSON.parse(JSON.stringify(this.obj))

            newObj.setor_id = this.setor_id

            //  console.log(newObj);
            Api.post('/setor_update/ZmlsYWRlYXRlbmRpbWVudG8=', newObj)
                .then(response => {
                    this.chamarSetores()
                    this.btn_setor = false

                    Swal.fire('Atualizado!', response.data.mensagem, 'success')

                    this.obj.editanome = null

                    const truck_modal = document.querySelector('#editModal')
                    const modal = bootstrap.Modal.getOrCreateInstance(truck_modal)
                    modal.hide()
                })
                .catch(error => {
                    this.btn_setor = false
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

/* input.buscar {
} */

/* .usuarios {
  background-color: #f0f0f0;
} */

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
