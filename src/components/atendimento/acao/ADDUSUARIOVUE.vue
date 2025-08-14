<template>
    <container>
        <div
            id="add_user"
            class="offcanvas offcanvas-end"
            style="width: 80%"
            tabindex="-1"
            aria-labelledby="offcanvasRightLabel"
        >
            <div class="offcanvas-header">
                <button
                    type="button"
                    class="btn btn-danger ms-auto"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                >
                    Fechar
                </button>
            </div>
            <div class="offcanvas-body">
                <div class="container-fluid row">
                    <div class="col-md-12 text-center mb-3">
                        <h2
                            id="offcanvasRightLabel"
                            class="offcanvas-title fs-3"
                        >
                            <b>Novo Contato</b>
                        </h2>
                    </div>

                    <form class="row container">
                        <div class="col-md-4 form-group">
                            <label class="col-form-label fs-3">Nome</label>
                            <input
                                v-model="obj.nome"
                                type="text"
                                class="form-control form-pad"
                            />
                        </div>

                        <div class="col-md-4 form-group">
                            <label class="col-form-label fs-3">Telefone</label>

                            <input
                                v-model="obj.fone"
                                v-mask="mascara.cel"
                                type="text"
                                class="form-control form-pad"
                            />
                        </div>

                        <div class="col-md-4 form-group">
                            <label class="col-form-label fs-3">Email</label>
                            <div class="">
                                <input
                                    v-model="obj.email"
                                    type="email"
                                    class="form-control form-pad"
                                />
                            </div>
                        </div>

                        <div class="col-md-2 mt-3 form-group">
                            <label class="col-form-label fs-3">Gênero</label>

                            <select
                                v-model="obj.genero"
                                class="form-select form-pad"
                            >
                                <option
                                    value="0"
                                    disabled
                                    selected
                                >
                                    Selecione
                                </option>
                                <option value="Masculino">MASCULINO</option>
                                <option value="Feminino">FEMININO</option>
                                <option value="LGBTQIA+">LGBTQIA+</option>
                            </select>
                        </div>

                        <div class="col-md-3 mt-3 form-group">
                            <label class="col-form-label fs-3">Nascimento</label>
                            <input
                                v-model="obj.nascimento"
                                v-mask="mascara.nascimento"
                                type="text"
                                class="form-control form-pad"
                            />
                        </div>

                        <locais
                            :reset="resetLocals"
                            modal-type="add"
                            @updated-reset="resetLocals = false"
                            @fill-uf="updateUF"
                            @fill-city="updateCity"
                        />

                        <div class="col-md-3 form-group mt-3">
                            <label class="col-form-label fs-3">Grupo</label>

                            <select class="form-select form-pad">
                                <option
                                    :value="0"
                                    selected
                                    disabled
                                >
                                    Selecione o grupo
                                </option>

                                <option
                                    v-for="grupo in grupos"
                                    :key="grupo.id"
                                    :value="grupo.id"
                                >
                                    {{ grupo.nome_grupo }}
                                </option>
                            </select>
                        </div>

                        <div class="col-md-12 form-group mt-2">
                            <label class="col-form-label fs-3 mb-2">Observacao</label>
                            <div class="">
                                <textarea
                                    v-model="obj.observacao"
                                    class="form-control"
                                    cols="5"
                                    rows="5"
                                ></textarea>
                            </div>
                        </div>

                        <div class="col-md-2 mt-3 center">
                            <button
                                type="button"
                                class="btn btn-primary form-pad fw-bold"
                                @click="CriarUsuario"
                            >
                                <div v-if="!btnLoading">Cadastrar</div>

                                <div
                                    v-else
                                    class="spinner-border spinner-border-sm"
                                    role="status"
                                >
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </container>
</template>

<script>
import Locais from '@/components/GLOBALS/CidadesEstado.vue'
import Container from '@/components/GLOBALS/container.vue'
import Api from '@/services/api'
import Swal from 'sweetalert2'

export default {
    name: 'AddUser',

    components: { Container, Locais },

    props: {
        grupos: {
            type: Array,
        },
    },

    emits: ['updated-contatos'],

    data() {
        return {
            mascara: {
                nascimento: '##/##/####',
                cel: '(##) #####-####',
            },
            obj: {
                id: localStorage.getItem('@USER_ID'),
                nome: null,
                contato_id: null,
                fone: null,
                genero: '0',
                dia_aniversario: null,
                mes_aniversario: null,
                ano_aniversario: null,
                observacao: null,
                email: null,
                cidade: null,
                uf: null,
                grupo_id: 0,
            },

            btnLoading: false,
            resetLocals: false,
        }
    },

    mounted() {
        const offcanvasElement = document.getElementById('add_user')

        if (offcanvasElement) {
            offcanvasElement.addEventListener('shown.bs.offcanvas', this.handleModalOpen)
            offcanvasElement.addEventListener('hidden.bs.offcanvas', this.resetForm)
        }
    },

    beforeUnmount() {
        const offcanvasElement = document.getElementById('add_user')

        if (offcanvasElement) {
            offcanvasElement.removeEventListener('shown.bs.offcanvas', this.handleModalOpen)
            offcanvasElement.removeEventListener('hidden.bs.offcanvas', this.resetForm)
        }
    },

    methods: {
        async CriarUsuario() {
            this.btnLoading = true

            await Api.post('/contatos_grava/ZmlsYWRlYXRlbmRpbWVudG8=', this.obj)
                .then(response => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Sucesso!',
                        text: response.data.mensagem,
                        showConfirmButton: false,
                        timer: 2000,
                    })

                    const truck_offCanvas = document.querySelector('#add_user')
                    const offCanvas = bootstrap.Offcanvas.getOrCreateInstance(truck_offCanvas)
                    offCanvas.hide()
                })
                .catch(error => {
                    console.error(error)

                    this.btnLoading = false

                    Swal.fire({
                        icon: 'error',
                        title: 'Erro',
                        text: 'Erro ao cadastrar contato.',

                        didOpen: () => {
                            const confirmBtn = Swal.getConfirmButton()
                            const actionsContainer = confirmBtn.parentElement

                            actionsContainer.style.width = '100%'
                            actionsContainer.style.display = 'flex'
                            actionsContainer.style.justifyContent = 'center'

                            confirmBtn.style.width = '90%'
                        },
                    })
                })
                .finally(() => (this.btnLoading = false))
        },

        handleModalOpen() {
            this.$nextTick(() => {
                window.dispatchEvent(new CustomEvent('modal-add-opened'))
            })
        },

        updateUF(uf) {
            this.obj.uf = uf
        },

        updateCity(city) {
            this.obj.cidade = city
        },

        resetForm() {
            this.obj = {
                id: localStorage.getItem('@USER_ID'),
                nome: null,
                contato_id: null,
                fone: null,
                genero: '0',
                dia_aniversario: null,
                mes_aniversario: null,
                ano_aniversario: null,
                observacao: null,
                email: null,
                cidade: null,
                uf: null,
                grupo_id: 0,
            }

            this.$nextTick(() => {
                this.resetLocals = true
            })
        },
    },
}
</script>
