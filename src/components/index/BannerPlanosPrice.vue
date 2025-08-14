<template>
  <div class="planos">
    <div
      class="plano sombra p-5"
      v-for="(subplano) in subplanos"
      :key="subplano.id"
      :class="subplano.nome.toLowerCase() === 'premium' ? 'border-laranja' : ''"
    >
      <h2 class="fs-1 fw-bold">{{ subplano.nome }}</h2>

      <h3 class="card-title pricing-card-title text-dark fs-4">
        {{ formatMoney(subplano.valor) }}
      </h3>

      <p class="mt-3">
        {{ subplano.resumo }}
      </p>

      <ul class="list-unstyled mt-3 mb-4">
        <li v-for="(item, index) in subplano.conteudo" :key="index">
          <i class="fa fa-check verde" aria-hidden="true"></i>
          {{ item }}
        </li>
      </ul>

      <router-link 
        :to="{
          name: 'register',
          params: {token: subplano.token},
        }"
        
      >
        <button class="bg-laranja fs-5 comprar">
          <span class="text-white">COMECE AGORA</span>
        </button>
      </router-link>

      
      
    </div>
  </div>
</template>

<script>
import { formatBrMoney } from '@/utils/formatters';

export default {
  name: "BannerPlanosPrice",
  
  props: {
    subplanos: Array,
  },

  methods: {
    formatMoney(value) {
      if (value === 0) return "Consulte-nos";

      return formatBrMoney(value);
    },
  },
};
</script>



<style scoped>
.border-laranja {
  border: 2px solid #f58634;
}
.mt-10 {
  margin-top: 200px;
}

.comprar {
  border-radius: 10px;
  padding: 10px 20px;
}

.verde {
  color: #36b37e;
}

.precos {
  margin: auto;
  width: 90%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.sombra {
  box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.2);
}

.preco {
  height: 400px;
  padding: 4px;
}

.bg-laranja-card {
  background-color: #f58634;
}

.planos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}
.planos .plano {
  border: 1px solid #cdcdcd;
  padding: 20px;
  border-radius: 10px;
}

@media (max-width: 1000px) {
  .precos {
    flex-wrap: wrap;
  }
  .planos {
    gap: 20px;
    grid-template-columns: 1fr;
  }
}
</style>