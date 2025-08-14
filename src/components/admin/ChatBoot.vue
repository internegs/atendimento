<template>

  <container class="p-1">

    <div class="d-flex flex-column align-items-center mb-2 mt-2">
      <h1 class="fw-bold">CONFIGURAÇÃO CHATBOT</h1>
    </div>

    <div class="container-fluid bg-white" v-if="tipo_chatbot == 1" style="padding: 20px">
      <div class="form-check form-switch ms-4">
        <input class="form-check-input fs-2" type="checkbox" :checked="statusChatBot" role="switch"
          id="flexSwitchCheckDefault" @change="ativarChatBot" />

        <label v-if="statusChatBot == 0" class="form-check-label fs-2" for="flexSwitchCheckDefault">Ativar
          Chatbot</label>
        <label v-if="statusChatBot == 1" class="form-check-label fs-2" for="flexSwitchCheckDefault">Desativar
          Chatbot</label>


      </div>
      <div v-if="statusChatBot == 1" class="form-check form-switch ms-4">
        <input class="form-check-input fs-2" type="checkbox" :checked="statusSetor" role="switch"
          id="flexSwitchCheckDefault" @change="ativarPorSetor" />

        <label v-if="statusSetor == 0" class="form-check-label fs-2" for="flexSwitchCheckDefault">Ativar por
          Setor</label>
        <label v-if="statusSetor == 1" class="form-check-label fs-2" for="flexSwitchCheckDefault">Desativar por
          setor</label>

      </div>


      <h4 class="text-center fw-bold mt-3 mb-3">INFORMAÇÕES</h4>

      <div class="input-group mb-2">
        <span class="input-group-text">Saudação Inicial</span>
        <textarea v-if="statusChatBot != 0" class="form-control" v-model="objMenu.pergunta" rows="1"></textarea>
      </div>
      <div class="input-group mb-3" v-if="statusChatBot != 0">
        <span class="input-group-text">Horário de atendimento </span>
        <div class="inputs">
          <span>Inicio expediente</span>
          <input type="time" placeholder="Inicio expediente" class="form-control" v-model="objMenu.hora1" />
          <span>Fim expediente</span>
          <input type="time" placeholder="Fim expediente" class="form-control" v-model="objMenu.hora2" />
          <span>Inicio almoço</span>
          <input type="time" placeholder="Inicio almoço" class="form-control" v-model="objMenu.hora3" />
          <span>Fim almoço</span>
          <input type="time" placeholder="Fim almoço" class="form-control" v-model="objMenu.hora4" />
        </div>
      </div>
      <div class="input-group mb-3" v-if="statusChatBot != 0">
        <span class="input-group-text">Dias de atendimento </span>


        <div class="dias_semana">
          <input type="checkbox" class="form-check-input" :data-id="objMenu.segunda" :checked="objMenu.segunda == 1"
            @click="checked($event, 'segunda')" />
          <span>Segunda</span>
        </div>
        <div class="dias_semana">
          <input type="checkbox" class="form-check-input" :data-id="objMenu.terca" :checked="objMenu.terca == 1"
            @click="checked($event, 'terca')" />
          <span>Terça</span>
        </div>
        <div class="dias_semana">
          <input type="checkbox" class="form-check-input" :data-id="objMenu.quarta" :checked="objMenu.quarta == 1"
            @click="checked($event, 'quarta')" />
          <span>Quarta</span>
        </div>
        <div class="dias_semana">
          <input type="checkbox" class="form-check-input" :data-id="objMenu.quinta" :checked="objMenu.quinta == 1"
            @click="checked($event, 'quinta')" />
          <span>Quinta</span>
        </div>
        <div class="dias_semana">
          <input type="checkbox" class="form-check-input" :data-id="objMenu.sexta" :checked="objMenu.sexta == 1"
            @click="checked($event, 'sexta')" />
          <span>Sexta</span>
        </div>
        <div class="dias_semana">
          <input type="checkbox" class="form-check-input" :data-id="objMenu.sabado" :checked="objMenu.sabado == 1"
            @click="checked($event, 'sabado')" />
          <span>Sabádo</span>
        </div>
        <div class="dias_semana">
          <input type="checkbox" class="form-check-input" :data-id="objMenu.domingo" :checked="objMenu.domingo == 1"
            @click="checked($event, 'domingo')" />
          <span>Domingo</span>
        </div>
        <button v-if="tipo_chatbot == 2" class="btn btn-primary fs-4" style="padding: 10px 15px"
          @click="chamarDadosChatBot(1)">
          Salvar
        </button>
      </div>

    </div>


    <h4 class="text-center fw-bold mt-3 mb-3">ChatBot</h4>
    <div class="input-group mb-3" v-if="tipo_chatbot == 2">

      <span class="input-group-text">Mensagem inicial</span>

      <input v-model.number="objMenu.mensagem_inicial" type="text" class="form-control">

    </div>


    <div class="table-responsive d-flex flex-column align-items-center mt-4" v-if="tipo_chatbot == 2">

      <table class="table table-striped table-hover mb-4">
        <thead>
          <tr>

            <th colspan="1">Texto da lista</th>
            <th colspan="3">Resposta</th>
            <th colspan="2">Link</th>
            <th colspan="1">Opção</th>

          </tr>
        </thead>
        <tbody>
          <tr scope="rows" v-for="(dados, indice) in dados_opcao">

            <td colspan="1">
              <input class="form-control text-input" maxlength="24" readonly v-model="dados.texto_opcao"
                placeholder="Digite a nova opção opção" type="text">
            </td>

            <td colspan="3"><input class="form-control " v-model="dados.resposta">

            </td>
            <td colspan="2">
              <input class="form-control text-input" v-model="dados.link_opcao">


            </td>
            <td colspan="1">
              <button v-if="statusChatBot != 0" class="btn btn-primary fs-4" style="padding: 10px 15px"
                @click="gravarchatbot_medicos(dados.texto_opcao, dados.resposta, dados.link_opcao, dados.id)">
                Salvar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>

      <!--    fim  chatbot 2 -->


      <div v-if="tipo_chatbot == 1">
        <div class="input-group mb-3">
          <span class="input-group-text">Setores</span>
          <textarea disabled class="form-control" aria-label="With textarea" v-model="objMenu.setores" rows="5">
        </textarea>
        </div>
        <div class="input-group mb-3">
          <span class="input-group-text">Resposta depois da escolha</span>
          <textarea v-if="statusChatBot != 0" class="form-control" aria-label="With textarea"
            v-model="objMenu.resposta"></textarea>
        </div>
        <div class="input-group mb-3">
          <span class="input-group-text">Resposta após selecionada uma opção</span>
          <textarea v-if="statusChatBot != 0" class="form-control" aria-label="With textarea"
            v-model="objMenu.resposta_selecionado"></textarea>
        </div>
        <div class="input-group mb-3">
          <span class="input-group-text">Resposta de finalização</span>
          <textarea v-if="statusChatBot != 0" class="form-control" aria-label="With textarea"
            v-model="objMenu.resposta_final"></textarea>
        </div>


        <div class="input-group mb-3" v-if="statusChatBot != 0">
          <span class="input-group-text">Horário de atendimento </span>
          <div class="inputs">
            <span>Inicio expediente</span>
            <input type="time" placeholder="Inicio expediente" class="form-control" v-model="objMenu.hora1" />
            <span>Fim expediente</span>
            <input type="time" placeholder="Fim expediente" class="form-control" v-model="objMenu.hora2" />
            <span>Inicio almoço</span>
            <input type="time" placeholder="Inicio almoço" class="form-control" v-model="objMenu.hora3" />
            <span>Fim almoço</span>
            <input type="time" placeholder="Fim almoço" class="form-control" v-model="objMenu.hora4" />
          </div>
        </div>
        <div class="input-group mb-3" v-if="statusChatBot != 0">
          <span class="input-group-text">Dias de atendimento </span>


          <div class="dias_semana">
            <input type="checkbox" class="form-check-input" :data-id="objMenu.segunda" :checked="objMenu.segunda == 1"
              @click="checked($event, 'segunda')" />
            <span>Segunda</span>
          </div>
          <div class="dias_semana">
            <input type="checkbox" class="form-check-input" :data-id="objMenu.terca" :checked="objMenu.terca == 1"
              @click="checked($event, 'terca')" />
            <span>Terça</span>
          </div>
          <div class="dias_semana">
            <input type="checkbox" class="form-check-input" :data-id="objMenu.quarta" :checked="objMenu.quarta == 1"
              @click="checked($event, 'quarta')" />
            <span>Quarta</span>
          </div>
          <div class="dias_semana">
            <input type="checkbox" class="form-check-input" :data-id="objMenu.quinta" :checked="objMenu.quinta == 1"
              @click="checked($event, 'quinta')" />
            <span>Quinta</span>
          </div>
          <div class="dias_semana">
            <input type="checkbox" class="form-check-input" :data-id="objMenu.sexta" :checked="objMenu.sexta == 1"
              @click="checked($event, 'sexta')" />
            <span>Sexta</span>
          </div>
          <div class="dias_semana">
            <input type="checkbox" class="form-check-input" :data-id="objMenu.sabado" :checked="objMenu.sabado == 1"
              @click="checked($event, 'sabado')" />
            <span>Sabádo</span>
          </div>
          <div class="dias_semana">
            <input type="checkbox" class="form-check-input" :data-id="objMenu.domingo" :checked="objMenu.domingo == 1"
              @click="checked($event, 'domingo')" />
            <span>Domingo</span>
          </div>
        </div>
      </div>

      <button v-if="tipo_chatbot == 1" class="btn btn-primary fs-4" style="padding: 10px 15px"
        @click="chamarDadosChatBot(1)">
        Salvar
      </button>
    </div>
  </container>

</template>

<script>
import api from "@/services/api";
import container from "../GLOBALS/container.vue";
import Swal from "sweetalert2";

export default {
  name: "ChatBoot",

  components: { container },

  data() {
    return {
      edita: false,
      nome: 'sub',
      dados_opcao: [],
      dados_subopcao: [],
      setores: [],
      tipo: 0,
      id_sub: 0,
      objMenu: {
        texto_opcao: "",
        qtd_subopcao: 0,
        qtd_opcao: 0,
        opcao: [],
        subopcao: [],
        indice_tipo: 0,
        pergunta: "",
        resposta: "",
        resposta_final: "",
        resposta_selecionado: "",
        hora1: "",
        hora2: "",
        hora3: "",
        hora4: "",
        dias_semana: [],
        setores: [],
        segunda: 0,
        terca: 0,
        quarta: 0,
        quinta: 0,
        sexta: 0,
        sabado: 0,
        domingo: 0,
        tipo_opcao0: 0,
        mensagem_inicial: ""
      },

      texto_opcao: "",
      resposta: "",
      resposta_final: "",
      link_opcao: '',

      processando: false,
      grava: 0,


      mascara: {
        hora: "##:##",
      },

      statusChatBot: false,
      statusSetor: false,
      tipo_chatbot: 0
    };
  },

  mounted() {
    this.chamarDadosChatBot();
    this.chamarSetores();
    this.dadoschatBot_opcao();
  },

  methods: {

    grava_opcoes(tipo) {

      this.precessando = true;
      let obj = {
        tipo: tipo,
        id: localStorage.getItem("@USER_ID"),
        ...this.objMenu,

      };

      api
        .post("/chatbot_opcao/ZmlsYWRlYXRlbmRpbWVudG8=", obj)
        .then((response) => {
          let data = response.data;
          // console.log(data);
          this.processando = false;
          if (data.atualizado) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ATUALIZADO COM SUCESSO!",
              showConfirmButton: true,
            });
          }
          // this.statusChatBot = data.ativo;
          this.dadoschatBot_opcao();
          if (data.dados === null) return;

        })
        .catch((error) => {
          console.error(error);
        });

    },

    editar(tipo, id) {
      this.objMenu.texto_opcao = this.dados.texto_opcao
      console.log(this.objMenu.texto_opcao)
      let obj = {
        id_sub: id,
        tipo: tipo,
        id: localStorage.getItem("@USER_ID"),
        ...this.dados,


      };


    },

    gravarchatbot_medicos(texto, resposta, link, id) {

      let obj = {
        pergunta: texto,
        resposta: resposta,
        link: link,
        id: id
      }


      api
        .post("/chatbot_medicos/ZmlsYWRlYXRlbmRpbWVudG8=", obj)
        .then((response) => {
          let data = response.data;

          if (data.atualizado) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ATUALIZADO COM SUCESSO!",
              showConfirmButton: true,
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });

    },

    grava_subopcoes(tipo, id) {

      this.precessando = true;
      let obj = {
        id_sub: id,
        tipo: tipo,
        id: localStorage.getItem("@USER_ID"),
        ...this.objMenu,

      };

      api
        .post("/chatbot_opcao/ZmlsYWRlYXRlbmRpbWVudG8=", obj)
        .then((response) => {
          let data = response.data;
          // console.log(data);
          this.processando = false;
          if (data.atualizado) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ATUALIZADO COM SUCESSO!",
              showConfirmButton: true,
            });
          }

          // this.statusChatBot = data.ativo;

          if (data.dados === null) return;

        })
        .catch((error) => {
          console.error(error);
        });

    },

    dadoschatBot_opcao(grava) {
      this.grava = grava;

      let obj = {
        grava: this.grava,

        id: localStorage.getItem("@USER_ID"),
        ...this.objMenu,
      };

      api
        .post("/chatbot_geral/ZmlsYWRlYXRlbmRpbWVudG8=", obj)
        .then((response) => {
          let data = response.data;

          if (data.atualizado) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ATUALIZADO COM SUCESSO!",
              showConfirmButton: true,
            });
          }

          this.objMenu.qtd_opcao = data.qtd_opcao;

          this.dados_opcao = data.dados;

          this.dados_subopcao = data.subopcao;
          this.objMenu.mensagem_inicial = data.inicial.saudacao_inicial;


          if (data.dados === null) return;



        })
        .catch((error) => {
          console.error(error);
        });
    },

    chamarDadosChatBot(grava) {
      this.grava = grava;


      let obj = {
        grava: this.grava,
        id: localStorage.getItem("@USER_ID"),
        ...this.objMenu,
      };

      api
        .post("/chatbotapi/ZmlsYWRlYXRlbmRpbWVudG8=", obj)
        .then((response) => {
          let data = response.data;

          if (data.atualizado) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ATUALIZADO COM SUCESSO!",
              showConfirmButton: true,
            });
          }
          this.tipo_chatbot = data.tipo;
          this.statusChatBot = data.ativo;


          if (data.dados === null) return;

          this.objMenu.pergunta = data.dados.pergunta;
          this.objMenu.resposta = data.dados.resposta;
          this.objMenu.resposta_final = data.dados.resposta_final;
          this.objMenu.resposta_selecionado = data.dados.resposta_selecionado;
          this.objMenu.resposta_selecionado = data.dados.resposta_selecionado;
          this.objMenu.hora1 = data.dados.hora1;
          this.objMenu.hora2 = data.dados.hora2;
          this.objMenu.hora3 = data.dados.hora3;
          this.objMenu.hora4 = data.dados.hora4;


          this.objMenu.segunda = data.dados.segunda;
          this.objMenu.terca = data.dados.terca;
          this.objMenu.quarta = data.dados.quarta;
          this.objMenu.quinta = data.dados.quinta;
          this.objMenu.sexta = data.dados.sexta;
          this.objMenu.sabado = data.dados.sabado;
          this.objMenu.domingo = data.dados.domingo;



        })
        .catch((error) => {
          console.error(error);
        });
    },

    chamarSetores() {
      api
        .post("/setores/ZmlsYWRlYXRlbmRpbWVudG8=", {
          id: localStorage.getItem("@USER_ID"),
        })
        .then((response) => {
          let data = response.data;
          this.setores = data.setores;

          let textoFormatado = this.setores.reduce((acc, element) => {
            acc += element.vinculo_id + " - " + element.nome + "\n";

            return acc;
          }, "");

          this.objMenu.setores = "\n" + textoFormatado;
        })
        .catch((erro) => console.error(erro));
    },

    ativarChatBot() {
      this.statusChatBot = !this.statusChatBot;

      let obj = {
        id: localStorage.getItem("@USER_ID"),
        ativo: this.statusChatBot,
      };

      api
        .post("/ativar_chatbot/ZmlsYWRlYXRlbmRpbWVudG8=", obj)
        .then((response) => {
          let data = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    
    ativarPorSetor() {
      this.statusSetor = !this.statusSetor;

      let obj = {
        id: localStorage.getItem("@USER_ID"),
        porsetor: this.statusSetor
      };

      api
        .post("/ativar_chatbot/ZmlsYWRlYXRlbmRpbWVudG8=", obj)
        .then((response) => {
          let data = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    checked({ target }, dia) {
      let checkbox = target;
      const id = checkbox.getAttribute("data-id");

      if (checkbox.checked) {
        //     console.log("marcado");
        this.objMenu[dia] = 1;
        checkbox.setAttribute("data-id", 1);
      } else {

        //    console.log("nao marcado");
        this.objMenu[dia] = 0;
        checkbox.setAttribute("data-id", 0);
      }

      // console.log(this.objMenu);
    },
  },

};
</script>

<style scoped>
.text-input {
  width: 100%
}

.box {
  width: 50%;
  box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.2);
}

.container {
  padding-top: 2%;
  margin-left: 15%;
}

.inputs {
  display: flex;
  padding-left: 10px;
  gap: 10px;
}

.inputs input {
  padding: 10px;
}

.dias_semana {
  display: flex;
  align-items: center;
  padding: 10px;
  gap: 10px;
}

.dias_semana input {
  padding: 10px;
}

.dias_semana span {
  font-size: 0.985rem;
}

@media (max-width: 1200px) {
  .inputs {
    margin-top: 10px;
  }
}

@media (max-width: 600px) {
  .inputs {
    flex-direction: column;
  }
}
</style>
