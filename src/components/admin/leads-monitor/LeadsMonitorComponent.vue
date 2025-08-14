<template>
    <container class="mt-5">
        <div class="d-flex flex-column align-items-center">
            <h1 class="fw-bold">Leads - Monitor</h1>
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
                            CPF
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
                            Status
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
                            <span>{{ maskCpf(lead?.cpf) }}</span>
                        </td>

                        <td>
                            {{ maskNumber(lead?.telefone) }}
                        </td>

                        <td>
                            {{ lead.tipo }}
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
</template>

<script>
import Container from '@/components/GLOBALS/container.vue'
import Api from '@/services/api'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default {
    name: 'LeadsMonitorComponent',

    components: { Container },

    data() {
        return {
            CLIENTE_ID: btoa(localStorage.getItem('@USER_ID')),
            leads: [],
            list_page: [],
            last_page: null,
            page_active: 1,
            loadingPage: false,
        }
    },

    watch: {
        page_active: function () {
            this.getLeadsRealTime()
        },
    },

    created() {
        this.getLeadsRealTime()
    },

    methods: {
        async getLeadsRealTime() {
            this.loadingPage = true

            Api.post('/tempo_real_leads', {
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

        maskCpf(value) {
            if (value === null || value === undefined || value.length === 0) return 'Não definido'

            if (value.length !== 11) return value

            return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`
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
