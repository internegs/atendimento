<template>
    <div style="background-image: linear-gradient(to right, #7ed0dd, #479fcf)">
        <header>
            <nav
                class="navbar navbar-expand-lg p-4"
                data-js="header"
            >
                <div class="container">
                    <router-link
                        to="/"
                        class="navbar-brand"
                    >
                        <img
                            src="../assets/img/inzap.png"
                            alt="inzupt"
                            width="200"
                            class="logo"
                        />
                    </router-link>
                    <div
                        :class="situacao ? 'active' : ''"
                        class="menu_hamburguer navbar-toggler"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        @click="responsivo()"
                    >
                        <div class="one"></div>
                        <div class="two"></div>
                        <div class="three"></div>
                    </div>

                    <div
                        id="navbarSupportedContent"
                        class="collapse navbar-collapse mgt-2"
                    >
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0"></ul>
                        <div class="d-flex align-items-center flex-column flex-lg-row gap-4">
                            <a
                                class="nav-link text-white fs-3 links"
                                href="/#home"
                            >
                                Home
                            </a>
                            <a
                                class="nav-link text-white fs-3 links"
                                href="/#home"
                            >
                                A plataforma
                            </a>
                            <a
                                class="nav-link text-white fs-3 links"
                                href="/#faq"
                            >
                                FAQ
                            </a>
                            <a
                                class="nav-link text-white fs-3 links"
                                href="/#planos"
                            >
                                Planos
                            </a>

                            <router-link
                                to="/login"
                                class="link"
                            >
                                <div class="bg-laranja full text-center button rounded">
                                    <span
                                        class="fs-3 text color-cinza text-white fw-bold text-uppercase"
                                    >
                                        Login
                                    </span>
                                </div>
                            </router-link>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
        <div
            class="container-fluid mt-5"
            style="padding-bottom: 50px"
        >
            <div class="col-md-10 bg-white p-4 rounded mt-5 m-auto">
                <h1 class="fw-bold text-center mb-5 fs-1">
                    {{ titulo }}
                </h1>

                <div class="form-control">{{ politica }}</div>
            </div>
        </div>
        <div class="container color-branco">
            <footer class="row py-5 my-5 border-top">
                <div class="col-md-3 col-12 mb-3">
                    <router-link
                        to="/"
                        class="d-flex align-items-center mb-4 link-dark text-decoration-none"
                    >
                        <img
                            src="../assets/img/inzap.png"
                            alt=""
                            width="142"
                        />
                    </router-link>
                </div>

                <div class="col-md-3 col-12 mb-3">
                    <h5 class="text-white fs-3 fw-bold">Informações</h5>
                    <ul class="nav flex-column">
                        <li class="nav-item mb-2">
                            <a
                                href="#home"
                                class="nav-link p-0 text-white"
                            >
                                Home
                            </a>
                        </li>
                        <li class="nav-item mb-2">
                            <a
                                href="#planos"
                                class="nav-link p-0 text-white"
                            >
                                Planos
                            </a>
                        </li>

                        <li class="nav-item mb-2">
                            <a
                                href="#planos"
                                class="nav-link p-0 text-white"
                            >
                                FAQ
                            </a>
                        </li>
                        <li class="nav-item mb-2">
                            <router-link
                                to="/politica_privacidade"
                                class="nav-link p-0 text-white"
                            >
                                Política de privacidade
                            </router-link>
                        </li>
                    </ul>
                </div>

                <div class="col-md-3 col-12 mb-3">
                    <h5 class="text-white fs-3 fw-bold">Contato</h5>
                    <ul class="nav flex-column">
                        <li class="nav-item mb-2">
                            <a
                                href="#"
                                class="nav-link p-0 text-white"
                            >
                                (65) 4141-0643
                            </a>
                        </li>
                        <li class="nav-item mb-2">
                            <a
                                href="#"
                                class="nav-link p-0 text-white"
                            >
                                atendimento@inzupt.com.br
                            </a>
                        </li>
                    </ul>
                </div>

                <div class="col-md-3 col-12 mb-4">
                    <div class="links">
                        <h5 class="text-white fs-3 fw-bold">Redes Sociais</h5>
                        <a
                            href="https://www.facebook.com/inzupt"
                            style="padding-left: 10px"
                        >
                            <img
                                src="../assets/img/homeFooter/facebook.png"
                                alt=""
                            />
                        </a>
                        <a
                            href="https://api.whatsapp.com/send/?phone=556541410643&text=Oi+acessei+o+site+https%3A%2F%2Finzupt.com.br+e+gostaria+de+mais+informa%C3%A7%C3%B5es&type=phone_number&app_absent=0"
                            style="padding-left: 10px"
                        >
                            <img
                                src="../assets/img/homeFooter/whatsapp.png"
                                alt=""
                            />
                        </a>
                        <a
                            href="https://www.instagram.com/inzupt/"
                            style="padding-left: 10px"
                        >
                            <img
                                src="../assets/img/homeFooter/instagram (1).png"
                                alt=""
                            />
                        </a>
                    </div>
                </div>
                <div class="col-md-12 mt-3">
                    <div class="text-center fs-3 text-white">Copyright@inzupt - 2022</div>
                </div>
            </footer>
        </div>
    </div>
</template>

<script>
import Api from '@/services/api'
export default {
    name: 'politicaPrivacidade',

    data() {
        return {
            situacao: false,
            value: 0,
            politica: '',
            titulo: '',
        }
    },

    created() {
        window.scrollTo(0, 0)
    },

    mounted() {
        this.politica_privacidade()
    },

    methods: {
        politica_privacidade() {
            Api.get('/politica_privacidade/ZmlsYWRlYXRlbmRpbWVudG8=', {})
                .then(response => {
                    const data = response.data
                    this.politica = data.politica.descricao
                    this.titulo = data.politica.titulo
                })
                .catch(error => {
                    console.error(error)
                })
        },

        responsivo() {
            const botao = document.querySelector('[aria-expanded]')
            const valor = botao.getAttribute('aria-expanded')

            this.situacao = valor === 'true' ? true : false
        },
    },
}
</script>

<style scoped>
.link {
    text-decoration: none;
}

.bg-nav {
    /* background-color: #0774ae !important; */
    background-image: linear-gradient(to right, #7ed0dd, #479fcf);
}

.navbar-transparent {
    background-color: transparent;
}
button {
    outline: 0;
    border: 0;
    background-color: transparent;
}

.navbar {
    box-shadow: none !important;
}

.button {
    padding: 15px 35px;
}
.navbar-toggler {
    border: 0 !important;
}

.menu_hamburguer {
    width: 40px;
    height: 30px;
    margin-right: 20px;
}
.menu_hamburguer div {
    background-color: #fff;
    height: 4px;
    width: 40px;
    margin: 5px auto;
    opacity: 1;
    transition-duration: 0.3s;
}

.menu_hamburguer.active .one {
    transform: rotate(45deg) translate(7px, 7px);
}

.menu_hamburguer.active .two {
    opacity: 0;
}

.menu_hamburguer.active .three {
    transform: rotate(-45deg) translate(5px, -7px);
}

.navbar {
    font-family: 'Fira Sans', sans-serif;
}

.bold {
    font-weight: bold;
}

.navbar-nav button {
    width: 100%;
}
.full {
    width: 100%;
}

@media (max-width: 995px) {
    .link {
        width: 100%;
    }
    .mgt-2 {
        padding-top: 30px;
    }
}

@media (max-width: 997px) {
    nav.navbar {
        background-image: linear-gradient(to right, #7ed0dd, #479fcf);
    }
}

@media (max-width: 400px) {
    .logo {
        width: 140px;
    }
}
</style>
