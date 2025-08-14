<template>
    <Container class="mt-5 100">
        <div class="d-flex flex-column align-items-center">
            <h1 class="fw-bold">Gerenciador de Arquivos</h1>
            <div class="d-flex align-items-center botoes gap-3 justify-content-center">
                <div class="row">
                    <div class="col-md-8">
                        <input
                            class="buscar rounded pad-header form-control"
                            id="formFileLg"
                            name="file"
                            type="file"
                            ref="file"
                            @change="newFile"
                        />
                    </div>

                    <div class="col-md-4">
                        <button
                            class="bg-info text-white text-uppercase fw-bold rounded pad-header"
                            @click="salvaMidia()"
                        >
                            <div v-if="!btn_midia">Salvar</div>

                            <div
                                class="spinner-border"
                                role="status"
                                v-else
                            >
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="d-flex flex-wrap usuarios justify-content-center align-items-center p-4">
            <input
                type="text"
                class="buscar rounded pad-header m-1 w-50 text-dark bg-white"
                style="caret-color: #333"
                placeholder="Busque Midias"
                v-model="pesquisa"
            />
        </div>

        <div
            v-if="loadingPage"
            class="w-100 d-flex justify-content-center align-items-center mt-4"
        >
            <div
                class="spinner-border spinner-border-md"
                role="status"
            ></div>
        </div>

        <div
            v-else
            class="table-responsive"
        >
            <table class="table table-striped table-hover mb-4">
                <thead>
                    <tr>
                        <th scope="col">Nome do Arquivo</th>
                        <th scope="col">Ver Midias</th>
                        <th scope="col">Ação</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(midia, index) in arquivos"
                        :key="index"
                    >
                        <td>{{ midia.nomeArquivo }}</td>
                        <td>
                            <a
                                :href="midia.linkArquivo"
                                target="_blank"
                            >
                                Visualizar
                                <i class="fa-solid fa-eye"></i>
                            </a>
                        </td>
                        <td
                            class="d-flex gap-3 flex-wrap"
                            style="align-items: center; justify-content: center"
                        >
                            <button
                                class="btn btn-danger w-50 fs-3"
                                @click="deletaMidias(midia.idArquivo)"
                            >
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </Container>
</template>

<script>
import Container from '../GLOBALS/container.vue'

import Api from '@/services/api'
import apiImagem from '@/services/apiImagem'
import Swal from 'sweetalert2'

export default {
    name: 'midiasAdm',
    components: { Container },
    data() {
        return {
            midia: '',
            urlMidia: '',
            nomeArquivo: '',
            status: false,
            pesquisa: '',
            extArquivo: '',
            arquivos: [],
            path: '',
            obj: {
                user_id: localStorage.getItem('@USER_ID'),

                email: null,
                password: null,
            },
            atendente_id: null,
            btn_midia: false,
            loadingPage: false,
        }
    },
    mounted() {
        this.chamarMidias()
    },
    methods: {
        newFile(e) {
            const file = e.target.files[0]

            this.nomeArquivo = file.name
            this.midia = file
            this.extArquivo = file.type
            this.geraMidia()
        },
        geraMidia() {
            if (this.midia === '') return
            const tipo = 1
            let form = ''

            form = new FormData()

            form.append('midia', this.midia)

            apiImagem
                .post('/gera_mida/ZmlsYWRlYXRlbmRpbWVudG8=', form, tipo)
                .then(response => {
                    const data = response.data
                    this.urlMidia = data.file
                    this.path = data.path
                })
                .catch(error => {
                    console.error(error)
                })
        },
        salvaMidia() {
            this.btn_midia = true
            setTimeout(() => {
                const objSalvaMidia = {
                    user_id: localStorage.getItem(`@USER_ID`),
                    linkArquivo: this.urlMidia,
                    nomeArquivo: this.nomeArquivo,
                    extArquivo: this.extArquivo,
                    path: this.path,
                }
                //  console.log(objSalvaMidia);
                Api.post('/store_midia/ZmlsYWRlYXRlbmRpbWVudG8=', objSalvaMidia)
                    .then(response => {
                        this.midia = ''
                        Swal.fire('Upload!', response.data.mensagem, 'success')
                        this.chamarMidias()
                        this.btn_midia = false
                    })
                    .catch(error => {
                        console.error(error)
                        this.btn_midia = false
                    })
            }, 2000)
        },

        chamarMidias() {
            this.loadingPage = true

            Api.post('/midias/ZmlsYWRlYXRlbmRpbWVudG8=', {
                id: localStorage.getItem('@USER_ID'),
            })
                .then(response => {
                    let data = response.data

                    this.arquivos = data.midias
                })
                .catch(erro => {
                    console.error(erro)
                    this.loadingPage = false
                })
                .finally(() => (this.loadingPage = false))
        },

        deletaMidias(id_midia) {
            Swal.fire({
                title: 'Tem certeza que deseja deletar este registro?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim, deletar!',
                cancelButtonText: 'Cancelar',
            }).then(result => {
                if (result.isConfirmed) {
                    Api.post('/midia_exclui/ZmlsYWRlYXRlbmRpbWVudG8=', {
                        id_midia: id_midia,
                    })
                        .then(response => {
                            //     console.log(response);
                            Swal.fire('Excluído!', response.data[0], 'success')

                            this.chamarMidias()
                        })
                        .catch(error => {
                            console.error(error)
                        })
                }
            })
        },
    },
    filters: {
        midiaFilter(value) {
            switch (value) {
                case 1:
                    return `<span class="text-primary fw-bold">Liberado</span>`
                default:
                    return `<span class="text-secondary fw-bold">Bloqueado</span>`
            }
        },
    },
}
</script>

<style scoped>
.pad-header {
    padding: 10px 20px;
}

/* input.buscar {
} */

/* .midias {
  background-color: #f0f0f0;
} */

@media (max-width: 590px) {
    .botoes {
        flex-wrap: wrap;
        justify-content: center;
    }

    .botoes button {
        width: 100%;
        margin-top: 30px;
    }
}

.input-pad {
    padding: 10px 20px;
    font-size: 1.1rem;
}

.midias input {
    border: 1px solid #d0d0d0;
}

.table {
    font-family: 'Roboto', sans-serif;
}

.midias {
    border-bottom: 2px solid #ababab;
}

.table_section {
    overflow: auto;
    height: auto;
}

table {
    width: 100%;
    margin: auto;
    table-layout: fixed;
    min-width: 1000px;
}
table th {
    position: sticky;
    top: 0;
    background-color: #f6f9fc;
    color: #8493a5;
    font-size: 1.12rem;
}

th,
td {
    border-bottom: 1px solid #dddd;
    padding: 10px 20px;
    word-break: break-all;
    text-align: center;
}

td {
    font-size: 1.2rem;
}

tr:hover td {
    cursor: pointer;
    background-color: #f6f9fc;
}

td img {
    height: 60px;
    width: 60px;
    object-fit: cover;
    border-radius: 50%;
}
</style>
