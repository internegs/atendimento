<template>
    <container class="p-1">
        <section>
            <div class="d-flex flex-column align-items-center mb-2 mt-2 text-center">
                <h1 class="fw-bold">Período de Atendimento</h1>
            </div>

            <div
                class="container-fluid bg-white"
                style="padding: 20px"
            >
                <div class="input-group mb-3">
                    <span class="input-group-text">Horário de atendimento</span>

                    <div class="inputs">
                        <div>
                            <label>Inicio expediente</label>

                            <input
                                type="time"
                                placeholder="Inicio expediente"
                                class="form-control"
                                v-model="objMenu.hora1"
                            />
                        </div>

                        <div>
                            <label>Fim expediente</label>

                            <input
                                type="time"
                                placeholder="Fim expediente"
                                class="form-control"
                                v-model="objMenu.hora2"
                            />
                        </div>

                        <div>
                            <label>Inicio almoço</label>

                            <input
                                type="time"
                                placeholder="Inicio almoço"
                                class="form-control"
                                v-model="objMenu.hora3"
                            />
                        </div>

                        <div>
                            <label>Fim almoço</label>

                            <input
                                type="time"
                                placeholder="Fim almoço"
                                class="form-control"
                                v-model="objMenu.hora4"
                            />
                        </div>

                        <div>
                            <label>Intervalo entre horários</label>

                            <input
                                type="text"
                                placeholder="0 min"
                                class="form-control"
                                v-model="displayValue"
                                maxlength="7"
                                @input="validateIntervalo($event)"
                                @keyup="posicionarCursor($event)"
                                @focus="posicionarCursor($event)"
                            />
                        </div>
                    </div>
                </div>

                <div class="input-group mb-3">
                    <span class="input-group-text">Dias de atendimento</span>

                    <div class="dias_semana">
                        <input
                            type="checkbox"
                            class="form-check-input"
                            :data-id="objMenu.segunda"
                            :checked="objMenu.segunda == 1"
                            @click="checked($event, 'segunda')"
                        />
                        <span>Segunda</span>
                    </div>
                    <div class="dias_semana">
                        <input
                            type="checkbox"
                            class="form-check-input"
                            :data-id="objMenu.terca"
                            :checked="objMenu.terca == 1"
                            @click="checked($event, 'terca')"
                        />
                        <span>Terça</span>
                    </div>
                    <div class="dias_semana">
                        <input
                            type="checkbox"
                            class="form-check-input"
                            :data-id="objMenu.quarta"
                            :checked="objMenu.quarta == 1"
                            @click="checked($event, 'quarta')"
                        />
                        <span>Quarta</span>
                    </div>
                    <div class="dias_semana">
                        <input
                            type="checkbox"
                            class="form-check-input"
                            :data-id="objMenu.quinta"
                            :checked="objMenu.quinta == 1"
                            @click="checked($event, 'quinta')"
                        />
                        <span>Quinta</span>
                    </div>
                    <div class="dias_semana">
                        <input
                            type="checkbox"
                            class="form-check-input"
                            :data-id="objMenu.sexta"
                            :checked="objMenu.sexta == 1"
                            @click="checked($event, 'sexta')"
                        />
                        <span>Sexta</span>
                    </div>
                    <div class="dias_semana">
                        <input
                            type="checkbox"
                            class="form-check-input"
                            :data-id="objMenu.sabado"
                            :checked="objMenu.sabado == 1"
                            @click="checked($event, 'sabado')"
                        />
                        <span>Sabádo</span>
                    </div>
                    <div class="dias_semana">
                        <input
                            type="checkbox"
                            class="form-check-input"
                            :data-id="objMenu.domingo"
                            :checked="objMenu.domingo == 1"
                            @click="checked($event, 'domingo')"
                        />
                        <span>Domingo</span>
                    </div>

                    <button
                        class="btn btn-primary fs-4 rounded"
                        @click="createOrEditHours()"
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </section>

        <section
            v-if="!desativado"
            class="mt-4"
        >
            <div class="d-flex flex-column align-items-center text-center">
                <h1 class="fw-bold">Cronograma de Atendimento</h1>
            </div>

            <div class="d-flex flex-wrap usuarios text-center p-1">
                <div class="col-12 mb-5">
                    <input
                        type="text"
                        class="buscar rounded pad-header m-1 w-50 text-dark bg-white"
                        style="caret-color: #333"
                        placeholder="Busque por nome"
                        aria-describedby="button-addon2"
                        v-model="pesquisa"
                        @keyup="Pesquisar"
                    />

                    <button
                        class="m-1 bg-success text-white text-uppercase fw-bold rounded pad-header"
                        data-bs-toggle="modal"
                        data-bs-target="#convenio_modal"
                    >
                        Definir agenda
                    </button>
                </div>
            </div>

            <div class="table-responsive mt-5">
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

                            <li
                                class="page-item"
                                v-for="(list, index) in list_page"
                                :key="index"
                            >
                                <button
                                    v-show="
                                        list.label !== '&laquo; Previous' &&
                                        list.label !== 'Next &raquo;'
                                    "
                                    @click="SelecionarPagina(list.label)"
                                    class="page-link"
                                    :class="{ active: list.active }"
                                    href="#"
                                >
                                    {{ list.label }}
                                </button>
                            </li>

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

                            <li
                                class="page-item"
                                v-for="(list, index) in list_page"
                                :key="index"
                            >
                                <button
                                    v-show="
                                        list.label !== '&laquo; Previous' &&
                                        list.label !== 'Next &raquo;'
                                    "
                                    @click="SelecionarPagina(list.label)"
                                    class="page-link"
                                    :class="{ active: list.active }"
                                    href="#"
                                >
                                    {{ list.label }}
                                </button>
                            </li>

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

            <CreateOrEditModal
                :convenio="selecionado"
                @handle-close-modal="clearSelecionado"
                @refresh-convenios="refreshConvenios()"
            />
        </section>
    </container>
</template>

<script>
import container from '@/components/GLOBALS/container.vue'
import Api from '@/services/api'
import Swal from 'sweetalert2'
import CreateOrEditModal from './modals/plano-saude-modal/CreateOrEditModal.vue'

const CLIENTE_ID = btoa(localStorage.getItem('@USER_ID'))

export default {
    name: 'HorariosMedicos',

    components: { container, CreateOrEditModal },

    data() {
        return {
            displayValue: '',

            objMenu: {
                hora1: '',
                hora2: '',
                hora3: '',
                hora4: '',
                segunda: 0,
                terca: 0,
                quarta: 0,
                quinta: 0,
                sexta: 0,
                sabado: 0,
                domingo: 0,
                intervalo: '',
            },

            convenios: [],
            list_page: [],
            page_active: 1,
            selecionado: {},
            pesquisa: null,
            desativado: true,
        }
    },

    created() {
        this.getConvenios()
    },

    mounted() {
        this.getHoursById()
    },

    watch: {
        page_active: function () {
            this.getConvenios()
        },
    },

    methods: {
        async getHoursById() {
            let data = {
                Y2xpZW50ZV9pZA: btoa(localStorage.getItem('@USER_ID')),
            }

            await Api.post('/horarios', data)
                .then(response => {
                    let responseData = response.data

                    if (responseData.result) {
                        this.objMenu.hora1 = responseData.horarios.h_i
                        this.objMenu.hora2 = responseData.horarios.h_f
                        this.objMenu.hora3 = responseData.horarios.almoco_i
                        this.objMenu.hora4 = responseData.horarios.almoco_f
                        this.displayValue = this.validateIntervalo(
                            '',
                            responseData.horarios.intervalo
                        )

                        this.objMenu.segunda = responseData.horarios.segunda
                        this.objMenu.terca = responseData.horarios.terca
                        this.objMenu.quarta = responseData.horarios.quarta
                        this.objMenu.quinta = responseData.horarios.quinta
                        this.objMenu.sexta = responseData.horarios.sexta
                        this.objMenu.sabado = responseData.horarios.sabado
                        this.objMenu.domingo = responseData.horarios.domingo
                    }
                })
                .catch(error => {
                    console.error(error)
                })
        },

        async createOrEditHours() {
            const keys = ['hora1', 'hora2', 'hora3', 'hora4', 'intervalo']

            const objectWeekDays = Object.fromEntries(
                Object.entries(this.objMenu).filter(([key]) => !keys.includes(key))
            )

            const objectHours = {
                SG9yYXJpbyBpbmljaWFs: btoa(this.objMenu.hora1),
                SG9yYXJpbyBmaW5hbA: btoa(this.objMenu.hora2),
                YWxtb2NvIGluaWNpYWw: btoa(this.objMenu.hora3),
                YWxtb2NvIGZpbmFs: btoa(this.objMenu.hora4),
                aW50ZXJ2YWxv: btoa(this.objMenu.intervalo),
            }

            let data = {
                Y2xpZW50ZV9pZA: btoa(localStorage.getItem('@USER_ID')),
                ...objectHours,
                ...objectWeekDays,
            }

            await Api.post('/create_horario', data)
                .then(response => {
                    let responseData = response.data

                    if (responseData.result) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'ATUALIZADO COM SUCESSO!',
                            showConfirmButton: true,
                        }).then(result => {
                            if (result.isConfirmed) {
                                location.reload()
                            }
                        })
                    }
                })
                .catch(error => {
                    console.error(error)
                })
        },

        async getConvenios() {
            Api.post(
                '/convenios',
                {
                    Y2xpZW50ZV9pZA: CLIENTE_ID,
                    pagination: true,
                },
                {
                    params: {
                        page: this.page_active,
                    },
                }
            )
                .then(response => {
                    let data = response.data.convenios.data
                    let linksPagination = response.data.convenios.links

                    this.convenios = data
                    this.list_page = linksPagination
                })
                .catch(erro => console.error(erro))
        },

        async Pesquisar() {
            if (this.pesquisa[0] === ' ' || /[^a-zA-Z0-9\s]/.test(this.pesquisa[0])) return

            Api.post(`/convenio_busca`, {
                Y2xpZW50ZV9pZA: CLIENTE_ID,
                busca: this.pesquisa,
            })
                .then(response => {
                    if (!this.pesquisa || this.pesquisa === '' || this.pesquisa === null) {
                        return this.getConvenios()
                    }

                    let data = response.data.convenios.data
                    let linksPagination = response.data.convenios.links
                    this.convenios = data
                    this.list_page = linksPagination
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
                        Y2xpZW50ZV9pZA: CLIENTE_ID,
                        convenio_id: convenio,
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

                                this.refreshConvenios()
                            } else {
                                alert('Erro ao deletar convenio')
                            }
                        })
                        .catch(erro => console.error(erro))
                }
            })
        },

        checked({ target }, dia) {
            let checkbox = target
            const id = checkbox.getAttribute('data-id')

            if (checkbox.checked) {
                this.objMenu[dia] = 1
                checkbox.setAttribute('data-id', 1)
            } else {
                this.objMenu[dia] = 0
                checkbox.setAttribute('data-id', 0)
            }
        },

        validateIntervalo(event = null, value = null) {
            let numeros

            if (!event) {
                numeros = value

                this.objMenu.intervalo = numeros

                if (numeros) {
                    return (this.displayValue = `${numeros} min`)
                } else {
                    return (this.displayValue = '')
                }
            }

            numeros = event.target.value.replace(/[^\d]/g, '')

            this.objMenu.intervalo = numeros

            if (numeros) {
                this.displayValue = `${numeros} min`
            } else {
                this.displayValue = ''
            }

            event.target.value = this.displayValue
        },

        posicionarCursor(event) {
            if (this.objMenu.intervalo) {
                const posicao = this.objMenu.intervalo.length

                this.$nextTick(() => {
                    event.target.setSelectionRange(posicao, posicao)
                })
            }
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
.text-input {
    width: 100%;
}
.box {
    width: 50%;
    box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.2);
}
.container {
    padding-top: 2%;
    margin-left: 15%;
}

.inputs {
    display: flex;
    align-items: center;
    padding-left: 1.5rem;
    gap: 1.5rem;
}
.inputs input {
    padding: 10px;
}

.dias_semana {
    display: flex;
    align-items: center;
    padding: 10px;
    gap: 10px;
}

.dias_semana input {
    padding: 10px;
}
.dias_semana span {
    font-size: 0.985rem;
}

@media (max-width: 1200px) {
    .inputs {
        margin-top: 10px;
    }
}
@media (max-width: 600px) {
    .inputs {
        flex-direction: column;
        align-items: start;
    }
}

/* ----- */

pad-header {
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

.buscar {
    width: 40rem;
}

@media (max-width: 645px) {
    .usuarios {
        justify-content: center;
        gap: 10px;
    }

    .usuarios div {
        margin: 0;
    }

    .buscar {
        width: 100%;
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
