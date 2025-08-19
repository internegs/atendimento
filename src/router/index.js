import { createRouter, createWebHistory } from 'vue-router'
import atendimento from '@/views/atendimento.vue'
import Middleware from '@/services/middleware'

const routes = [
    {
        path: '/atendimento/:token?',
        name: 'atendimento',
        component: atendimento,
        beforeEnter: Middleware.atendimento,
    },
    {
        path: '/',
        name: 'error',
        component: () => import('@/views/ErrorsPage.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/error',
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router
