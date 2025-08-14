<template>
    <Container class="mt-5 100">
        <div class="d-flex flex-column align-items-center">
            <h1 class="fw-bold">Minhas Campanhas</h1>
            <button
                class="m-1 bg-success text-white text-uppercase fw-bold rounded pad-header"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
            >
                Inserir nova
            </button>
        </div>

        <div class="d-flex flex-wrap usuarios justify-content-center align-items-center p-4">
            <input
                type="text"
                class="buscar rounded pad-header m-1 w-50 text-dark bg-white"
                style="caret-color: #333"
                placeholder="Nome da Campanha"
                aria-label="Recipient's username"
                aria-describedby="button-addon2"
                v-model="pesquisa"
                @keyup.enter="Pesquisar"
                @keyup="limparPesquisa"
            />
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
            class="table-responsive d-flex flex-column align-items-center mt-4"
        >
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
                        <td :inner-html.prop="statusFilter(campanha.status)"></td>
                        <td
                            class="d-flex gap-3 flex-wrap"
                            style="align-items: center; justify-content: center"
                        >
                            <div class="row">
                                <div class="col-md-4">
                                    <button
                                        class="btn btn-success fs-3"
                                        @click="editaCampanha(campanha.id)"
                                    >
                                        <i class="fa-solid fa-paper-plane"></i>
                                    </button>
                                </div>
                                <div class="col-md-4">
                                    <button
                                        class="btn btn-danger fs-3"
                                        @click="deletaCampanha(campanha.id)"
                                    >
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                                <div class="col-md-4">
                                    <button
                                        v-if="campanha.status != 0"
                                        class="btn btn-primary fs-3"
                                        @click="pausaCampanha(campanha.id)"
                                    >
                                        <i class="fa-solid fa-pause"></i>
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
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1
                            class="modal-title fs-5"
                            id="staticBackdropLabel"
                        >
                            Nova Campanha
                        </h1>
                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div class="modal-body row">
                        <div class="form-group col-md-7">
                            <label
                                for=""
                                class="fs-5"
                            >
                                Nome da Campanha:
                            </label>
                            <input
                                type="text"
                                class="form-control"
                                placeholder="Digite nome da campanha"
                                v-model="obj.nome_campanha"
                            />
                        </div>
                        <div class="form-group col-md-5">
                            <label
                                for=""
                                class="fs-5"
                            >
                                Tipo de Mensagem:
                            </label>
                            <select
                                class="form-select"
                                v-model="obj.tipo"
                                @change="isMidia"
                            >
                                <option
                                    :value="option.value"
                                    v-for="(option, index) in options"
                                    :key="index"
                                    :disabled="option.value === null"
                                >
                                    {{ option.text }}
                                </option>
                            </select>
                        </div>

                        <div
                            class="form-group col-md-12 mt-4"
                            v-show="dataIsMidia"
                        >
                            <label
                                for=""
                                class="fs-5"
                            >
                                Selecione o arquivo:
                            </label>
                            <select
                                class="form-select"
                                v-model="obj.midia"
                            >
                                <option
                                    :value="option.idArquivo"
                                    v-for="(option, index) in midiaOptions"
                                    :key="index"
                                    :disabled="option.value === null"
                                >
                                    {{ option.nomeArquivo }}
                                </option>
                            </select>
                        </div>

                        <div class="form-group mt-4 col-md-12">
                            <label
                                for=""
                                class="fs-4"
                            >
                                Mensagem:
                            </label>
                            <textarea
                                class="form-control"
                                v-model="obj.msg"
                            ></textarea>
                        </div>
                        <div class="form-group mt-4 col-md-12">
                            <label
                                for=""
                                class="fs-4"
                            >
                                Mensagem LGPD
                            </label>
                            <textarea
                                class="form-control"
                                v-model="obj.lgpd"
                            ></textarea>
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
                            @click="gravaCampanha"
                        >
                            <div v-if="!btn_gravar">Gravar</div>
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

        <div
            class="offcanvas offcanvas-end"
            style="width: 85%"
            tabindex="-1"
            id="canvasEditaCampanhas"
            aria-labelledby="canvasEditaCampanhas"
        >
            <div class="offcanvas-header flex-wrap mt-2">
                <button
                    type="button"
                    class="btn btn-danger fs-4 fw-bold ms-auto"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                >
                    Fechar
                </button>
            </div>
            <div class="row container-fluid">
                <div class="col-md-12 text-center">
                    <h2
                        class="offcanvas-title fs-3 fw-bold"
                        id="offcanvasRightLabel"
                    >
                        CAMPANHA -
                        <span class="fs-3 fw-normal">
                            {{ objEdit.campanhaDados.nome_campanha }}
                        </span>
                    </h2>

                    <button
                        class="btn btn-primary ms-2 fw-bold pad-button fs-4 mt-2"
                        data-bs-toggle="modal"
                        data-bs-target="#selecionaContatos"
                        v-if="!objEdit.contatos.length && objEdit.campanhaDados.status === 0"
                        @click="chamarEstadosCidade"
                    >
                        Selecionar Contatos
                    </button>
                    <button
                        class="btn btn-success ms-2 fw-bold pad-button fs-4 mt-2"
                        v-else-if="objEdit.campanhaDados.status === 2"
                    >
                        campanha iniciada
                    </button>
                    <button
                        class="btn btn-success ms-2 fw-bold pad-button fs-4 mt-2"
                        v-else-if="objEdit.contatos.length"
                        @click="enviarCampanha()"
                    >
                        <div v-if="!btn_enviar">Enviar</div>
                        <div
                            class="spinner-border"
                            role="status"
                            v-else
                        >
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </button>
                </div>

                <h3
                    v-if="totalContatosSelecionados !== 0"
                    class="col-md-12 fw-bold"
                >
                    Total de Contatos Selecionados {{ totalContatosSelecionados }}
                </h3>

                <div class="col-md-12 mt-5">
                    <div
                        class="table-responsive d-flex flex-column justify-content-center align-items-center"
                    >
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
                                    v-for="(contato, index) in objEdit.contatos"
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
            </div>
        </div>

        <!-- modal -->
        <div
            class="modal fade"
            id="selecionaContatos"
            tabindex="-1"
            aria-labelledby="selecionaContatosLabel"
            aria-hidden="true"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1
                            class="modal-title fs-3 fw-bold"
                            id="staticBackdropLabel"
                        >
                            Selecionar Contatos
                        </h1>
                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>

                    <div class="modal-body row">
                        <div class="col-md-12">
                            <span class="fw-bold text-danger fs-5 text-center">
                                {{ objEdit.mensagem }}
                            </span>
                        </div>
                        <div class="form-group col-md-6">
                            <label
                                for=""
                                class="fs-5 fw-bold font-roboto"
                            >
                                Selecione a Linha:
                            </label>
                            <select
                                class="form-select pad-button"
                                v-model="objSelecionarContatos.linha_id"
                            >
                                <option
                                    :value="linha.id"
                                    v-for="(linha, index) in objEdit.linhas"
                                    :key="index"
                                >
                                    {{ linha.session }}
                                </option>
                            </select>
                        </div>

                        <div class="form-group col-md-6">
                            <label
                                for=""
                                class="fs-5 fw-bold font-roboto"
                            >
                                Selecione o Grupo:
                            </label>
                            <select
                                class="form-select pad-button"
                                v-model="objSelecionarContatos.grupo_id"
                            >
                                <option value="0">Todos</option>
                                <option
                                    v-for="(grupo, index) in objEdit.grupos"
                                    :key="index"
                                    :value="grupo.id"
                                >
                                    {{ grupo.nome_grupo }}
                                </option>
                            </select>
                        </div>
                        <div class="form-group col-md-4 mt-3">
                            <label
                                for=""
                                class="fs-5 fw-bold font-roboto"
                            >
                                Selecione o Genero:
                            </label>
                            <select
                                class="form-select pad-button"
                                v-model="objSelecionarContatos.genero"
                            >
                                <option
                                    :value="genero.id"
                                    v-for="(genero, index) in objEdit.generos"
                                    :key="index"
                                >
                                    {{ genero.genero }}
                                </option>
                            </select>
                        </div>
                        <div class="form-group col-md-4 mt-3">
                            <label
                                for=""
                                class="fs-5 fw-bold font-roboto"
                            >
                                Selecione a UF:
                            </label>
                            <select
                                class="form-select pad-button"
                                v-model="objChamaCidade.uf_id"
                                @change="mudarCidades()"
                            >
                                <option
                                    value="0"
                                    selected
                                >
                                    Todos
                                </option>
                                <option
                                    :value="estado.id"
                                    v-for="(estado, index) in objEdit.estados"
                                    :key="index"
                                >
                                    {{ estado.sigla }}
                                </option>
                            </select>
                        </div>
                        <div class="form-group col-md-4 mt-3">
                            <label
                                for=""
                                class="fs-5 fw-bold font-roboto"
                            >
                                Selecione a Cidade:
                            </label>
                            <select
                                class="form-select pad-button"
                                v-model="objSelecionarContatos.cidade"
                            >
                                <option
                                    value="0"
                                    selected
                                >
                                    Todos
                                </option>
                                <option
                                    :value="cidade.id"
                                    :selected="objSelecionarContatos.cidade === cidade.id"
                                    v-for="(cidade, index) in objEdit.cidades"
                                    :key="index"
                                >
                                    {{ cidade.nome }}
                                </option>
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
                            @click="selecionaContatos"
                        >
                            Gravar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Container>
</template>

<script>
import { filterContatos, statusFilter } from '@/utils/statusFilters'
import Container from '../GLOBALS/container.vue'

import Api from '@/services/api'
import Swal from 'sweetalert2'

export default {
    name: 'campanhaAdm',

    components: { Container },

    data() {
        return {
            campanhas: [],
            pesquisa: '',
            campanha_id: null,
            btn_enviar: false,
            obj: {
                user_id: localStorage.getItem('@USER_ID'),
                nome_campanha: null,
                midia: null,
                tipo: 0,
                msg: null,
                lgpd: `Respeitamos a sua escolha e a Lei de proteção de dados (LGPD) e por isso,
        
        ❌Caso não queira receber nossos informativos ⌨️ digite 0️⃣`,
            },
            options: [
                { value: null, text: 'Selecione tipo de Mensagem' },
                { value: 0, text: 'Somente Texto' },
                { value: 1, text: 'Texto + Arquivo' },
            ],
            dataIsMidia: false,
            midiaOptions: [],
            objEdit: {
                linhas: [],
                grupos: [],
                contatos: [],
                campanhaDados: '',
                generos: [
                    {
                        id: 0,
                        genero: 'Todos',
                    },
                    {
                        id: 'Masculino',
                        genero: 'Masculino',
                    },
                    {
                        id: 'Feminino',
                        genero: 'Feminino',
                    },
                    {
                        id: 'LGBTQIA+',
                        genero: 'LGBTQIA+',
                    },
                ],
                cidades: [],
                estados: [],
                mensagem: null,
            },
            objSelecionarContatos: {
                campanha_id: null,
                id: localStorage.getItem('@USER_ID'),
                grupo_id: 0,
                genero: 0,
                cidade: 0,
                linha_id: null,
            },

            totalContatosSelecionados: 0,

            objChamaCidade: {
                uf_id: 0,
                id: localStorage.getItem('@USER_ID'),
            },

            list_page: [],
            page_active: 1,
            last_page: null,
            btn_gravar: false,
            stop: false,
            loadingPage: false,
        }
    },

    mounted() {
        this.chamaCampanha()
    },

    methods: {
        statusFilter,
        filterContatos,

        mudarCidades() {
            this.RenderCidades()
        },

        RenderEstados() {
            Api.post(`/cidades/ZmlsYWRlYXRlbmRpbWVudG8=`, this.objChamaCidade)
                .then(response => {
                    this.objEdit.estados = response.data.estados
                })
                .catch(err => {
                    console.log(err)
                })
        },

        RenderCidades() {
            Api.post(`/cidades/ZmlsYWRlYXRlbmRpbWVudG8=`, this.objChamaCidade)
                .then(({ data }) => {
                    this.objEdit.cidades = data.cidades

                    try {
                        this.objSelecionarContatos.cidade = this.objEdit.cidades[0].id
                    } catch (error) {
                        this.objSelecionarContatos.cidade = 0
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        chamarEstadosCidade() {
            this.RenderCidades()
            this.RenderEstados()
        },

        incrementar() {
            if (this.page_active >= this.last_page) return

            this.page_active++
        },

        decrementar() {
            if (this.page_active <= 0) return

            this.page_active--
        },

        selecionarPagina(id) {
            this.page_active = id
        },

        isMidia() {
            this.dataIsMidia = false

            if (this.obj.tipo === 1) {
                this.dataIsMidia = true

                this.obj.midia = 0
            }
        },

        chamaCampanha() {
            this.loadingPage = true

            Api.post('/campanhas/ZmlsYWRlYXRlbmRpbWVudG8=', {
                id: localStorage.getItem('@USER_ID'),
            })
                .then(response => {
                    let data = response.data

                    this.midiaOptions = data.midia
                    this.campanhas = data.campanhas

                    if (data.campanhas[0].status == 4) {
                        this.stop = true
                    }
                    if (data.campanhas[0].status == 2) {
                        this.stop = false
                    }
                })
                .catch(erro => {
                    console.error(erro)
                    this.loadingPage = false
                })
                .finally(() => (this.loadingPage = false))
        },

        fechaModal() {
            const truck_modal = document.querySelector('#exampleModal')
            const modal = bootstrap.Modal.getInstance(truck_modal)
            modal.hide()
        },

        enviarCampanha() {
            this.btn_enviar = true

            Api.post('/campanha_envia_txt/ZmlsYWRlYXRlbmRpbWVudG8=', {
                id: localStorage.getItem('@USER_ID'),
                campanha_id: this.campanha_id,
            }).then(response => {
                if (response.data.status == true) {
                    Swal.fire(response.data.mensagem)
                } else {
                    Swal.fire(response.data.mensagem)
                }
                this.btn_enviar = false

                const truck_modal = document.querySelector('#canvasEditaCampanhas')
                const modal = bootstrap.Offcanvas.getOrCreateInstance(truck_modal)
                modal.hide()

                this.chamaCampanha()
            })

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
                        id: localStorage.getItem('@USER_ID'),
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

        pausaCampanha(campanha_id) {
            let situacao
            if (this.stop == true) {
                situacao = 'Tem certeza que deseja reiniciar esta campanha?'
            } else {
                situacao = 'Tem certeza que deseja pausar esta campanha?'
            }

            Swal.fire({
                title: situacao,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim',
                cancelButtonText: 'Cancelar',
            }).then(result => {
                if (result.isConfirmed) {
                    this.stop = !this.stop
                    Api.post('/campanha_pausa/ZmlsYWRlYXRlbmRpbWVudG8=', {
                        id_campanha: campanha_id,
                        stop: this.stop,
                        id: localStorage.getItem('@USER_ID'),
                    })
                        .then(response => {
                            Swal.fire('Alterado!', response.data.mensagem, 'success')

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
            this.obj.lgpd = null
        },

        editaCampanha(campanha_id) {
            this.campanha_id = campanha_id
            Api.post('/campanha_estrutura/ZmlsYWRlYXRlbmRpbWVudG8=', {
                campanha_id: campanha_id,
                id: this.obj.user_id,
            })
                .then(response => {
                    const data = response.data

                    this.objEdit.linhas = data.linhas
                    this.objEdit.grupos = data.grupos
                    this.objEdit.estados = data.estados
                    this.objEdit.campanhaDados = data.campanhadados

                    this.totalContatosSelecionados = data.lista_envio.total

                    if (Array.isArray(data.lista_envio)) {
                        this.objEdit.contatos = data.lista_envio

                        this.list_page = response.data.lista_envio.links
                    } else {
                        this.objEdit.contatos = data.lista_envio.data

                        this.list_page = response.data.lista_envio.links
                    }

                    const truck_modal = document.querySelector('#canvasEditaCampanhas')
                    const modal = bootstrap.Offcanvas.getOrCreateInstance(truck_modal)
                    modal.show()
                })
                .catch(error => {
                    console.error(error)
                })
        },

        listarContatos() {
            Api.post(`/campanha_estrutura/ZmlsYWRlYXRlbmRpbWVudG8=?page=${this.page_active}`, {
                campanha_id: this.campanha_id,
                id: this.obj.user_id,
            })
                .then(response => {
                    const data = response.data
                    if (Array.isArray(data.lista_envio)) {
                        this.objEdit.contatos = data.lista_envio
                    } else {
                        this.objEdit.contatos = data.lista_envio.data

                        this.list_page = response.data.lista_envio.links
                    }
                })
                .catch(error => {
                    console.error(error)
                })
        },

        atualizaCampanha() {
            if (this.obj.nome_campanha === null || this.obj.msg === null) return

            const newObj = JSON.parse(JSON.stringify(this.obj))

            newObj.id = this.campanha_id

            Api.post('/grupo_update/ZmlsYWRlYXRlbmRpbWVudG8=', newObj)
                .then(response => {
                    const truck_modal = document.querySelector('#canvasEditaCampanha')
                    const modal = bootstrap.Modal.getOrCreateInstance(truck_modal)
                    modal.hide()

                    this.chamaCampanha()
                    Swal.fire('Atualizado!', response.data.mensagem, 'success')

                    this.limpaObj()
                })
                .catch(error => {
                    console.error(error)
                })
        },

        gravaCampanha() {
            if (this.obj.nome_campanha === null || this.obj.msg === null) return

            this.btn_gravar = true

            Api.post('/campanha_grava/ZmlsYWRlYXRlbmRpbWVudG8=', this.obj)
                .then(response => {
                    this.btn_gravar = false

                    this.fechaModal()

                    this.chamaCampanha()
                    Swal.fire('Gravado!', response.data.status, 'success')

                    this.obj.nome_campanha = null
                    this.obj.msg = null
                    this.obj.midia = null
                    this.obj.tipo = 0

                    this.dataIsMidia = false
                })
                .catch(error => {
                    console.error(error)
                    this.btn_gravar = false
                })
        },

        selecionaContatos() {
            this.objSelecionarContatos.campanha_id = this.campanha_id

            console.log(this.objSelecionarContatos)

            Api.post('/seleciona_contatos/ZmlsYWRlYXRlbmRpbWVudG8=', this.objSelecionarContatos)
                .then(response => {
                    if (!response.data.status) {
                        this.objEdit.mensagem = response.data.mensagem
                        setTimeout(() => {
                            this.objEdit.mensagem = null
                        }, 2000)
                    } else {
                        const truck_modal = document.querySelector('#selecionaContatos')
                        const modal = bootstrap.Modal.getInstance(truck_modal)
                        modal.hide()

                        this.totalContatosSelecionados = response.data.total

                        if (Array.isArray(response.data.contatos)) {
                            this.objEdit.contatos = response.data.contatos
                        } else {
                            this.list_page = response.data.contatos.links

                            this.objEdit.contatos = response.data.contatos.data
                        }
                    }
                })
                .catch(error => console.error(error))
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
