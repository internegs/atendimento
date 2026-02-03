import Axios from 'axios'
import middleware from '@/services/middleware.js'

const api = Axios.create({
    baseURL: 'https://inzupt.com/api',
    timeout: 50000,
})

api.interceptors.request.use(
    config => {
        const token_acess = localStorage.getItem('@TOKEN')

        if (token_acess) {
            config.headers.Authorization = `Bearer ${token_acess}`
        }

        return config
    },
    error => {

        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    response => {
        return response
    },

    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    console.warn('Não autorizado - redirecionando para login')

                    middleware.logout()

                    break
            }
        } else if (error.request) {
            console.error('Sem resposta do servidor')
        } else {
            console.error('Error:', error.message)
        }
    }
)

export default api
