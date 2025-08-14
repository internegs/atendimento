<template>
    <container class="mt-5">
        <div class="d-flex flex-column align-items-center">
            <h1 class="fw-bold">Planos</h1>
        </div>

        <div class="d-flex flex-wrap usuarios text-center p-1">
            <div class="col-12 mb-5">
                <button
                    class="m-1 bg-success text-white text-uppercase fw-bold rounded pad-header"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#add_plano"
                >
                    Cadastrar plano
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
            <table class="table table-striped table-hover mb-4">
                <thead>
                    <tr>
                        <th scope="col">Nome</th>
                        <th scope="col">Resumo</th>
                        <th scope="col">Valor</th>
                        <th scope="col">Ação</th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="(plano, index) in planos"
                        :key="index"
                    >
                        <td>
                            {{ plano.nome ? plano.nome : 'Não definido' }}
                            <br />
                        </td>

                        <td>
                            {{ plano.resumo }}
                        </td>

                        <td>
                            <span>{{ maskMoney(plano.valor_inicial) }}</span>
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
                                        data-bs-target="#add_plano"
                                        @click="Selecionar(plano)"
                                    >
                                        <i class="fa-solid fa-pen"></i>
                                    </button>
                                </div>

                                <div class="col-md-6">
                                    <button
                                        title="Excluir"
                                        class="btn btn-danger fs-3"
                                        @click="Deleta(plano.id)"
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

        <create-or-edit-modal
            :plano="selecionado"
            @handle-close-modal="clearSelecionado"
            @refresh-planos="refreshPlanos()"
        />
    </container>
</template>

<script>
import Container from '@/components/GLOBALS/container.vue'
import Swal from 'sweetalert2'
import Api from '@/services/api'
import CreateOrEditModal from './modals/plano-modal/CreateOrEditModal.vue'

export default {
    name: 'PlanoComponent',

    components: { Container, CreateOrEditModal },

    data() {
        return {
            CLIENTE_ID: btoa(localStorage.getItem('@USER_ID')),
            planos: [],
            list_page: [],
            last_page: null,
            selecionado: {},
            pesquisa: null,
            loadingPage: false,
        }
    },

    created() {
        this.getPlanos()
    },

    methods: {
        async getPlanos() {
            this.loadingPage = true

            Api.get('/planos')
                .then(response => {
                    this.planos = response.data
                })
                .catch(erro => {
                    console.error(erro)
                    this.loadingPage = false
                })
                .finally(() => {
                    this.loadingPage = false
                })
        },

        async Pesquisar() {
            if (this.pesquisa[0] === ' ' || /[^a-zA-Z0-9\s]/.test(this.pesquisa[0])) return

            Api.post(`/pacientes_busca`, {
                Y2xpZW50ZV9pZA: this.CLIENTE_ID,
                busca: this.pesquisa,
            })
                .then(response => {
                    if (!this.pesquisa || this.pesquisa === '' || this.pesquisa === null) {
                        return this.getPlanos()
                    }

                    let data = response.data.pacientes.data
                    let linksPagination = response.data.pacientes.links
                    this.planos = data
                    this.list_page = linksPagination
                })
                .catch(erro => console.error(erro))
        },

        async Deleta(planoId) {
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
                    Api.post(`/plano_delete`, {
                        Y2xpZW50ZV9pZA: this.CLIENTE_ID,
                        cGxhbm9faWQ: btoa(planoId),
                    })
                        .then(response => {
                            if (response.data) {
                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    title: 'Sucesso!',
                                    text: 'Plano deletado com sucesso.',
                                    showConfirmButton: false,
                                    timer: 1500,
                                })

                                this.getPlanos()
                                this.pesquisa = null
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
                                title: 'Erro',
                                text: 'Erro ao deletar plano.',

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

        Selecionar(plano) {
            this.selecionado = plano
        },

        limparPesquisa() {
            if (this.pesquisa == '') {
                this.getPlanos()
            }
        },

        clearSelecionado() {
            this.selecionado = {}
        },

        refreshPlanos() {
            this.getPlanos()
            this.pesquisa = null
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
