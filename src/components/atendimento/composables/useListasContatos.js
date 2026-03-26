import { ref, watch } from 'vue'
import Api from '@/services/api.js'
import { base64 } from '@/utils/base64.js'
import StorageUtil from '@/utils/StorageUtil.js'

export function useListasContatos({
    contatoSelecionado,
    conversaAberta,
    opcaoSelecionada,
}) {
    const listaContatos = ref({
        fila: [],
        meusAtendimentos: [],
        todos: [],
    })
    const listaContatosSelecionado = ref([])
    const listaContatosPesquisa = ref([])
    const listaContatosInterno = ref(null)
    const listaContatosLoading = ref(false)
    const fila_qtd = ref(0)
    const meusatendimentos_qtd = ref('')
    const qtdmensagensinternas = ref(0)
    const plano_id = ref(0)
    const pesquisa = ref('')

    async function chamarAtendimentosFila() {
        try {
            if (listaContatosInterno.value) {
                conversaAberta.value = false
            }

            listaContatosInterno.value = null
            pesquisa.value = ''

            const response = await Api.post('/fila_atendimento/ZmlsYWRlYXRlbmRpbWVudG8=', {
                id: StorageUtil.get('@USER_ID'),
                setor_id: StorageUtil.get('@SETOR_ID'),
            })

            const data = response.data

            plano_id.value = data?.plano ?? null
            fila_qtd.value = data?.fila?.length ?? 0
            listaContatos.value.fila = data?.fila ?? []
        } catch (error) {
            console.error(error)
        }
    }

    async function chamarMeusAtendimentos() {
        const fone = contatoSelecionado.value?.fone ?? null

        try {
            if (listaContatosInterno.value) {
                conversaAberta.value = false
            }

            listaContatosInterno.value = null
            pesquisa.value = ''

            const response = await Api.post('/meus_atendimentos/ZmlsYWRlYXRlbmRpbWVudG8=', {
                id: StorageUtil.get('@USER_ID'),
                setor_id: StorageUtil.get('@SETOR_ID'),
                fone: fone,
            })

            const data = response.data

            listaContatos.value.meusAtendimentos = data?.meusatendimentos ?? []
            meusatendimentos_qtd.value = data?.qtdmeus_atendimentos ?? ''
        } catch (error) {
            console.error(error)
        }
    }

    async function chamarTodosAtendimentos() {
        try {
            if (listaContatosInterno.value) {
                conversaAberta.value = false
            }

            listaContatosInterno.value = null
            pesquisa.value = ''

            const response = await Api.post(
                '/fila_atendimento_todas/ZmlsYWRlYXRlbmRpbWVudG8=?dXNlcl9pZA=MTEy',
                {
                    dXNlcl9pZA: base64.encode(StorageUtil.get('@USER_ID')),
                }
            )

            const data = response.data

            listaContatos.value.todos = data?.fila ?? []
        } catch (error) {
            console.error(error)
        }
    }

    function chamarMeusChatsInternos() {
        opcaoSelecionada.value = 'interno'
        pesquisa.value = ''
        conversaAberta.value = false

        Api.post('/meus_chat_interno/ZmlsYWRlYXRlbmRpbWVudG8=', {
            id: StorageUtil.get('@USER_ID'),
        })
            .then(response => {
                const data = response.data

                qtdmensagensinternas.value = data.lido
                listaContatosInterno.value = data.atendentes
            })
            .catch(error => {
                console.error(error)
            })
    }

    async function pesquisar() {
        listaContatosLoading.value = true

        if (pesquisa.value.length === 0) return

        try {
            const response = await Api.post(`/busca_contatos/ZmlsYWRlYXRlbmRpbWVudG8=`, {
                id: StorageUtil.get('@USER_ID'),
                busca: pesquisa.value,
            })

            listaContatosPesquisa.value = response.data.contatos.data
        } catch (error) {
            console.error(error)

            listaContatosLoading.value = false
        } finally {
            listaContatosLoading.value = false
        }
    }

    watch(
        opcaoSelecionada,
        newVal => {
            switch (newVal) {
                case 'meus_atendimentos':
                    listaContatosSelecionado.value = listaContatos.value.meusAtendimentos
                    break
                case 'fila':
                    listaContatosSelecionado.value = listaContatos.value.fila
                    break
                case 'todos':
                    listaContatosSelecionado.value = listaContatos.value.todos
                    break
                case 'interno':
                    chamarMeusChatsInternos()
                    break
                default:
                    console.warn('WATCH(opcaoSelecionada): Nenhuma das alternativas é válida.')
                    break
            }
        },
        { immediate: true }
    )

    watch(
        listaContatos,
        newVal => {
            switch (opcaoSelecionada.value) {
                case 'meus_atendimentos':
                    listaContatosSelecionado.value = newVal.meusAtendimentos
                    break
                case 'fila':
                    listaContatosSelecionado.value = newVal.fila
                    break
                case 'todos':
                    listaContatosSelecionado.value = newVal.todos
                    break
                case 'interno':
                    chamarMeusChatsInternos()
                    break
            }
        },
        { deep: true }
    )

    watch(pesquisa, newValue => {
        if (newValue.length === 0) {
            listaContatosPesquisa.value = []
        }
    })

    return {
        listaContatos,
        listaContatosSelecionado,
        listaContatosPesquisa,
        listaContatosInterno,
        listaContatosLoading,
        fila_qtd,
        meusatendimentos_qtd,
        qtdmensagensinternas,
        plano_id,
        pesquisa,
        chamarAtendimentosFila,
        chamarMeusAtendimentos,
        chamarTodosAtendimentos,
        chamarMeusChatsInternos,
        pesquisar,
    }
}
