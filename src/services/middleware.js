import Api from '@/services/api'
import LINKS from '@/utils/links'
import { localStorageDecode } from '@/utils/localStorageDecode'


export default {
    logout: function (to, from, next) {
        const objEnviaMensagem = {
            user_id: localStorage.getItem(`@USER_ID`),
        }

        Api.post('/logout/ZmlsYWRlYXRlbmRpbWVudG8=', objEnviaMensagem)
            .then(() => {
                localStorage.clear()
                window.location.replace(LINKS.login)
            })
            .catch(() => {
                localStorage.clear()
                window.location.replace(LINKS.login)
            })
    },

    atendimento: async (to, _, next) => {
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
