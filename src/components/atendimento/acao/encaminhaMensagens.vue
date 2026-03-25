<template>
    <div class="container-fluid">
        <div
            class="modal fade"
            id="encaminhaMensagens"
            tabindex="-1"
            aria-labelledby="encaminhaMensagensLabel"
            aria-hidden="true"
        >
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1
                            class="modal-title fs-5"
                            id="encaminhaMensagensLabel"
                        >
                            Encaminhar Mensagem
                        </h1>
                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div class="modal-body">
                        <h1 class="fs-4 text-center">Encaminhar mensagem para</h1>

                        <div>
                            <input
                                class="form-control form-control-lg"
                                type="text"
                                placeholder="pesquise contato"
                                v-model="pesquisa"
                                @keyup="Pesquisar"
                                aria-label=".form-control-lg example"
                            />

                            <ul class="list-group">
                                <li
                                    class="list-group-item"
                                    v-for="(contato, index) in listaContatos"
                                    :key="index"
                                >
                                    <label class="conteiner">
                                        <input
                                            type="checkbox"
                                            class="form-check-input selecionarMensagens"
                                        />
                                        <span
                                            class="checkmark-encaminha-mensagem"
                                            @click="selecionarContato"
                                            :data-contato="contato.fone"
                                        ></span>
                                    </label>
                                    <span style="margin-left: 40px">
                                        {{ contato.nome }} {{ contato.fone }}
                                    </span>
                                </li>
                            </ul>

                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-primary"
                            @click="encaminhaMensagem()"
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/services/api.js'

export default {
    name: 'mandarArquivo',
    components: {},
    props: {
        fone: {
            type: String,
        },
        name: {
            type: String,
        },
        listaMensagensSelecionadas: {
            type: Array,
        },
        limpaArray: {
            type: Function,
        },
    },
    data() {
        return {
            pesquisa: '',
            listaContatos: [],
            selecionado: null,
            contatoFone: null,
        }
    },
    methods: {
        selecionarContato(e) {
            let labelCheckBox = e.target
            let elementoPai = labelCheckBox.parentNode
            let checkbox = elementoPai.querySelector('.selecionarMensagens')

            let data_contato = labelCheckBox.getAttribute('data-contato')

            let checkMarks = document.querySelectorAll('.checkmark-encaminha-mensagem')

            if (!checkbox.checked) {
                checkMarks.forEach(checkMark => {
                    if (checkMark.getAttribute('data-contato') !== data_contato) {
                        checkMark.style.display = 'none'
                    }
                })

                this.contatoFone = data_contato
            } else {
                checkMarks.forEach(checkMark => {
                    checkMark.style.display = 'block'
                })
                this.contatoFone = ''
            }

            console.log(this.contatoFone)
        },
        encaminhaMensagem() {
            let obj = {
                user_id: localStorage.getItem('@USER_ID'),
                fone: this.contatoFone,
                name: this.name,
                fone_contato: this.fone,
                mensagem_id: this.listaMensagensSelecionadas,
            }

            api.post('/encaminhar_mensagemnova/ZmlsYWRlYXRlbmRpbWVudG8=', obj)
                .then(response => {
                    console.log(response)
                    const truck_modal = document.querySelector('#encaminhaMensagens')
                    const modal = bootstrap.Modal.getOrCreateInstance(truck_modal)
                    console.log(response)
                    modal.hide()
                })
                .catch(error => {
                    console.error(error)
                })

            this.pesquisa = ''
            this.limpaArray()
        },
        Pesquisar() {
            if (this.pesquisa === '') {
                this.listaContatos = []
                return
            }

            api.post(`/busca_contatos/ZmlsYWRlYXRlbmRpbWVudG8=`, {
                id: localStorage.getItem('@USER_ID'),
                busca: this.pesquisa,
            })
                .then(response => {
                    let data = response.data
                    console.log(data.contatos.data)
                    this.listaContatos = data.contatos.data
                })
                .catch(erro => console.error(erro))
        },
    },
}
</script>

<style lang="scss" scoped>
.form-pad {
    padding: 10px 20px !important;
}

ul {
    list-style: none;
}

.list {
    width: 100%;
    background-color: #ffffff;
    border-radius: 0 0 5px 5px;
}

.list-group-item {
    padding: 10px 5px;
    cursor: pointer;

    &:hover {
        background-color: #dddddd;
    }
}

button {
    @media (max-width: 600px) {
        width: 100%;
    }
}

.conteiner {
    display: block;
    background-color: red;
    position: relative;
    cursor: pointer;
    font-size: 22px;
    user-select: none;

    input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    &:hover input ~ .checkmark-encaminha-mensagem {
        background-color: #ccc;
    }

    input:checked ~ .checkmark-encaminha-mensagem {
        background-color: #f58634;

        &:after {
            display: block;
        }
    }

    .checkmark-encaminha-mensagem {
        position: absolute;
        top: 0;
        left: 0;
        height: 25px;
        width: 25px;
        background-color: #eee;
        border: solid #68737a;
        cursor: pointer;

        &:after {
            content: '';
            position: absolute;
            display: none;
            left: 5px;
            width: 8px;
            height: 15px;
            border: solid white;
            border-width: 0 3px 3px 0;
            transform: rotate(45deg);
        }
    }
}
</style>
