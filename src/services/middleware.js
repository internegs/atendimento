import Api from '@/services/api'
import router from '@/router'

export default {
    auth: function (to, from, next) {
        Api.post('/validate')
            .then(response => {
                const resp = response.data.auth
                if (resp) {
                    next()
                } else {
                    next({ name: 'home' })
                }
            })
            .catch(err => console.log(err))
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
                router.push({ name: 'login' })
            })
            .catch(() => {
                localStorage.clear()
                router.push({ name: 'login' })
            })
    },

    atendimento: function (to, from, next) {
        const tk = localStorage.getItem('@TOKEN')
        const tipo = +localStorage.getItem('@TIPO')

        if ((tk && tipo === 2) || tipo === 1) {
            next()
        } else {
            next({ name: 'login' })
        }
    },
}
