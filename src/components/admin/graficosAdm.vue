<template>
  <Container class="mt-5">
    <div class="d-flex flex-column align-items-center">
      <h1 class="fw-bold">Gráficos</h1>
    </div>
    <div class="box-grafico">
      <BarChart
        v-if="loaded"
        :chart-data="chartData"
        :chartOptions="chartOptions"
      />
    </div>
  </Container>
</template>


<script>
import Container from "../GLOBALS/container.vue";
import BarChart from "@/components/graficos/BarChart.vue";

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

      loaded: false,

      labels: [],
      data: [],
    };
  },
  mounted() {
    this.buscarDadosGraficos();
  },
  methods: {
    buscarDadosGraficos() {
      Api.post("/grafico/ZmlsYWRlYXRlbmRpbWVudG8=", {
        id: localStorage.getItem("@USER_ID"),
      })
        .then((success) => {

          let dados = success.data;

       //   console.log(dados.grafico1);
          this.labels = Object.keys(dados);
          this.data = Object.values(dados);

        //  console.log(this.labels);
        //  console.log(this.data);
          this.chartData = {
            labels: this.labels,
            datasets: [
              {
                label: "Informações",
                backgroundColor: "#f87979",
                data: this.data,
              },
            ],
          };
          this.loaded = true;

        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>


<style scoped>
.box-grafico {
  height: 400px;
}
</style>