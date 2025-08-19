import Api from '@/services/api'
import { localStorageDecode } from '@/utils/localStorageDecode'

export default {
    auth: function (to, from, next) {
        Api.post('/validate')
            .then((response) => {
                const resp = response.data.auth
                if (resp) {
                    next()
                } else {
                    next({ name: 'home' })
                }
            })
            .catch((err) => console.log(err))
    },

    admin: function (to, from, next) {
        const tk = localStorage.getItem('@TOKEN')
        const tipo = +localStorage.getItem('@TIPO')

        if (tk && tipo === 1) {
            next()
        } else {
            next({ name: 'login' })
        }
    },

    logout: function (to, from, next) {
        const objEnviaMensagem = {
            user_id: localStorage.getItem(`@USER_ID`),
        }

        Api.post('/logout/ZmlsYWRlYXRlbmRpbWVudG8=', objEnviaMensagem)
            .then(() => {
                localStorage.clear()
                window.location.replace('http://admin.localhost:8080')
            })
            .catch(() => {
                localStorage.clear()
                window.location.replace('http://admin.localhost:8080')
            })
    },

    atendimento: async (to, from, next) => {
        await localStorageDecode(to.params.token)

        const tk = localStorage.getItem('@TOKEN')
        const tipo = +localStorage.getItem('@TIPO')

        if ((tk && tipo === 2) || tipo === 1) {
            next()
        } else {
            next({ name: 'forbidden' })
        }
    },
}
