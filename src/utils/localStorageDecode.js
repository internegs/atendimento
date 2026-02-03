import api from '@/services/api/api.js'

export const localStorageDecode = async (token) => {
    try {
        const obj = JSON.parse(atob(token))

        localStorage.setItem('@TOKEN', obj.token)

        const response = await api.post('/string_atendimento/ZmlsYWRlYXRlbmRpbWVudG8=', {
            dG9rZW4: obj.data,
        })

        const storage = JSON.parse(atob(response.data.c3RyaW5n))

        Object.keys(storage).forEach((key) => {
            localStorage.setItem(key, storage[key])
        })
    } catch (error) {
        console.error(error)

        throw error
    }
}
