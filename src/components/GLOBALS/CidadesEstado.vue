<template>
    <div class="col-md-5">
        <div class="row">
            <div class="col-md-4 mt-2">
                <label class="fs-3 mb-2 col-form-label">Estado</label>

                <select
                    v-model="data.uf"
                    class="form-select form-pad"
                    @change="selectUF"
                >
                    <option
                        :value="null"
                        :selected="data.uf === null"
                        disabled
                    >
                        Selecione
                    </option>

                    <option
                        v-for="estado in estados"
                        :key="estado.id"
                        :value="estado.id"
                        :selected="estado.id === data.uf"
                    >
                        {{ estado.sigla }}
                    </option>
                </select>
            </div>

            <div
                v-if="data.uf"
                class="col-md-8 mt-2"
            >
                <label class="col-form-label fs-3 mb-2">Cidade</label>

                <select
                    v-model="data.city"
                    class="form-select form-pad"
                    @change="selectCity"
                >
                    <option
                        :value="null"
                        :selected="data.city === null"
                        disabled
                    >
                        Selecione
                    </option>

                    <option
                        v-for="cidade in cidades"
                        :key="cidade.id"
                        :value="cidade.id"
                        :selected="cidade.id === data.city"
                    >
                        {{ cidade.nome }}
                    </option>
                </select>
            </div>
        </div>
    </div>
</template>

<script>
import Api from '@/services/api'

export default {
    name: 'CidadesEstado',

    props: {
        user: Object,
        reset: Boolean,

        modalType: {
            type: String,
            required: true,
        },
    },

    emits: ['fill-uf', 'fill-city', 'updated-reset'],

    data() {
        return {
            estados: [],
            cidades: [],

            data: {
                uf: null,
                city: null,
            },
        }
    },

    watch: {
        async reset(newValue) {
            if (newValue) {
                this.resetForm()
            }
        },
    },

    mounted() {
        const eventName = this.modalType === 'add' ? 'modal-add-opened' : 'modal-edit-opened'
        window.addEventListener(eventName, this.handleModalOpen)
    },

    beforeUnmount() {
        const eventName = this.modalType === 'add' ? 'modal-add-opened' : 'modal-edit-opened'
        window.removeEventListener(eventName, this.handleModalOpen)
    },

    methods: {
        async getEstados() {
            await Api.post(`/cidades/ZmlsYWRlYXRlbmRpbWVudG8=`, {
                id: localStorage.getItem('@USER_ID'),
                uf_id: this.data.uf,
            })
                .then(response => {
                    this.estados = response.data.estados
                })
                .catch(err => {
                    console.error(err)
                })
        },

        async getCidades() {
            await Api.post(`/cidades/ZmlsYWRlYXRlbmRpbWVudG8=`, {
                id: localStorage.getItem('@USER_ID'),
                uf_id: this.data.uf,
            })
                .then(response => {
                    this.cidades = response.data.cidades
                })
                .catch(err => {
                    console.error(err)
                })
        },

        async handleModalOpen() {
            await this.getEstados()

            if (this.user) {
                await this.fillData(this.user)
            }
        },

        selectUF() {
            const uf = this.estados?.find(estado => estado.id === this.data.uf)

            this.$emit('fill-uf', uf.sigla ?? null)

            this.getCidades()
        },

        selectCity() {
            const city = this.cidades?.find(cidade => cidade.id === this.data.city)

            this.$emit('fill-city', city.nome ?? null)
        },

        async fillData(data) {
            this.data.uf = this.estados?.find(estado => estado.sigla === data?.uf)?.id ?? null

            if (this.data.uf) {
                await this.getCidades()

                this.data.city =
                    this.cidades?.find(cidade => cidade.nome === data?.cidade)?.id ?? null
            }
        },

        resetForm() {
            this.estados = []
            this.cidades = []

            this.data = {
                uf: null,
                city: null,
            }

            this.$emit('updated-reset')
        },
    },
}
</script>

<style></style>
