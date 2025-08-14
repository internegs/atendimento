<template>
  <Container :nome="nome" class="bg-cinza p-5">
    <div class="d-flex flex-column align-items-center">
      <h1 class="fw-bold">Meus Canais</h1>
    </div>
    
    <div class="grid text-center mt-2 gap-4">
      <div
        class="bg-white p-5 d-flex flex-column rounded mt-3"
        v-for="(linha, index) in linhas"
        :key="index"
      >
        <h1 class="text-uppercase text-center fs-3">
          Celular - {{ linha.number }}
        </h1>
        <div v-if="linha.state === 'Connected' || linha.state === 'inChat'">
          <img :src="objImg.success" width="180px" alt="" />
          <button
            class="btn btn-primary mt-5 btn-pad w-100 fw-bold"
            @click="desconectar()"
          >
            <span v-if="status === 0">DESCONECTAR</span>
            <span v-if="status === 1">Processando...</span>
            <span v-if="status === 2">Desconectado com sucesso!</span>
          </button>

          <button
            class="btn btn-warning mt-5 text-uppercase btn-pad w-100 fw-bold"
            @click="importa_contatos()"
          >
            <span v-if="status === 0">Importar Contatos</span>
            <span v-if="status === 3">Importando...</span>
            <span v-if="status === 4"
              >{{ qtd_contatos }} Contatos importados com sucesso!</span
            >
          </button>
        </div>

        <div
          v-if="
            linha.state === 'autocloseCalled' ||
            linha.state === 'STARTING' ||
            linha.state === 'UNPAIRED' ||
            linha.state === 'notLogged' ||
            linha.state === 'qrReadError' ||
            linha.state === 'browserClose'  
            
          "
        >
          <img :src="linha.qrcode" alt="" />

          <button
            class="btn btn-primary mt-5 btn-pad w-100 fw-bold"
            @click="gerarQrcode()"
          >
            <span v-if="status === 0">ATUALIZAR QRCODE</span>
            <span v-if="status === 5">Atualizando...</span>
            <span v-if="status === 6">QRCODE atualizado com sucesso!</span>
          </button>
        </div>

        <div v-if="linha.state === 'Disconnected'">
          <img :src="objImg.error" width="150px"  alt="" />

          <button
            class="btn btn-primary mt-5 btn-pad w-100 fw-bold"
            @click="gerarQrcode()"
          >
            <span v-if="status === 0">GERAR QRCODE</span>
            <span v-if="status === 5">Atualizando...</span>
            <span v-if="status === 6">QRCODE Gerado com sucesso!</span>
          </button>
        </div>

        <div v-if="linha.state === 'logout'">
          <img :src="objImg.error" alt="" />

          <button
            class="btn btn-primary mt-5 btn-pad w-100 fw-bold"
            @click="gerarQrcode()"
          >
            <span v-if="status === 0">GERAR QRCODE</span>
            <span v-if="status === 5">Atualizando...</span>
            <span v-if="status === 2">GERAR QRCODE!</span>
          </button>
        </div>
      </div>
    </div>
  </Container>
</template>
<script>
import Container from "../GLOBALS/container.vue";
import Api from "@/services/api";
import { getDatabase, ref, onValue } from 'firebase/database'

export default {
  name: "canaisAdm",

  components: { Container },

  data() {
    return {
      qtd_contatos: "",
      nome: "viana",
      color: "danger",
      status: 0,
      pesquisa: "",
      linhas: [],
      objImg: {
        success:
          "https://inzupt.com.br/sucesso.png",
        error: "https://inzupt.com.br/erro.jpg",
      },
    };
  },

  created() {
    //
  },

  mounted() {
    this.canalAtualiza();
    this.consultaConexao();
  },

  methods: {
    canalAtualiza() {
      const session = localStorage.getItem("@SESSION") || ""; 
  
      const instancia = "aW56YXBicmFzaWx2dWU=/" + session + "/CANAL";
      
      const dbRef = ref(this.$database, `/${instancia}`);

      onValue(dbRef, (data) => {
        const values = data.val();

        console.log(values);

        this.chamarLinhas();
      });
    },

    chamarLinhas() {
      Api.post("/linhas/ZmlsYWRlYXRlbmRpbWVudG8=", {
        id: localStorage.getItem("@USER_ID"),
      })
        .then((response) => {
          const data = response.data;

          this.linhas = data.linhas;
        })
        .catch((error) => console.error(error));
    },

    consultaConexao() {
      Api.post("/status_conexao/ZmlsYWRlYXRlbmRpbWVudG8=", {
        id: localStorage.getItem("@USER_ID"),
      })
        .then((response) => {
          const data = response.data;

          this.linhas = data.linhas;
        })
        .catch((error) => console.error(error));
    },
    
    gerarQrcode() {
      this.status = 5;
      Api.post("/conectar/ZmlsYWRlYXRlbmRpbWVudG8=", {
        id: localStorage.getItem("@USER_ID"),
      })
        .then((response) => {
          const data = response;
          this.status = 6;
          this.chamarLinhas();
        })
        .catch((error) => console.error(error));
    },

    desconectar() {
      this.status = 1;
      Api.post("/desconectar/ZmlsYWRlYXRlbmRpbWVudG8=", {
        id: localStorage.getItem("@USER_ID"),
      })
        .then((response) => {
          const data = response.data;
          this.status = 2;
          this.chamarLinhas();
        })
        .catch((error) => console.error(error));
    },

    importa_contatos() {
      this.status = 3;
      Api.post("/importa_contatos/ZmlsYWRlYXRlbmRpbWVudG8=", {
        id: localStorage.getItem("@USER_ID"),
      })
        .then((response) => {
          const data = response.data;
          this.qtd_contatos = data.count;
          this.status = 4;
        })
        .catch((error) => console.error(error));
    },
  },
};

</script>

<style scoped>
.pad-header {
  padding: 10px 20px;
}
.form-pad {
  padding: 10px 20px;
}


.usuarios input {
  border: 1px solid #d0d0d0;
}

.table {
  font-family: "Roboto", sans-serif;
}

.usuarios {
  border-bottom: 2px solid #ababab;
}

@media (max-width: 680px) {
  .usuarios {
    justify-content: center;
    gap: 10px;
  }

  .usuarios div {
    margin: 0;
  }
}
@media (max-width: 570px) {
  .usuarios button,
  input {
    width: 100%;
  }
}

.btn-pad {
  padding: 10px 15px;
}
.inativo {
  opacity: 0.6;
  position: relative;
  transition-duration: 0.5s;
}

.canais {
  border-bottom: 2px solid #ababab;
}

.card {
  width: 18em;
  margin-right: 15px;
  margin-left: 15px;

  border: 1px dotted black;
}

img {
  max-width: 100%;
}
.grid {
  max-width: 1200px;
  width: 80%;
  margin: auto;

  display: grid;
  grid-template-columns: repeat(2, minmax(350px, 1fr));
}

@media (max-width: 550px) {
  .canais {
    justify-content: center;
    gap: 10px;
  }

  .canais button {
    margin: 0;
  }
}

@media (max-width: 900px) {
  .grid {
    place-content: center;
    grid-template-columns: 300px;
  }
}
</style>
