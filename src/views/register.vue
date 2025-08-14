<template>
    <div class="box">
        <front-menu />

        <div class="content">
            <div
                v-if="subplanData.price === null"
                class="container bg-white text-center info"
            >
                <div
                    class="spinner-border spinner-border-sm"
                    role="status"
                ></div>
            </div>

            <div
                v-if="subplanData.price !== null && !isRegisterConsulteNos"
                class="container bg-white text-center info"
            >
                <div class="plano">
                    <h1>
                        Plano {{ subplanData.name_plan }} {{ subplanData.name }} -
                        {{ formatedMoney(subplanData.price) }}
                    </h1>

                    <h3
                        v-show="pay"
                        class="text-success"
                    >
                        Cadastro realizado com sucesso efetue o pagamento
                    </h3>
                </div>

                <banner-register
                    :dados="subplanData"
                    :setTokenCad="setTokenCad"
                    :pay="pay"
                    :setClienteId="setClienteId"
                />
                <banner-pagamento
                    :dados="subplanData"
                    :pay="pay"
                    :clienteId="clienteId"
                />
            </div>

            <div
                v-if="subplanData.price !== null && isRegisterConsulteNos"
                class="container bg-white text-center info"
            >
                <div class="plano">
                    <h1>Deixe seus dados que entraremos em contato Ou fale conosco via zap</h1>
                </div>

                <banner-register-consulte-nos />

                <div class="d-flex align-items-center justify-content-center">
                    <a
                        href="https://api.whatsapp.com/send?phone=5565920011640&text=Acessei%20o%20site%20inzupt.com.br%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%A3o"
                        class="btn-entrarContato"
                    >
                        <img
                            src="../assets/whatsapp.png"
                            alt=""
                        />
                        Fale conosco via zap
                    </a>
                </div>
            </div>
        </div>

        <banner-footer />
    </div>
</template>

<script>
import FrontMenu from '@/components/GLOBALS/FrontMenu.vue'
import BannerRegister from '@/components/register/BannerRegister.vue'
import BannerRegisterConsulteNos from '@/components/register/BannerRegisterConsulteNos.vue'
import BannerPagamento from '@/components/register/BannerPagamento.vue'
import BannerFooter from '@/components/index/BannerFooter.vue'
import router from '@/router'
import Api from '@/services/api'

export default {
    name: 'RegisterPage',
    components: {
        FrontMenu,
        BannerRegister,
        BannerFooter,
        BannerPagamento,
        BannerRegisterConsulteNos,
    },

    data() {
        return {
            pay: false, //false
            subplanData: {
                id: null,
                name: '',
                price: null,
                name_plan: null,
            },
            clienteId: null,
        }
    },

    computed: {
        isRegisterConsulteNos() {
            return this.subplanData.price === 0 && this.subplanData.price !== null
        },
    },

    created() {
        window.scrollTo(0, 0)

        this.verifyTokenCad()
        this.getPlanData()
    },

    methods: {
        async getPlanData() {
            const token = this.$route.params.token

            await Api.get(`/checkout/${token}`)
                .then(response => {
                    this.subplanData.id = parseInt(atob(response.data.subplano[0]))
                    this.subplanData.name = decodeURIComponent(
                        escape(atob(response.data.subplano[1]))
                    )
                    this.subplanData.price = parseFloat(atob(response.data.subplano[2]))
                    this.subplanData.name_plan = decodeURIComponent(
                        escape(atob(response.data.subplano[3]))
                    )
                })
                .catch(error => {
                    console.error(error)
                })
        },

        listarSubPlano() {
            Api.get('subplanos/' + btoa(this.$route.query.id))
                .then(response => {
                    this.subplanData = response.data[this.$route.query.posicao]

                    console.log(response.data)
                })
                .catch(() => {
                    router.push({ name: 'index' })
                })
        },

        verifyTokenCad() {
            let tk = localStorage.getItem('@CAD')

            if (tk) {
                this.pay = true
            } else {
                this.pay = false
            }
        },

        setTokenCad(token) {
            localStorage.setItem('@CAD', token)
            this.verifyTokenCad()
        },

        setClienteId(id) {
            this.clienteId = id
        },

        formatedMoney(value) {
            if (!value) return

            return value.toLocaleString('pt-br', {
                style: 'currency',
                currency: 'BRL',
            })
        },
    },
}
</script>

<style scoped>
.content {
    padding-top: 100px;
    background-image: linear-gradient(to right, #7ed0dd, #479fcf);
}
.box {
    width: 100%;
    height: 100%;

    background-image: linear-gradient(to right, #7ed0dd, #479fcf);
}
.container-form {
    max-width: 800px;
    width: 90%;
}

.plano {
    grid-column: span 2;
}

.info {
    border-radius: 10px;
    max-width: 90%;
    margin: auto;
    display: grid;
    place-content: center;
    padding: 30px 0;
}

@media (max-width: 760px) {
    .container-form {
        max-width: 800px;
        width: 100%;
    }
    .info {
        display: grid;
        place-items: center;
        max-width: 100%;
        padding: 0px 0;
    }
    .plano {
        grid-column: 1;
    }
    .content {
        padding-top: 140px;
    }
}

.btn-entrarContato {
    background: transparent;
    border: 2px solid #29a71a;
    padding: 20px 25px;

    color: #29a71a;
    font-weight: bold;

    display: flex;

    align-items: center;
    gap: 10px;
    justify-content: space-between;

    font-size: 1.5rem;
    border-radius: 100px;
    transition: 0.3s;
    text-decoration: none;
}

.btn-entrarContato:hover {
    background: #29a71a;
    color: #fff;
}

.btn-entrarContato img {
    border: 3px solid #fff;
    border-radius: 50%;
}

.sombra {
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
}
</style>
