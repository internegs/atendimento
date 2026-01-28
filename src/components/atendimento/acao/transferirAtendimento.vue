<template>
    <container>
        <!-- Modal -->
        <div
            id="transfereAtendimento"
            class="modal fade"
            tabindex="-1"
            aria-labelledby="transfereAtendimento"
            aria-hidden="true"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1
                            id="exampleModalLabel"
                            class="modal-title fs-5"
                        >
                            Tansferir Atendimento
                        </h1>
                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>

                    <div class="modal-body">
                        <form
                            action=""
                            class="row"
                        >
                            <div class="form-group col-md-12">
                                <select
                                    v-model="atendenteSelecionado"
                                    class="form-select"
                                >
                                    <option
                                        value=""
                                        selected
                                        disabled
                                    >
                                        Selecione um atendente
                                    </option>

                                    <option
                                        v-for="(atendente, index) in atendentesDisponiveis"
                                        :key="index"
                                        :value="atendente.id"
                                    >
                                        {{ atendente.name }} -
                                        <span
                                            v-if="atendente.online == 0"
                                            class="badge bg-primary rounded-pill"
                                        >
                                            Off
                                        </span>
                                        <span
                                            v-if="atendente.online == 1"
                                            class="badge bg-warning rounded-pill"
                                        >
                                            On
                                        </span>
                                    </option>
                                </select>
                            </div>
                        </form>
                    </div>

                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-primary"
                            @click="transfereAtendimento"
                        >
                            <span v-if="!btnLoading">Transferir</span>

                            <div
                                v-else
                                class="spinner-border spinner-border-sm"
                                role="status"
                            >
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </container>
</template>

<script>
import Container from '@/components/GLOBALS/container.vue'
import Api from '@/services/api'
import Swal from 'sweetalert2'

export default {
    name: 'transfereAtendimento',

    components: { Container },

    props: {
        id_atendimento: {
            type: Number,
        },
        chamarDados: {
            type: Function,
        },
        atualizaMeusAtendimentos: {
            type: Function,
        },
        
        Chamafirebase: {
            type: Function,
        },
        fecharTelaDeConversa: {
            type: Function,
        },
    },

    data() {
        return {
            atendentesDisponiveis: [],
            atendenteSelecionado: '',
            btnLoading: false,
        }
    },

    mounted() {
        this.chamarAtendentesDisponiveis()
    },

    methods: {
        chamarAtendentesDisponiveis() {
            Api.post('/atendentes_online/ZmlsYWRlYXRlbmRpbWVudG8=', {
                id: localStorage.getItem('@USER_ID'),
            })
                .then(response => {
                    this.atendentesDisponiveis = response.data.atendentes
                })
                .catch(error => {
                    console.error(error)
                })
        },

        transfereAtendimento() {
            try {
                const objTransfere = {
                    id: localStorage.getItem('@USER_ID'),
                    atendente_id_transfere: this.atendenteSelecionado,
                    id_atendimento: this.id_atendimento,
                }

                const response = Api.post(
                    '/transfere_atendimento/ZmlsYWRlYXRlbmRpbWVudG8=',
                    objTransfere
                )

                this.fecharTelaDeConversa()

                const truck_modal = document.querySelector('#transfereAtendimento')
                const modal = bootstrap.Modal.getInstance(truck_modal)
                modal.hide()

                if (response) {
                    Swal.fire('Transferido com Sucesso!', response, 'success')
                
                this.Chamafirebase()
                this.chamarDados()

                this.atualizaMeusAtendimentos()
                    
                } else {
                    throw new Error(response)
                }



            
            } catch (error) {
                this.btnLoading = false

                console.error(error)

                Swal.fire('Erro!', error.data.message || 'Erro ao transferir atendimento', 'error')
            } finally {
                this.btnLoading = false
            }
        },
    },
}
</script>

<style>
.form-pad {
    padding: 10px 20px !important;
}

@media (max-width: 600px) {
    button {
        width: 100%;
    }
}
</style>
