import { createRouter, createWebHistory } from 'vue-router'
import login from '@/views/LoginPage.vue'
import atendimento from '@/views/atendimento.vue'
import admin from '@/views/admin.vue'
import Middleware from '@/services/middleware'

const routes = [
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
        path: '/atendimento',
        name: 'atendimento',
        component: atendimento,
        beforeEnter: Middleware.atendimento,
    },
    {
        path: '/forbidden',
        name: 'Forbidden',
        component: () => import('@/views/ErrorsPage.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/login',
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router
