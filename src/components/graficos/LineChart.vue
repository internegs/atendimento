<template>
  <!-- <Bar id="my-chart-id" :options="chartOptions" :data="chartData" /> -->

  <LineChartGenerator :options="chartOptions" :data="chartData" />
</template>
  
  <script>
import { Line as LineChartGenerator } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
} from "chart.js";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
);

export default {
  name: "BarChart",
  components: { LineChartGenerator },
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      default: () => {},
    },
  },
};
</script>