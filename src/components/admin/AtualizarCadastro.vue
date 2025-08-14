<template>
  <Container class="mt-4">
    <div class="d-flex flex-column align-items-center mb-3">
      <h1 class="fw-bold">Atualizar Cadastro</h1>
    </div>

    <form
      class="row g-3 bg-white p-4 mb-4"
      style="max-width: 60%; margin: 0 auto"
    >
      <div class="col-md-12 position-relative">
        <select  class="form-select btn-pd" v-model="obj.pfpj">
          <option
            :value="option.value"
            v-for="(option, index) in options"
            :key="index"
            :disabled="option.value === null"
            :selected="option.value === null"
          >
            {{ option.text }}
          </option>
        </select>
      </div>

      <div v-if="obj.pfpj === 2" class="g-2 row">
        <div class="col-md-6">
          <input
            type="text"
            class="form-control btn-pd"
            placeholder="Digite Nome da Sua Empresa"
            name="name"
          />
        </div>
        <div class="col-md-6">
          <input
            type="text"
            class="form-control btn-pd"
            placeholder="Digite seu CPNJ"
            name="name"
            v-model="obj.cnpj"
            v-mask="mascara.cnpj"
          />
        </div>
        <div class="col-md-12" style="padding: 10px 20px 0px 20px">
          <h1 class="fs-3">Dados do representante da empresa</h1>
        </div>
        <hr />
      </div>
      <div class="col-md-12">
        <input
          type="text"
          class="form-control btn-pd"
          placeholder="Digite Seu Nome"
          name="name"
          v-model="obj.name"
        />
        <p
          class="text-start ps-1 mt-1 text-danger fw-bold"
          v-show="errors.name"
        >
          {{ errors.name }}
        </p>
      </div>
      <div v-if="obj.pfpj">
        <div class="col-md-12">
          <input
            type="text"
            class="form-control btn-pd"
            placeholder="CPF"
            v-model="obj.cpf"
            v-mask="mascara.cpf"
          />
        </div>
      </div>
      
      <div class="col-12 col-md-6">
        <input
          type="text"
          name="telefone"
          class="form-control btn-pd"
          placeholder="Digite Seu WhatsApp"
          v-model="obj.telefone_movel"
          v-mask="mascara.cel"
        />
        <p
          class="text-start ps-1 mt-1 text-danger fw-bold"
          v-show="errors.number"
        >
          {{ errors.number }}
        </p>
      </div>
      
      <div class="col-12 col-md-6">
        <input
          type="text"
          name="telefone"
          class="form-control btn-pd"
          placeholder="Digite telefone fixo"
          v-model="obj.telefone_fixo"
          v-mask="mascara.fixo"
        />
        <p
          class="text-start ps-1 mt-1 text-danger fw-bold"
          v-show="errors.telefone_fixo"
        >
          {{ errors.telefone_fixo }}
        </p>
      </div>
 
      <div class="col-12 col-md-6">
        <input
          type="text"
          name="cep"
          class="form-control btn-pd"
          placeholder="Digite seu CEP"
          v-model="obj.cep"
          v-mask="mascara.cep"
          @blur="buscarCep()"
        />
      </div>

      <div class="col-12 col-md-4">
        <input
          type="text"
          name="numero"
          placeholder="Nº"
          class="form-control btn-pd"
          v-model="obj.numero"
        />
      </div>
      <div class="col-12 col-md-8">
        <input
          type="text"
          name="complemento"
          placeholder="Complemento"
          v-model="obj.complemento"
          class="form-control btn-pd"
        />
      </div>

      <div class="col-md-6">
        <input
          type="text"
          name="bairro"
          placeholder="Bairro"
          class="form-control btn-pd"
          v-model="obj.bairro"
        />
      </div>
      <div class="col-md-6">
        <input
          type="text"
          name="endereco"
          placeholder="Endereço"
          class="form-control btn-pd"
          v-model="obj.endereco"
        />
      </div>

      <div class="col-md-6">
        <input
          type="text"
          name="cidade"
          placeholder="Cidade"
          class="form-control btn-pd"
          v-model="obj.cidade"
        />
      </div>
      <div class="col-md-6">
        <input
          type="text"
          name="estado"
          placeholder="Estado"
          class="form-control btn-pd"
          v-model="obj.estado"
        />
      </div>

      <div class="col-12 mt-4 w-100">
        <button class="button-register w-100" @click.prevent="atualizarCadastro()">
          <div v-if="!btn_register">Atualizar</div>
          <div class="spinner-border" role="status" v-else>
            <span class="visually-hidden">Loading...</span>
          </div>
        </button>
      </div>
    </form>
  </Container>
</template>
  
<script>
import Container from "../GLOBALS/container.vue";
import cepApi from "@/services/cep";
import Api from "@/services/api";
import Swal from "sweetalert2";

export default {
  name: "ATUALIZARCADASTRO",
  components: { Container },
  data() {
    return {
      btn_register: false,
      propSituacao: null,
      errors: {
        name: null,
        email: null,
        number: null,
      },
      mascara: {
        cel: "(##) #####-####",
        fixo: "(##) ####-####",
        cep: "#####-###",
        cpf: "###.###.###-##",
        cnpj: "##.###.###/####-##",
      },
      options: [
        { value: null, text: "Pessoa Física ou Pessoa Jurídica?" },
        { value: 1, text: "Pessoa Física" },
        { value: 2, text: "Pessoa Jurídica" },
      ],
      obj: {
        name: null,
        cnpj: null,
        genero: null,
        telefone_movel: null,
        telefone_fixo: null,
        pfpj: null,
        estado: null,
        cpf: null,
        cep: null,
        cidade: null,
        bairro: null,
        endereco: null,
        complemento: null,
        numero: null,
        user_id: null,
       },
    };
  },
  mounted() {
    this.editarcadastro();
  },
  methods: {
    buscarCep() {
      if (this.obj.cep === "") return;

      cepApi
        .get(`${this.obj.cep}/json`)
        .then((response) => {
          let cep = response.data;
          this.obj.complemento = cep.complemento;
          this.obj.bairro = cep.bairro;
          this.obj.cidade = cep.localidade;
          this.obj.estado = cep.uf;
          this.obj.endereco = cep.logradouro;
        })
        .catch((error) => console.error(error));
    },
    editarcadastro() {

      Api.post("/cadastro_edita/ZmlsYWRlYXRlbmRpbWVudG8=", {
        user_id:  localStorage.getItem("@USER_ID"),
      })
        .then((response) => {
          const data = response.data;
          const cadastro = data.cadastro;
          this.obj.name = cadastro.name;
          this.obj.cnpj = cadastro.cnpj;
          this.obj.genero = cadastro.genero;
          this.obj.telefone_movel =  cadastro.telefone_movel;
          this.obj.telefone_fixo =  cadastro.telefone_fixo;
          this.obj.pfpj = cadastro.pfpj;
          this.obj.estado = cadastro.estado;
          this.obj.cpf = cadastro.cpf;
          this.obj.cep = cadastro.cep;
          this.obj.cidade = cadastro.cidade;
          this.obj.bairro = cadastro.bairro;
          this.obj.endereco = cadastro.endereco;
          this.obj.complemento = cadastro.complemento;
          this.obj.numero = cadastro.numero;
      
      //    const truck_modal = document.querySelector("#editModal");
        //  const modal = bootstrap.Modal.getOrCreateInstance(truck_modal);

         // modal.show();
          // modal.show();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    atualizarCadastro() {
      if (this.obj.name === null || this.obj.email === null) return;
      this.obj.user_id =  localStorage.getItem("@USER_ID");
      const newObj = JSON.parse(JSON.stringify(this.obj));

   //   console.log(newObj);
      Api.post("/cadastro_update/ZmlsYWRlYXRlbmRpbWVudG8=",    newObj)
        .then((response) => {

          Swal.fire("Atualizado!", response.data.message, "success");

            })
        .catch((error) => {
           console.error(error);
        });
    },
  },
};
</script>

<style scoped>
.input-metade {
  width: 50% !important;
}

.disable {
  opacity: 0.7;
}

.btn-pd {
  padding: 10px 20px;
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

.icone {
  position: absolute;
  top: 62%;
  font-size: 1.1rem;
  right: 20px;
}

.button-register {
  text-transform: uppercase;
  color: #fff;
  font-weight: bold;

  font-size: 1.1rem;
  padding: 10px 20px;

  border-radius: 5px;

  background-color: #f58634;
}

.bg-branco {
  background-color: #fff;
}

.bg-gray {
  box-shadow: 5px 5px 25px 5px rgba(0, 0, 0, 0.2);
  margin-left: 20px;
}

.input {
  padding: 15px 10px;
  border-radius: 5px;
  border-bottom: 1px dashed #9e9e9e;
  font-size: 1.2rem;
}

.input:hover,
.input:hover i {
  border-color: #f58634;
  color: #f58634;
}

.input input {
  width: 90%;
  background-color: transparent;
  outline: 0;
  padding: 0px 10px;
  border: 0;
}

.input input::placeholder {
  font-size: 1.2rem;
}

.input:nth-child(2) {
  margin-top: 20px;
}

.input i {
  color: #9e9e9e;
  font-size: 20px;
}
.button-login {
  text-transform: uppercase;
  color: #fff;
  font-weight: bold;

  font-size: 1.5rem;
  padding: 10px 20px;

  border-radius: 5px;

  background-color: #f58634;
}
.laranja {
  color: #f58634;
}
.register {
  text-decoration: none;
}
.box-register {
  font-size: 1.1rem;
  text-align: center;
}

@media (max-width: 760px) {
  .input-metade {
    width: 100% !important;
  }
  .telefone {
    width: 100% !important;
  }
  .registroRealizado {
    display: none;
  }
}
</style>
