import { ref, reactive, markRaw } from 'vue'
import IDBService from '@/services/IDBService.js'
import { sincronizar } from '@/services/newApi.js'
import { base64 } from '@/utils/base64.js'

export function useAtendimentoIDB({
    userId,
    contatoSelecionado,
    conversaAberta,
    onConversaAtualizada,
    onSincronizacaoConcluida,
}) {
    const idbConn = ref(null)
    const qtdTotal = reactive({ conversas: 0 })
    const processadosNestaSessao = ref(0)
    const loadingPage = ref(true)
    const qtdNovaMensagem = ref({})

    async function initIdbConn() {
        const instance = new IDBService('inzupt_chat')
        await instance.conn()
        idbConn.value = markRaw(instance)

        await idbConn.value.createStore('sync', 'id')
        await idbConn.value.createStore('conversas', 'id')

        await idbConn.value.createIndex('conversas', 'message_id')
        await idbConn.value.createIndex('conversas', 'fone_enviado')
        await idbConn.value.createIndex('conversas', 'fone_destino')
        await idbConn.value.createIndex('conversas', 'status')
        await idbConn.value.createIndex('conversas', 'updated_at')
        await idbConn.value.createIndex('conversas', 'type')
        await idbConn.value.createIndex('conversas', 'contactName')
        await idbConn.value.createIndex('conversas', 'wook')
    }

    async function useIndexedDb() {
        try {
            if (!idbConn.value) {
                await initIdbConn()
            }

            await sincronizarConversas()
        } catch (error) {
            console.error(error)
        }
    }

    async function sincronizarConversas() {
        const sync = (await idbConn.value?.getAll('sync'))?.at(-1) ?? null
        const syncId = sync?.id ?? null
        let lastSyncTimestamp = sync?.last_sync_timestamp ?? null

        if (syncId && syncId !== userId()) {
            await idbConn.value.deleteDb()
            idbConn.value = null
            await initIdbConn()

            lastSyncTimestamp = null
        }

        let hasRequest = true
        let cursorConversas = null
        let isFirstBatch = true
        const isInitialSync = !lastSyncTimestamp
        let contatos

        const limiter = {
            limit: 100,
            indexList: ['conversas_fone_enviado_idx', 'conversas_fone_destino_idx'],
            keyValue: ['fone_enviado', 'fone_destino'],
            blackList: [base64.encode('782833411572320')],
        }

        processadosNestaSessao.value = 0

        while (hasRequest) {
            const response = await sincronizar({
                atendente_id: userId(),
                last_sync_timestamp: lastSyncTimestamp,
                cursor_conversas: cursorConversas,
            })

            if (isFirstBatch) {
                qtdTotal.conversas = response?.meta_data?.qtd ?? 0
                qtdNovaMensagem.value = response?.meta_data?.novas ?? {}
                isFirstBatch = false
            }

            const loteConversas = response?.conversas?.data ?? []

            contatos = loteConversas.flatMap(conversa => [
                conversa.fone_enviado,
                conversa.fone_destino,
            ])

            if (loteConversas.length > 0) {
                await idbConn.value.bulkPut(
                    'conversas',
                    response?.conversas?.data,
                    isInitialSync ? {} : limiter
                )
            }

            if (loadingPage.value) {
                processadosNestaSessao.value += loteConversas.length
            }

            cursorConversas = response?.conversas?.next_cursor ?? null

            if (!cursorConversas) {
                lastSyncTimestamp = response?.conversas.data?.at(-1)?.updated_at ?? null

                hasRequest = false
            }
        }

        if (lastSyncTimestamp) {
            await idbConn.value.put('sync', {
                id: userId(),
                last_sync_timestamp: lastSyncTimestamp,
            })
        }

        const fone = contatoSelecionado.value?.fone ?? null
        const hasContato = [...new Set(contatos)]?.includes(base64.encode(fone))

        if (conversaAberta.value && hasContato) {

            await carregarMensagens(contatoSelecionado.value)
        }

        if (loadingPage.value) {
            processadosNestaSessao.value = qtdTotal.conversas

            onSincronizacaoConcluida()
        }
    }

    async function carregarMensagens(contato) {
        if (!contato?.fone) {
            throw new Error('carregarMensagens(): O telefone do contato nao esta presente.')
        }

        const conversasEnviadas = await idbConn.value.getAll('conversas', {
            name: 'conversas_fone_enviado_idx',
            value: base64.encode(contato.fone),
        })

        const conversasDestino = await idbConn.value.getAll('conversas', {
            name: 'conversas_fone_destino_idx',
            value: base64.encode(contato.fone),
        })

        const todasConversas = [...conversasEnviadas, ...conversasDestino]
        const conversasReordenadas = todasConversas.sort((a, b) => a.id - b.id)
        const data = decodeList(conversasReordenadas ?? [], ['id', 'updated_at'])

        const qtd = data.length
        let msgs, meta

        if (data && data.length > 0) {
            meta = { qtd, status: true, fone: contato.fone, id: contato.id, ativo: true }
            msgs = data
        } else {
            meta = { qtd: 0, status: false, fone: contato.fone, id: contato.id, ativo: true }
            msgs = 'Não há conversas para este contato.'
        }

        onConversaAtualizada(msgs, meta)
    }

    function decodeList(list, ignoredKeys = []) {
        if (!Array.isArray(list)) return []
        if (list.length === 0) return []

        return list.map(obj => {
            return Object.fromEntries(
                Object.entries(obj).map(([key, val]) => {
                    if (ignoredKeys.includes(key)) return [key, val]
                    return [key, val ? base64.decode(val) : null]
                })
            )
        })
    }

    function fecharIdb() {
        idbConn.value?.close()
    }

    async function deletarIdb() {
        await idbConn.value?.deleteDb()
    }

    return {
        idbConn,
        qtdTotal,
        processadosNestaSessao,
        loadingPage,
        qtdNovaMensagem,
        useIndexedDb,
        carregarMensagens,
        fecharIdb,
        deletarIdb,
    }
}
