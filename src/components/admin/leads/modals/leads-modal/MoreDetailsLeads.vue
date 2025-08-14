<template>
    <section
        id="more_details_leads"
        class="modal fade"
        tabindex="-1"
    >
        <div class="modal-dialog modal-fullscreen-lg-down modal-xl">
            <div class="modal-content">
                <header class="modal-header border-0">
                    <h1 class="modal-title fw-bold">Detalhes Leads</h1>

                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Fechar"
                    ></button>
                </header>

                <div class="modal-body d-grid gap-3">
                    <div class="border border-color rounded-3 shadow-sm">
                        <header>
                            <h2 class="fw-bold border-bottom border-color p-3">
                                Informações Pessoais
                            </h2>
                        </header>

                        <div class="row row-cols-1 row-cols-md-2 g-2 p-3">
                            <dl>
                                <dt>Nome</dt>
                                <dd>{{ leadData.nome ?? 'Não definido' }}</dd>
                            </dl>

                            <dl>
                                <dt>Cargo</dt>
                                <dd>{{ leadData.cargo ?? 'Não definido' }}</dd>
                            </dl>

                            <dl>
                                <dt>Contato</dt>
                                <dd>{{ maskNumber(leadData?.telefone) ?? 'Não definido' }}</dd>
                            </dl>
                        </div>
                    </div>

                    <div class="border border-color rounded-3 shadow-sm">
                        <header>
                            <h2 class="fw-bold border-bottom border-color p-3">
                                Informações de Negócio
                            </h2>
                        </header>

                        <div class="row row-cols-1 row-cols-md-2 g-2 p-3">
                            <dl>
                                <dt>Nome do Negócio</dt>
                                <dd>{{ leadData.nome_negocio ?? 'Não definido' }}</dd>
                            </dl>

                            <dl>
                                <dt>Tipo do Negócio</dt>
                                <dd>{{ leadData.tipo_negocio ?? 'Não definido' }}</dd>
                            </dl>

                            <dl>
                                <dt>Ramo do Negócio</dt>
                                <dd>{{ leadData.ramo_negocio ?? 'Não definido' }}</dd>
                            </dl>

                            <dl>
                                <dt>Contato</dt>
                                <dd>{{ maskNumber(leadData.telefone) ?? 'Não definido' }}</dd>
                            </dl>

                            <dl>
                                <dt>Site</dt>
                                <dd>{{ leadData.url ?? 'Não definido' }}</dd>
                            </dl>
                        </div>
                    </div>

                    <div class="border border-color rounded-3 shadow-sm">
                        <header>
                            <h2 class="fw-bold border-bottom border-color p-3">
                                Serviço e Agendamento
                            </h2>
                        </header>

                        <div class="row row-cols-1 row-cols-md-2 g-2 p-3">
                            <dl>
                                <dt>Serviço Solicitado</dt>
                                <dd>{{ leadData.servico_buscado ?? 'Não definido' }}</dd>
                            </dl>

                            <dl>
                                <dt>Plano Selecionado</dt>
                                <dd>{{ leadData.plano_selecionado ?? 'Não definido' }}</dd>
                            </dl>

                            <dl>
                                <dt>Agendado?</dt>
                                <dd>{{ maskIsScheduled(leadData?.agendado) ?? 'Não definido' }}</dd>
                            </dl>

                            <dl>
                                <dt>Data/Horário do Agendamento</dt>
                                <dd>
                                    {{
                                        maskDateHors(leadData.data_call, leadData.horario) ??
                                        'Não definido'
                                    }}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default {
    name: 'MoreDetailsLeads',

    props: {
        leads: {
            type: [Array, Object],
            required: true,
        },
    },

    emits: ['handle-close-modal'],

    data() {
        return {
            leadData: {},
        }
    },

    computed: {},

    watch: {
        leads: {
            handler(newValue) {
                this.leadData = newValue
            },
            immediate: true,
        },
    },

    updated() {
        const modalElement = document.getElementById('more_details_leads')

        modalElement.addEventListener('hidden.bs.modal', this.closeModal)
    },

    beforeUpdate() {
        const modalElement = document.getElementById('more_details_leads')

        if (modalElement) {
            modalElement.removeEventListener('hidden.bs.modal', this.closeModal)
        }
    },

    methods: {
        closeModal() {
            this.$emit('handle-close-modal')
        },

        maskNumber(value) {
            if (!value) return 'Não definido'

            const number = value.replace(/\D/g, '')

            if (number.length > 13) return value

            if (number.length <= 11) {
                return `(${number.slice(0, 2)}) ${number.slice(2, 3)} ${number.slice(3, 6)}-${number.slice(6)}`
            }

            return `+${number.slice(0, 2)} (${number.slice(2, 4)}) ${number.slice(4, 5)} ${number.slice(5, 9)}-${number.slice(9)}`
        },

        maskDateHors(date, hours) {
            if (!date) return 'Não definido'

            if (!hours) return 'Não definido'

            const dateConverted = format(new Date(`${date}T${hours}`), 'Pp', { locale: ptBR })

            return dateConverted
        },

        maskIsScheduled(value) {
            if (!value) return 'Não definido'

            return value ? 'Sim' : 'Não'
        },
    },
}
</script>

<style scoped>
h1 {
    font-size: 18px;
}

@media (min-width: 768px) {
    h1 {
        font-size: 16px;
    }
}

@media (min-width: 1400px) {
    h1 {
        font-size: 18px;
    }
}

h2 {
    font-size: 18px;
}

@media (min-width: 768px) {
    h2 {
        font-size: 16px;
    }
}

@media (min-width: 1400px) {
    h2 {
        font-size: 18px;
    }
}

.border-color {
    border-color: #f4f4f4 !important;
}

dt {
    font-size: 14px;
}

@media (min-width: 768px) {
    dt {
        font-size: 12px;
    }
}

@media (min-width: 1400px) {
    dt {
        font-size: 14px;
    }
}

dd {
    font-size: 16px;
}

@media (min-width: 768px) {
    dd {
        font-size: 14px;
    }
}

@media (min-width: 1400px) {
    dd {
        font-size: 16px;
    }
}
</style>
