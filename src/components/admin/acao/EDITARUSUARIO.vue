<template>
    <container>
        <div
            id="acao_editar"
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
                    <div class="col-md-12 text-center mb-1">
                        <h2
                            id="offcanvasRightLabel"
                            class="offcanvas-title"
                        >
                            <b>Editar Contato</b>
                            <hr />
                        </h2>
                    </div>

                    <form class="row">
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
                                v-mask="mascara.fone"
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
                                    selected
                                >
                                    Selecione
                                </option>
                                <option value="Masculino">MASCULINO</option>
                                <option value="Feminino">FEMININO</option>
                                <option value="LGBTQIA+">LGBTQIA+</option>
                            </select>
                        </div>

                        <div class="col-md-2 mt-3 form-group">
                            <label class="col-form-label fs-3">Nascimento</label>
                            <input
                                v-model="nascimento"
                                v-mask="mascara.nascimento"
                                type="text"
                                class="form-control form-pad"
                            />
                        </div>

                        <locais
                            :user="obj"
                            :reset="resetLocals"
                            modal-type="editar"
                            @updated-reset="resetLocals = false"
                            @fill-uf="updateUF"
                            @fill-city="updateCity"
                        />

                        <div class="col-md-3 form-group mt-3">
                            <label class="col-form-label fs-3">Grupo</label>

                            <select
                                v-model="obj.grupo_id"
                                class="form-select form-pad"
                            >
                                <option
                                    :value="0"
                                    disabled
                                    selected
                                    @change="Grupo_bd"
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
                            <label class="col-form-label fs-3">Observacao</label>
                            <div class="">
                                <textarea
                                    v-model="obj.observacao"
                                    class="form-control"
                                    cols="5"
                                    rows="2"
                                ></textarea>
                            </div>
                        </div>
                        <div class="col-md-2 mt-3">
                            <button
                                type="button"
                                class="btn btn-primary btn-block form-pad"
                                @click="Salvar_edicao"
                            >
                                Salvar
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
    name: 'EditarUsuario',
    components: { Container, Locais },

    props: {
        grupos: {
            type: Array,
        },
        user: {
            type: Object,
        },
    },

    emits: ['handle-close-modal', 'updated-contatos'],

    data() {
        return {
            id: '',
            nascimento: '',
            obj: {
                id: localStorage.getItem('@USER_ID'),
                nome: '',
                contato_id: '',
                genero: '0',
                dia_aniversario: '',
                mes_aniversario: '',
                ano_aniversario: '',
                observacao: '',
                email: '',
                cidade: null,
                uf: null,
                grupo_id: 0,
                fone: '',
            },

            mascara: {
                nascimento: '##/##/####',
                fone: '##(##)#########',
            },

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
        Grupo_bd() {
            Api.post(`/grupos/ZmlsYWRlYXRlbmRpbWVudG8=`, id)
                .then(response => {
                    //  console.log(response)
                })
                .catch(() => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro ao atualizar',
                    })
                })
        },

        async Salvar_edicao() {
            await Api.post(
                `/contatos_update/ZmlsYWRlYXRlbmRpbWVudG8=`,

                this.obj
            )
                .then(response => {
                    if (response.data.status) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Sucesso!',
                            text: response.data.mensagem,
                            showConfirmButton: false,
                            timer: 2000,
                        })

                        this.$emit('updated-contatos')

                        const truck_modal = document.querySelector('#acao_editar')
                        const modal = bootstrap.Offcanvas.getOrCreateInstance(truck_modal)
                        modal.hide()
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Erro',
                            text: response.data.mensagem,

                            didOpen: () => {
                                const confirmBtn = Swal.getConfirmButton()
                                const actionsContainer = confirmBtn.parentElement

                                actionsContainer.style.width = '100%'
                                actionsContainer.style.display = 'flex'
                                actionsContainer.style.justifyContent = 'center'

                                confirmBtn.style.width = '90%'
                            },
                        })
                    }
                })
                .catch(error => {
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
        },

        updateUF(uf) {
            this.obj.uf = uf
        },

        updateCity(city) {
            this.obj.cidade = city
        },

        fillForm() {
            this.obj.nome = this.user.nome ?? ''
            this.obj.fone = this.maskPhone(this.user.fone) ?? ''
            this.obj.contato_id = this.user.id ?? ''
            this.obj.genero = this.user.genero ?? '0'
            this.obj.observacao = this.user.observacao ?? ''
            this.obj.email = this.user.email ?? ''
            this.obj.grupo_id = parseInt(this.user.grupo_id) ?? 0
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
                nome: '',
                contato_id: '',
                genero: '0',
                dia_aniversario: '',
                mes_aniversario: '',
                ano_aniversario: '',
                observacao: '',
                email: '',
                cidade: null,
                uf: null,
                grupo_id: '',
                fone: '',
            }

            this.$nextTick(() => (this.resetLocals = true))
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
