import { ref } from 'vue'
import StorageUtil from '@/utils/StorageUtil.js'

export function useNotificacoesAtendimento() {
    const audioStatus = ref(StorageUtil.get('@STATUS_NOTIFICACAO') === 'true')
    const novaTransferenciaBanner = ref(false)
    const novaMensagemInternaBanner = ref(false)

    function handleBtnNotification() {
        const newStatus = !audioStatus.value

        StorageUtil.set('@STATUS_NOTIFICACAO', String(newStatus))
        audioStatus.value = newStatus
    }

    function tocarSom(somUrl) {
        if (audioStatus.value && somUrl) {
            new Audio(somUrl).play().catch(() => {})
        }
    }

    function recebeuNovaTransferencia() {
        novaTransferenciaBanner.value = true

        setTimeout(() => {
            novaTransferenciaBanner.value = false
        }, 1000)
    }

    function recebeumensageminterna() {
        novaMensagemInternaBanner.value = true

        setTimeout(() => {
            novaMensagemInternaBanner.value = false
        }, 1000)
    }

    return {
        audioStatus,
        novaTransferenciaBanner,
        novaMensagemInternaBanner,
        handleBtnNotification,
        tocarSom,
        recebeuNovaTransferencia,
        recebeumensageminterna,
    }
}
