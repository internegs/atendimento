<template>
    <Container class="mt-5">
        <div class="d-flex flex-column align-items-center">
            <h1 class="fw-bold">Minhas Consultas</h1>
        </div>
        <div
            class="d-flex usuarios text-center align-items-center p-4 justify-content-around flex-wrap"
        >
            <!-- <div class="col-12"> -->
            <!-- <input
          type="text"
          class="buscar rounded pad-header m-1 w-50 text-dark bg-white"
          style="caret-color: #333;"
          placeholder="Busque Segmentos"
          v-model="pesquisa"
        />
        <button
          class="buscar_button m-1 bg-primary text-white text-uppercase fw-bold rounded pad-header"
        >
          Buscar
        </button> -->

            <!-- </div> -->

            <h1>Horario Definido: 08:00 - 17:00</h1>
            <button
                class="m-1 bg-success text-white text-uppercase fw-bold rounded pad-header"
                data-bs-toggle="modal"
                data-bs-target="#gravaGrupo"
            >
                Alterar Horario
            </button>
        </div>

        <div class="table-responsive">
            <table class="table table-striped table-hover mb-4">
                <thead>
                    <tr>
                        <th scope="col">Nome</th>
                        <th scope="col">Telefone</th>

                        <th scope="col">Ação</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>a</td>
                        <td>a</td>
                        <td>a</td>
                    </tr>
                    <!-- <tr v-for="(contato, index) in contatos" :key="index">
            <td>{{ contato.nome }}</td>
            <td>{{ contato.fone }}</td>

            <td
              class="d-flex gap-3 flex-wrap"
              style="align-items: center; justify-content: center"
            >
              <div class="row">
                <div class="col-md-6">
                  <button
                    title="Editar"
                    class="btn btn-primary fs-3"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#acao_editar"
                    @click="Selecionar(contato)"
                  >
                    <i class="fa-solid fa-pen"></i>
                  </button>
                </div>
                <div class="col-md-6">
                  <button
                    title="Excluir"
                    class="btn btn-danger fs-3"
                    @click="Deleta(contato.id)"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </td>
          </tr> -->
                </tbody>
            </table>
        </div>
    </Container>
</template>

<script>
import Container from '@/components/GLOBALS/container.vue'

export default {
    name: 'ConsultasDoutor',
    components: {
        Container,
    },
    data() {
        return {
            pesquisa: '',
        }
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
