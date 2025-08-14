<template>
    <div
        id="abrirChamadoFormulario"
        class="modal fade"
        tabindex="-1"
        aria-labelledby="abrirChamadoFormulario"
        aria-hidden="true"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1
                        id="staticBackdropLabel"
                        class="modal-title fs-5"
                    >
                        Abrir novo chamado
                    </h1>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>
                <div class="modal-body">
                    <div class="d-flex flex-column align-items-center">
                        <h1 class="fw-bold">Abrir Chamado</h1>
                    </div>

                    <div class="row g-3 bg-white mb-4">
                        <div class="col-md-12">
                            <h1 class="fs-3">Titulo:</h1>
                            <input
                                v-model="obj.titulo"
                                type="email"
                                name="email"
                                class="form-control btn-pd"
                                placeholder="Digite Seu Titulo"
                            />
                        </div>
                        <div class="col-md-12">
                            <h1 class="fs-3">Descrição:</h1>
                            <textarea
                                v-model="obj.descricao"
                                class="form-control"
                                cols="10"
                                rows="10"
                                placeholder="Digite sua Descrição Aqui"
                            ></textarea>
                        </div>
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
                        class="btn btn-primary"
                        @click="gravaChamado"
                    >
                        <div v-if="!btn_enviar">Enviar</div>

                        <div
                            v-else
                            class="spinner-border"
                            role="status"
                        >
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/services/api'

export default {
    name: 'ABRIRCHAMADO',

    data() {
        return {
            btn_enviar: false,
            obj: {
                user_id: localStorage.getItem('@USER_ID'),
                titulo: null,
                descricao: null,
            },
        }
    },

    methods: {
        gravaChamado() {
            if (!this.obj.titulo || !this.obj.descricao) return

            this.btn_enviar = true

            api.post('/chamados_grava/ZmlsYWRlYXRlbmRpbWVudG8=', this.obj)
                .then(success => {
                    console.log(success)
                    this.btn_enviar = false
                })
                .catch(error => {
                    this.btn_enviar = false

                    console.error(error)
                })
        },
    },
}
</script>
