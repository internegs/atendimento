<template>
    <div
        class="container-form bg-gray p-4 rounded mt-4 register"
        :class="!pay ? '' : 'disable registroRealizado'"
    >
        <h2>FAÇA SEU CADASTRO</h2>

        <form
            class="row g-3 mt-2"
            @submit.prevent="registrar()"
        >
            <div class="col-md-12 position-relative">
                <select
                    class="form-select btn-pd"
                    v-model="obj.pfpj"
                    required
                    :disabled="pay"
                >
                    <option
                        :value="option.value"
                        v-for="(option, index) in options"
                        :key="index"
                        :disabled="option.value === null"
                        :selected="option.value === null"
                    >
                        {{ option.text }}
                    </option>
                </select>

                <p
                    class="text-start ps-1 mt-1 text-danger fw-bold"
                    v-show="errors.tipo"
                >
                    {{ errors.tipo }}
                </p>
            </div>

            <div
                v-if="obj.pfpj === 1"
                class="g-2 row"
            >
                <div class="col-md-6">
                    <input
                        type="text"
                        id="input-name-pf"
                        class="form-control btn-pd"
                        :class="{ 'is-invalid': errors.nome }"
                        placeholder="Digite Seu Nome"
                        v-model="obj.nome"
                        :disabled="pay"
                        @input="validateInputs($event.target.id)"
                        required
                    />

                    <div
                        v-if="errors.nome"
                        class="invalid-feedback text-start"
                        style="font-size: 13px"
                    >
                        {{ errors.nome }}
                    </div>
                </div>

                <div class="col-md-6">
                    <input
                        type="text"
                        id="input-cpf"
                        :class="{ 'is-invalid': errors.cpf }"
                        class="form-control btn-pd"
                        placeholder="Digite seu CPF"
                        v-model="obj.cpf_cnpj"
                        v-mask="mascara.cpf"
                        required
                        :disabled="pay"
                        @input="validateInputs($event.target.id)"
                    />

                    <div
                        v-if="errors.cpf"
                        class="invalid-feedback text-start"
                        style="font-size: 13px"
                    >
                        {{ errors.cpf }}
                    </div>
                </div>
            </div>

            <div
                v-if="obj.pfpj === 2"
                class="g-2 row"
            >
                <div class="col-md-6">
                    <input
                        type="text"
                        id="input-name-pj"
                        class="form-control btn-pd"
                        :class="{ 'is-invalid': errors.nome }"
                        v-model="obj.nome"
                        placeholder="Digite Nome da Sua Empresa"
                        required
                        :disabled="pay"
                        @input="validateInputs($event.target.id)"
                    />

                    <div
                        v-if="errors.nome"
                        class="invalid-feedback text-start"
                        style="font-size: 13px"
                    >
                        {{ errors.nome }}
                    </div>
                </div>

                <div class="col-md-6">
                    <input
                        type="text"
                        id="input-cnpj"
                        class="form-control btn-pd"
                        :class="{ 'is-invalid': errors.cnpj }"
                        placeholder="Digite seu CNPJ"
                        v-model="obj.cpf_cnpj"
                        v-mask="mascara.cnpj"
                        required
                        :disabled="pay"
                        @input="validateInputs($event.target.id)"
                    />

                    <div
                        v-if="errors.cnpj"
                        class="invalid-feedback text-start"
                        style="font-size: 13px"
                    >
                        {{ errors.cnpj }}
                    </div>
                </div>
            </div>

            <div
                class="col-md-12"
                style="padding: 10px 20px 0px 20px"
            >
                <h1 class="fs-3">Dados de Acesso</h1>
            </div>

            <div class="col-md-12">
                <input
                    type="email"
                    name="email"
                    class="form-control btn-pd"
                    placeholder="Digite Seu Email"
                    v-model="obj.email"
                    :disabled="pay"
                    autocomplete="skibi dop"
                    required
                />
            </div>

            <div class="col-12 col-md-6">
                <input
                    type="password"
                    id="input-password"
                    name="password"
                    autocomplete="new-password"
                    class="form-control btn-pd"
                    :class="{ 'is-invalid': errors.password }"
                    placeholder="Digite Sua Senha"
                    v-model="obj.password"
                    :disabled="pay"
                    required
                    @input="validateInputs($event.target.id)"
                />

                <div
                    v-if="errors.password"
                    class="invalid-feedback text-start"
                    style="font-size: 13px"
                >
                    {{ errors.password }}
                </div>
            </div>

            <div class="col-12 col-md-6">
                <input
                    type="password"
                    id="input-confirm-password"
                    name="confirm_password"
                    autocomplete="new-password"
                    class="form-control btn-pd"
                    :class="{ 'is-invalid': errors.confirm_password }"
                    placeholder="Confirme Sua Senha"
                    v-model="obj.confirm_password"
                    :disabled="pay"
                    required
                    @input="validateInputs($event.target.id)"
                />

                <div
                    v-if="errors.confirm_password"
                    class="invalid-feedback text-start"
                    style="font-size: 13px"
                >
                    {{ errors.confirm_password }}
                </div>
            </div>

            <div class="col-12 col-md-6">
                <input
                    type="text"
                    id="input-celular"
                    name="celular"
                    class="form-control btn-pd"
                    :class="{ 'is-invalid': errors.celular }"
                    placeholder="Nº WhatsApp que será conectado"
                    v-model="obj.celular"
                    :disabled="pay"
                    v-mask="mascara.cel"
                    @input="validateInputs($event.target.id)"
                />

                <div
                    v-if="errors.celular"
                    class="invalid-feedback text-start"
                    style="font-size: 13px"
                >
                    {{ errors.celular }}
                </div>
            </div>

            <div class="col-12 col-md-6">
                <div class="position-relative d-flex align-items-center">
                    <input
                        type="text"
                        name="cep"
                        class="form-control btn-pd"
                        placeholder="Digite seu CEP"
                        v-model="obj.cep"
                        :disabled="pay"
                        v-mask="mascara.cep"
                        @input="buscarCep()"
                        required
                    />

                    <div
                        v-if="loading.cep"
                        class="spinner-border spinner-border-sm position-absolute"
                        style="right: 1rem"
                        role="status"
                    ></div>
                </div>
            </div>

            <div class="col-12 col-md-4">
                <input
                    type="text"
                    name="numero"
                    placeholder="Nº"
                    class="form-control btn-pd"
                    v-model="obj.numero"
                    :disabled="pay"
                />
            </div>

            <div class="col-12 col-md-8">
                <input
                    type="text"
                    name="complemento"
                    placeholder="Complemento"
                    v-model="obj.complemento"
                    :disabled="pay"
                    class="form-control btn-pd"
                />
            </div>

            <div class="col-md-6">
                <input
                    type="text"
                    name="bairro"
                    placeholder="Bairro"
                    class="form-control btn-pd"
                    v-model="obj.bairro"
                    :disabled="pay"
                />
            </div>

            <div class="col-md-6">
                <input
                    type="text"
                    name="endereco"
                    placeholder="Endereço"
                    class="form-control btn-pd"
                    v-model="obj.endereco"
                    :disabled="pay"
                />
            </div>

            <div class="col-md-6">
                <input
                    type="text"
                    name="cidade"
                    placeholder="Cidade"
                    class="form-control btn-pd"
                    v-model="obj.cidade"
                    :disabled="pay"
                />
            </div>

            <div class="col-md-6">
                <input
                    type="text"
                    name="uf"
                    placeholder="Estado"
                    class="form-control btn-pd"
                    v-model="obj.uf"
                    :disabled="pay"
                />
            </div>

            <div class="col-md-12 d-flex gap-3">
                <span class="fs-">
                    <a
                        href="../politica_privacidade"
                        target="blank"
                    >
                        Ao se cadastrar você concorda com a nossa política de privacidade e termo de
                        uso!
                    </a>
                </span>
            </div>

            <div class="col-12 mt-4 w-100">
                <button
                    type="submit"
                    class="button-register w-100"
                    :class="{ disable: isDisabledSubmit }"
                    :disabled="isDisabledSubmit"
                >
                    <div v-if="!loading.register">Cadastrar</div>

                    <div
                        class="spinner-border"
                        role="status"
                        v-else
                    >
                        <span class="visually-hidden">Processando...</span>
                    </div>
                </button>
            </div>
        </form>
    </div>
    <!-- /container -->
</template>

<script>
import cepApi from '@/services/cep'
import Api from '@/services/api'
import Swal from 'sweetalert2'

export default {
    name: 'BannerRegister',

    props: {
        dados: { type: Object },
        setTokenCad: { type: Function },
        pay: { type: Boolean },
        setClienteId: { type: Function },
    },

    data() {
        return {
            loading: {
                cep: false,
                register: false,
            },

            errors: {
                nome: null,
                email: null,
                password: null,
                confirm_password: null,
                celular: null,
                cep: null,
                cpf: null,
                cnpj: null,
            },

            mascara: {
                cel: '(##) # ####-####',
                cep: '#####-###',
                cpf: '###.###.###-##',
                cnpj: '##.###.###/####-##',
            },

            options: [
                { value: null, text: 'Selecione a opção' },
                { value: 1, text: 'Pessoa Física' },
                { value: 2, text: 'Pessoa Jurídica' },
            ],

            obj: {
                nome: null,
                email: null,
                password: null,
                confirm_password: null,
                cpf_cnpj: null,
                celular: null,
                pfpj: null,
                uf: null,
                cep: null,
                cidade: null,
                bairro: null,
                endereco: null,
                complemento: null,
                numero: null,
                subplano_id: null,
            },
        }
    },

    computed: {
        isDisabledSubmit() {
            const hasErrors =
                this.errors.nome ||
                this.errors.password ||
                this.errors.confirm_password ||
                this.errors.celular ||
                this.errors.cpf ||
                this.errors.cnpj
            const hasRequiredFields =
                this.obj.nome &&
                this.obj.cpf_cnpj &&
                this.obj.email &&
                this.obj.password &&
                this.obj.confirm_password &&
                this.obj.celular &&
                this.obj.cep &&
                this.obj.pfpj

            return hasErrors || !hasRequiredFields
        },
    },

    watch: {
        'obj.pfpj'(newValue) {
            if (newValue) {
                this.obj.nome = null
                this.obj.cpf_cnpj = null
            }
        },
    },

    methods: {
        async buscarCep() {
            if (this.obj.cep?.length < 9) return

            this.loading.cep = true

            await cepApi
                .get(`${this.obj.cep}/json`)
                .then(response => {
                    let cep = response.data
                    this.obj.complemento = cep.complemento
                    this.obj.bairro = cep.bairro
                    this.obj.cidade = cep.localidade
                    this.obj.uf = cep.uf
                    this.obj.endereco = cep.logradouro
                })
                .catch(error => {
                    console.error(error)

                    this.loading.cep = false
                })
                .finally(() => (this.loading.cep = false))
        },

        async registrar() {
            if (this.isDisabledSubmit) return

            this.loading.register = true
            this.obj.subplano_id = this.dados.id

            await this.cripto(this.obj.email)

            const encriptObj = {
                cGxhbm9faWQ3D: btoa(this.obj.subplano_id),
                bmFtZQ3D3D: btoa(this.obj.nome),
                ZW1haWw: btoa(this.obj.email),
                ZG9jdW1lbnRv: btoa(this.obj.cpf_cnpj),
                tipo: this.obj.pfpj,
                diaY2Vw: btoa(this.obj.cep),
                ZW5kZXJlY2: btoa(this.obj.endereco),
                bnVtZXJv: btoa(this.obj.numero),
                Y29tcGxlbWVudG8: btoa(this.obj.complemento),
                YmFpcnJv: btoa(this.obj.bairro),
                Y2lkYWRl: btoa(this.obj.cidade),
                ZXN0YWRv: btoa(this.obj.uf),
                Y2VsdWxhcg: btoa(this.obj.celular),
                DYZwhdkerR: btoa(this.obj.password),
            }

            Api.post(`/cadastro/Y2FkYXN0cmFuZG8=`, encriptObj)
                .then(response => {
                    let dados = response.data

                    localStorage.setItem('@TOKEN', dados.token)
                    let tk = dados.token

                    this.setTokenCad(tk)
                    this.setClienteId(dados.cliente_id)

                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: toast => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        },
                    })

                    Toast.fire({
                        icon: 'success',
                        title: 'Usuário Cadastrado com Sucesso',
                    })

                    this.loading.register = false

                    this.scroolAnimation('.box-pagamentos')
                })
                .catch(error => {
                    const apiError = error.response.data.message

                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 5000,
                        timerProgressBar: true,
                        didOpen: toast => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        },
                    })

                    Toast.fire({
                        icon: 'error',
                        title: apiError,
                    })

                    this.loading.register = false
                })
        },

        async cripto(email) {
            await Api.post(`cripto`, {
                ZW1haWw: btoa(email),
            })
                .then(response => {
                    localStorage.setItem('@TOKEN', response.data.token)
                })
                .catch(error => {
                    console.error(error)

                    this.loading.cep = false
                })
        },

        scroolAnimation(element) {
            const to = document.querySelector(`${element}`).offsetTop

            window.scroll({
                top: 0,
                behavior: 'smooth',
            })
        },

        validateInputs(name) {
            switch (name) {
                case 'input-name-pj':
                    if (this.obj.nome.trim().length < 3 && this.obj.nome.trim().length !== 0) {
                        return (this.errors.nome = 'Mínimo 3 dígitos')
                    }

                    return (this.errors.nome = null)

                case 'input-name-pf':
                    if (this.obj.nome.trim().length < 3 && this.obj.nome.trim().length !== 0) {
                        return (this.errors.nome = 'Mínimo 3 dígitos')
                    }

                    return (this.errors.nome = null)

                case 'input-password':
                    if (this.obj.password.length < 6 && this.obj.password.length !== 0) {
                        return (this.errors.password = 'A senha deve ter no mínimo 8 caracteres')
                    }

                    return (this.errors.password = null)

                case 'input-confirm-password':
                    if (
                        this.obj.confirm_password !== this.obj.password &&
                        this.obj.confirm_password > 0
                    ) {
                        return (this.errors.confirm_password = 'Senhas não conferem')
                    }

                    return (this.errors.confirm_password = null)

                case 'input-celular': {
                    const celular = this.obj.celular?.replace(/[^0-9]/g, '') || ''

                    if (celular.length < 11 && celular.length !== 0) {
                        return (this.errors.celular = 'Celular inválido')
                    }

                    return (this.errors.celular = null)
                }

                case 'input-cnpj': {
                    const cnpj = this.obj.cpf_cnpj?.replace(/[^0-9]/g, '') || ''

                    if (cnpj.length < 14 && cnpj.length !== 0) {
                        return (this.errors.cnpj = 'CNPJ inválido')
                    }

                    return (this.errors.cnpj = null)
                }

                case 'input-cpf': {
                    const cpf = this.obj.cpf_cnpj?.replace(/[^0-9]/g, '') || ''

                    if (cpf.length < 11 && cpf.length !== 0) {
                        return (this.errors.cpf = 'CPF inválido')
                    }

                    return (this.errors.cpf = null)
                }
            }
        },
    },
}
</script>

<style scoped>
.input-metade {
    width: 50% !important;
}

.disable {
    opacity: 0.7;
}

.btn-pd {
    padding: 10px 20px;
}

.hover-laranja:hover {
    background-color: #f58634;
    color: #fff;
}

.accordion-button:not(.collapsed) {
    background-color: #f58634 !important;
    color: #fff !important;
}

.accordion-button:focus {
    border: 0 !important;
    box-shadow: none !important;
}

.icone {
    position: absolute;
    top: 62%;
    font-size: 1.1rem;
    right: 20px;
}

.button-register {
    text-transform: uppercase;
    color: #fff;
    font-weight: bold;

    font-size: 1.1rem;
    padding: 10px 20px;

    border-radius: 5px;

    background-color: #f58634;
}

.bg-branco {
    background-color: #fff;
}

.bg-gray {
    box-shadow: 5px 5px 25px 5px rgba(0, 0, 0, 0.2);
    margin-left: 0px;
}

.input {
    padding: 15px 10px;
    border-radius: 5px;
    border-bottom: 1px dashed #9e9e9e;
    font-size: 1.2rem;
}

.input:hover,
.input:hover i {
    border-color: #f58634;
    color: #f58634;
}

.input input {
    width: 100%;
    background-color: transparent;
    outline: 0;
    padding: 0px 10px;
    border: 0;
}

.input input::placeholder {
    font-size: 1.2rem;
}

.input:nth-child(2) {
    margin-top: 20px;
}

.input i {
    color: #9e9e9e;
    font-size: 20px;
}
.button-login {
    text-transform: uppercase;
    color: #fff;
    font-weight: bold;

    font-size: 1.5rem;
    padding: 10px 20px;

    border-radius: 5px;

    background-color: #f58634;
}
.laranja {
    color: #f58634;
}
.register {
    text-decoration: none;
}
.box-register {
    font-size: 1.1rem;
    text-align: center;
}

@media (max-width: 760px) {
    .btn-pd {
        padding: 10px 20px;
    }

    .input-metade {
        width: 100% !important;
    }
    .telefone {
        width: 100% !important;
    }
    .registroRealizado {
        display: none;
    }
}
</style>
