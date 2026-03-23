import { ref as firebaseRef, onValue } from 'firebase/database'

const BASE_PATH = 'aW56YXBicmFzaWx2dWU=/'

export function useAtendimentoFirebase({
    session,
    database,
    userId,
    audioStatus,
    onMensagens,
    onFila,
    onTransferencia,
    onChatInterno,
}) {
    const listenerActiveList = []

    function iniciarListenersFirebase() {
        const sessionVal = session.value

        // Listener: MENSAGENS
        const instanciaMensagens = BASE_PATH + sessionVal + '/MENSAGENS'
        const dbRefMensagens = firebaseRef(database, `/${instanciaMensagens}`)
        const unsubMensagens = onValue(dbRefMensagens, () => onMensagens())

        listenerActiveList.push(unsubMensagens)

        // Listener: FILA
        const instanciaFila = BASE_PATH + sessionVal + '/FILA'
        const dbRefFila = firebaseRef(database, `/${instanciaFila}`)
        const unsubFila = onValue(dbRefFila, data => {
            const values = data.val()

            if (audioStatus.value) {
                onFila(values?.fila ?? 0)
            } else {
                onFila(values?.fila ?? 0, false)
            }
        })

        listenerActiveList.push(unsubFila)

        // Listener: TRANSFERENCIA
        const id = userId()
        const instanciaTransferencia = BASE_PATH + sessionVal + '/TRANSFERENCIA/' + id
        const dbRefTransferencia = firebaseRef(database, `/${instanciaTransferencia}`)
        const unsubTransferencia = onValue(dbRefTransferencia, () => onTransferencia())

        listenerActiveList.push(unsubTransferencia)

        // Listener: CHAT_INTERNO
        const instanciaChatInterno = BASE_PATH + sessionVal + '/CHAT_INTERNO/' + id
        const dbRefChatInterno = firebaseRef(database, `/${instanciaChatInterno}`)
        const unsubChatInterno = onValue(dbRefChatInterno, () => onChatInterno())

        listenerActiveList.push(unsubChatInterno)
    }

    function pararListeners() {
        listenerActiveList.forEach(unsub => {
            if (typeof unsub === 'function') {
                unsub()
            }
        })

        listenerActiveList.length = 0
    }

    return {
        iniciarListenersFirebase,
        pararListeners,
    }
}
