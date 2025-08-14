<template>
  <Container>
    <!-- Modal -->
    <div
      class="modal fade"
      id="transfereAtendimento"
      tabindex="-1"
      aria-labelledby="transfereAtendimento"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
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
            <form action="" class="row">
              <div class="form-group col-md-12">
                <select
                  name=""
                  id=""
                  class="form-select"
                  v-model="atendenteSelecionado"
                >
                  <option value="" selected disabled>
                    Selecione um atendente
                  </option>
                  <option
                    :value="atendente.id"
                    v-for="(atendente, index) in atendentesDisponiveis"
                    :key="index"
                  >
                    {{ atendente.name }} - <span class="badge bg-primary rounded-pill" v-if="atendente.online == 0 "  > Off</span>
                    <span class="badge bg-warning rounded-pill" v-if="atendente.online == 1 " > On</span>
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
              Transferir
            </button>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>
  
  <script>
import Container from "@/components/GLOBALS/container.vue";
import Api from "@/services/api";
import Swal from 'sweetalert2';
// import Swal from "sweetalert2";

export default {
  name: "transfereAtendimento",
  components: { Container },
  data() {
    return {
      atendentesDisponiveis: [],
      atendenteSelecionado: "",
    };
  },
  props: {
    id_atendimento: {
      type: Number,
    },
    chamarDados: {
      type: Function
    },
    atualizaMeusAtendimentos: {
      type: Function
    },
    fecharTelaDeConversa: {
      type: Function
    }
  },
  methods: {
    chamarAtendentesDisponiveis() {
      Api.post("/atendentes_online/ZmlsYWRlYXRlbmRpbWVudG8=", {
        id: localStorage.getItem("@USER_ID"),
      })
        .then((response) => {
          this.atendentesDisponiveis = response.data.atendentes;
         
        })
        .catch((error) => {
          console.error(error);
        });
    },
    transfereAtendimento() {
      const objTransfere = {
        id: localStorage.getItem("@USER_ID"),
        atendente_id_transfere: this.atendenteSelecionado,
        id_atendimento: this.id_atendimento,
      };

      Api.post("/transfere_atendimento/ZmlsYWRlYXRlbmRpbWVudG8=", objTransfere)
        .then((response) => {
          
          
          this.fecharTelaDeConversa();

          const truck_modal = document.querySelector("#transfereAtendimento");
          const modal = bootstrap.Modal.getInstance(truck_modal);
          modal.hide();

          if (response.status == 200){


          Swal.fire("Transferido!", response.data, "success");
//          console.log(response.data)
          } else {
            Swal.fire("Erro!", response.data.mensagem, "error"); 
            console.log(response.status)
          }

          this.chamarDados();

          this.atualizaMeusAtendimentos();


        })
        .catch((error) => {
          Swal.fire("Gravado!", error.data.mensagem, "error");
        });
    },
    
  },

  mounted() {
    this.chamarAtendentesDisponiveis();
  },
};
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
  