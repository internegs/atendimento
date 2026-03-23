import { ref } from 'vue'

export function useNotificacoesAtendimento() {
    const audioStatus = ref(false)
    const novaTransferenciaBanner = ref(false)
    const novaMensagemInternaBanner = ref(false)

    function inicializarAudioStatus() {
        audioStatus.value = localStorage.getItem('@STATUS_NOTIFICACAO') !== 'false'
    }

    function ativarNotificacao() {
        audioStatus.value = !audioStatus.value
        localStorage.setItem('@STATUS_NOTIFICACAO', audioStatus.value)
    }

    function tocarSom(somUrl) {
        if (somUrl) {
            new Audio(somUrl).play()
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
        inicializarAudioStatus,
        ativarNotificacao,
        tocarSom,
        recebeuNovaTransferencia,
        recebeumensageminterna,
    }
}
