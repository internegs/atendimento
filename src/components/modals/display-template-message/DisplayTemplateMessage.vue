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
                                <th scope="col">Mensagem</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <th scope="row">
                                    <input type="radio" />
                                </th>
                                <td>Ola mundo</td>
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
                                        <span aria-hidden="true">&raquo;</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div class="modal-footer">
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
            </form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            messages: [],
            list_page: [],
            last_page: null,
            page_active: 1,
            search: null,

            btnLoading: false,
        }
    },

    mounted() {
        const modal = document.getElementById('templateMessages')

        modal.addEventListener(
            'hidden.bs.modal',
            () => {
                console.log('hfhd')
            },
            { once: true }
        )
    },

    methods: {
        sendMessage() {
            console.log('ola')
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
    },
}
</script>

<style lang="scss">
.modal-header {
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
    }
}

.modal-footer {
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
