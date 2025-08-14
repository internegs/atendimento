<template>
    <container class="mt-5">
        <div class="d-flex flex-column align-items-center">
            <h1 class="fw-bold">Subplanos</h1>
        </div>

        <div class="d-flex flex-wrap usuarios text-center p-1">
            <div class="col-12 mb-5">
                <button
                    class="m-1 bg-success text-white text-uppercase fw-bold rounded pad-header"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#add_subplano"
                >
                    Cadastrar subplano
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
                        <th scope="col">Plano</th>
                        <th scope="col">Resumo</th>
                        <th scope="col">Valor</th>
                        <th scope="col">Ação</th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="(subplano, index) in subplanos"
                        :key="index"
                    >
                        <td>
                            {{ subplano.nome ? subplano.nome : 'Não definido' }}
                            <br />
                        </td>

                        <td>
                            <span>{{ hasNamePlano(subplano.plano_nome) }}</span>
                        </td>

                        <td>
                            {{ subplano.resumo }}
                        </td>

                        <td>
                            <span>{{ maskMoney(subplano.valor) }}</span>
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
                                        data-bs-target="#add_subplano"
                                        @click="Selecionar(subplano)"
                                    >
                                        <i class="fa-solid fa-pen"></i>
                                    </button>
                                </div>

                                <div class="col-md-6">
                                    <button
                                        title="Excluir"
                                        class="btn btn-danger fs-3"
                                        @click="Deleta(subplano.cpf)"
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
            :planos="planos"
            :subplano="selecionado"
            @handle-close-modal="clearSelecionado"
            @refresh-subplanos="refreshSubplanos()"
        />
    </container>
</template>

<script>
import Container from '@/components/GLOBALS/container.vue'

import Swal from 'sweetalert2'
import Api from '@/services/api'
import CreateOrEditModal from './modals/subplano-modal/CreateOrEditModal.vue'

export default {
    name: 'PacientesComponent',

    components: { Container, CreateOrEditModal },

    data() {
        return {
            CLIENTE_ID: btoa(localStorage.getItem('@USER_ID')),
            subplanos: [],
            list_page: [],
            last_page: null,
            page_active: 1,
            selecionado: {},
            planos: [],
            loadingPage: false,
        }
    },

    watch: {
        page_active: function () {
            this.getSubplanos()
        },
    },

    created() {
        this.getSubplanos()
        this.getPlanos()
    },

    methods: {
        async getSubplanos() {
            this.loadingPage = true

            Api.post(
                '/subplano_admin',
                {
                    Y2xpZW50ZV9pZA: this.CLIENTE_ID,
                },
                {
                    params: {
                        page: this.page_active,
                    },
                }
            )
                .then(response => {
                    this.subplanos = response.data.subplanos.data
                    this.list_page = response.data.subplanos.links.filter(
                        link => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;'
                    )
                    this.last_page = response.data.subplanos.last_page
                })
                .catch(erro => {
                    console.error(erro)

                    this.loadingPage = false
                })
                .finally(() => (this.loadingPage = false))
        },

        async getPlanos() {
            Api.get('/planos', {
                Y2xpZW50ZV9pZA: this.CLIENTE_ID,
            })
                .then(response => {
                    this.planos = response.data.map(plano => ({
                        id: plano.id,
                        nome: plano.nome,
                    }))
                })
                .catch(err => {
                    console.log(err)
                })
        },

        async Deleta(subplano) {
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
                    Api.post(`/subplano_delete`, {
                        Y2xpZW50ZV9pZA: this.CLIENTE_ID,
                        c3VicGxhbm9faWQ: btoa(subplano),
                    })
                        .then(response => {
                            if (response.data.status) {
                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    title: 'Sucesso!',
                                    text: 'Subplano deletado com Sucesso.',
                                    showConfirmButton: false,
                                    timer: 1500,
                                })

                                this.getSubplanos()
                            } else {
                                alert('Erro ao deletar subplano')
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
                                titleText: 'Erro ao deletar subplano',
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

        Selecionar(subplano) {
            this.selecionado = subplano
        },

        SelecionarPagina(id) {
            this.page_active = id
        },

        clearSelecionado() {
            this.selecionado = {}
        },

        hasNamePlano(value) {
            if (!value) return ''

            return this.planos.find(plano => plano.nome === value)?.nome
        },

        refreshSubplanos() {
            this.getSubplanos()
        },

        maskMoney(value) {
            if (!value) return ''

            let numero

            if (typeof value === 'number') {
                numero = String(value) * 100
            } else {
                numero = value.toString().replace(/\D/g, '')
            }

            if (!numero) return ''

            const valorEmReais = parseFloat(numero) / 100

            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(valorEmReais)
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
