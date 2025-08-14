<template>
  <Container>
    <div
      class="offcanvas offcanvas-end"
      style="width: 100%"
      tabindex="-1"
      id="canvasuser"
      aria-labelledby="offcanvasRightLabel"
    >
      <div class="offcanvas-header d-flex align-items-center">
        <button
          class="btn btn-danger"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        >
          <i
            class="fa fa-arrow-left"
            style="margin-right: 10px"
            aria-hidden="true"
          ></i
          >Voltar
        </button>
        <h5 class="offcanvas-title" id="offcanvasRightLabel">ADD PLANO</h5>

        <div class="col-6 text-end">
          <select
            class="form-control"
            v-model="typePlan"
            @change="changeTypePlan"
          >
            <option value="1">Plano por Combos</option>
            <option value="2">Plano Personalizado</option>
          </select>
        </div>
        <hr />
      </div>
      <div class="offcanvas-body"></div>
    </div>
  </Container>
</template>

<script>
import Container from "@/components/GLOBALS/container.vue";
import Api from "@/services/api";
export default {
  name: "ADDPLANOADMIN",
  components: { Container },
  data() {
    return {
      typePlan: 1,
      planos: [],
    };
  },
  // mounted() {
  //   this.CarregarPlan();
  // },
  methods: {
    changeTypePlan() {
      let valor = this.typePlan;
      if (valor == 1) {
        this.typePlan = 2;
      } else {
        this.typePlan = 1;
      }
    },

    // CarregarPlan() {
    //   Api.get("/planos")
    //     .then((response) => {
    //       console.log(response);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // },
  },
};
</script>

<style></style>
