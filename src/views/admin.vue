<template>
    <div class="wrapper">
        <adm-menu
            :option="options"
            :change="setSelect"
        />

        <div
            class="main"
            :class="{ 'sidebar-collapsed': sidebarCollapsed }"
        >
            <adm-navegation
                :change="setSelect"
                :busca-chamados="buscarDadosChamados"
                @sidebar-toggle="handleSidebarToggle"
            />

            <div class="container-fluid p-0 h-100 bg-cinza">
                <!--RENDERIZA O MENU SELECIONADA-->
                <component
                    :is="selected"
                    :key="componentKey"
                ></component>

                <!--OFFSET QUE PROVENIENTE DO DROPDOWN DO PERFIL-->
                <ABRIRCHAMADO :chamados="chamados" />
                <ADDCHAMADO />
            </div>

            <footer class="footer">
                <div class="container-fluid">
                    <div class="row text-muted">
                        <div class="col-6 text-start">
                            <p class="mb-0">
                                <a class="text-muted"><strong>INZUPT</strong></a>
                                &copy;
                            </p>
                        </div>
                        <div class="col-6 text-end">
                            <ul class="list-inline">
                                <li class="list-inline-item">
                                    <router-link
                                        class="text-muted"
                                        target="_blank"
                                        to="/politica_privacidade"
                                    >
                                        Política de privacidade
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    </div>
</template>

<script>
import AdmMenu from '../components/admin/AdmMenu.vue'
import AdmNavegation from '../components/admin/AdmNavegation.vue'
import DASHBOARD from '@/components/admin/homeAdm.vue'
import FINANCEIRO from '@/components/admin/pagamentoAdm.vue'
import CANAIS from '@/components/admin/canaisAdm.vue'
import ATENDENTES from '@/components/admin/usuariosAdm.vue'
import SETOR from '@/components/admin/setorAdm.vue'
import CONTATOS from '@/components/admin/contatosAdm.vue'
import SEGMENTOS from '@/components/admin/gruposAdm.vue'
import CONSULTAS from '@/components/admin/ConsultasPaciente.vue'

import ENVIAMENSAGEM from '@/components/admin/campanhaAdm.vue'
import MIDIAS from '@/components/admin/midiasAdm.vue'
import ENVIOS from '@/components/admin/estatisticaCampanha.vue'
import CHATBOT from '@/components/admin/ChatBoot.vue'

import CONSULTADOUTOR from '@/components/admin/ConsultasDoutor.vue'
import REGISTRO from '@/components/admin/RegistrosConsulta.vue'

import ATUALIZARCADASTRO from '@/components/admin/AtualizarCadastro.vue'
import ABRIRCHAMADO from '@/components/admin/AbrirChamado.vue'
import ADDCHAMADO from '@/components/admin/acao/ADDCHAMADO.vue'

import PLANOSAUDE from '@/components/admin/clinicas/PlanoSaude.vue'
import HORARIOS_AGENDA from '@/components/admin/clinicas/HorariosMedicos.vue'
import CLIENTES from '@/components/admin/clinicas/PacientesComponent.vue'
import AGENDAMENTOS from '@/views/AgendamentoView.vue'

import PLANOS from '@/components/admin/planos/PlanoComponent.vue'
import SUBPLANOS from '@/components/admin/planos/SubplanoComponent.vue'
import LINHAS from '@/components/admin/linhas/LinhasComponent.vue'
import MENU from '@/components/admin/menu/MenuComponent.vue'

import LEADS from '@/components/admin/leads/LeadsComponent.vue'
import LEADS_MONITOR from '@/components/admin/leads-monitor/LeadsMonitorComponent.vue'

import Api from '@/services/api'

export default {
    name: 'adm',

    components: {
        AdmMenu,
        AdmNavegation,
        DASHBOARD,
        CANAIS,
        ENVIAMENSAGEM,
        ENVIOS,
        ATENDENTES,
        SETOR,
        CONTATOS,
        FINANCEIRO,
        SEGMENTOS,
        CONSULTAS,
        MIDIAS,
        CHATBOT,
        ATUALIZARCADASTRO,
        ABRIRCHAMADO,
        ADDCHAMADO,

        CONSULTADOUTOR,
        REGISTRO,

        CLIENTES,
        PLANOSAUDE,
        HORARIOS_AGENDA,
        AGENDAMENTOS,

        PLANOS,
        SUBPLANOS,
        LINHAS,
        MENU,

        LEADS,
        LEADS_MONITOR,
    },

    data() {
        return {
            titleMenu: 'ADMIN',
            dadosHome: null,
            selected: localStorage.getItem('@USER_PAGE'),
            chamados: [],
            options: [],
            componentKey: 0,
            sidebarCollapsed: false,
        }
    },

    mounted() {
        this.$validateTokenPage.start(this.$router)

        this.getMenus()
    },

    beforeUnmount() {
        this.$validateTokenPage.stop()
    },

    methods: {
        buscarDadosChamados() {
            Api.post('/chamados/ZmlsYWRlYXRlbmRpbWVudG8=', {
                id: localStorage.getItem('@USER_ID'),
            })
                .then(success => {
                    let data = success.data
                    this.chamados = data.chamados
                })
                .catch(error => {
                    console.error(error)
                })
        },

        buscarDadosGraficos() {
            Api.post('/grafico/ZmlsYWRlYXRlbmRpbWVudG8=', {
                id: localStorage.getItem('@USER_ID'),
            })
                .then(success => {
                    let dados = success.data
                    this.dadosHome = dados
                })
                .catch(error => {
                    console.error(error)
                })
        },

        async getMenus() {
            Api.post('/admin_menu', {
                id: localStorage.getItem('@USER_ID'),
            })
                .then(response => {
                    this.options = response.data.menu.map(menu => {
                        let menuObj = { ...menu }

                        if (menu.submenus === '0') {
                            menuObj.submenus = null
                        } else {
                            if (menu?.submenus) {
                                menuObj.submenus = JSON.parse(menu.submenus)
                            } else {
                                throw new Error('Formato inválido para conversão JSON')
                            }
                        }

                        return menuObj
                    })
                })
                .catch(error => {
                    console.error(error)
                })
        },

        setSelect(name) {
            if (name === 'null' || name === 'undefined') return

            this.selected = name

            this.componentKey++ // CONTROLA A RE-RENDERIZAÇÃO DO CONTEÚDO DA PG

            localStorage.setItem('@USER_PAGE', name)
        },

        handleSidebarToggle(collapsed) {
            this.sidebarCollapsed = collapsed
        },
    },
}
</script>

<style scoped>
.bg-transparent {
    background-color: transparent;
}

.bg-cinza {
    background-color: #e3eaef !important;
}

.main {
    width: 100vw;
    transition: all 0.35s ease-in-out;
}

.main.sidebar-collapsed {
    width: calc(100vw - 250px) !important;
    margin-left: 0 !important;
}

@media (min-width: 768px) {
    .main {
        width: calc(100vw - 250px);
        margin-left: 260px;
    }

    .main.sidebar-collapsed {
        width: 100vw !important;
        margin-left: 0 !important;
    }
}
</style>
