<template>
  <Container>
    <!-- Modal -->
    <div
      class="modal fade"
      id="apagarmensagemmodal"
      tabindex="-1"
      aria-labelledby="apagarmensagemmodal"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
             <b> Deseja realmente apagar a mensagem?</b>
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
                {{ mensagemdeleta }} 
                 </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              @click="apagar_mensagem"
                    >
                   <span v-if="status">Apagar mensagem</span> 
                   
                   <span v-if="!status" aria-disabled="disabled">Apagando...</span> 
              
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
  name: "apagarMensagem",
  components: { Container },
  data() {
    return {
      status: true,
    };
  },
  props: {
    id_mensagem: {
      type: String,
    },
    
    fone:{
      type: [Number, String],
    },
    
    atualizarConversa: {
      type: Function
    },
    mensagemdeleta:{
      type: String,
    }
  },
  methods: {
    
    apagar_mensagem() {
      this.status = false;
      const objTransfere = {
        user_id: localStorage.getItem("@USER_ID"),
        mensagem_id: this.id_mensagem,
        fone: this.fone,
      };

      Api.post("/deletar_mensagem/ZmlsYWRlYXRlbmRpbWVudG8=", objTransfere)
        .then((response) => {
          
          const truck_modal = document.querySelector("#apagarmensagemmodal");
          const modal = bootstrap.Modal.getInstance(truck_modal);
          modal.hide();

          if (response.status == 200){


          Swal.fire("Mensagem apagada!", response.data, "success");
//          console.log(response.data)
            
          this.atualizarConversa();
          } else {
            Swal.fire("Erro!", response.data.mensagem, "error"); 
            console.log(response.status)
          }

        })
        .catch((error) => {
          Swal.fire("Gravado!", error.data.mensagem, "error");
        });
    },
    
  },

  mounted() {
    
    this.atualizarConversa();
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
  