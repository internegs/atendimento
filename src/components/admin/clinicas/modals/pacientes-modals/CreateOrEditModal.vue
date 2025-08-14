<template>
    <container>
        <div
            id="add_paciente"
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
                            <b>{{ hasPaciente ? 'Editar' : 'Novo' }} Paciente</b>
                        </h2>
                    </div>

                    <form
                        class="row container"
                        @submit.prevent="createOrEdit"
                    >
                        <div class="col-md-4 form-group">
                            <label class="col-form-label fs-3">
                                Nome
                                <span
                                    v-if="!obj.nome"
                                    class="text-danger"
                                >
                                    *
                                </span>
                            </label>

                            <input
                                v-model="obj.nome"
                                type="text"
                                class="form-control form-pad"
                                required
                            />
                        </div>

                        <div class="col-md-4 form-group">
                            <label
                                for="cpfField"
                                class="col-form-label fs-3"
                            >
                                CPF
                                <span
                                    v-if="!obj.cpf"
                                    class="text-danger"
                                >
                                    *
                                </span>
                            </label>

                            <div class="position-relative d-flex align-items-center">
                                <input
                                    id="cpfField"
                                    v-model="obj.cpf"
                                    v-mask="mascara.cpf"
                                    type="text"
                                    class="form-control form-pad"
                                    :class="{ 'is-invalid': !validateCpf.isValid }"
                                    :disabled="isDisabledCpf"
                                    required
                                    @keyup="validatorCpf($event.target.value)"
                                />

                                <div
                                    v-if="loadingCpf && isDisabledCpf"
                                    class="spinner-border spinner-border-sm position-absolute"
                                    style="right: 1rem"
                                    role="status"
                                ></div>
                            </div>

                            <div
                                class="invalid-feedback"
                                :class="{ 'd-block': !validateCpf.isValid }"
                            >
                                <span v-text="validateCpf.messageError"></span>
                            </div>
                        </div>

                        <div class="col-md-4 form-group">
                            <label class="col-form-label fs-3">
                                Telefone
                                <span
                                    v-if="!obj.telefone"
                                    class="text-danger"
                                >
                                    *
                                </span>
                            </label>

                            <input
                                v-model="obj.telefone"
                                v-mask="phoneMask"
                                type="text"
                                class="form-control form-pad"
                                :placeholder="
                                    hasPaciente
                                        ? 'Ex: +55 (65) 9 9999-9999'
                                        : 'Ex: (65) 9 9999-9999'
                                "
                                required
                            />
                        </div>

                        <div class="col-md-3 mt-3 form-group">
                            <label class="col-form-label fs-3">
                                Nascimento
                                <span
                                    v-if="!obj.nascimento"
                                    class="text-danger"
                                >
                                    *
                                </span>
                            </label>

                            <input
                                v-model="obj.nascimento"
                                v-mask="mascara.nascimento"
                                type="text"
                                class="form-control form-pad"
                                required
                            />
                        </div>

                        <div class="col-md-2 mt-3 form-group">
                            <label class="col-form-label fs-3">Gênero</label>

                            <select
                                v-model="obj.genero"
                                class="form-select form-pad"
                            >
                                <option
                                    selected
                                    disabled
                                    value=""
                                >
                                    Selecione
                                </option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="LGBTQIA+">LGBTQIA+</option>
                            </select>
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
                                <option value="0">Particular</option>
                                <option value="1">Convênio</option>
                            </select>
                        </div>

                        <div
                            v-if="obj.tipo == 1"
                            class="col-md-3 form-group mt-3"
                        >
                            <label class="col-form-label fs-3">Convênios</label>

                            <select
                                v-model="obj.convenio"
                                class="form-select form-pad"
                                required
                            >
                                <option
                                    selected
                                    disabled
                                    value=""
                                >
                                    Selecione
                                </option>

                                <option
                                    v-for="(convenio, i) in convenios"
                                    :key="i"
                                    :value="convenio"
                                >
                                    {{ convenio }}
                                </option>
                            </select>
                        </div>

                        <div class="col-md-4 form-group mt-3">
                            <label class="col-form-label fs-3">CEP</label>

                            <div class="position-relative d-flex align-items-center">
                                <input
                                    v-model="objStreet.cep"
                                    v-mask="mascara.cep"
                                    type="text"
                                    class="form-control form-pad"
                                    :disabled="isDisabled"
                                    @keyup="getStreets"
                                />

                                <div
                                    v-if="loading && isDisabled"
                                    class="spinner-border spinner-border-sm position-absolute"
                                    style="right: 1rem"
                                    role="status"
                                ></div>
                            </div>
                        </div>

                        <div class="col-md-4 form-group mt-3">
                            <label class="col-form-label fs-3">Endereço</label>
                            <div class="">
                                <input
                                    v-model="objStreet.endereco"
                                    type="text"
                                    class="form-control form-pad"
                                    :disabled="isDisabled"
                                />
                            </div>
                        </div>

                        <div class="col-md-4 form-group mt-3">
                            <label class="col-form-label fs-3">Número</label>
                            <div class="">
                                <input
                                    v-model="objStreet.numero"
                                    type="text"
                                    class="form-control form-pad"
                                    maxlength="5"
                                    @input="filteredNumber($event.target.value)"
                                />
                            </div>
                        </div>

                        <div class="col-md-4 form-group mt-3">
                            <label class="col-form-label fs-3">Bairro</label>
                            <div class="">
                                <input
                                    v-model="objStreet.bairro"
                                    type="text"
                                    class="form-control form-pad"
                                    :disabled="isDisabled"
                                />
                            </div>
                        </div>

                        <div class="col-md-3 form-group mt-3">
                            <label class="col-form-label fs-3">Complemento</label>
                            <div class="">
                                <input
                                    v-model="objStreet.complemento"
                                    type="text"
                                    class="form-control form-pad"
                                    :disabled="isDisabled"
                                />
                            </div>
                        </div>

                        <div class="col-md-2 form-group mt-3">
                            <label class="col-form-label fs-3">Estado</label>
                            <div class="">
                                <input
                                    v-model="objStreet.uf"
                                    type="text"
                                    class="form-control form-pad"
                                    :disabled="isDisabled"
                                />
                            </div>
                        </div>

                        <div class="col-md-2 form-group mt-3">
                            <label class="col-form-label fs-3">Cidade</label>
                            <div class="">
                                <input
                                    v-model="objStreet.cidade"
                                    type="text"
                                    class="form-control form-pad"
                                    :disabled="isDisabled"
                                />
                            </div>
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
                                type="submit"
                                class="btn btn-primary form-pad fw-bold"
                            >
                                <span
                                    v-if="!loading"
                                    v-text="hasPaciente ? 'ATUALIZAR' : 'CADASTRAR'"
                                ></span>

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
    </container>
</template>

<script>
import Container from '@/components/GLOBALS/container.vue'
import Api from '@/services/api'
import Swal from 'sweetalert2'
import cep from '@/services/cep'
import validatorCpf from '@/services/ValidatorCpf'

const CLIENTE_ID = btoa(localStorage.getItem('@USER_ID'))

export default {
    name: 'AddUser',

    components: { Container },

    props: {
        convenios: {
            type: Array,
            required: true,
        },
        paciente: {
            type: Object,
        },
    },

    emits: ['handle-close-modal', 'refresh-pacientes'],

    data() {
        return {
            mascara: {
                nascimento: '##/##/####',
                cpf: '###.###.###-##',
                cep: '#####-###',
            },

            obj: {
                cliente_id: CLIENTE_ID,
                nome: '',
                cpf: '',
                telefone: '',
                nascimento: '',
                genero: '',
                tipo: null,
                convenio: '',
                observacao: '',
            },
            objStreet: {
                cep: '',
                endereco: '',
                numero: null,
                bairro: '',
                complemento: '',
                cidade: '',
                uf: '',
            },

            loading: false,
            loadingCpf: false,
            isDisabled: false,
            isDisabledCpf: false,
            validateCpf: {
                isValid: true,
                messageError: '',
            },
        }
    },

    computed: {
        hasPaciente() {
            return this.paciente && Object.keys(this.paciente).length > 0
        },

        phoneMask() {
            if (!this.hasPaciente) {
                return '(##) # ####-####'
            }

            return '+## (##) # ####-####'
        },
    },

    watch: {
        paciente: {
            handler(newValue) {
                this.fillForm(newValue)
            },

            deep: true,
        },

        obj: {
            handler(newValue) {
                if (newValue.tipo == 0) {
                    this.obj.convenio = ''
                }
            },
            deep: true,
        },
    },

    mounted() {
        const offcanvasElement = document.getElementById('add_paciente')

        offcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
            this.resetForm()

            if (this.paciente) {
                this.$emit('handle-close-modal')
            }
        })
    },

    beforeUnmount() {
        const offcanvasElement = document.getElementById('add_paciente')

        if (offcanvasElement) {
            offcanvasElement.removeEventListener('hidden.bs.offcanvas', this.resetForm)
        }
    },

    methods: {
        async getStreets() {
            let cepFiltered = this.filteredValues(this.objStreet.cep)

            if (cepFiltered.length < 8) return

            this.activeLoading()

            cep.get(`/${cepFiltered}/json`)
                .then(response => {
                    this.objStreet.bairro = response.data.bairro
                    this.objStreet.endereco = response.data.logradouro
                    this.objStreet.complemento = response.data.complemento
                    this.objStreet.uf = response.data.uf
                    this.objStreet.cidade = response.data.localidade
                })
                .catch(error => {
                    console.error(error)

                    this.disabledLoading()
                })
                .finally(() => this.disabledLoading())
        },

        async createOrEdit() {
            try {
                this.loading = true
                let path
                let confirmMsg

                if (!this.hasPaciente) {
                    path = '/paciente_create'
                    confirmMsg = 'Paciente criado com sucesso'
                } else {
                    path = '/paciente_edit'
                    confirmMsg = 'Dados atualizados com sucesso'
                }

                const response = await Api.post(path, {
                    Y2xpZW50ZV9pZA: CLIENTE_ID,
                    bm9tZQ: btoa(this.obj.nome),
                    Y3Bm: btoa(this.filteredValues(this.obj.cpf)),
                    dGlwb19pZA: btoa(this.obj.tipo),
                    JG5vbWVfcGxhbm8: btoa(this.obj.convenio),
                    JHRlbGVmb25l: btoa(this.filteredPhone(this.obj.telefone)),
                    bmFzY2ltZW50bw: btoa(this.filteredDate(this.obj.nascimento)),
                    JGNlcA: btoa(this.filteredValues(this.objStreet.cep)),
                    JGVuZGVyZWNv: btoa(this.objStreet.endereco),
                    JG51bWVybw: this.objStreet.numero,
                    JGJhaXJybw: btoa(this.objStreet.bairro),
                    JGNvbXBsZW1lbnRv: btoa(this.objStreet.complemento),
                    JGNpZGFkZQ: btoa(this.objStreet.cidade),
                    JGVzdGFkbw: btoa(this.objStreet.uf),
                    b2JzZXJ2YWNhbw: btoa(this.obj.observacao),
                    genero: this.obj.genero,
                    clinica_id: 0,
                })

                if (!response.data.status) {
                    throw new Error(
                        `Erro ao realizar a criação do paciente. Info: ${response.data.message}`
                    )
                }

                this.hideModal()

                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: confirmMsg,
                    showConfirmButton: false,
                }).then(() => this.$emit('refresh-pacientes'))
            } catch (error) {
                if (error?.response?.data?.message) {
                    console.error(error.response.data.message)
                } else {
                    console.error(error)
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Erro ao realizar o registro do paciente.',

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

        async validatorCpf(cpf) {
            this.validateCpf.isValid = true
            this.validateCpf.messageError = ''

            if (!cpf) return

            const cpfFiltered = cpf.replace(/[^0-9]/g, '')
            this.loadingCpf = true
            this.isDisabledCpf = true

            try {
                if (cpfFiltered.length !== 11) return

                await validatorCpf.post(
                    '',
                    {
                        Y2xpZW50ZV9pZA: CLIENTE_ID,
                    },
                    {
                        params: {
                            Y3Bm: btoa(cpfFiltered),
                        },
                    }
                )
            } catch (error) {
                console.error(error)

                this.validateCpf.messageError = error.response.data
                this.validateCpf.isValid = false
                this.loadingCpf = false
                this.isDisabledCpf = false
            } finally {
                this.loadingCpf = false
                this.isDisabledCpf = false
            }
        },

        filteredValues(values) {
            return values.replace(/[^a-zA-Z0-9\s]/g, '')
        },

        filteredDate(date) {
            const arrayDate = date.split('/')
            const dd = arrayDate[0]
            const mm = arrayDate[1]
            const yyyy = arrayDate[2]

            return `${yyyy}-${mm}-${dd}`
        },

        formatDate(date) {
            if (!date) return

            const arrayDate = date.split('-')

            const dd = arrayDate[2]
            const mm = arrayDate[1]
            const yyyy = arrayDate[0]

            return `${dd}/${mm}/${yyyy}`
        },

        filteredPhone(phone) {
            return phone.replace(/\D/g, '')
        },

        filteredNumber(number) {
            this.objStreet.numero = number.replace(/[^0-9]/g, '')
        },

        activeLoading() {
            this.loading = true
            this.isDisabled = true
        },

        disabledLoading() {
            this.loading = false
            this.isDisabled = false
        },

        resetForm() {
            this.obj = {
                cliente_id: CLIENTE_ID,
                nome: '',
                cpf: '',
                telefone: '',
                nascimento: '',
                genero: '',
                tipo: null,
                convenio: '',
                observacao: '',
            }

            this.objStreet = {
                cep: '',
                endereco: '',
                numero: null,
                bairro: '',
                complemento: '',
                cidade: '',
                uf: '',
            }
        },

        fillForm(obj) {
            this.obj = {
                nome: obj.nome || '',
                cpf: obj.cpf || '',
                telefone: obj.telefone || '',
                nascimento: this.formatDate(obj.nascimento) || '',
                genero: obj.genero || '',
                tipo: obj.tipo_id || null,
                convenio: obj.nome_plano || '',
                observacao: obj.observacao || '',
            }

            this.objStreet = {
                cep: obj.cep || '',
                endereco: obj.endereco || '',
                numero: obj.numero || null,
                bairro: obj.bairro || '',
                complemento: obj.complemento || '',
                cidade: obj.cidade || '',
                uf: obj.uf || '',
            }
        },

        hideModal() {
            const modalElement = document.getElementById('add_paciente')
            const modal = bootstrap.Offcanvas.getInstance(modalElement)

            modal.hide()
        },
    },
}
</script>
