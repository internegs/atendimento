<template>
    <container>
        <div
            id="acao_editar"
            class="offcanvas offcanvas-end"
            style="width: 85%"
            tabindex="-1"
            aria-labelledby="offcanvasRightLabel"
        >
            <div class="offcanvas-header">
                <div class="col-md-6 text-center mb-4">
                    <h2
                        id="offcanvasRightLabel"
                        class="offcanvas-title fs-3"
                    >
                        <b>Editar Contato</b>
                    </h2>
                </div>

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
                    <form class="row">
                        <div class="col-md-4 form-group">
                            <label class="col-form-label fs-3 mb-2">Nome</label>
                            <input
                                v-model="obj.nome"
                                type="text"
                                class="form-control form-pad"
                            />
                        </div>

                        <div class="col-md-4 form-group">
                            <label class="col-form-label fs-3 mb-2">Telefone</label>

                            <input
                                v-model="obj.fone"
                                v-mask="mascara.telefone"
                                type="text"
                                class="form-control form-pad"
                            />
                        </div>

                        <div class="col-md-4 form-group">
                            <label class="col-form-label fs-3 mb-2">Email</label>

                            <input
                                v-model="obj.email"
                                type="email"
                                class="form-control form-pad"
                            />
                        </div>

                        <div class="col-md-4 mt-3 form-group">
                            <label class="col-form-label fs-3 mb-2">Gênero</label>

                            <select
                                v-model="obj.genero"
                                class="form-select form-pad"
                            >
                                <option
                                    value="0"
                                    selected
                                >
                                    Selecione
                                </option>
                                <option value="Masculino">MASCULINO</option>
                                <option value="Feminino">FEMININO</option>
                                <option value="LGBTQIA+">LGBTQIA+</option>
                            </select>
                        </div>

                        <div class="col-md-4 mt-3 form-group">
                            <label class="col-form-label fs-3 mb-2">Nascimento</label>
                            <input
                                v-model="nascimento"
                                v-mask="mascara.nascimento"
                                type="text"
                                class="form-control form-pad"
                            />
                        </div>

                        <div class="col-md-4 form-group mt-3">
                            <label class="col-form-label fs-3 mb-2">Grupo</label>

                            <select
                                v-model="obj.grupo_id"
                                class="form-select form-pad"
                            >
                                <option
                                    value="0"
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

                        <locais
                            :user="user"
                            :reset="resetLocals"
                            modal-type="edit"
                            @updated-reset="resetLocals = false"
                            @fill-uf="updateUF"
                            @fill-city="updateCity"
                        />

                        <div class="col-md-12 form-group mt-2">
                            <label class="col-form-label fs-3 mb-2">Observacao</label>
                            <div class="">
                                <textarea
                                    v-model="obj.observacao"
                                    class="form-control"
                                    cols="2"
                                    rows="2"
                                ></textarea>
                            </div>
                        </div>

                        <div class="col-md-2 mt-3">
                            <button
                                type="button"
                                class="btn btn-primary btn-block form-pad"
                                @click="saveEdit"
                            >
                                <span v-if="!btnLoading">Editar</span>

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
import Container from '@/components/GLOBALS/container.vue'
import Locais from '@/components/GLOBALS/CidadesEstado.vue'
import Api from '@/services/api'
import Swal from 'sweetalert2'

export default {
    name: 'editarContato',

    components: { Container, Locais },

    props: {
        grupos: {
            type: Array,
        },

        user: {
            type: Object,
        },
    },

    emits: ['handle-close-modal', 'updated-atendimentos'],

    data() {
        return {
            id: '',
            nascimento: '',
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

            mascara: {
                nascimento: '##/##/####',
                telefone: '+## (##) # ####-####',
            },

            btnLoading: false,
            resetLocals: false,
        }
    },

    watch: {
        nascimento: function () {
            this.obj.dia_aniversario = this.nascimento.substring(0, 2)
            this.obj.mes_aniversario = this.nascimento.substring(3, 5)
            this.obj.ano_aniversario = this.nascimento.substring(6, 11)
        },
    },

    mounted() {
        const offcanvasElement = document.getElementById('acao_editar')

        if (offcanvasElement) {
            offcanvasElement.addEventListener('shown.bs.offcanvas', () => {
                this.fillForm()

                this.$nextTick(() => {
                    window.dispatchEvent(new CustomEvent('modal-edit-opened'))
                })
            })

            offcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
                this.resetForm()
            })
        }
    },

    beforeUnmount() {
        const offcanvasElement = document.getElementById('acao_editar')

        if (offcanvasElement) {
            offcanvasElement.removeEventListener('shown.bs.offcanvas', this.fillForm)
            offcanvasElement.removeEventListener('hidden.bs.offcanvas', this.resetForm)
        }
    },

    methods: {
        async saveEdit() {
            this.btnLoading = true

            await Api.post(
                `/contatos_update/ZmlsYWRlYXRlbmRpbWVudG8=`,

                this.obj
            )
                .then(response => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Sucesso!',
                        text: response.data.mensagem,
                        showConfirmButton: false,
                        timer: 2000,
                    })

                    this.$emit('updated-atendimentos')

                    const truck_modal = document.querySelector('#acao_editar')
                    const modal = bootstrap.Offcanvas.getOrCreateInstance(truck_modal)
                    modal.hide()
                })
                .catch(error => {
                    this.btnLoading = false

                    console.error(error)

                    Swal.fire({
                        icon: 'error',
                        title: 'Erro',
                        text: 'Erro ao editar contato.',

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

        maskPhone(value) {
            if (!value || value.length > 13) {
                if (value.includes('+')) {
                    return `+${value.slice(1, 3)} (${value.slice(3, 5)}) ${value.slice(5, 6)} ${value.slice(6, 10)}-${value.slice(10)}`
                }

                return ''
            }

            return `+${value.slice(0, 2)} (${value.slice(2, 4)}) ${value.slice(4, 5)} ${value.slice(5, 9)}-${value.slice(9)}`
        },

        updateUF(uf) {
            this.obj.uf = uf
        },

        updateCity(city) {
            this.obj.cidade = city
        },

        fillForm() {
            this.obj.contato_id = this.user.id ?? null
            this.obj.nome = this.user.nome ?? null
            this.obj.fone = this.maskPhone(this.user.fone) ?? null
            this.obj.contato_id = this.user.id ?? null
            this.obj.genero = this.user.genero ?? '0'
            this.obj.observacao = this.user.observacao ?? null
            this.obj.email = this.user.email ?? null
            this.obj.grupo_id = this.user.grupo_id ?? 0
            this.obj.cidade = this.user.cidade ?? null
            this.obj.uf = this.user.uf ?? null

            const dia = this.user.dia_aniversario ?? null
            const mes = this.user.mes_aniversario ?? null
            const ano = this.user.ano_aniversario ?? null

            if (dia && mes && ano) {
                this.nascimento = `${dia}/${mes}/${ano}`
            } else {
                this.nascimento = ''
            }
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

            this.$nextTick(() => (this.resetLocals = true))
        },

        teste(value) {
            console.log(value)
        },
    },
}
</script>

<style>
.form-pad {
    padding: 10px 20px !important;
}

@media (max-width: 600px) {
    button {
        width: 100%;
    }
}
</style>
