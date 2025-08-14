<template>
  <div>
    <h2>PLANO PERSONALIZADO- R$ {{ total }}</h2>
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Serviço</th>
          <th scope="col">Quantidade</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in servicos" :key="key" style="cursor: pointer">
          <td>
            <input
              type="checkbox"
              class="form-check-input"
              @click="selecionar(key)"
              :id="'check_' + key"
            />
          </td>
          <td>{{ item.name }}- {{ item.val }}</td>
          <td>
            <select name="" class="form-control">
              <option v-for="(qtd, qkey) in item.max" :keY="qkey">
                {{ qtd }} qtdes
              </option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "PERSONALPLANOADM",
  data() {
    return {
      total: 0.0,
      servicos: [
        { name: "ChatBoot", max: 1, val: 100 },
        { name: "Atendimento", max: 8, val: 200 },
        { name: "Canais", max: 7, val: 300 },
      ],
      selecionados: [],
    };
  },
  methods: {
    selecionar(index) {
      let checkbox = document.getElementById("check_" + index);
      if (checkbox.checked) {
        this.selecionados.push(index);
      } else {
        let indice = this.selecionados.indexOf(index);
        this.selecionados.splice(indice, 1);
      }
      this.somaTotal();
    },
    somaTotal() {
      let teste = this.servicos;
      let sub = 0;
      this.selecionados.forEach(function (i) {
        sub += teste[i].val;
       
      });
      this.total=sub
    },
  },
};
</script>

<style></style>
