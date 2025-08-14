<template>
    <div
        class="modal fade"
        id="convenio_modal"
        tabindex="-1"
        aria-labelledby="cadastrarModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="createOrEdit">
                    <div class="modal-header">
                        <h1
                            class="modal-title fs-2"
                            id="staticBackdropLabel"
                        >
                            <b>{{ hasConvenio ? 'Editar' : 'Novo' }} Convênios</b>
                        </h1>

                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>

                    <div
                        class="modal-body"
                        @submit.prevent="createOrEdit"
                    >
                        <div class="form-group mb-3">
                            <label
                                for="nameField"
                                class="fs-3"
                            >
                                Nome
                                <span
                                    v-if="!convenioData.name"
                                    class="text-danger"
                                >
                                    *
                                </span>
                            </label>

                            <input
                                id="nameField"
                                type="text"
                                class="form-control input-pad"
                                v-model="convenioData.name"
                                placeholder="Digite o Nome"
                                required
                            />
                        </div>

                        <div class="form-group mb-3">
                            <label
                                for="codeField"
                                class="fs-3"
                            >
                                Código:
                            </label>

                            <input
                                id="codeField"
                                type="text"
                                class="form-control input-pad"
                                placeholder="Ex: 10"
                                v-model="convenioData.code"
                                @input="convenioData.code = filterNumber($event.target.value)"
                            />
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
                            type="submit"
                            class="btn btn-primary"
                        >
                            <span v-if="!loading">Salvar</span>

                            <div
                                v-else
                                class="spinner-border spinner-border-sm"
                                role="status"
                            ></div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import Api from '@/services/api'
import Swal from 'sweetalert2'

const CLIENTE_ID = btoa(localStorage.getItem('@USER_ID'))

export default {
    name: 'PlanoSaude',

    props: {
        convenio: {
            type: Object,
        },
    },

    emits: ['handle-close-modal', 'refresh-convenios'],

    data() {
        return {
            convenioData: {
                cliente_id: CLIENTE_ID,
                name: '',
                code: null,
            },

            loading: false,
        }
    },

    computed: {
        hasConvenio() {
            return this.convenio && Object.keys(this.convenio).length > 0
        },
    },

    mounted() {
        const modalElement = document.getElementById('convenio_modal')

        modalElement.addEventListener('hidden.bs.modal', () => {
            this.resetForm()

            if (this.convenio) {
                this.$emit('handle-close-modal')
            }
        })
    },

    beforeUnmount() {
        const modalElement = document.getElementById('convenio_modal')

        if (modalElement) {
            modalElement.removeEventListener('hidden.bs.modal', this.resetForm)
        }
    },

    watch: {
        convenio: {
            handler(newValue) {
                this.fillForm(newValue)
            },
            deep: true,
        },
    },

    methods: {
        async createOrEdit() {
            try {
                this.loading = true
                let response
                let confirmMsg

                if (!this.hasConvenio) {
                    response = await Api.post('/convenio_create', {
                        Y2xpZW50ZV9pZA: CLIENTE_ID,
                        nome: this.convenioData.name,
                        codigo: this.convenioData.code,
                    })

                    confirmMsg = 'Convenio criado com sucesso'
                } else {
                    response = await Api.post('/convenio_edit', {
                        Y2xpZW50ZV9pZA: CLIENTE_ID,
                        nome: this.convenioData.name,
                        codigo: this.convenioData.code,
                        convenio_id: this.convenio.id,
                        clinica_id: 0,
                    })

                    confirmMsg = 'Dados atualizados com sucesso'
                }

                if (!response.data.result)
                    throw new Error(
                        `Erro ao realizar o registro do convenio. Info: ${response.data}`
                    )

                this.hideModal()

                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: confirmMsg,
                    showConfirmButton: false,
                    timer: 2000,
                }).then(() => this.$emit('refresh-convenios'))
            } catch (error) {
                if (error?.response?.data?.message) {
                    console.error(error.response.data.message)
                } else {
                    console.error(error)
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Erro ao realizar o registro do convênio.',

                    didOpen: () => {
                        const confirmBtn = Swal.getConfirmButton()
                        const actionsContainer = confirmBtn.parentElement

                        actionsContainer.style.width = '100%'
                        actionsContainer.style.display = 'flex'
                        actionsContainer.style.justifyContent = 'center'

                        confirmBtn.style.width = '90%'
                    },
                })

                this.loading = false
            } finally {
                this.loading = false
            }
        },

        filterNumber(value) {
            return value.replace(/[^0-9]/g, '')
        },

        resetForm() {
            this.convenioData = {
                name: '',
                code: null,
            }
        },

        fillForm(data) {
            this.convenioData = {
                name: data.nome,
                code: data.codigo,
            }
        },

        hideModal() {
            const modalElement = document.getElementById('convenio_modal')
            const modal = bootstrap.Modal.getInstance(modalElement)

            modal.hide()
        },
    },
}
</script>
