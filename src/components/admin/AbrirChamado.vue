<template>
    <div
        id="abrirChamado"
        class="offcanvas offcanvas-end"
        style="width: 85%"
        tabindex="-1"
        aria-labelledby="abrirChamado"
    >
        <div class="offcanvas-header flex-wrap mt-2">
            <button
                type="button"
                class="ms-auto btn btn-danger fs-4 fw-bold"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
            >
                Fechar
            </button>
        </div>
        <div class="row container-fluid">
            <div class="col-md-12">
                <button
                    class="btn btn-primary ms-2 fw-bold pad-button fs-4"
                    data-bs-toggle="modal"
                    data-bs-target="#abrirChamadoFormulario"
                >
                    Abrir Chamado
                </button>
            </div>
            <h1 class="col-md-12 text-center fw-bold">Meus Chamados</h1>
            <div class="col-md-12 mt-2">
                <div
                    class="table-responsive d-flex flex-column justify-content-center align-items-center tabela-imprimir"
                >
                    <table class="table table-striped table-hover mb-4">
                        <thead>
                            <tr>
                                <th scope="col">Status</th>
                                <th scope="col">Titulo</th>
                                <th scope="col">Descrição</th>
                                <th scope="col">Resposta</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(chamado, index) in chamados"
                                :key="index"
                            >
                                <td>{{ chamado.status }}</td>
                                <td>{{ chamado.titulo }}</td>
                                <td>{{ chamado.descricao }}</td>
                                <td>{{ chamado.resposta }}</td>
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

                            <!-- <li
                class="page-item"
                v-for="(list, index) in list_page"
                :key="index"
              >
                <a
                  v-show="
                    list.label !== '&laquo; Previous' &&
                    list.label !== 'Next &raquo;'
                  "
                  @click="selecionarPagina(list.label)"
                  class="page-link"
                  :class="{ active: list.active }"
                  href="#"
                  >{{ list.label }}</a
                >
              </li> -->

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

        <!-- <Container class="mt-4">
    <div class="d-flex flex-column align-items-center mb-3">
      <h1 class="fw-bold">Abrir Chamado</h1>
    </div>

    <form
      class="row g-3 bg-white p-4 mb-4"
      style="max-width: 60%; margin: 0 auto"
    >
      <div class="col-md-12">
        <h1 class="fw-bold fs-3">Titulo:</h1>
        <input
          type="email"
          name="email"
          class="form-control btn-pd"
          placeholder="Digite Seu Titulo"
          v-model="obj.titulo"
        />
      </div>
      <div class="col-md-12">
        <h1 class="fw-bold fs-3">Mensagem:</h1>
        <textarea
          class="form-control"
          cols="30"
          rows="10"
          placeholder="Digite sua Mensagem Aqui"
          v-model="obj.mensagem"
        ></textarea>

      </div>

      <div class="col-12 mt-4 w-100">
        <button class="button-register w-100" @click.prevent="registrar()">
          <div v-if="!btn_enviar">Enviar</div>
          <div class="spinner-border" role="status" v-else>
            <span class="visually-hidden">Loading...</span>
          </div>
        </button>
      </div>
    </form>
  </Container> -->
    </div>
</template>

<script>
import Container from '../GLOBALS/container.vue'

export default {
    name: 'ABRIRCHAMADO',
    components: { Container },
    props: {
        chamados: {
            type: [Array, Object],
        },
    },
    data() {
        return {
            btn_register: false,
            obj: {
                titulo: null,
                mensagem: null,
            },
        }
    },
}
</script>

<style scoped>
.input-metade {
    width: 50% !important;
}

.disable {
    opacity: 0.7;
}

.btn-pd {
    padding: 10px 20px;
}

.hover-laranja:hover {
    background-color: #f58634;
    color: #fff;
}

.accordion-button:not(.collapsed) {
    background-color: #f58634 !important;
    color: #fff !important;
}

.accordion-button:focus {
    border: 0 !important;
    box-shadow: none !important;
}

.icone {
    position: absolute;
    top: 62%;
    font-size: 1.1rem;
    right: 20px;
}

.button-register {
    text-transform: uppercase;
    color: #fff;
    font-weight: bold;

    font-size: 1.1rem;
    padding: 10px 20px;

    border-radius: 5px;

    background-color: #f58634;
}

.bg-branco {
    background-color: #fff;
}

.bg-gray {
    box-shadow: 5px 5px 25px 5px rgba(0, 0, 0, 0.2);
    margin-left: 20px;
}

.input {
    padding: 15px 10px;
    border-radius: 5px;
    border-bottom: 1px dashed #9e9e9e;
    font-size: 1.2rem;
}

.input:hover,
.input:hover i {
    border-color: #f58634;
    color: #f58634;
}

.input input {
    width: 90%;
    background-color: transparent;
    outline: 0;
    padding: 0px 10px;
    border: 0;
}

.input input::placeholder {
    font-size: 1.2rem;
}

.input:nth-child(2) {
    margin-top: 20px;
}

.input i {
    color: #9e9e9e;
    font-size: 20px;
}
.button-login {
    text-transform: uppercase;
    color: #fff;
    font-weight: bold;

    font-size: 1.5rem;
    padding: 10px 20px;

    border-radius: 5px;

    background-color: #f58634;
}
.laranja {
    color: #f58634;
}
.register {
    text-decoration: none;
}
.box-register {
    font-size: 1.1rem;
    text-align: center;
}

@media (max-width: 760px) {
    .input-metade {
        width: 100% !important;
    }
    .telefone {
        width: 100% !important;
    }
    .registroRealizado {
        display: none;
    }
}
</style>
