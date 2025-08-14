import Axios from 'axios'

const api = Axios.create({
    baseURL: 'https://inzupt.com/api',
    timeout: 15000,
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

export default api
