<template>
    <container class="mt-5">
        <div class="d-flex flex-column align-items-center">
            <h1 class="fw-bold">Convênios</h1>
        </div>

        <div class="d-flex flex-wrap usuarios text-center p-1">
            <div class="col-12 mb-5">
                <input
                    v-model="pesquisa"
                    type="text"
                    class="buscar rounded pad-header m-1 w-50 text-dark bg-white"
                    style="caret-color: #333"
                    placeholder="Busque por nome"
                    aria-describedby="button-addon2"
                    @keyup="Pesquisar"
                />

                <button
                    class="m-1 bg-success text-white text-uppercase fw-bold rounded pad-header"
                    data-bs-toggle="modal"
                    data-bs-target="#convenio_modal"
                >
                    Cadastrar convênio
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
                        <th scope="col">Código</th>
                        <th scope="col">Ação</th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="(convenio, index) in convenios"
                        :key="index"
                    >
                        <td>
                            {{ convenio.nome ? convenio.nome : 'Não definido' }}
                            <br />
                        </td>

                        <td>
                            {{ convenio.codigo }}
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
                                        data-bs-toggle="modal"
                                        data-bs-target="#convenio_modal"
                                        @click="Selecionar(convenio)"
                                    >
                                        <i class="fa-solid fa-pen"></i>
                                    </button>
                                </div>

                                <div class="col-md-6">
                                    <button
                                        title="Excluir"
                                        class="btn btn-danger fs-3"
                                        @click="convenioDelete(convenio.id)"
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

        <create-or-edit-modal
            :convenio="selecionado"
            @handle-close-modal="clearSelecionado"
            @refresh-convenios="refreshConvenios()"
        />
    </container>
</template>

<script>
import Container from '@/components/GLOBALS/container.vue'

import Swal from 'sweetalert2'
import Api from '@/services/api'
import CreateOrEditModal from './modals/plano-saude-modal/CreateOrEditModal.vue'

export default {
    name: 'PlanoSaude',

    components: { Container, CreateOrEditModal },

    data() {
        return {
            CLIENTE_ID: btoa(localStorage.getItem('@USER_ID')),
            convenios: [],
            list_page: [],
            last_page: null,
            page_active: 1,
            selecionado: {},
            pesquisa: null,
            loadingPage: false,
        }
    },

    watch: {
        page_active: function () {
            this.getConvenios()
        },
    },

    created() {
        this.getConvenios()
    },

    methods: {
        async getConvenios() {
            this.loadingPage = true

            Api.post(
                '/convenios',
                {
                    Y2xpZW50ZV9pZA: this.CLIENTE_ID,
                    pagination: true,
                },
                {
                    params: {
                        page: this.page_active,
                    },
                }
            )
                .then(response => {
                    this.convenios = response.data.convenios.data
                    this.list_page = response.data.convenios.links.filter(
                        link => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;'
                    )
                    this.last_page = response.data.convenios.last_page
                })
                .catch(erro => {
                    console.error(erro)
                    this.loadingPage = false
                })
                .finally(() => (this.loadingPage = false))
        },

        async Pesquisar() {
            if (this.pesquisa[0] === ' ' || /[^a-zA-Z0-9\s]/.test(this.pesquisa[0])) return

            Api.post(`/convenio_busca`, {
                Y2xpZW50ZV9pZA: this.CLIENTE_ID,
                busca: this.pesquisa,
            })
                .then(response => {
                    if (!this.pesquisa || this.pesquisa === '' || this.pesquisa === null) {
                        return this.getConvenios()
                    }

                    this.convenios = response.data.convenios.data
                    this.list_page = response.data.convenios.links.filter(
                        link => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;'
                    )
                })
                .catch(erro => console.error(erro))
        },

        async convenioDelete(convenio) {
            Swal.fire({
                title: 'Delete',
                text: 'Você tem certeza de que deseja deletar este item?',
                icon: 'warning',
                showCancelButton: true,
                reverseButtons: true,
                cancelButtonColor: '#d33',
                confirmButtonColor: '#3b82f6',
                cancelButtonText: 'CANCELAR',
                confirmButtonText: 'DELETAR',
            }).then(result => {
                if (result.isConfirmed) {
                    Api.post(`/convenio_destroy`, {
                        Y2xpZW50ZV9pZA: this.CLIENTE_ID,
                        convenio_id: convenio,
                    })
                        .then(response => {
                            if (response.data.status) {
                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    title: 'Sucesso!',
                                    text: 'Convênio deletado com sucesso.',
                                    showConfirmButton: false,
                                    timer: 1500,
                                })

                                this.refreshConvenios()
                            } else {
                                alert('Erro ao deletar convenio')
                            }
                        })
                        .catch(error => {
                            console.error(error)

                            if (error.response.data) {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Erro',
                                    text: error.response.data,

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

                            Swal.fire({
                                icon: 'error',
                                title: 'Erro ',
                                titleText: 'Erro ao deletar convênio.',
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

        incrementar() {
            if (this.page_active >= this.last_page) return

            this.page_active++
        },

        decrementar() {
            if (this.page_active <= 0) return

            this.page_active--
        },

        Selecionar(convenio) {
            this.selecionado = convenio
        },

        SelecionarPagina(id) {
            this.page_active = id
        },

        limparPesquisa() {
            if (this.pesquisa == '') {
                this.getConvenios()
            }
        },

        clearSelecionado() {
            this.selecionado = {}
        },

        refreshConvenios() {
            this.getConvenios()
            this.pesquisa = null
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
