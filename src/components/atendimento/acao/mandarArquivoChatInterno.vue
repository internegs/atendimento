<template>
  <Container>
    <div
      class="modal fade"
      id="mandarArquivoChatInterno"
      tabindex="-1"
      aria-labelledby="mandarArquivoChatInternoLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="mandarArquivoChatInternoLabel">
              Enviar Arquivo
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <h1 class="fs-5 text-center">
              Enviar para <span class="text-danger">{{ nomeSelecionado }}</span>
            </h1>

            <div>
              <input
                class="form-control form-control-lg"
                id="formFileLg"
                name="file"
                type="file"
                ref="file"
                @change="newFile"
              />
            </div>
            <div class="text-center mt-4" v-if="urlMidia">
              <a
                :href="urlMidia"
                target="__blank"
                class="fs-5 text-center d-block mt-4"
                >Ver arquivo em outra guia</a
              >
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="enviaMidia">
              <span v-if="!status">Enviar</span>
              <span v-else>Enviando...</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<script>
import Container from "@/components/GLOBALS/container.vue";
import apiImagem from "@/services/apiImagem";
import api from "@/services/api";

export default {
  name: "mandarArquivoChatInterno",
  components: { Container },
  props: {
    id_transferido: {
      type: [String, Number],
    },
    nomeSelecionado: {
      type: String,
    },
    atualizaConversa: {
      type: Function,
    },
  },
  data() {
    return {
      midia: "",
      urlMidia: "",
      status: false,
    };
  },
  created() {
    this.urlMidia = "";
  },
  methods: {
    newFile(e) {
      const file = e.target.files[0];

      this.midia = file;
      this.geraMidia();
    },
    enviaMidia() {
      this.status = true;
      const obj = {
        id: localStorage.getItem("@USER_ID"),
        id_transferido: this.id_transferido,
        midia: this.urlMidia,
      };

      api
        .post("/envia_midia_interno/ZmlsYWRlYXRlbmRpbWVudG8=", obj)
        .then((response) => {
          const data = response.data;
          if (data.status) {
            this.status = false;
            const truck_modal = document.querySelector("#mandarArquivoChatInterno");
            const modal = bootstrap.Modal.getOrCreateInstance(truck_modal);
            modal.hide();
            
            this.atualizaConversa();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    geraMidia() {
      if (this.midia === "") return;
      // console.log(this.midia);
      const tipo = 0;
      let form = "";

      form = new FormData();

      
      form.append("midia", this.midia);

      apiImagem
        .post("/gera_mida/ZmlsYWRlYXRlbmRpbWVudG8=", form, tipo)
        .then((response) => {
          const data = response.data;
          this.urlMidia = data.file;
          //console.log(this.urlMidia);
        })
        .catch((error) => {
          console.error(error);
        });
    },
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
