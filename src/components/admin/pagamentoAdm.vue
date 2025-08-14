<template>
  <Container>
    <div class="d-flex flex-wrap pagamento text-center align-items-center p-4">
      <h1 class="fw-bold">Meus Pagamentos</h1>
    </div>

    <div class="table_section bg-white">
      <table>
        <thead>
          <tr>
            <td>Plano</td>
            <td>Valor</td>
            <td>Referencia</td>
            <td>Vencimento</td>
            <td>STATUS</td>
            <td>AÇÕES</td>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(pagamento, index) in pagamentos" :key="index">
            <td>{{ pagamento.plano }}</td>
            <td>{{ pagamento.valor }}</td>
            <td>{{ pagamento.observacao }}</td>
            <td>{{ pagamento.data_vencimento }}</td>
            <td>{{ filterContatosString(pagamento.status_pagamento) }}</td>
            <td>
              <a :href="pagamento.url_pagamento" target="_blank"
                v-if="pagamento.status_pagamento === 'PENDING' || pagamento.status_pagamento === 'OVERDUE'">Emitir
                pagamento</a>
              <a :href="pagamento.url_comprovante_asas" target="_blank" v-else>Emitir comprovante</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <ADDPLANOADMIN />

  </Container>
</template>

<script>
  import addPlano from "@/components/admin/acao/ADDPLANOADMIN.vue";
  import Container from "../GLOBALS/container.vue";
  import ADDPLANOADMIN from "@/components/admin/acao/ADDPLANOADMIN.vue";
  import Api from "@/services/api";
import { filterContatosString } from "@/utils/statusFilters";

  export default {
    name: "pagamentoAdm",
    components: { addPlano, Container, ADDPLANOADMIN },
    data() {
      return {
        create: false,
        pagamentos: [],
        obj: {
          plano: null,
          valor: null,
          status_pagamento: null,
          created_at: null,
          id: null,
          url_pagamento: null,
        },
      };
    },
    mounted() {
      this.chamarPagamentos();
    },

    methods: {
      filterContatosString,

      chamarPagamentos() {
        Api.post("/ver_pagamentos/ZmlsYWRlYXRlbmRpbWVudG8=", {
          user_id: localStorage.getItem("@USER_ID"),
        })
          .then((response) => {
            const data = response.data;
            this.pagamentos = data.pagamento;
          })
          .catch((error) => {
            console.error(error);
          });
      },
    },
  };
</script>

<style scoped>
.pagamento {
  background-color: rgb(240, 240, 240);
}

.pagamento input {
  border: 1px solid #d0d0d0;
}

.table {
  font-family: "Roboto", sans-serif;
}

.pagamento {
  border-bottom: 2px solid #ababab;
}

.pad-header {
  padding: 10px 20px;
}

@media (max-width: 800px) {
  .pagamento {
    justify-content: center;
    gap: 10px;
  }

  .pagamento div {
    margin: 0;
  }
}

@media (max-width: 500px) {

  .pagamento button,
  input {
    width: 100%;
  }
}

.table_section {
  overflow: auto;
  height: auto;
}

table {
  width: 100%;
  margin: auto;
  table-layout: fixed;
  min-width: 1000px;
}

table th {
  position: sticky;
  top: 0;
  background-color: #f6f9fc;
  color: #8493a5;
  font-size: 1.12rem;
}

th,
td {
  border-bottom: 1px solid #dddd;
  padding: 20px;
  text-align: center;
}

td {
  font-size: 1.2rem;
}

tr:hover td {
  cursor: pointer;
  background-color: #f6f9fc;
}

td img {
  height: 60px;
  width: 60px;
  object-fit: cover;
  border-radius: 50%;
}

body {
  margin-top: 20px;
  background: #eee;
}

/* My Account */
.payments-item img.mr-3 {
  width: 47px;
}

.order-list .btn {
  border-radius: 2px;
  min-width: 121px;
  font-size: 13px;
  padding: 7px 0 7px 0;
}

.osahan-account-page-left .nav-link {
  padding: 18px 20px;
  border: none;
  font-weight: 600;
  color: #535665;
}

.osahan-account-page-left .nav-link i {
  width: 28px;
  height: 28px;
  background: #535665;
  display: inline-block;
  text-align: center;
  line-height: 29px;
  font-size: 15px;
  border-radius: 50px;
  margin: 0 7px 0 0px;
  color: #fff;
}

.osahan-account-page-left .nav-link.active {
  background: #f3f7f8;
  color: #282c3f !important;
}

.osahan-account-page-left .nav-link.active i {
  background: #282c3f !important;
}

.osahan-user-media img {
  width: 90px;
}

.card offer-card h5.card-title {
  border: 2px dotted #000;
}

.card.offer-card h5 {
  border: 1px dotted #daceb7;
  display: inline-table;
  color: #17a2b8;
  margin: 0 0 19px 0;
  font-size: 15px;
  padding: 6px 10px 6px 6px;
  border-radius: 2px;
  background: #fffae6;
  position: relative;
}

.card.offer-card h5 img {
  height: 22px;
  object-fit: cover;
  width: 22px;
  margin: 0 8px 0 0;
  border-radius: 2px;
}

.card.offer-card h5:after {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #daceb7;
  content: "";
  left: 30px;
  position: absolute;
  bottom: 0;
}

.card.offer-card h5:before {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #daceb7;
  content: "";
  left: 30px;
  position: absolute;
  top: 0;
}

.payments-item .media {
  align-items: center;
}

.payments-item .media img {
  margin: 0 40px 0 11px !important;
}

.reviews-members .media .mr-3 {
  width: 56px;
  height: 56px;
  object-fit: cover;
}

.order-list img.mr-4 {
  width: 70px;
  height: 70px;
  object-fit: cover;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  border-radius: 2px;
}

.osahan-cart-item p.text-gray.float-right {
  margin: 3px 0 0 0;
  font-size: 12px;
}

.osahan-cart-item .food-item {
  vertical-align: bottom;
}

.h1,
.h2,
.h3,
.h4,
.h5,
.h6,
h1,
h2,
h3,
h4,
h5,
h6 {
  color: #000000;
}

.shadow-sm {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
}

.rounded-pill {
  border-radius: 50rem !important;
}

a:hover {
  text-decoration: none;
}
</style>
