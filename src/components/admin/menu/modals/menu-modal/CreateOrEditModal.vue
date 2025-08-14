<template>
    <container>
        <form
            id="add_menu"
            class="offcanvas offcanvas-end"
            tabindex="-1"
            aria-labelledby="offcanvasRightLabel"
            @submit.prevent="createOrEdit"
        >
            <div class="offcanvas-header">
                <h2
                    id="offcanvasRightLabel"
                    class="offcanvas-title fs-3"
                >
                    <b>{{ hasMenu ? 'Editar' : 'Novo' }} Menu</b>
                </h2>

                <button
                    type="button"
                    class="btn btn-danger w-auto"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                >
                    Fechar
                </button>
            </div>

            <div class="offcanvas-body">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-4 form-group">
                            <label
                                for="nomeField"
                                class="col-form-label fs-3"
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

                        <div class="col-md-4 form-group">
                            <label
                                for="iconeField"
                                class="col-form-label fs-3"
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

                        <div class="col-md-4 form-group">
                            <label
                                for="targetField"
                                class="col-form-label fs-3"
                            >
                                Target
                            </label>

                            <input
                                id="targetField"
                                v-model="obj.target"
                                type="text"
                                class="form-control form-pad"
                                @input="formatUpperCase($event)"
                            />
                        </div>

                        <div class="col-md-2 mt-3 form-group">
                            <label class="col-form-label fs-3">
                                Tipo
                                <span
                                    v-if="!obj.tipo"
                                    class="text-danger"
                                >
                                    *
                                </span>
                            </label>

                            <select
                                v-model="obj.tipo"
                                class="form-select form-pad"
                                required
                            >
                                <option
                                    selected
                                    disabled
                                    :value="null"
                                >
                                    Selecione
                                </option>

                                <option
                                    v-for="(tipo, i) in arrayTipo"
                                    :key="i"
                                    :value="tipo"
                                >
                                    {{ tipo }}
                                </option>
                            </select>
                        </div>

                        <div class="col-md-2 mt-3 form-group">
                            <label class="col-form-label fs-3 d-block">Possuí Submenu?</label>

                            <div class="row-md-3 fs-4 form-check form-switch">
                                <input
                                    id="submenuField"
                                    v-model="hasSubmenu"
                                    type="checkbox"
                                    class="form-check-input"
                                />

                                <label
                                    class="form-check-label"
                                    for="submenuField"
                                >
                                    {{ hasSubmenu ? 'Sim' : 'Não' }}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div
                        v-if="hasSubmenu"
                        class="col mt-3"
                    >
                        <div
                            class="position-relative d-flex flex-column flex-md-row justify-content-center align-items-center"
                        >
                            <h1
                                class="fs-3"
                                style="color: #495057"
                            >
                                Submenus
                            </h1>

                            <button
                                type="button"
                                class="btn btn-primary position-md-absolute end-0"
                                data-bs-toggle="modal"
                                data-bs-target="#submenu_modal"
                            >
                                <span>Adicionar</span>
                            </button>
                        </div>

                        <div class="table-responsive">
                            <table class="table table-sm table-hover mt-3">
                                <thead>
                                    <tr>
                                        <th scope="col">Nome</th>
                                        <th scope="col">Icone</th>
                                        <th scope="col">Target</th>
                                        <th scope="col">Ações</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr
                                        v-for="(submenu, index) in obj.submenus"
                                        :key="index"
                                        scope="row"
                                    >
                                        <td>{{ submenu.name }}</td>
                                        <td>{{ submenu.icone }}</td>
                                        <td>{{ submenu.target }}</td>

                                        <td
                                            class="d-flex gap-3 gap-md-4 justify-content-center align-items-center"
                                        >
                                            <button
                                                type="button"
                                                class="button-actions bg-transparent px-2"
                                                data-bs-toggle="modal"
                                                data-bs-target="#submenu_modal"
                                                @click="selectSubmenu(submenu.id)"
                                            >
                                                <i class="fa-solid fa-pen text-primary"></i>
                                            </button>

                                            <button
                                                type="button"
                                                class="button-actions bg-transparent rounded px-2"
                                                @click="removeSubmenu(submenu.id)"
                                            >
                                                <i class="fa-solid fa-trash text-danger"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="offcanvas-footer border-top p-3">
                <div class="d-flex justify-content-end">
                    <button
                        type="submit"
                        class="btn btn-primary form-pad fw-bold"
                    >
                        <span v-if="!loading">SALVAR</span>
                        <div
                            v-else
                            class="spinner-border spinner-border-sm"
                            role="status"
                        ></div>
                    </button>
                </div>
            </div>
        </form>

        <add-or-remove-modal
            :submenu="submenuSelected"
            @handle-close-modal="clearSubmenuSelected()"
            @handle-create="fillSubmenu"
        />
    </container>
</template>

<script>
import Container from '@/components/GLOBALS/container.vue'
import Api from '@/services/api'
import Swal from 'sweetalert2'
import AddOrRemoveModal from './AddOrRemoveModal.vue'

export default {
    name: 'CreateOrEditModal',

    components: { Container, AddOrRemoveModal },

    props: {
        menu: {
            type: Object,
        },
    },

    emits: ['handle-close-modal'],

    data() {
        return {
            obj: {
                cliente_id: localStorage.getItem('@USER_ID'),
                tipo: null,
                name: '',
                icone: '',
                target: '',
                submenus: [],
            },

            hasSubmenu: false,
            submenuSelected: {},

            loading: false,
            isDisabled: false,
        }
    },

    computed: {
        hasMenu() {
            return this.menu && Object.keys(this.menu).length > 0
        },

        arrayTipo() {
            const numbers = []

            for (let i = 1; i < 10; i++) {
                numbers.push(i)
            }

            return numbers
        },
    },

    watch: {
        menu: {
            handler(newValue) {
                this.fillForm(newValue)
            },

            deep: true,
        },
    },

    updated() {
        const offcanvasElement = document.getElementById('add_menu')

        offcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
            this.resetForm()

            if (this.menu) {
                this.$emit('handle-close-modal')
            }
        })
    },

    beforeUpdate() {
        const offcanvasElement = document.getElementById('add_menu')

        if (offcanvasElement) {
            offcanvasElement.removeEventListener('hidden.bs.offcanvas', this.resetForm)
        }
    },

    methods: {
        async createOrEdit() {
            try {
                this.loading = true
                let confirmMsg
                let submenus

                if (this.obj?.submenus?.length > 0) {
                    submenus = this.obj.submenus.map(({ id, ...rest }) => rest)
                } else {
                    submenus = 0
                }

                if (!this.hasMenu) {
                    const data = {
                        dGlwbw: btoa(this.obj?.tipo ? this.obj?.tipo : null),
                        bm9tZQ: btoa(this.obj?.name ? this.obj?.name : null),
                        dGFyZ2V0: btoa(this.obj?.target ? this.obj?.target : null),
                        aWNvbmU: btoa(this.obj?.icone ? this.obj?.icone : null),
                        dXNlcl9pZA: btoa(this.obj?.cliente_id ? this.obj?.cliente_id : null),
                    }

                    if (!Array.isArray(submenus)) {
                        data.c3VibWVudXM = btoa(submenus ?? null)
                    } else {
                        data.c3VibWVudXM = btoa(submenus ? JSON.stringify(submenus) : null)
                    }

                    await Api.post('/menu_create', data)

                    confirmMsg = 'Menu registrado com sucesso'
                } else {
                    const data = {
                        dGlwbw: btoa(this.obj?.tipo ? this.obj?.tipo : null),
                        bm9tZQ: btoa(this.obj?.name ? this.obj?.name : null),
                        dGFyZ2V0: btoa(this.obj?.target ? this.obj?.target : null),
                        aWNvbmU: btoa(this.obj?.icone ? this.obj?.icone : null),
                        dXNlcl9pZA: btoa(this.obj?.cliente_id ? this.obj?.cliente_id : null),
                        bWVudV9pZA: btoa(this.menu?.id ? this.menu?.id : null),
                    }

                    if (!Array.isArray(submenus)) {
                        data.c3VibWVudXM = btoa(submenus ?? null)
                    } else {
                        data.c3VibWVudXM = btoa(submenus ? JSON.stringify(submenus) : null)
                    }

                    await Api.post('/menu_edit', data)

                    confirmMsg = 'Dados atualizados com sucesso'
                }

                this.hideModal()

                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: confirmMsg,
                    showConfirmButton: false,
                    timer: 2000,
                }).then(() => window.location.reload())
            } catch (error) {
                if (error?.response?.data?.message) {
                    console.error(error.response.data.message)
                } else {
                    console.error(error)
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Erro ao realizar o registro do menu.',

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

        resetForm() {
            this.obj = {
                cliente_id: localStorage.getItem('@USER_ID'),
                tipo: localStorage.getItem('@TIPO'),
                name: '',
                icone: '',
                target: '',
                submenus: [],
            }

            this.hasSubmenu = false
        },

        fillForm(obj) {
            this.obj = {
                cliente_id: localStorage.getItem('@USER_ID'),
                tipo: obj?.tipo ?? null,
                name: obj?.name ?? '',
                icone: obj?.icone ?? '',
                target: obj?.target ?? '',
            }

            if (obj?.submenus && obj?.submenus?.length > 1) {
                const submenus = JSON.parse(obj?.submenus)

                this.obj.submenus = submenus.map(submenu => ({
                    ...submenu,
                    id: this.generateSecureId(),
                }))
            } else {
                this.obj.submenus = parseInt(obj?.submenus) || []
            }

            if (this.obj.submenus.length === 0) {
                this.hasSubmenu = false

                return
            }

            this.hasSubmenu = true
        },

        hideModal() {
            const modalElement = document.getElementById('add_menu')
            const modal = bootstrap.Offcanvas.getInstance(modalElement)

            modal.hide()
        },

        clearSubmenuSelected() {
            this.submenuSelected = {}
        },

        fillSubmenu(objValue) {
            if (!this.obj?.submenus) {
                this.obj.submenus = []
            }

            const index = this.obj?.submenus?.findIndex(submenu => submenu.id === objValue.id)

            if (index === -1) {
                this.obj?.submenus?.push(objValue)

                return
            }

            this.obj?.submenus?.splice(index, 1, objValue)
        },

        removeSubmenu(submenuId) {
            const index = this.obj.submenus.findIndex(submenu => submenu.id === submenuId)

            if (index > -1) {
                this.obj.submenus.splice(index, 1)
            }
        },

        selectSubmenu(submenuId) {
            this.submenuSelected = this.obj.submenus.find(submenu => submenu.id === submenuId)
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

<style scoped>
.offcanvas {
    width: 80%;
}

@media (max-width: 1030px) {
    .offcanvas {
        width: 100%;
    }
}

.button-actions,
.button-actions i {
    transition: all 200ms ease;
}

.button-actions:hover,
.button-actions:hover > i {
    transform: scale(1.08);
}

@media (min-width: 768px) {
    .position-md-absolute {
        position: absolute !important;
    }
}
</style>
