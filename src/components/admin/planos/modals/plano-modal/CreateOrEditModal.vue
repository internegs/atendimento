<template>
    <Container>
        <div
            class="offcanvas offcanvas-end"
            style="width: 80%"
            tabindex="-1"
            id="add_plano"
            aria-labelledby="offcanvasRightLabel"
        >
            <div class="offcanvas-header">
                <button
                    type="button"
                    class="btn btn-danger ms-auto"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                >
                    Fechar
                </button>
            </div>
            <div class="offcanvas-body">
                <div class="container-fluid row">
                    <div class="col-md-12 text-center mb-3">
                        <h2
                            class="offcanvas-title fs-3"
                            id="offcanvasRightLabel"
                        >
                            <b>{{ hasPlano ? 'Editar' : 'Novo' }} Plano</b>
                        </h2>
                    </div>

                    <form
                        class="row container"
                        @submit.prevent="createOrEdit"
                    >
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
                                type="text"
                                id="nomeField"
                                class="form-control form-pad"
                                v-model="obj.nome"
                                required
                            />
                        </div>

                        <div class="col-md-4 form-group">
                            <label
                                for="resumoField"
                                class="col-form-label fs-3"
                            >
                                Resumo
                                <span
                                    v-if="!obj.resumo"
                                    class="text-danger"
                                >
                                    *
                                </span>
                            </label>

                            <div class="position-relative d-flex align-items-center">
                                <textarea
                                    type="text"
                                    id="resumoField"
                                    class="form-control form-pad"
                                    cols="5"
                                    rows="3"
                                    v-model="obj.resumo"
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <div class="col-md-4 form-group">
                            <label
                                for="conteudoField"
                                class="col-form-label fs-3"
                            >
                                Conteúdo
                                <span
                                    v-if="!obj.conteudo"
                                    class="text-danger"
                                >
                                    *
                                </span>
                            </label>

                            <textarea
                                type="text"
                                id="conteudoField"
                                class="form-control form-pad"
                                cols="5"
                                rows="3"
                                v-model="obj.conteudo"
                                required
                            ></textarea>
                        </div>

                        <div class="col-md-3 mt-3 form-group">
                            <label
                                for="valorField"
                                class="col-form-label fs-3"
                            >
                                Valor Inicial
                            </label>

                            <input
                                type="text"
                                id="valorField"
                                class="form-control form-pad"
                                placeholder="R$ 0,00"
                                v-model="obj.valor_inicial"
                                @input="handleMoneyInput($event)"
                            />
                        </div>

                        <div class="col-md-2 mt-3 form-group">
                            <label class="col-form-label fs-3 d-block">Destaque</label>

                            <div class="row-md-3 fs-4 form-check form-switch">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    :true-value="1"
                                    :false-value="0"
                                    id="destaqueField"
                                    v-model="obj.destaque"
                                />

                                <label
                                    class="form-check-label"
                                    for="destaqueField"
                                >
                                    {{ obj.destaque ? 'Ativo' : 'Inativo' }}
                                </label>
                            </div>
                        </div>

                        <div class="col-md-2 mt-3 d-flex align-items-end">
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
                    </form>
                </div>
            </div>
        </div>
    </Container>
</template>

<script>
import Container from '@/components/GLOBALS/container.vue'
import Api from '@/services/api'
import Swal from 'sweetalert2'

const CLIENTE_ID = btoa(localStorage.getItem('@USER_ID'))

export default {
    name: 'CreateOrEditModal',

    components: { Container },

    props: {
        plano: {
            type: Object,
        },
    },

    emits: ['handle-close-modal', 'refresh-planos'],

    data() {
        return {
            masks: {
                valor_inicial: '',
            },

            obj: {
                cliente_id: CLIENTE_ID,
                nome: '',
                resumo: '',
                conteudo: '',
                valor_inicial: '',
                destaque: 0,
            },

            loading: false,
            isDisabled: false,
            isDisabledCpf: false,
        }
    },

    computed: {
        hasPlano() {
            return this.plano && Object.keys(this.plano).length > 0
        },
    },

    watch: {
        plano: {
            handler(newValue) {
                this.fillForm(newValue)
            },

            deep: true,
        },
    },

    mounted() {
        const offcanvasElement = document.getElementById('add_plano')

        offcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
            this.resetForm()

            if (this.plano) {
                this.$emit('handle-close-modal')
            }
        })
    },

    beforeUnmount() {
        const offcanvasElement = document.getElementById('add_plano')

        if (offcanvasElement) {
            offcanvasElement.removeEventListener('hidden.bs.offcanvas', this.resetForm)
        }
    },

    methods: {
        async createOrEdit() {
            try {
                this.loading = true
                let confirmMsg

                if (!this.hasPlano) {
                    await Api.post('/plano_create', {
                        Y2xpZW50ZV9pZA: CLIENTE_ID,
                        bm9tZQ: btoa(this.obj.nome),
                        cmVzdW1v: btoa(this.obj.resumo),
                        Y29udGV1ZG8: btoa(this.obj.conteudo),
                        dmFsb3JfaW5pY2lhbA: btoa(this.unmaskMoney(this.obj.valor_inicial)),
                        ZGVzdGFxdWU: btoa(this.obj.destaque),
                    })

                    confirmMsg = 'Plano registrado com sucesso'
                } else {
                    await Api.post('/plano_edit', {
                        Y2xpZW50ZV9pZA: CLIENTE_ID,
                        bm9tZQ: btoa(this.obj.nome),
                        cmVzdW1v: btoa(this.obj.resumo),
                        Y29udGV1ZG8: btoa(this.obj.conteudo),
                        dmFsb3JfaW5pY2lhbA: btoa(this.unmaskMoney(this.obj.valor_inicial)),
                        ZGVzdGFxdWU: btoa(this.obj.destaque),
                        cGxhbm9faWQ: btoa(this.plano.id),
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
                }).then(() => this.$emit('refresh-planos'))
            } catch (error) {
                console.error(error)

                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Erro ao realizar a criação do plano.',

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

        resetForm() {
            this.obj = {
                cliente_id: CLIENTE_ID,
                nome: '',
                resumo: '',
                conteudo: '',
                valor_inicial: '',
                destaque: '',
            }
        },

        fillForm(obj) {
            this.obj = {
                nome: obj.nome || '',
                resumo: obj.resumo || '',
                conteudo: obj.conteudo || '',
                valor_inicial: obj.valor_inicial ? this.maskMoney(obj.valor_inicial) : '',
                destaque: obj.destaque || '',
            }
        },

        hideModal() {
            const modalElement = document.getElementById('add_plano')
            const modal = bootstrap.Offcanvas.getInstance(modalElement)

            modal.hide()
        },

        maskMoney(value) {
            if (!value) return ''

            let numero

            if (typeof value === 'number') {
                numero = String(value) * 100
            } else {
                numero = value.toString().replace(/\D/g, '')
            }

            if (!numero) return ''

            const valorEmReais = parseFloat(numero) / 100

            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(valorEmReais)
        },

        handleMoneyInput(event) {
            const formatted = this.maskMoney(event.target.value)

            this.obj.valor_inicial = formatted
        },

        unmaskMoney(value) {
            if (!value) return 0

            const numero = value
                .toString()
                .replace(/[^\d,]/g, '')
                .replace(',', '.')

            return parseFloat(numero) || 0
        },
    },
}
</script>
