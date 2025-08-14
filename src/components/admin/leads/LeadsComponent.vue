<template>
    <container class="mt-5">
        <div class="d-flex flex-column align-items-center">
            <h1 class="fw-bold">Leads</h1>
        </div>

        <div class="d-flex flex-wrap usuarios text-center p-1">
            <!-- Só um <hr> customizado -->
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
                        <th
                            scope="col"
                            class="align-middle"
                        >
                            Nome
                        </th>

                        <th
                            scope="col"
                            class="align-middle"
                        >
                            Telefone
                        </th>

                        <th
                            scope="col"
                            class="align-middle"
                        >
                            Negócio
                        </th>

                        <th
                            scope="col"
                            class="align-middle"
                        >
                            Agendado
                        </th>

                        <th
                            scope="col"
                            class="align-middle"
                        >
                            Data/hora
                            <br />
                            Agendada
                        </th>

                        <th
                            scope="col"
                            class="align-middle"
                        >
                            Ação
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="(lead, index) in leads"
                        :key="index"
                    >
                        <td>
                            {{ lead?.nome ?? 'Não definido' }}
                            <br />
                        </td>

                        <td>
                            <span>{{ maskNumber(lead?.telefone) }}</span>
                        </td>

                        <td>
                            {{ lead?.nome_negocio }}
                        </td>

                        <td>
                            {{ maskIsScheduled(lead?.agendado) }}
                        </td>

                        <td>
                            {{ maskDateHors(lead?.data_call, lead?.horario) }}
                        </td>

                        <td
                            class="d-flex gap-3 flex-wrap"
                            style="align-items: center; justify-content: center"
                        >
                            <div class="row">
                                <div class="col-md-6">
                                    <button
                                        v-tooltip="'Mais detalhes'"
                                        class="btn btn-primary fs-3"
                                        data-bs-toggle="modal"
                                        data-bs-target="#more_details_leads"
                                        @click="handleMoreDatails(lead.id)"
                                    >
                                        <i class="fa-solid fa-eye"></i>
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
    </container>

    <more-details-leads
        :leads="selecionado"
        @handle-close-modal="clearSelected()"
    />
</template>

<script>
import Container from '@/components/GLOBALS/container.vue'
import Api from '@/services/api'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import MoreDetailsLeads from './modals/leads-modal/MoreDetailsLeads.vue'

export default {
    name: 'LeadsComponent',

    components: { Container, MoreDetailsLeads },

    data() {
        return {
            CLIENTE_ID: btoa(localStorage.getItem('@USER_ID')),
            leads: [],
            list_page: [],
            last_page: null,
            page_active: 1,
            loadingPage: false,
            selecionado: {},
        }
    },

    watch: {
        page_active: function () {
            this.getLeads()
        },
    },

    created() {
        this.getLeads()
    },

    methods: {
        async getLeads() {
            this.loadingPage = true

            Api.post('/leads_lista', {
                dXNlcl9pZA: this.CLIENTE_ID,
            })
                .then(response => {
                    this.leads = response.data.dados.data
                    this.list_page = response.data.dados.links.filter(
                        link => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;'
                    )
                    this.last_page = response.data.dados.last_page
                })
                .catch(erro => {
                    console.error(erro)
                    this.loadingPage = false
                })
                .finally(() => (this.loadingPage = false))
        },

        incrementar() {
            if (this.page_active >= this.last_page) return

            this.page_active++
        },

        decrementar() {
            if (this.page_active <= 0) return

            this.page_active--
        },

        SelecionarPagina(id) {
            this.page_active = id
        },

        maskNumber(value) {
            const number = value.replace(/\D/g, '')

            if (number.length > 13) return value

            if (number.length <= 11) {
                return `(${number.slice(0, 2)}) ${number.slice(2, 3)} ${number.slice(3, 6)}-${number.slice(6)}`
            }

            return `+${number.slice(0, 2)} (${number.slice(2, 4)}) ${number.slice(4, 5)} ${number.slice(5, 9)}-${number.slice(9)}`
        },

        maskDateHors(date, hours) {
            if (!date) return 'Não definido'

            if (!hours) return 'Não definido'

            const dateConverted = format(new Date(`${date}T${hours}`), 'Pp', { locale: ptBR })

            return dateConverted
        },

        maskIsScheduled(value) {
            if (value.length === 0) return 'Não definido'

            return value ? 'Sim' : 'Não'
        },

        handleMoreDatails(leadId) {
            this.selecionado = this.leads.find(lead => leadId === lead.id)
        },

        clearSelected() {
            this.selecionado = {}
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
