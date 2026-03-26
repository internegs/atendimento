import Api from '@/services/api.js'
import LINKS from '@/utils/links'
import { base64 } from '@/utils/base64.js'
import StorageUtil from '@/utils/StorageUtil.js'

export default {
    logout: function (to, from, next) {
        const objEnviaMensagem = {
            user_id: StorageUtil.get('@USER_ID'),
        }

        Api.post('/logout/ZmlsYWRlYXRlbmRpbWVudG8=', objEnviaMensagem)
            .then(() => {
                StorageUtil.clear()

                window.location.replace(LINKS.login)
            })
            .catch(() => {
                StorageUtil.clear()

                window.location.replace(LINKS.login)
            })
    },

    atendimento: async (to, _, next) => {
        if (!to.params?.token || to.params?.token?.length < 10) {
            next({
                name: 'error',
                query: {
                    code: 403,
                    error: base64.encode('Acesso não autorizado'),
                },
            })

            return
        }

        await StorageUtil.up(to.params.token)

        next()
    },
}
