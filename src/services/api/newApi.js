import Axios from 'axios'

const API = Axios.create({
    baseURL: 'https://inzupt.com.br/api/api',
    timeout: 50000,
})

API.interceptors.request.use(
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

export function enviaMidia(data) {
    const binaryData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
        binaryData.append(key, value)
    })

    return API.post('/atendimento/envia_midia', binaryData)
}
