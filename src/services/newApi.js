import Axios from 'axios'
import { base64 } from '@/utils/base64.js'
import StorageUtil from '@/utils/StorageUtil.js'

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

export async function conversaList(data) {
    const dataEncripted = base64.encode(JSON.stringify(data))

    const response = await API.post('/conversas_bd/ZmlsYWRlYXRlbmRpbWVudG8=', dataEncripted)

    return JSON.parse(base64.decode(response.data))
}

export async function sincronizar(data) {
    const dataEncripted = base64.encode(JSON.stringify(data))

    const response = await API.post('/atendimento/sync/ZmlsYWRlYXRlbmRpbWVudG8=', dataEncripted)

    // return JSON.parse(atob(response.data))

    return response.data
}