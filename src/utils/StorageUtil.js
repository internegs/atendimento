import api from '@/services/api.js'
import { base64 } from '@/utils/base64.js'

export default class StorageUtil {
    static get(key) {
        try {
            const data = localStorage.getItem('data')

            if (!data) return null

            const obj = JSON.parse(base64.decode(data))

            return obj[key]
        } catch (error) {
            console.error('Erro ao decodificar localStorage:', error)
            return null
        }
    }

    static set(key, val) {
        try {
            const data = localStorage.getItem('data')

            if (!data) {
                console.error('Nenhum dado encontrado no localStorage')
                return
            }

            const obj = JSON.parse(base64.decode(data))
            obj[key] = val

            localStorage.setItem('data', base64.encode(JSON.stringify(obj)))
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error)
        }
    }

    static remove(key) {
        try {
            const data = localStorage.getItem('data')

            if (!data) return

            const obj = JSON.parse(base64.decode(data))
            delete obj[key]

            localStorage.setItem('data', base64.encode(JSON.stringify(obj)))
        } catch (error) {
            console.error('Erro ao remover do localStorage:', error)
        }
    }

    static getAll() {
        try {
            const data = localStorage.getItem('data')

            if (!data) return null

            return JSON.parse(base64.decode(data))
        } catch (error) {
            console.error('Erro ao obter todos os dados:', error)
            return null
        }
    }

    static clear() {
        localStorage.clear()
    }

    static async up(token) {
        const obj = JSON.parse(base64.decode(token))
        const tokenLS = localStorage.getItem('@TOKEN')

        if (tokenLS !== obj.token) {
            localStorage.setItem('@TOKEN', obj.token)

            const response = await api.post('/string_atendimento/ZmlsYWRlYXRlbmRpbWVudG8=', {
                dG9rZW4: obj.data,
            })

            localStorage.setItem('data', response.data.c3RyaW5n)
        }
    }
}
