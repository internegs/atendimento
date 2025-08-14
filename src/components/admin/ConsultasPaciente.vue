<template>
    <container class="mt-5">
        <div class="d-flex flex-column align-items-center">
            <h1 class="fw-bold">Escolha a especialidade</h1>
        </div>
        <div
            class="d-flex usuarios text-center align-items-center p-4 justify-content-around flex-wrap"
        >
            <div class="col-12">
                <input
                    v-model="pesquisa"
                    type="text"
                    class="buscar rounded pad-header m-1 w-50 text-dark bg-white"
                    style="caret-color: #333"
                    placeholder="Busque Consultorios"
                />
                <button
                    class="buscar_button m-1 bg-primary text-white text-uppercase fw-bold rounded pad-header"
                >
                    Buscar
                </button>
            </div>
        </div>

        <div class="table-responsive">
            <table class="table table-striped table-hover mb-4">
                <thead>
                    <tr>
                        <th scope="col">Consultório</th>

                        <th scope="col">Ação</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Quiropraxia</td>

                        <td
                            class="d-flex gap-3 flex-wrap"
                            style="align-items: center; justify-content: center"
                        >
                            <button
                                title="Editar"
                                class="btn btn-primary fs-3"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#acao_editar"
                                @click="marcarConsulta()"
                            >
                                Selecionar
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>Neurologia</td>
                        <td
                            class="d-flex gap-3 flex-wrap"
                            style="align-items: center; justify-content: center"
                        >
                            <button
                                title="Editar"
                                class="btn btn-primary fs-3"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#acao_editar"
                                @click="marcarConsulta()"
                            >
                                Selecionar
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>Cardiologia</td>
                        <td
                            class="d-flex gap-3 flex-wrap"
                            style="align-items: center; justify-content: center"
                        >
                            <button
                                title="Editar"
                                class="btn btn-primary fs-3"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#acao_editar"
                                @click="marcarConsulta()"
                            >
                                Selecionar
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div
            id="marcarConsulta"
            class="offcanvas offcanvas-end"
            style="width: 85%"
            tabindex="-1"
            aria-labelledby="marcarConsulta"
        >
            <div class="offcanvas-header flex-wrap mt-2">
                <h2
                    id="offcanvasRightLabel"
                    class="offcanvas-title fs-3 fw-bold"
                >
                    Marcar Consulta
                </h2>
                <button
                    type="button"
                    class="btn btn-danger fs-4 fw-bold"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                >
                    Fechar
                </button>
            </div>
            <div class="row container-fluid">
                <h1 class="col-md-12 text-center">Selecione um dos médicos disponíveis</h1>

                <div class="col-md-12 mt-5">
                    <div
                        class="table-responsive d-flex flex-column justify-content-center align-items-center tabela-imprimir"
                    >
                        <table class="table table-striped table-hover mb-4">
                            <thead>
                                <tr>
                                    <th scope="col">Nome</th>
                                    <th scope="col">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Guilherme</td>
                                    <td>
                                        <button
                                            class="btn btn-primary"
                                            @click="abrecalendario()"
                                        >
                                            Marcar consulta
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <nav aria-label="Page navigation example">
                            <ul class="pagination text-center">
                                <li class="page-item">
                                    <a
                                        class="page-link"
                                        href="#"
                                        aria-label="Previous"
                                    >
                                        <span aria-hidden="true">&laquo;</span>
                                    </a>
                                </li>

                                <li
                                    v-for="(list, index) in list_page"
                                    :key="index"
                                    class="page-item"
                                >
                                    <a
                                        v-show="
                                            list.label !== '&laquo; Previous' &&
                                            list.label !== 'Next &raquo;'
                                        "
                                        class="page-link"
                                        :class="{ active: list.active }"
                                        href="#"
                                        @click="selecionarPagina(list.label)"
                                    >
                                        {{ list.label }}
                                    </a>
                                </li>

                                <li class="page-item">
                                    <a
                                        class="page-link"
                                        href="#"
                                        aria-label="Next"
                                    >
                                        <span aria-hidden="true">&raquo;</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

        <div
            id="calendario"
            class="offcanvas offcanvas-end"
            style="width: 85%"
            tabindex="-1"
            aria-labelledby="abrecalendario"
        >
            <div class="offcanvas-header flex-wrap mt-2">
                <h2
                    id="offcanvasRightLabel"
                    class="offcanvas-title fs-3 fw-bold"
                >
                    Calendario
                </h2>
                <button
                    type="button"
                    class="btn btn-danger fs-4 fw-bold"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                >
                    Fechar
                </button>
            </div>
            <div class="row container-fluid">
                <div class="col-md-12 mt-5">
                    <h1 class="col-md-12 text-center">Selecione a data da consulta</h1>

                    <vue-scheduler
                        :event-dialog-config="dialogConfig"
                        @time-clicked="timeClicked"
                        @event-created="eventCreated"
                    />
                </div>
            </div>
        </div>
    </container>
</template>

<script>
import Container from '@/components/GLOBALS/container.vue'

export default {
    name: 'ConsultasPaciente',
    components: {
        Container,
    },
    data() {
        return {
            pesquisa: '',

            dialogConfig: {
                title: 'Efetue o pagamento',
                createButtonLabel: 'Pagar',
                enableTimeInputs: true,
                fields: [
                    {
                        name: 'name',
                        label: 'Event name',
                    },
                    {
                        name: 'email',
                        type: 'email',
                        required: true,
                        label: 'E-mail',
                        value: '',
                    },
                    {
                        label: 'Grouped',
                        fields: [
                            {
                                name: 'Field 1',
                            },
                            {
                                name: 'Field 2',
                            },
                        ],
                    },
                    {
                        name: 'comments',
                        type: 'textarea',
                        label: 'comments',
                    },
                ],
            }, // fim dialogConfig
        }
    },

    methods: {
        timeClicked(dateWithTime) {
            console.log('Dados completo')
            console.log('Data: ' + dateWithTime.date)
            console.log('Tempo: ' + dateWithTime.time)
        },

        eventCreated(event) {
            console.log('Event criado')
            console.log('Todos' + event.comments)
            console.log('horario fim ' + event.endTime)
            console.log('Horario inicio ' + event.startTime)
        },

        marcarConsulta() {
            const truck_offCanvas = document.querySelector('#marcarConsulta')
            const offCanvas = bootstrap.Offcanvas.getOrCreateInstance(truck_offCanvas)
            offCanvas.show()
        },
        abrecalendario() {
            const truck_offCanvas2 = document.querySelector('#calendario')
            const offCanvas2 = bootstrap.Offcanvas.getOrCreateInstance(truck_offCanvas2)
            console.log('testando')
            offCanvas2.show()
        },
    },
}
</script>

<style>
.pad-header {
    padding: 10px;
}

.usuarios input {
    border: 1px solid #d0d0d0;
}

.table {
    font-family: 'Roboto', sans-serif;
}

.usuarios {
    border-bottom: 2px solid #ababab;
}

@media (max-width: 645px) {
    .usuarios {
        justify-content: center;
        gap: 10px;
    }

    .usuarios div {
        margin: 0;
    }
}
@media (max-width: 430px) {
    .usuarios button,
    input {
        width: 100%;
    }
}

.table_section {
    overflow: auto;
    height: auto;
}

table {
    text-align: center;
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
