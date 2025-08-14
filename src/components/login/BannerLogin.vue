<template>
    <div class="login mt-3">
        <form
            class="form"
            @submit.prevent="logar()"
        >
            <h1 class="text-uppercase text-center">Login</h1>

            <div class="input bg-branco mt-5 d-flex align-items-center">
                <i
                    class="fa fa-envelope"
                    aria-hidden="true"
                ></i>

                <input
                    v-model="obj.email"
                    type="email"
                    placeholder="E-mail"
                    required
                    @change="verificacao"
                    @focus="verificacao"
                />
            </div>

            <div class="input bg-branco mt-4 d-flex align-items-center">
                <i
                    class="fa fa-lock fs-4"
                    aria-hidden="true"
                ></i>

                <input
                    v-model="obj.password"
                    type="password"
                    placeholder="Senha"
                    required
                    @blur="verificacao"
                    @keydown="verificacao"
                    @focus="verificacao"
                />
            </div>

            <div v-if="!situacao">
                <button
                    type="submit"
                    class="button-login mt-5 w-100 disable"
                    disabled
                >
                    entrar
                </button>
            </div>

            <div v-else>
                <button
                    type="submit"
                    class="button-login mt-5 w-100"
                >
                    <div v-if="!btn_login">entrar</div>
                    <div
                        v-else
                        class="spinner-border"
                        role="status"
                    >
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </button>
            </div>

            <div
                class="box-register mt-3 laranja"
                @click="change('forgot')"
            >
                Esqueci minha senha
            </div>
        </form>
    </div>
</template>

<script>
import Api from '@/services/api'
import router from '@/router'
import Swal from 'sweetalert2'

export default {
    name: 'BannerLogin',

    props: {
        change: { type: Function },
    },

    data() {
        return {
            obj: {
                email: '',
                password: '',
            },
            situacao: false,
            btn_login: false,
        }
    },

    created() {
        localStorage.clear()
    },

    methods: {
        async logar() {
            if (this.obj.email === '' || this.obj.password === '') return

            this.btn_login = true
            await Api.post('/login', this.obj)
                .then(response => {
                    this.btn_login = false
                    const token_user = response.data.token
                    const tipo = response.data.type
                    const user_id = response.data.user.id
                    const setor_id = response.data.user.setor_id
                    const user_name = response.data.user.name
                    const session = response.data.config.session
                    const number = response.data.config.number
                    const mensagem = response.data.message

                    localStorage.setItem('@TOKEN', token_user)
                    localStorage.setItem('@MENSAGEM', mensagem)
                    localStorage.setItem('@USER_NAME', user_name)
                    localStorage.setItem('@USER_ID', user_id)
                    localStorage.setItem('@TIPO', tipo)
                    localStorage.setItem('@SESSION', session)
                    localStorage.setItem('@NUMBER', number)
                    localStorage.setItem('@SETOR_ID', setor_id)
                    localStorage.setItem('@STATUS_NOTIFICACAO', false)
                    localStorage.setItem('@AGENDA', response.data.YWdlbmRhX3Rva2Vu)

                    if (tipo === 1) {
                        localStorage.setItem('@USER_PAGE', 'DASHBOARD')
                        router.push({ name: 'admin' })
                    }

                    if (tipo === 2) {
                        localStorage.setItem('@USER_PAGE', 'ATENDIMENTO')

                        router.push({ name: 'atendimento' }) // tirei /token_c. Caso der erro, é aki
                    }
                })
                .catch(error => {
                    console.error(error)

                    this.btn_login = false

                    Swal.fire({
                        icon: 'error',
                        title: 'login ou senha incorreta',
                    })
                })
        },

        verificacao() {
            if (this.obj.password === '' || this.obj.email === '') {
                this.situacao = false
            } else {
                this.situacao = true
            }
        },
    },
}
</script>

<style scoped>
.disable {
    opacity: 0.5;
    cursor: not-allowed;
}
.bg-branco {
    background-color: #fff;
}
.login {
    width: 90%;
    max-width: 500px;
    background: #fff;
    border-radius: 5px;
}

.form {
    display: flex;
    flex-direction: column;
    padding: 32px;
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
    width: 90%;
    background-color: transparent;
    outline: 0;
    padding: 0px 10px;
    border: 0;
    color: #4d4f5c;
}

.input input::placeholder {
    font-size: 1.2rem;
}

.input:nth-child(2) {
    margin-top: 20px;
}

.input:nth-child(1) i {
    background-color: red;
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
    cursor: pointer;
}

.input:nth-child(1) input:focus {
    background-color: red;
}
</style>
