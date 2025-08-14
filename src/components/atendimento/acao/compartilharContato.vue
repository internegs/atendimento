<template>
  <Container>
    <div
      class="modal fade"
      id="compartilharContato"
      tabindex="-1"
      aria-labelledby="compartilharContatoLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="compartilharContatoLabel">
              Compartilhar Contato
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <h1 class="fs-4 text-center">
              Selecione o contato que deseja compartilhar
            </h1>

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
                  @click="selecionarContato(contato)"
                >
                  {{ contato.nome }} {{ contato.fone }}
                </li>
              </ul>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              @click="encaminhaContato()"
            >
              <div v-if="!btn_encaminhaContato">Enviar</div>
              <div class="spinner-border" role="status" v-else>
                <span class="visually-hidden">Loading...</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<script>
import Container from "@/components/GLOBALS/container.vue";
import api from "@/services/api";
// import Api from "@/services/api";

export default {
  name: "mandarArquivo",
  components: { Container },
  props: {
    fone: {
      type: String,
    },
    atualizaConversa: {
      type: Function,
    },
  },
  data() {
    return {
      pesquisa: "",
      listaContatos: [],
      obj: {},
      selecionado: null,
      btn_encaminhaContato: false,
    };
  },
  methods: {
    selecionarContato(contato) {
      this.pesquisa = contato.fone;
      this.selecionado = contato.id;
      this.Pesquisar();

      this.obj = {
        user_id: localStorage.getItem("@USER_ID"),
        fone: this.fone,
        name: contato.nome,
        fone_contato: contato.fone,
      };
    },
    encaminhaContato() {
      this.btn_encaminhaContato = true;

      api
        .post("/encaminhar_contatonovo/ZmlsYWRlYXRlbmRpbWVudG8=", this.obj)
        .then(() => {
          this.btn_encaminhaContato = false;
          const truck_modal = document.querySelector("#compartilharContato");
          const modal = bootstrap.Modal.getInstance(truck_modal);
          modal.hide();
          this.atualizaConversa();
        })
        .catch((error) => {
          console.error(error);
          this.btn_encaminhaContato = false;
        });
    },
    Pesquisar() {
      if (this.pesquisa === "") {
        
        this.listaContatos = [];
        return;
      }

      api
        .post(`/busca_contatos/ZmlsYWRlYXRlbmRpbWVudG8=`, {
          id: localStorage.getItem("@USER_ID"),
          busca: this.pesquisa,
        })
        .then((response) => {
          let data = response.data;

          this.listaContatos = data.contatos.data;
        })
        .catch((erro) => console.error(erro));
    },
  },
};
</script>

<style>
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
}
.list-group-item:hover {
  background-color: #dddddd;
}
@media (max-width: 600px) {
  button {
    width: 100%;
  }
}
</style>
