import Api from '@/services/api'
import { localStorageDecode } from '@/utils/localStorageDecode'

const URL = 'http://admin.inzupt:8080'

export default {
    logout: function (to, from, next) {
        const objEnviaMensagem = {
            user_id: localStorage.getItem(`@USER_ID`),
        }

        Api.post('/logout/ZmlsYWRlYXRlbmRpbWVudG8=', objEnviaMensagem)
            .then(() => {
                localStorage.clear()
                window.location.replace(URL)
            })
            .catch(() => {
                localStorage.clear()
                window.location.replace(URL)
            })
    },

    atendimento: async (to, from, next) => {
        if (!to.params?.token || to.params?.token?.length < 10) {
            console.log(to.params.token)
            console.log(to.params.token.length)

            next({
                name: 'error',
                query: {
                    code: 403,
                    error: btoa('Acesso não autorizado'),
                },
            })

            return
        }

        await localStorageDecode(to.params.token)

        const tk = localStorage.getItem('@TOKEN')
        const tipo = +localStorage.getItem('@TIPO')

        if ((tk && tipo === 2) || tipo === 1) {
            next()
        } else {
            next({
                name: 'error',
                query: {
                    code: 403,
                    error: btoa('Acesso não autorizado'),
                },
            })
        }
    },
}
