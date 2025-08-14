<template>
    <container>
        <form
            id="add_linhas"
            class="offcanvas offcanvas-end"
            tabindex="-1"
            aria-labelledby="offcanvasRightLabel"
            @submit.prevent="createOrEdit"
        >
            <div class="offcanvas-header">
                <h2
                    id="offcanvasRightLabel"
                    class="offcanvas-title fs-3"
                >
                    <b>{{ hasLinha ? 'Editar' : 'Nova' }} Linha</b>
                </h2>

                <button
                    type="button"
                    class="btn btn-danger w-auto"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                >
                    Fechar
                </button>
            </div>

            <div class="offcanvas-body">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-4 form-group">
                            <label
                                for="nomeField"
                                class="col-form-label fs-3"
                            >
                                Nome
                                <span
                                    v-if="!obj.nome"
                                    class="text-danger"
                                >
                                    *
                                </span>
                            </label>

                            <input
                                id="nomeField"
                                v-model="obj.nome"
                                type="text"
                                class="form-control form-pad"
                                required
                            />
                        </div>

                        <div class="col-md-4 form-group">
                            <label
                                for="nomeField"
                                class="col-form-label fs-3"
                            >
                                WhatsApp
                                <span
                                    v-if="!obj.whatsapp"
                                    class="text-danger"
                                >
                                    *
                                </span>
                            </label>

                            <input
                                id="nomeField"
                                v-model="obj.whatsapp"
                                v-mask="phoneMask"
                                type="text"
                                class="form-control form-pad"
                                required
                            />
                        </div>

                        <div class="col-md-4 form-group">
                            <label
                                for="nomeField"
                                class="col-form-label fs-3"
                            >
                                Session
                                <span
                                    v-if="!obj.session"
                                    class="text-danger"
                                >
                                    *
                                </span>
                            </label>

                            <input
                                id="nomeField"
                                v-model="obj.session"
                                type="text"
                                class="form-control form-pad"
                                required
                            />
                        </div>

                        <div class="col-md-4 mt-3 form-group">
                            <label
                                for="nomeField"
                                class="col-form-label fs-3"
                            >
                                Token de Acesso
                            </label>

                            <input
                                id="nomeField"
                                v-model="obj.tokenAcess"
                                type="text"
                                class="form-control form-pad"
                            />
                        </div>

                        <div class="col-md-4 mt-3 form-group">
                            <label
                                for="nomeField"
                                class="col-form-label fs-3"
                            >
                                API
                                <span
                                    v-if="!obj.api"
                                    class="text-danger"
                                >
                                    *
                                </span>
                            </label>

                            <input
                                id="nomeField"
                                v-model="obj.api"
                                type="text"
                                class="form-control form-pad"
                                required
                                @input="filterAPI($event)"
                            />
                        </div>

                        <div class="col-md-2 mt-3 form-group">
                            <label class="col-form-label fs-3">
                                Planos
                                <span
                                    v-if="!obj.plano_id"
                                    class="text-danger"
                                >
                                    *
                                </span>
                            </label>

                            <select
                                v-model="obj.plano_id"
                                class="form-select form-pad"
                                required
                            >
                                <option
                                    selected
                                    disabled
                                    :value="null"
                                >
                                    Selecione
                                </option>

                                <option
                                    v-for="(plano, i) in planos"
                                    :key="i"
                                    :value="plano.id"
                                >
                                    {{ plano.nome }}
                                </option>
                            </select>
                        </div>

                        <div
                            v-if="obj.plano_id"
                            class="col-md-2 mt-3 form-group"
                        >
                            <label class="col-form-label fs-3">Subplano</label>

                            <select
                                v-model="obj.subplano_id"
                                class="form-select form-pad"
                                required
                            >
                                <option
                                    selected
                                    disabled
                                    :value="null"
                                >
                                    Selecione
                                </option>

                                <option
                                    v-for="(subplano, i) in subplanoSelected"
                                    :key="i"
                                    :value="subplano.id"
                                >
                                    {{ subplano.nome }}
                                </option>
                            </select>
                        </div>

                        <div class="col-md-2 mt-3 form-group">
                            <label class="col-form-label fs-3">
                                Tipo de Chatbot
                                <span
                                    v-if="!obj.chatbotTipo"
                                    class="text-danger"
                                >
                                    *
                                </span>
                            </label>

                            <select
                                v-model="obj.chatbotTipo"
                                class="form-select form-pad"
                                required
                            >
                                <option
                                    selected
                                    disabled
                                    :value="null"
                                >
                                    Selecione
                                </option>

                                <option
                                    v-for="(tipo, i) in tipoChatbot"
                                    :key="i"
                                    :value="tipo"
                                >
                                    {{ tipo }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-2 mt-3 form-group">
                            <label class="col-form-label fs-3 d-block">Avisa</label>

                            <div class="row-md-3 fs-4 form-check form-switch">
                                <input
                                    id="avisa-field"
                                    v-model="obj.avisa"
                                    type="checkbox"
                                    class="form-check-input"
                                    :true-value="1"
                                    :false-value="0"
                                />

                                <label
                                    class="form-check-label"
                                    for="avisa-field"
                                >
                                    {{ obj.avisa ? 'Ativo' : 'Inativo' }}
                                </label>
                            </div>
                        </div>

                        <div class="col-md-2 mt-3 form-group">
                            <label class="col-form-label fs-3 d-block">Tem chatbot?</label>

                            <div class="row-md-3 fs-4 form-check form-switch">
                                <input
                                    id="chatbot-field"
                                    v-model="obj.hasChatbot"
                                    type="checkbox"
                                    class="form-check-input"
                                    :true-value="1"
                                    :false-value="0"
                                />

                                <label
                                    class="form-check-label"
                                    for="chatbot-field"
                                >
                                    {{ obj.hasChatbot ? 'Sim' : 'Não' }}
                                </label>
                            </div>
                        </div>

                        <div class="col-md-2 mt-3 form-group">
                            <label class="col-form-label fs-3 d-block">Mudar Nome</label>

                            <div class="row-md-3 fs-4 form-check form-switch">
                                <input
                                    id="mudar-nome-field"
                                    v-model="obj.mudarNome"
                                    type="checkbox"
                                    class="form-check-input"
                                    :true-value="1"
                                    :false-value="0"
                                />

                                <label
                                    class="form-check-label"
                                    for="mudar-nome-field"
                                >
                                    {{ obj.mudarNome ? 'Ativo' : 'Inativo' }}
                                </label>
                            </div>
                        </div>

                        <div class="col-md-2 mt-3 form-group">
                            <label class="col-form-label fs-3 d-block">Por Setor</label>

                            <div class="row-md-3 fs-4 form-check form-switch">
                                <input
                                    id="setor-field"
                                    v-model="obj.porSetor"
                                    type="checkbox"
                                    class="form-check-input"
                                    :true-value="1"
                                    :false-value="0"
                                />

                                <label
                                    class="form-check-label"
                                    for="setor-field"
                                >
                                    {{ obj.porSetor ? 'Ativo' : 'Inativo' }}
                                </label>
                            </div>
                        </div>

                        <div class="col-md-2 mt-3 form-group">
                            <label class="col-form-label fs-3 d-block">Ativo</label>

                            <div class="row-md-3 fs-4 form-check form-switch">
                                <input
                                    id="ativo-field"
                                    v-model="obj.ativo"
                                    type="checkbox"
                                    class="form-check-input"
                                    :true-value="1"
                                    :false-value="0"
                                />

                                <label
                                    class="form-check-label"
                                    for="ativo-field"
                                >
                                    {{ obj.ativo ? 'Sim' : 'Não' }}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="offcanvas-footer border-top p-3">
                <div class="d-flex justify-content-end">
                    <button
                        type="submit"
                        class="btn btn-primary form-pad fw-bold"
                    >
                        <span v-if="!loading">SALVAR</span>
                        <div
                            v-else
                            class="spinner-border spinner-border-sm"
                            role="status"
                        ></div>
                    </button>
                </div>
            </div>
        </form>
    </container>
</template>

<script>
import Container from '@/components/GLOBALS/container.vue'
import Api from '@/services/api'
import Swal from 'sweetalert2'

export default {
    name: 'CreateOrEditModal',

    components: { Container },

    props: {
        linha: {
            type: Object,
        },

        planos: {
            type: [Array, Object],
            required: true,
        },

        subplanos: {
            type: [Array, Object],
            required: true,
        },
    },

    emits: ['handle-close-modal', 'refresh-linhas'],

    data() {
        return {
            obj: {
                cliente_id: localStorage.getItem('@USER_ID'),
                nome: '',
                whatsapp: '',
                session: '',
                tokenAcess: null,
                api: '',
                plano_id: null,
                subplano_id: null,
                chatbotTipo: null,
                avisa: 0,
                hasChatbot: 0,
                mudarNome: 0,
                porSetor: 0,
                ativo: 0,
            },

            subplanoSelected: [],

            loading: false,
            isDisabled: false,
        }
    },

    computed: {
        hasLinha() {
            return this.linha && Object.keys(this.linha).length > 0
        },

        tipoChatbot() {
            const numbers = []

            for (let i = 1; i <= 10; i++) {
                numbers.push(i)
            }

            return numbers
        },

        phoneMask() {
            if (!this.hasLinha) {
                return '(##) # ####-####'
            }

            return '+## (##) # ####-####'
        },
    },

    watch: {
        linha: {
            handler(newValue) {
                this.fillForm(newValue)
            },

            deep: true,
        },

        'obj.plano_id': {
            handler(newValue) {
                this.getSubplanosByPlano(newValue)
            },
        },
    },

    mounted() {
        const offcanvasElement = document.getElementById('add_linhas')

        offcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
            this.resetForm()

            if (this.linha) {
                this.$emit('handle-close-modal')
            }
        })
    },

    beforeUnmount() {
        const offcanvasElement = document.getElementById('add_linhas')

        if (offcanvasElement) {
            offcanvasElement.removeEventListener('hidden.bs.offcanvas', this.resetForm)
        }
    },

    methods: {
        async createOrEdit() {
            try {
                this.loading = true
                let confirmMsg

                if (!this.hasLinha) {
                    await Api.post('/configuracao_create', {
                        Y2xpZW50ZV9pZA: btoa(this.obj.cliente_id),
                        YXZpc2E: btoa(this.obj.avisa),
                        YXBp: btoa(this.obj.api),
                        dGlwb19jaGF0Ym8: btoa(this.obj.chatbotTipo),
                        dGVtX2NoYXRib3Q: btoa(this.obj.hasChatbot),
                        bXVkYV9ub21l: btoa(this.obj.mudarNome),
                        cG9yX3NldG9y: btoa(this.obj.porSetor),
                        c3VicGxhbm9faWQ: btoa(this.obj.subplano_id),
                        cGxhbm9faWQ: btoa(this.obj.plano_id),
                        bm9tZQ: btoa(this.obj.nome),
                        YXRpdm8: btoa(this.obj.ativo),
                        bnVtYmVy: btoa(this.obj.whatsapp),
                        c2Vzc2lvbg: btoa(this.obj.session),
                        dG9rZW5fYWNlc3M: btoa(this.obj.tokenAcess),
                    })

                    confirmMsg = 'Linha registrada com sucesso'
                } else {
                    await Api.post('/config_edit', {
                        Y2xpZW50ZV9pZA: this.obj?.cliente_id ? btoa(this.obj.cliente_id) : null,
                        Y29uZmlnX2RlbGV0ZQ: this.linha?.id ? btoa(this.linha.id) : null,
                        YXZpc2E: this.obj?.avisa ? btoa(this.obj.avisa) : null,
                        YXBp: this.obj?.api ? btoa(this.obj.api) : null,
                        dGlwb19jaGF0Ym8: this.obj?.chatbotTipo ? btoa(this.obj.chatbotTipo) : null,
                        dGVtX2NoYXRib3Q: this.obj?.hasChatbot ? btoa(this.obj.hasChatbot) : null,
                        bXVkYV9ub21l: this.obj?.mudarNome ? btoa(this.obj.mudarNome) : null,
                        cG9yX3NldG9y: this.obj?.porSetor ? btoa(this.obj.porSetor) : null,
                        c3VicGxhbm9faWQ: this.obj?.subplano_id ? btoa(this.obj.subplano_id) : null,
                        cGxhbm9faWQ: this.obj?.plano_id ? btoa(this.obj.plano_id) : null,
                        bm9tZQ: this.obj?.nome ? btoa(this.obj.nome) : null,
                        YXRpdm8: this.obj?.ativo ? btoa(this.obj.ativo) : null,
                        bnVtYmVy: this.obj?.whatsapp ? btoa(this.obj.whatsapp) : null,
                        c2Vzc2lvbg: this.obj?.session ? btoa(this.obj.session) : null,
                        dG9rZW5fYWNlc3M: this.obj?.tokenAcess ? btoa(this.obj.tokenAcess) : null,
                    })

                    confirmMsg = 'Dados atualizados com sucesso'
                }

                this.hideModal()

                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: confirmMsg,
                    showConfirmButton: false,
                    timer: 2000,
                }).then(() => this.$emit('refresh-linhas'))
            } catch (error) {
                if (error?.response?.data?.message) {
                    console.error(error.response.data.message)
                } else {
                    console.error(error)
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Erro ao realizar o registro da linha.',

                    didOpen: () => {
                        const confirmBtn = Swal.getConfirmButton()
                        const actionsContainer = confirmBtn.parentElement

                        actionsContainer.style.width = '100%'
                        actionsContainer.style.display = 'flex'
                        actionsContainer.style.justifyContent = 'center'

                        confirmBtn.style.width = '90%'
                    },
                })

                this.loading = false
            } finally {
                this.loading = false
            }
        },

        activeLoading() {
            this.loading = true
            this.isDisabled = true
        },

        disabledLoading() {
            this.loading = false
            this.isDisabled = false
        },

        resetForm() {
            this.obj = {
                cliente_id: localStorage.getItem('@USER_ID'),
                nome: '',
                whatsapp: '',
                session: '',
                tokenAcess: '',
                api: '',
                plano_id: null,
                subplano_id: null,
                chatbotTipo: null,
                avisa: 0,
                hasChatbot: 0,
                mudarNome: 0,
                porSetor: 0,
                ativo: 0,
            }
        },

        fillForm(obj) {
            this.obj = {
                cliente_id: localStorage.getItem('@USER_ID'),
                nome: obj.nome || '',
                plano_id: obj.plano_id || null,
                subplano_id: obj.subplano_id || null,
                session: obj.session || '',
                whatsapp: obj.number || '',
                api: obj.api || '',
                chatbotTipo: obj.chatbot || null,
                avisa: obj.avisa || 0,
                hasChatbot: obj.chatbot || 0,
                mudarNome: obj.muda_nome || 0,
                porSetor: obj.por_setor || 0,
                ativo: obj.ativo || 0,
            }
        },

        hideModal() {
            const modalElement = document.getElementById('add_linhas')
            const modal = bootstrap.Offcanvas.getInstance(modalElement)

            modal.hide()
        },

        getSubplanosByPlano(id) {
            this.subplanoSelected = this.subplanos.filter(subplano => subplano.plano_id === id)
        },

        filterNumber(value) {
            return value.replace(/\D/g, '')
        },

        filterAPI(event) {
            this.obj.api = this.filterNumber(event.target.value)
        },
    },
}
</script>

<style scoped>
.offcanvas {
    width: 80%;
}

@media (max-width: 1030px) {
    .offcanvas {
        width: 100%;
    }
}
</style>
