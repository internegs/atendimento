<template>
  <Container>
    <div
      class="modal fade"
      id="mandarArquivo"
      tabindex="-1"
      aria-labelledby="mandarArquivoLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="mandarArquivoLabel">
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
            <div v-if="!processando"></div>
              <div class="spinner-border" role="status" v-else>
                <span class="visually-hidden">Loading...</span>
              </div>

            <div class="text-center mt-4" v-if="urlMidia">
              <img v-if="extensao == 'jpg' || 'png' || 'jpeg' || 'gif' || 'webm' " :src="urlMidia" alt="" class="img-thumbnail"
          />
          <video v-else-if="extensao == 'mp4' || 'avi' || '3gp'" width="50%" controls>
            <source type="video/mp4" :src="urlMidia" />
          </video>
          <div v-else>
            <canvas :ref="pdfCanvas"></canvas>
            </div>
              <a
                :href="urlMidia"
                target="__blank"
                class="fs-5 text-center d-block mt-4"
                >{{mensagem_midia}}</a>

            </div>
          </div>
          <div class="modal-footer">
            
            <button v-if="status" type="button" class="btn btn-primary" @click="enviaMidia">
              <span >Enviar</span>
            </button>
            <button v-if="processa_enviar"  type="button" class="btn btn-primary " disabled >
              <span >Enviando...</span>
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

import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.10.111/pdf.worker.min.js`;

export default {
  name: "mandarArquivo",
  components: { Container },
  props: {
    fone: {
      type: String,
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
      processa_enviar: false,
      processando: false,
      mensagem_midia:"",
      extensao: "",
      pdfDocument: null,
      currentPage: 1,
      totalPages: 0,
    };
  },
  created() {
    this.urlMidia = "";
    
  },
  methods: {
    newFile(e) {
      const file = e.target.files[0];
      this.processando = true;
      this.status = false;
      this.midia = file;
      this.geraMidia();
    },
    enviaMidia() {
      this.status = false;

      const obj = {
        user_id: localStorage.getItem("@USER_ID"),
        fone: this.fone,
        midia: this.urlMidia,
        type: 2,
        extensao: this.extensao
       
      };
      this.processa_enviar = true;
      api
        .post("/envia_midianovo/ZmlsYWRlYXRlbmRpbWVudG8=", obj)
        .then((response) => {

          this.status = false;
          this.processa_enviar = false;
          const data = response.data;
          if (data.status) {
            

            const truck_modal = document.querySelector("#mandarArquivo");
            const modal = bootstrap.Modal.getInstance(truck_modal);
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
          
          if (data.status == true){
            
            this.processando = false;
            this.extensao = data.extensao;
          this.status = true;
          this.urlMidia = data.file;
          this.loadPdf();
          this.mensagem_midia = 'Visualizar arquivo antes de enviar';
        }
          else {
            this.processando = false;
            this.urlMidia = data.mensagem;
            this.mensagem_midia = data.mensagem;
            this.status = false;
          }
          //console.log(this.urlMidia);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    async loadPdf() {

      const pdfUrl = 'https://inzupt.com/storage/uploads/enviados/JyE0jMBEdTLfegks118ZnNyqGiY5MiUjxDOBuWZd.pdf'; // Substitua pelo URL ou caminho para o seu PDF
        
      const loadingTask = pdfjsLib.getDocument(pdfUrl, {mode: "no-cors"});
      
      try {
        const pdfDocument = await loadingTask.promise;
        this.pdfDocument = pdfDocument;
        this.totalPages = pdfDocument.numPages;
        
        this.renderPage(this.currentPage);
        
      } catch (error) {

        console.error('Erro ao carregar o PDF:', error);
      }
    },
    async renderPage(pageNumber) {
      const canvas = this.$refs.pdfCanvas;
      const context = canvas.getContext('2d');

      const pdfPage = await this.pdfDocument.getPage(pageNumber);
      const viewport = pdfPage.getViewport({ scale: 1 });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await pdfPage.render(renderContext);
     

    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.renderPage(this.currentPage);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.renderPage(this.currentPage);
      }
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
