<template>
  <div class="container-form bg-gray p-4 rounded mt-4 register">
    <h2>DADOS</h2>

    <form class="row g-3 mt-2">
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

      <div class="col-md-12">
        <input
          type="email"
          name="email"
          class="form-control btn-pd"
          placeholder="Digite Seu Email"
          v-model="obj.email"
          :disabled="pay"
        />

        <p
          class="text-start ps-1 mt-1 text-danger fw-bold"
          v-show="errors.email"
        >
          {{ errors.email }}
        </p>
      </div>

      <div class="col-md-12">
        <input
          type="text"
          name="telefone"
          class="form-control btn-pd"
          placeholder="Digite Seu WhatsApp"
          v-model="obj.telefone_movel"
          :disabled="pay"
          v-mask="mascara.cel"
        />

        <p
          class="text-start ps-1 mt-1 text-danger fw-bold"
          v-show="errors.number"
        >
          {{ errors.number }}
        </p>
      </div>

      <div class="col-12 mt-4 w-100">
        <button class="button-register w-100" @click.prevent="registrar()">
          <div v-if="!btn_register">Enviar</div>
          <div class="spinner-border" role="status" v-else>
            <span class="visually-hidden">Loading...</span>
          </div>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import cepApi from "@/services/cep";
import Api from "@/services/api";
import Swal from "sweetalert2";

export default {
  name: "BannerRegister",

  props: {
    dados: { type: Object },
    setTokenCad: { type: Function },
    pay: { type: Boolean },
    setClienteId: { type: Function },
  },

  data() {
    return {
      btn_register: false,
      propSituacao: null,
      errors: {
        name: null,
        email: null,
        password: null,
        password2: null,
        number: null,
      },

      mascara: {
        cel: "(##) #####-####",
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
        email: null,
        password: null,
        password2: null,
        cnpj: null,
        genero: null,
        telefone_movel: null,
        pfpj: null,
        estado: null,
        cpf: null,
        cep: null,
        cidade: null,
        bairro: null,
        endereco: null,
        complemento: null,
        numero: null,
        planocliente_id: null,
      },
    };
  },

  methods: {
    verificarProp() {
      this.propSituacao = this.obj.pfpj;
    },

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

    registrar() {
      let validacao = this.validarForm();

      if (validacao) {
        this.btn_register = true;

        this.obj.planocliente_id = this.dados.plano_id;

        Api.post("/registro", this.obj)
          .then((response) => {
            let dados = response.data;
            console.log(dados);

            let tk = dados.token;
            this.setTokenCad(tk);
            this.setClienteId(dados.cliente.id);

            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
            });

            Toast.fire({
              icon: "success",
              title: "Usuário Cadastrado com Sucesso",
            });

            this.btn_register = false;

            this.scroolAnimation(".box-pagamentos");
          })
          .catch((error) => {
            const apiError = error.response.data.message;

            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 5000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
            });

            Toast.fire({
              icon: "error",
              title: apiError,
            });

            this.btn_register = false;
          });
      }

    },

    scroolAnimation(element) {
      const to = document.querySelector(`${element}`).offsetTop;
      console.log(to);
      window.scroll({
        top: 0,
        behavior: "smooth",
      });
    },

    validarForm() {
      if (!this.obj.name) {
        this.errors.name = "O nome é obrigatório.";
      } else if (this.obj.name.length < 5) {
        this.errors.name = "O nome precisa ser completo";
      }

      if (!this.obj.email) {
        this.errors.email = "O e-mail é obrigatório.";
      } else if (!this.validEmail(this.obj.email)) {
        this.errors.email = "Utilize um e-mail válido.";
      }
      if (!this.obj.password) {
        this.errors.password = "A senha é obrigatória.";
      } else if (this.obj.password != this.obj.password2) {
        this.errors.password = "As senha não conferem.";
        this.errors.password2 = "As senha não conferem.";
      }
      if (!this.obj.password2) {
        this.errors.password2 = "Confirmação é obrigatório.";
      }

      if (!this.obj.telefone_movel) {
        this.errors.number = "Telefone é obrigatório.";
      }

      // ajax para verificação de email
      // teste
      const teste = false;
      if (teste) {
        this.errors.email = "Esse email ja foi cadastrado em nosso sistema";
      }

      // length no objeto de erros
      let erros_length = 0;

      for (let key in this.errors) {
        if (this.errors[key]) {
          erros_length++;
        }
      }

      // zerando os erros
      setTimeout(() => {
        this.errors = {
          name: null,
          email: null,
          password: null,
          password2: null,
        };
      }, 10000);

      window.scrollTo(0, 0);

      console.log(this.errors)
      console.log(this.obj)

      //não mexe
      if (!erros_length) {
        return true;
      } else {
        return false;
      }
    },

    validEmail: function (email) {
      var re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
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
