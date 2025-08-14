<template>
  <section
    class="
      perguntas
      d-flex
      flex-column
      align-items-center
      justify-content-center
      p-5
    "
    id="faq"
  >
    <h1 class="fw-bold text-center">Perguntas Frequentes</h1>
    <div class="accordion mt-5" id="accordionExample">
      <div class="accordion-item" v-for="per in data" :key="per.id">
        <h2 class="accordion-header" :id="'heading' + per.id">
          <button
            class="accordion-button collapsed hover-laranja fs-per fw-bold"
            type="button"
            data-bs-toggle="collapse"
            :data-bs-target="'#collapse' + per.id"
            :aria-expanded="per.id === 1 ? 'true' : 'false'"
            :aria-controls="'collapse' + per.id"
          >
            {{ per.pergunta }}
          </button>
        </h2>
        <div
          :id="'collapse' + per.id"
          class="accordion-collapse collapse"
          :aria-labelledby="'heading' + per.id"
          data-bs-parent="#accordionExample"
        >
          <div class="accordion-body">
            {{ per.resposta }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
  
  <script>
import Api from "@/services/api";

export default {
  name: "BannerHome",
  data() {
    return {
      data: [],
    };
  },
  mounted() {
    Api.get("/perguntas")
      .then((response) => {
        this.data = response.data;
      })
      .catch((error) => {
        console.error(error);
      });
  },
};
</script>
  
<style scoped>
.perguntas {
  background-color: #F2F2F2;
}

.fs-per {
  font-size: 1.2rem;
}

.accordion {
  width: 100%;
}

.hover-laranja:hover {
  background-color: #f58634;
  color: #fff;
}


.accordion-button:not(.collapsed) {
  background-color: #f58634 !important;
  color: #fff !important;
}

.accordion-button:focus {
  border: 0 !important;
  box-shadow: none !important;
}

.accordion-button::after {
  background-image: url("@/assets/mais.png");
}

@media (max-width: 500px) {
  .fs-per{
    font-size: 1rem;
  }
}
</style>
  