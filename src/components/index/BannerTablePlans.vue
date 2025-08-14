<template>
  <div class="table-responsive">
    <h2 class="display-6 text-center mb-4 fw-bold mt-5" style="color: #091e42">
      Compare os planos
    </h2>
    <table class="table text-center mt-3">
      <thead>
        <tr>
          <th style="width: 34%"></th>
          <th style="width: 22%">STANDARD</th>
          <th style="width: 22%">PREMIUM</th>
          <th style="width: 22%">ENTERPRISE</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row" class="text-start">Instagram</th>
          <td>
            <span class="material-icons verde"> done </span>
          </td>
          <td>
            <span class="material-icons verde"> done </span>
          </td>
          <td>
            <span class="material-icons verde"> done </span>
          </td>
        </tr>
        <tr>
          <th scope="row" class="text-start">Multiplo Atendente</th>
          <td>
            <span class="material-icons verde"> done </span>
          </td>
          <td>
            <span class="material-icons verde"> done </span>
          </td>
          <td>
            <span class="material-icons verde"> done </span>
          </td>
        </tr>
        <tr>
          <th scope="row" class="text-start">Whatsapp</th>
          <td>
            <span class="material-icons verde"> done </span>
          </td>
          <td>
            <span class="material-icons verde"> done </span>
          </td>
          <td>
            <span class="material-icons verde"> done </span>
          </td>
        </tr>
        <tr>
          <th scope="row" class="text-start">Chat ao vivo</th>
          <td></td>
          <td>
            <span class="material-icons verde"> done </span>
          </td>
          <td>
            <span class="material-icons verde"> done </span>
          </td>
        </tr>
        <tr>
          <th scope="row" class="text-start">MSN</th>
          <td></td>
          <td></td>
          <td>
            <span class="material-icons verde"> done </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "BannerTablePlans",
  props: {
    data: Array,
  },
};
</script>

<style scoped>
.verde {
  color: #36b37e;
}
table {
  color: #7a7979;
}
td {
  padding: 20px;
  border: 1px solid #d7d7d7;
}

th {
  border-bottom: 1px solid #d7d7d7;
}
</style>