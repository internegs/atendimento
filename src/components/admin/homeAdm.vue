<template>
  <Container class="mt-5">
    <div class="d-flex flex-column align-items-center">
      <h1 class="fw-bold">Dashboard</h1>
    </div>
    <h1 style="margin-top: 30px; color: #757676" class="text-center">
      Total de atendimentos: {{ total_atendimentos }}
    </h1>
    <div class="box-grafico mt-3" style="margin-bottom: 50px; display: ">
      <BarChart
        v-if="loaded"
        :chart-data="chartData3"
        :chartOptions="chartOptions"
      />
    </div>


    <div class="box-grafico mt-2">
      <BarChart
        v-if="loaded"
        :chart-data="chartData"
        :chartOptions="chartOptions"
      />
    </div>
    <div class="box-grafico mt-3">
      <BarChart
        v-if="loaded"
        :chart-data="chartData2"
        :chartOptions="chartOptions"
      />
    </div>

      </Container>
</template>
<script>
import Container from "../GLOBALS/container.vue";
import BarChart from "@/components/graficos/BarChart.vue";
import Swal from "sweetalert2";

import Api from "@/services/api";
export default {
  name: "graficosAdm",
  components: {
    Container,
    BarChart,
  },
  data() {
    return {
      chartData: null,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
      chartData2: null,
      chartData3: null,
      total_atendimentos: 0,
      loaded: false,

      labels: [],
      data: [],

      labels2: [],
      data2: [],

      labels3: [],
      data3: [],
      alerta: "",
    };
  },

  props: {
    dadosPrincipal: {
      type: [Array, Object],
    },
  },
  mounted() {
    // this.teste();
    this.alerta = localStorage.getItem("@MENSAGEM");
    if (this.alerta == 'browserClose' || this.alerta =='Disconnected' ){
      Swal.fire("Celular Desconectado!", 'Reconectar o celular no menu Canais, mensagens não serão enviadas ou recebidas', "error");
      
    } 

    this.buscarDadosGraficos();
    // this.buscarIpUsuario();
  },
  methods: {
    teste() {
      const ref = this.$firebase
        .database()
        .ref("/aW56YXBicmFzaWx2dWU=/instancia_32");

      ref.on("value", (data) => {
        const values = data.val();

        // console.log(values);
      });
    },
    buscarDadosGraficos() {
      Api.post("/grafico/ZmlsYWRlYXRlbmRpbWVudG8=", {
        id: localStorage.getItem("@USER_ID"),
      })
        .then((success) => {
          let dados = success.data;

          this.montarGraficos(dados);
        })
        .catch((error) => {
          console.error(error);
        });
    },

    zerarDados() {
      this.label = [];
      this.labels2 = [];
      this.labels3 = [];

      this.data = [];
      this.data2 = [];
      this.data3 = [];
    },
    montarGraficos(dados) {
      this.zerarDados();
      let dados_graficos_1 = dados.grafico1;
      let dados_graficos_2 = dados.grafico2;
      let dados_graficos_3 = dados.grafico3;

      this.total_atendimentos = dados.qtdatendimentomes;

      this.labels = Object.keys(dados_graficos_1);
      this.data = Object.values(dados_graficos_1);

      dados_graficos_2.forEach((element) => {
        element.forEach((values) => {
          this.labels2.push(values.nome);
          this.data2.push(values.quantidade);
        });
      });
      dados_graficos_3.forEach((values) => {
        this.labels3.push(values.nome);
        this.data3.push(values.qtd);
      });
    //  console.log(this.labels3);
    //  console.log(this.data3);

      this.chartData = {
        labels: this.labels,
        datasets: [
          {
            label: "Mensagens recebidas/mês",
            backgroundColor: "#56ACD3",
            data: this.data,
          },
        ],
      };
      this.chartData2 = {
        labels: this.labels2,
        datasets: [
          {
            label: "Mensagens recebidas por atendente",
            backgroundColor: "#10234F",
            data: this.data2,
          },
        ],
      };
      this.chartData3 = {
        labels: this.labels3,
        datasets: [
          {
            label: "Atendimentos por atendente",
            backgroundColor: "#f58634",
            data: this.data3,
          },
        ],
      };

      this.loaded = true;
    },
    buscarIpUsuario() {
      fetch("http://ip-api.com/json/")
        .then((data) => data.json())
        .then((success) => {
     //     console.log(success);
        });
    },
  },
  watch: {
    dadosPrincipal: function () {
      this.montarGraficos(this.dadosPrincipal);
    },
  },
};
</script>


<style scoped>
/* .box-grafico {
  height: 400px;
  display: flex;
} */

.box-grafico {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>

