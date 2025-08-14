<template>
    <Container class="mt-5 100">
        <div class="w-100 d-flex flex-column align-items-center">
            <h1 class="fw-bold text-center">Estatística de Envio</h1>
        </div>

        <div class="d-flex flex-wrap usuarios justify-content-center align-items-center p-4">
            <input
                type="text"
                class="buscar rounded pad-header m-1 w-50 text-dark bg-white"
                style="caret-color: #333"
                placeholder="Busque Campanhas"
                v-model="pesquisa"
            />

            <button class="m-1 bg-primary text-white text-uppercase fw-bold rounded pad-header">
                Buscar
            </button>
        </div>

        <div class="table-responsive">
            <table class="table table-striped table-hover mb-4">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nome Campanha</th>
                        <th scope="col">Mensagem</th>
                        <th scope="col">Status</th>
                        <th scope="col">Ação</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(campanha, index) in campanhas"
                        :key="index"
                    >
                        <td>{{ campanha.id }}</td>
                        <td>{{ campanha.nome_campanha }}</td>
                        <td>{{ campanha.msg }}</td>
                        <td :inner-html.prop="filterEstatistica(campanha.mensagem_status)"></td>
                        <td
                            class="d-flex gap-3 flex-wrap"
                            style="align-items: center; justify-content: center"
                        >
                            <button
                                class="btn btn-success w-50 fs-3"
                                @click="editaCampanha(campanha.id, campanha.nome_campanha)"
                            >
                                <i class="fa-solid fa-paper-plane"></i>
                            </button>
                            <button
                                class="btn btn-danger w-50 fs-3"
                                @click="deletaCampanha(campanha.id)"
                            >
                                <i class="fa-solid fa-trash"></i>
                            </button>

                            <button
                                class="btn btn-success w-50 fs-3"
                                @click="reiniciaCampanha(campanha.id, campanha.nome_campanha)"
                            >
                                <i class="fa-solid fa-rotate-left"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div
            class="offcanvas offcanvas-end"
            style="width: 85%"
            tabindex="-1"
            id="offCanvasEditaCampanhas"
            aria-labelledby="offCanvasEditaCampanhas"
        >
            <div class="offcanvas-header flex-wrap mt-2">
                <h2
                    class="offcanvas-title fs-3 fw-bold"
                    id="offcanvasRightLabel"
                >
                    CAMPANHA -
                    <span class="fs-3 fw-normal">{{ objContatos.nome_campanha }}</span>
                </h2>
                <button
                    type="button"
                    class="btn btn-danger fs-4 fw-bold"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                    v-if="!tirarPrint"
                >
                    Fechar
                </button>
            </div>
            <div class="row container-fluid">
                <div class="col-md-12">
                    <button
                        class="btn btn-success ms-2 fw-bold pad-button fs-4"
                        data-bs-toggle="modal"
                        data-bs-target="#selecionaContatos"
                        v-if="!tirarPrint"
                    >
                        Enviados {{ objContatos.qtdeEnviados }}
                    </button>
                    <button
                        class="btn btn-warning ms-2 fw-bold pad-button fs-4"
                        data-bs-toggle="modal"
                        data-bs-target="#selecionaContatos"
                        v-if="!tirarPrint"
                    >
                        Não Enviados {{ objContatos.qtdeNaoEnviados }}
                    </button>
                    <button
                        class="btn btn-primary ms-2 fw-bold pad-button fs-4"
                        data-bs-toggle="modal"
                        data-bs-target="#selecionaContatos"
                        @click="editaCampanha(campanha_id, campanha_nome)"
                        v-if="!tirarPrint"
                    >
                        Atualizar
                    </button>
                </div>

                <div class="col-md-12 mt-5">
                    <div
                        class="table-responsive d-flex flex-column justify-content-center align-items-center tabela-imprimir"
                    >
                        <table class="table table-striped table-hover mb-4">
                            <thead>
                                <tr>
                                    <th scope="col">Status</th>
                                    <th scope="col">Nome</th>
                                    <th scope="col">Telefone</th>
                                    <th scope="col">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(contato, index) in objContatos.contatos"
                                    :key="index"
                                >
                                    <td
                                        :inner-html.prop="filterContatos(contato.mensagem_status)"
                                    ></td>
                                    <td>{{ contato.nome }}</td>
                                    <td>{{ contato.fone }}</td>
                                    <td>
                                        <button
                                            class="btn btn-danger"
                                            @click="
                                                deletarContato(
                                                    contato.id_listaenvio,
                                                    contato.campanha_id
                                                )
                                            "
                                        >
                                            Deletar
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <nav aria-label="Page navigation example">
                            <ul class="pagination text-center">
                                <li class="page-item">
                                    <a
                                        class="page-link"
                                        href="#"
                                        aria-label="Previous"
                                    >
                                        <span aria-hidden="true">&laquo;</span>
                                    </a>
                                </li>

                                <li
                                    class="page-item"
                                    v-for="(list, index) in list_page"
                                    :key="index"
                                >
                                    <a
                                        v-show="
                                            list.label !== '&laquo; Previous' &&
                                            list.label !== 'Next &raquo;'
                                        "
                                        @click="selecionarPagina(list.label)"
                                        class="page-link"
                                        :class="{ active: list.active }"
                                        href="#"
                                    >
                                        {{ list.label }}
                                    </a>
                                </li>

                                <li class="page-item">
                                    <a
                                        class="page-link"
                                        href="#"
                                        aria-label="Next"
                                    >
                                        <span aria-hidden="true">&raquo;</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                <div class="col-md-12 mt-5 text-center">
                    <button
                        class="btn btn-primary fs-3"
                        @click="printDiv('.tabela-imprimir')"
                        v-if="!tirarPrint"
                    >
                        Imprimir
                    </button>
                </div>
            </div>
        </div>
    </Container>
</template>

<script>
import { filterEstatistica, filterContatos } from '@/utils/statusFilters'
import Container from '../GLOBALS/container.vue'

import Api from '@/services/api'
import Swal from 'sweetalert2'

export default {
    name: 'estatisticaCampanha',

    components: { Container },

    data() {
        return {
            campanhas: [],
            pesquisa: '',
            campanha_id: null,
            campanha_nome: null,
            objContatos: {
                contatos: null,
                qtdeEnviados: null,
                qtdeNaoEnviados: null,
                nome_campanha: null,
            },
            user_id: localStorage.getItem('@USER_ID'),
            list_page: [],
            page_active: 1,
            tirarPrint: false,
        }
    },

    mounted() {
        this.chamaCampanha()
    },

    methods: {
        filterContatos,
        filterEstatistica,

        printDiv() {
            this.tirarPrint = true

            let offCanvas = document.querySelector('#offCanvasEditaCampanhas')

            offCanvas.style.width = '100%'

            setTimeout(() => {
                window.print()

                this.tirarPrint = false
                offCanvas.style.width = '85%'
            }, 100)
        },

        selecionarPagina(id) {
            this.page_active = id
        },

        chamaCampanha() {
            Api.post('/estatistica/ZmlsYWRlYXRlbmRpbWVudG8=', {
                id: this.user_id,
            })
                .then(response => {
                    let data = response.data

                    this.midiaOptions = data.midia
                    this.campanhas = data.campanhas
                })
                .catch(erro => console.error(erro))
        },

        fechaModal() {
            const truck_modal = document.querySelector('#exampleModal')
            const modal = bootstrap.Modal.getInstance(truck_modal)
            modal.hide()
        },

        deletaCampanha(campanha_id) {
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
                    Api.post('/campanha_exclui/ZmlsYWRlYXRlbmRpbWVudG8=', {
                        id_campanha: campanha_id,
                    })
                        .then(response => {
                            Swal.fire('Excluído!', response.data.mensagem, 'success')

                            this.chamaCampanha()
                        })
                        .catch(error => {
                            console.error(error)
                        })
                }
            })
        },

        limpaObj() {
            this.obj.nome_campanha = null
            this.obj.msg = null
            this.obj.midia = null
            this.obj.tipo = 0
        },

        editaCampanha(campanha_id, nome_campanha) {
            this.campanha_id = campanha_id
            this.campanha_nome = nome_campanha
            Api.post('/estatistica_mostra/ZmlsYWRlYXRlbmRpbWVudG8=', {
                campanha_id: campanha_id,
                id: this.user_id,
            })
                .then(response => {
                    const data = response.data

                    if (Array.isArray(data.lista_envio)) {
                        this.objContatos.contatos = data.lista_envio
                    } else {
                        this.objContatos.contatos = data.lista_envio.data

                        this.objContatos.qtdeEnviados = data.qtdenviados

                        this.objContatos.qtdeNaoEnviados = data.qtdnaoenviados

                        this.objContatos.nome_campanha = this.campanha_nome

                        this.list_page = response.data.lista_envio.links
                    }

                    const truck_modal = document.querySelector('#offCanvasEditaCampanhas')
                    const modal = bootstrap.Offcanvas.getOrCreateInstance(truck_modal)
                    modal.show()
                })
                .catch(error => {
                    console.error(error)
                })
        },

        deletarContato(id_listaenvio, id_campanha) {
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
                    Api.post('/contatoenvia_exclui/ZmlsYWRlYXRlbmRpbWVudG8=', {
                        id_listaenvio: id_listaenvio,
                        id_campanha: id_campanha,
                        id: localStorage.getItem('@USER_ID'),
                    })
                        .then(response => {
                            Swal.fire('Excluído!', response.data.mensagem, 'success')

                            this.objEdit.contatos = response.data.contatos.data
                        })
                        .catch(error => {
                            console.error(error)
                        })
                }
            })
        },

        reiniciaCampanha(id_listaenvio, id_campanha) {
            Swal.fire({
                title: 'Tem certeza que deseja reiniciar esta campanha ?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim, reiniciar!',
                cancelButtonText: 'Cancelar',
            }).then(result => {
                if (result.isConfirmed) {
                    Api.post('/reinicia_campanha/ZmlsYWRlYXRlbmRpbWVudG8=', {
                        id_listaenvio: id_listaenvio,
                        id_campanha: id_campanha,
                        id: localStorage.getItem('@USER_ID'),
                    })
                        .then(response => {
                            Swal.fire('Reiniciado com Sucesso!', response.data.mensagem, 'success')

                            this.objEdit.contatos = response.data.contatos.data
                        })
                        .catch(error => {
                            console.error(error)
                        })
                }
            })
        },

        async listarContatos() {
            Api.post(`/campanha_estrutura/ZmlsYWRlYXRlbmRpbWVudG8=?page=${this.page_active}`, {
                campanha_id: this.campanha_id,
                id: localStorage.getItem('@USER_ID'),
            })
                .then(response => {
                    const data = response.data

                    this.objEdit.contatos = data.lista_envio.data

                    this.list_page = response.data.lista_envio.links
                })
                .catch(error => {
                    console.error(error)
                })
        },

        limparPesquisa() {
            if (this.pesquisa == '') {
                this.chamaCampanha()
            }
        },

        async Pesquisar() {
            Api.post(`/buscar_campanha/ZmlsYWRlYXRlbmRpbWVudG8=`, {
                id: localStorage.getItem('@USER_ID'),
                busca: this.pesquisa,
            })
                .then(response => {
                    let data = response.data
                    this.campanhas = data.buscar_campanhas
                    // let links = response.data.contatos.links;
                    // this.contatos = data;
                    // this.list_page = links;
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
.offcanvas {
    overflow-x: scroll;
}

.pad-header {
    padding: 10px 20px;
}
.pad-button {
    padding: 10px 15px;
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

#offCanvasEditaCampanhas.print {
    width: 100%;
}

@media (max-width: 700px) {
    .usuarios {
        justify-content: center;
        gap: 10px;
    }

    .usuarios div {
        margin: 0;
    }
}
@media (max-width: 570px) {
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
    min-width: 600px;
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

@media (max-width: 500px) {
    table {
        max-width: 1000px;
    }
}
</style>
