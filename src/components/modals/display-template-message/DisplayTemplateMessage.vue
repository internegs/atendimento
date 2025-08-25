<template>
    <div
        id="templateMessages"
        class="modal fade"
        tabindex="-1"
        aria-labelledby="Mensagens Template"
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
                        Mensagens Template
                    </h1>

                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>

                <div class="modal-body">
                    <div class="input-container">
                        <div class="input-wrapper">
                            <input
                                type="text"
                                class="search-input rounded text-dark bg-transparent"
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
                                <th scope="col">Modelo</th>
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
                                            style="background-color: #17a2b8; border-color: #17a2b8"
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
                </div>

                <transition name="fade-footer">
                    <div
                        v-if="requestData.mensagem"
                        class="modal-footer"
                    >
                        <button class="btn-send">
                            <div v-if="!btnLoading">Enviar</div>

                            <div
                                v-else
                                class="spinner-border"
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

            btnLoading: false,
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
    },

    mounted() {
        this.getTemplates()

        const el = document.getElementById('templateMessages')

        el.addEventListener('show.bs.modal', () => {
            el.addEventListener('hidden.bs.modal', this.resetTemplateData, { once: true })
        })
    },

    methods: {
        async getTemplates() {
            try {
                const response = await api.post(
                    'https://inzupt.com/api/templates_meta/ZmlsYWRlYXRlbmRpbWVudG8=',
                    {
                        dXNlcl9pZA: btoa(localStorage.getItem('@USER_ID')),
                    }
                )

                this.messages = response.data.templates.data
                this.list_page = response.data.templates.links.filter(
                    (link) => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;'
                )
            } catch (error) {
                console.error(error)
            }
        },

        async sendMessage() {
            this.btnLoading = true

            try {
                // api.post('/envia_mensagemnova/ZmlsYWRlYXRlbmRpbWVudG8=', this.requestData)

                this.$emit('update-messages')

                this.closeModal()
            } catch (error) {
                this.btnLoading = false

                console.log(error)
            } finally {
                this.btnLoading = false
            }
        },

        increment() {
            if (this.page_active >= this.last_page) return

            this.page_active++
        },

        decrement() {
            if (this.page_active <= 0) return

            this.page_active--
        },

        selectPage(id) {
            this.page_active = id
        },

        handleRowInput(id) {
            this.requestData.mensagem = this.messages.find((msg) => msg.id === id).nome_modelo
        },

        closeModal() {
            const modal = bootstrap.Modal.getInstance(document.getElementById('templateMessages'))
            modal.hide()
        },

        resetTemplateData() {
            this.requestData.mensagem = null
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

            .search-input {
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

        tbody {
            tr {
                transition: background-color 0.3s ease;

                &:hover {
                    background-color: #f1f1f17c;
                    cursor: pointer;
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

        transition: all 0.3s ease-out;
        will-change: transform;
        backface-visibility: hidden;

        &:hover {
            background-color: #289eb1;
        }

        &:active {
            transform: translateY(5px) scale(0.95);
        }
    }
}
</style>
