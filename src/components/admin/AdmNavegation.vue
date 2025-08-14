<template>
    <nav class="navbar navbar-expand navbar-light navbar-bg">
        <button
            class="sidebar-toggle js-sidebar-toggle bg-transparent ms-2"
            @click="menu"
        >
            <i class="hamburger align-self-center"></i>
        </button>

        <div class="navbar-collapse collapse">
            <ul class="navbar-nav navbar-align">
                <li class="nav-item dropdown">
                    <a
                        class="nav-icon dropdown-toggle d-inline-block d-sm-none"
                        href="#"
                        data-bs-toggle="dropdown"
                    >
                        <i
                            class="align-middle"
                            data-feather="settings"
                        ></i>
                    </a>

                    <a
                        class="nav-link dropdown-toggle d-none d-sm-inline-block"
                        href="#"
                        data-bs-toggle="dropdown"
                    >
                        <span class="text-dark pe-1">{{ userName }}</span>
                    </a>
                    <div class="dropdown-menu dropdown-menu-end">
                        <a
                            class="dropdown-item"
                            href="#"
                            @click="change('ATUALIZARCADASTRO')"
                        >
                            <i
                                class="align-middle me-1"
                                data-feather="user"
                            ></i>
                            Atualizar cadastro
                        </a>
                        <div class="dropdown-divider"></div>

                        <a
                            class="dropdown-item"
                            href="#"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#abrirChamado"
                            @click="buscaChamados"
                        >
                            <i
                                class="align-middle me-1"
                                data-feather="help-circle"
                            ></i>
                            Abrir chamado
                        </a>
                        <div class="dropdown-divider"></div>
                        <a
                            class="dropdown-item"
                            @click="deslogar()"
                        >
                            Sair
                        </a>
                    </div>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
import middleware from '@/services/middleware'
export default {
    name: 'AdmNavegation',

    props: {
        change: {
            type: Function,
        },
        buscaChamados: {
            type: Function,
        },
    },

    emits: ['sidebar-toggle'],

    data() {
        return {
            userName: null,
        }
    },

    mounted() {
        this.userName = localStorage.getItem('@USER_NAME')
    },

    methods: {
        menu() {
            const el = document.querySelector('.sidebar')
            el.classList.toggle('collapsed')

            this.$emit('sidebar-toggle', el.classList.contains('collapsed'))
        },

        deslogar() {
            middleware.logout()
        },
    },
}
</script>
