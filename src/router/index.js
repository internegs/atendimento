import { createRouter, createWebHistory } from 'vue-router'
import index from '@/views/IndexPage.vue'
import login from '@/views/LoginPage.vue'
import atendimento from '@/views/atendimento.vue'
import register from '@/views/register.vue'
import admin from '@/views/admin.vue'
import politica_privacidade from '@/views/politicaPrivacidade.vue'
import Middleware from '@/services/middleware'

const routes = [
    {
        path: '/',
        name: 'index',
        component: index,
    },
    {
        path: '/login',
        name: 'login',
        component: login,
    },
    {
        path: '/admin',
        name: 'admin',
        component: admin,
        beforeEnter: Middleware.admin,
    },
    {
        path: '/politica_privacidade',
        name: 'politica_privacidade',
        component: politica_privacidade,
    },
    {
        path: '/register/:token',
        name: 'register',
        component: register,
    },
    {
        path: '/atendimento',
        name: 'atendimento',
        component: atendimento,
        beforeEnter: Middleware.atendimento,
    },
    {
        path: '/agendamentos/:token?',
        name: 'agendamentos',
        component: () => import('@/views/AgendamentoView.vue'),
    },
    {
        path: '/forbidden',
        name: 'Forbidden',
        component: () => import('@/views/ErrorsPage.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        component: index,
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router
