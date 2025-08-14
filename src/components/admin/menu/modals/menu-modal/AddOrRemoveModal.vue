<template>
    <form
        id="submenu_modal"
        class="modal fade"
        tabindex="-1"
        aria-hidden="true"
        @submit.prevent="createOrEdit()"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1
                        id="exampleModalLabel"
                        class="modal-title fs-3"
                    >
                        Adicionar Submenu
                    </h1>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>

                <div class="modal-body">
                    <div class="col">
                        <div class="col-md-13 form-group">
                            <label
                                for="nomeField"
                                class="col-form-label fs-4"
                            >
                                Nome
                                <span
                                    v-if="!obj.name"
                                    class="text-danger"
                                >
                                    *
                                </span>
                            </label>

                            <input
                                id="nomeField"
                                v-model="obj.name"
                                type="text"
                                class="form-control form-pad"
                                required
                            />
                        </div>

                        <div class="col-md-13 form-group">
                            <label
                                for="iconeField"
                                class="col-form-label fs-4"
                            >
                                Icone
                                <i
                                    v-tooltip="
                                        'Os ícones utilizados seguem o padrão da biblioteca Font Awesome v5.15.3.'
                                    "
                                    class="fa-solid fa-circle-question fs-5"
                                    data-bs-toggle="tooltip"
                                ></i>
                            </label>

                            <input
                                id="iconeField"
                                v-model="obj.icone"
                                type="text"
                                class="form-control form-pad"
                            />
                        </div>

                        <div class="col-md-13 form-group">
                            <label
                                for="targetField"
                                class="col-form-label fs-4"
                            >
                                Target
                                <span
                                    v-if="!obj.target"
                                    class="text-danger"
                                >
                                    *
                                </span>
                            </label>

                            <input
                                id="targetField"
                                v-model="obj.target"
                                type="text"
                                class="form-control form-pad"
                                required
                                @input="formatUpperCase($event)"
                            />
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-danger"
                        data-bs-dismiss="modal"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        class="btn btn-primary"
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    </form>
</template>

<script>
export default {
    name: 'AddOrRemoveModal',

    props: {
        submenu: Object,
    },

    emits: ['handle-create', 'handle-close-modal'],

    data() {
        return {
            obj: {
                id: null,
                name: null,
                icone: null,
                target: null,
            },
        }
    },

    computed: {
        hasSubmenu() {
            return this.submenu && Object.keys(this.submenu).length > 0
        },
    },

    watch: {
        submenu: {
            handler(newValue) {
                this.fillForm(newValue)
            },
            deep: true,
        },
    },

    updated() {
        const offcanvasElement = document.getElementById('submenu_modal')

        offcanvasElement.addEventListener('hidden.bs.modal', () => {
            this.resetForm()

            if (this.menu) {
                this.$emit('handle-close-modal')
            }
        })
    },

    beforeUpdate() {
        const offcanvasElement = document.getElementById('submenu_modal')

        if (offcanvasElement) {
            offcanvasElement.removeEventListener('hidden.bs.modal', this.resetForm)
        }
    },

    methods: {
        createOrEdit() {
            if (!this.hasSubmenu) {
                this.obj.id = this.generateSecureId()
            }

            this.$emit('handle-create', this.obj)

            this.hideModal()
        },

        resetForm() {
            this.obj = {
                name: null,
                icone: null,
                target: null,
            }
        },

        fillForm(objValue) {
            this.obj = {
                id: objValue?.id ? objValue?.id : null,
                name: objValue?.name ? objValue?.name : null,
                icone: objValue?.icone ? objValue?.icone : null,
                target: objValue?.target ? objValue?.target : null,
            }
        },

        hideModal() {
            const modalElement = document.getElementById('submenu_modal')
            const modal = bootstrap.Modal.getInstance(modalElement)

            modal.hide()
        },

        formatUpperCase(event) {
            this.obj.target = event.target.value.replace(/[\s]/g, '').toUpperCase()
        },

        generateSecureId() {
            return crypto.randomUUID()
        },
    },
}
</script>

<style></style>
