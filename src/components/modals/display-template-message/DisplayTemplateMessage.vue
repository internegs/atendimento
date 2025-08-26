<template>
    <div
        id="templateMessages"
        class="modal fade"
        tabindex="-1"
        aria-labelledby="Modelo de mensagens"
        aria-hidden="true"
    >
        <div class="modal-dialog modal-lg">
            <form
                class="modal-content"
                @submit.prevent="sendMessage"
            >
                <div class="modal-header">
                    <h1
                        id="compartilharContatoLabel"
                        class="modal-title"
                    >
                        Modelo de Mensagens
                    </h1>

                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>

                <div class="modal-body">
                    <template v-if="!loading.data">
                        <div class="input-container">
                            <div class="input-wrapper">
                                <input
                                    v-model="search"
                                    type="text"
                                    class="search-input rounded text-dark bg-transparent"
                                    @input="filterInputSearch"
                                />

                                <i class="fa-solid fa-magnifying-glass"></i>
                            </div>
                        </div>

                        <table class="table shadow">
                            <thead class="table-light">
                                <tr>
                                    <th
                                        scope="col"
                                        class="col-1"
                                    ></th>
                                    <th scope="col">Identificador</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr
                                    v-for="(msg, i) in messages || []"
                                    :key="i"
                                    @click="handleRowInput(msg.id)"
                                >
                                    <th scope="row">
                                        <input
                                            :ref="`input[${msg.id}]`"
                                            v-model="requestData.mensagem"
                                            type="radio"
                                            :value="msg.nome_modelo"
                                        />
                                    </th>

                                    <td>{{ msg?.nome_modelo || 'N/A' }}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div class="mt-2 d-flex flex-column align-items-center gap-2">
                            <nav aria-label="Page navigation example">
                                <ul class="pagination text-center">
                                    <li class="page-item">
                                        <button
                                            class="page-link"
                                            aria-label="Previous"
                                            @click="decrement()"
                                        >
                                            <i
                                                class="fa-solid fa-angle-left"
                                                style="color: #17a2b8"
                                            ></i>
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
                                                style="
                                                    background-color: #17a2b8;
                                                    border-color: #17a2b8;
                                                "
                                                href="#"
                                                @click="selectPage(list.label)"
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
                                            @click="increment()"
                                        >
                                            <i
                                                class="fa-solid fa-angle-right"
                                                style="color: #17a2b8"
                                            ></i>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </template>

                    <div
                        v-else
                        class="w-100 d-flex justify-content-center align-items-center"
                    >
                        <div
                            class="spinner-border text-info"
                            role="status"
                        >
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>

                <transition name="fade-footer">
                    <div
                        v-if="requestData.mensagem"
                        class="modal-footer"
                    >
                        <button class="btn-send">
                            <div v-if="!loading.send">Enviar</div>

                            <div
                                v-else
                                class="spinner-border spinner-border-sm"
                                role="status"
                            >
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </button>
                    </div>
                </transition>
            </form>
        </div>
    </div>
</template>

<script>
import api from '@/services/api'
import { debounce } from 'lodash-es'
import Swal from 'sweetalert2'

export default {
    name: 'DisplayTemplateMessage',

    props: {
        templateData: {
            type: Object,
            required: true,
        },
    },

    emits: ['update-messages'],

    data() {
        return {
            messages: [],
            list_page: [],
            last_page: null,
            page_active: 1,
            search: null,
            requestData: null,
            abortController: null,
            debouncedSearch: null,

            loading: {
                send: false,
                data: false,
            },
        }
    },

    watch: {
        templateData: {
            handler(newValue) {
                if (newValue) {
                    this.requestData = newValue
                }
            },
            deep: true,
            immediate: true,
        },

        page_active() {
            this.getTemplates
        },

        search() {
            this.debouncedSearch()
        },
    },

    async mounted() {
        this.debouncedSearch = debounce(() => this.searchTemplates(), 300)

        await this.getTemplates()

        const el = document.getElementById('templateMessages')

        el.addEventListener('show.bs.modal', () => {
            el.addEventListener('hidden.bs.modal', this.resetTemplateData, { once: true })
        })
    },

    methods: {
        async getTemplates() {
            this.loading.data = true

            try {
                const response = await api.post(
                    'https://inzupt.com/api/templates_meta/ZmlsYWRlYXRlbmRpbWVudG8=',
                    {
                        dXNlcl9pZA: btoa(localStorage.getItem('@USER_ID')),
                    },
                    {
                        params: {
                            page: this.page_active,
                        },
                    }
                )

                this.messages = response.data.templates.data
                this.list_page = response.data.templates.links.filter(
                    link => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;'
                )
            } catch (error) {
                this.loading.data = false

                console.error(error)
            } finally {
                this.loading.data = false
            }
        },

        async searchTemplates() {
            if (this.search && this.search.length < 3) {
                if (this.search.length > 0) return

                this.getTemplates()

                return
            }

            try {
                if (this.abortController) {
                    this.abortController.abort()
                }

                this.abortController = new AbortController()

                const response = await api.post(
                    `/templates_meta_busca/ZmlsYWRlYXRlbmRpbWVudG8=?YnVzY2E&dXNlcl9pZA`,
                    {
                        dXNlcl9pZA: btoa(localStorage.getItem('@USER_ID')),
                        YnVzY2E: this.search,
                    },
                    {
                        signal: this.abortController.signal,
                    }
                )

                this.messages = response.data?.templates?.data
                this.list_page = response.data?.templates?.links.filter(
                    link => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;'
                )
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error(error)
                }
            }
        },

        async sendMessage() {
            this.loading.send = true

            try {
                const obj = {
                    user_id: localStorage.getItem('@USER_ID'),
                    fone: this.templateData?.fone,
                    nome_modelo: this.requestData?.mensagem,
                    type: 3,
                }

                const binaryObj = new FormData()

                Object.entries(obj).forEach(([key, value]) => {
                    binaryObj.append(key, value)
                })

                await api.post('/envia_midianovo/ZmlsYWRlYXRlbmRpbWVudG8=', binaryObj)

                this.$emit('update-messages')

                this.closeModal()
            } catch (error) {
                this.loading.send = false

                console.log(error)

                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Erro ao enviar modelo de mensagem.',
                    confirmButtonColor: '#17a2b8',

                    didOpen: () => {
                        const confirmBtn = Swal.getConfirmButton()
                        const actionsContainer = confirmBtn.parentElement

                        actionsContainer.style.width = '100%'
                        actionsContainer.style.display = 'flex'
                        actionsContainer.style.justifyContent = 'center'

                        confirmBtn.style.width = '90%'
                    },
                })
            } finally {
                this.loading.send = false
            }
        },

        filterInputSearch(e) {
            this.search = e.target.value.replace(/[^a-zA-z\d-]/g, '')
        },

        increment() {
            if (this.page_active >= this.last_page) return

            this.page_active++
        },

        decrement() {
            if (this.page_active <= 0) return

            this.page_active--
        },

        selectPage(number) {
            this.page_active = number
        },

        handleRowInput(id) {
            this.requestData.mensagem = this.messages.find(msg => msg.id === id).nome_modelo
        },

        closeModal() {
            const modal = bootstrap.Modal.getInstance(document.getElementById('templateMessages'))
            modal.hide()
        },

        resetTemplateData() {
            this.requestData.mensagem = null
            this.search = null
        },

        teste(value) {
            console.log(value)
        },
    },
}
</script>

<style lang="scss">
.modal-header {
    border: none;

    .modal-title {
        font-size: 18px;
        font-weight: 500;

        @media (min-width: 768px) {
            & {
                font-size: 20px;
            }
        }
    }
}

.modal-body {
    .input-container {
        display: flex;
        align-items: center;
        justify-content: end;
        margin-bottom: 10px;

        .input-wrapper {
            position: relative;
            display: flex;
            align-items: center;

            @media (max-width: 576px) {
                & {
                    width: 100%;
                }
            }

            .search-input {
                width: 100%;
                padding: 3px 10px;
                padding-left: 30px;

                border: solid 2px rgb(240, 240, 240);

                transition: all 0.2s ease;

                &:focus {
                    outline: none;
                    border-color: #32b9ce;
                }
            }

            i {
                position: absolute;
                left: 8px;
            }
        }
    }

    .table {
        border: solid 2px rgb(240, 240, 240);

        thead {
            th {
                font-size: 16px;

                @media (min-width: 768px) {
                    & {
                        font-size: 14px;
                    }
                }
            }
        }

        tbody {
            tr {
                transition: background-color 0.3s ease;

                &:hover {
                    background-color: #f1f1f17c;
                    cursor: pointer;
                }

                td,
                th {
                    font-size: 16px;

                    @media (min-width: 768px) {
                        & {
                            font-size: 14px;
                        }
                    }
                }

                th input {
                    accent-color: #199aad;
                }
            }
        }
    }
}

.modal-footer {
    border: none;

    .btn-send {
        padding: 8px 10px;

        background-color: #2cacbf;
        color: white;
        font-weight: bold;
        border-radius: 6px;
        font-size: 16px;

        transition: all 0.3s ease-out;
        will-change: transform;
        backface-visibility: hidden;

        @media (min-width: 768px) {
            & {
                font-size: 14px;
            }
        }

        &:hover {
            background-color: #289eb1;
        }

        &:active {
            transform: translateY(5px) scale(0.95);
        }
    }
}
</style>
