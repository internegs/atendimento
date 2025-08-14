<template>
  <Container>
    <div
      class="modal fade"
      id="selecionaContatos"
      tabindex="-1"
      aria-labelledby="selecionaContatosLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="selecionaContatosLabel">
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
                  <span style="margin-left: 40px"
                    >{{ contato.nome }} {{ contato.fone }}</span
                  >
                </li>
              </ul>

              <!-- <ul class="list-group">
                <li
                  class="list-group-item"
                  v-for="(contato, index) in listaContatos"
                  :key="index"
                  @click="selecionarContato(contato)"
                >
                  {{ contato.nome }} {{ contato.fone }}
                </li>
              </ul> -->
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
  </Container>
</template>

<script>
import Container from "@/components/GLOBALS/container.vue";
import api from "@/services/api";

export default {
  name: "mandarArquivo",
  components: { Container },
  props: {

    // atualizaConversa: {
    //   type: Function,
    // },
  },
  data() {
    return {
      pesquisa: "",
      listaContatos: [],
      selecionado: null,
      contatoFone: null,
    };
  },
  methods: {
    selecionarContato(e) {
      let labelCheckBox = e.target;
      let elementoPai = labelCheckBox.parentNode;
      let checkbox = elementoPai.querySelector(".selecionarMensagens");

      let data_contato = labelCheckBox.getAttribute("data-contato");

      let checkMarks = document.querySelectorAll(".checkmark-encaminha-mensagem");

      if (!checkbox.checked) {
        checkMarks.forEach((checkMark) => {
          if (checkMark.getAttribute("data-contato") !== data_contato) {
            checkMark.style.display = "none";
          }
        });

        this.contatoFone = data_contato
      } else {
        checkMarks.forEach((checkMark) => {
          checkMark.style.display = "block";
        });
        this.contatoFone = '';
      }

    //  console.log(this.contatoFone);
    },
    // encaminhaMensagem() {

      

    //   let obj = {
    //     user_id: localStorage.getItem('@USER_ID'),
    //     fone: this.contatoFone,
    //     name: this.name,
    //     fone_contato: this.fone,
    //     mensagem_id: this.listaMensagensSelecionadas
    //   }


    //   api.post("/encaminhar_mensagem/ZmlsYWRlYXRlbmRpbWVudG8=", obj)
    //     .then((response) => {
    //       console.log(response);
    //       const truck_modal = document.querySelector("#selecionaContatos");
    //       const modal = bootstrap.Modal.getOrCreateInstance(truck_modal);
    //       console.log(modal)
    //       modal.hide();
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });

    //     this.pesquisa = '';
    //     this.limpaArray();
    // },
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
          console.log(data.contatos.data);
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

.conteiner {
  display: block;
  background-color: red;
  position: relative;
  /* padding-left: 35px; */
  /* margin-bottom: 12px; */
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.conteiner input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
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
}

.conteiner:hover input ~ .checkmark-encaminha-mensagem {
  background-color: #ccc;
}

.conteiner input:checked ~ .checkmark-encaminha-mensagem {
  background-color: #f58634;
}

.checkmark-encaminha-mensagem:after {
  content: "";
  position: absolute;
  display: none;
}

.conteiner input:checked ~ .checkmark-encaminha-mensagem:after {
  display: block;
}

.conteiner .checkmark-encaminha-mensagem:after {
  left: 5px;
  width: 8px;
  height: 15px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
