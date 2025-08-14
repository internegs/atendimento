<template>
  <div class="container-form bg-gray p-4 rounded mt-4 mb-4">
    <div v-if="pagamento_confirmado">
    Pagamento realizado com sucesso!<p>
       Foi encaminhado no e-mail e WhatsApp cadastrados as instruções de acesso.
    </p>
    Número do pedido : {{ pedido }}
    </div>
    <div v-else class="box-pagamentos" :class="pay ? '' : 'disable'">
      <h2 class="text-center" >
        Selecione uma forma de pagamento
      </h2>
      <div class="accordion accordion-flush mt-4" id="accordionFlushExample">
        <div class="accordion-item bg-gray">
          <button
            class="accordion-button collapsed hover-laranja fs-per fw-bold"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#flush-collapseTwo"
            aria-expanded="false"
            :disabled="!pay"
            aria-controls="flush-collapseTwo"
          >
            Cartão de crédito
          </button>

          <div
            id="flush-collapseTwo"
            class="accordion-collapse collapse"
            aria-labelledby="flush-headingTwo"
            data-bs-parent="#accordionFlushExample"
          >
            <div class="accordion-body">
              <h5>Dados do cartão</h5>
              <form class="row g-2">
                <div class="col-md-12">
                  <input
                    type="text"
                    class="form-control btn-pd"
                    placeholder="Digite Nome no Cartão"
                    v-model="obj.nome_cartao"
                  />
                </div>
                <div class="col-md-12">
                  <input
                    type="text"
                    class="form-control btn-pd"
                    placeholder="Digite Número do Cartão"
                    v-mask="mascara.cartao"
                    v-model="obj.numero_cartao"
                  />
                  <p
          class="text-start ps-1 mt-1 text-danger fw-bold"
          v-show="errors.number"
        >
          {{ errors.number }}
        </p>
                </div>
                <div class="col-12 col-xl-6">
                  <input
                    type="text"
                    class="form-control btn-pd"
                    placeholder="Validade"
                    v-mask="mascara.dataValidade"
                    v-model="dataValidade"
                    @change="verificadata()"
                  />
                  <p
          class="text-start ps-1 mt-1 text-danger fw-bold"
          v-show="errors.dataValidade"
        >
          {{ errors.dataValidade }}
        </p>
        <p
          class="text-start ps-1 mt-1 text-danger fw-bold"
          v-show="errors.mes"
        >
          {{ errors.mes }}
        </p>
        <p
          class="text-start ps-1 mt-1 text-danger fw-bold"
          v-show="errors.ano"
        >
          {{ errors.ano }}
        </p>
                </div>
                <div class="col-12 col-xl-6">
                  <input
                    type="text"
                    class="form-control btn-pd"
                    placeholder="CVV"
                    v-mask="mascara.cvv"
                    v-model="obj.cvv"
                  />
                  <p
          class="text-start ps-1 mt-1 text-danger fw-bold"
          v-show="errors.cvv"
        >
          {{ errors.cvv }}
        </p>
                </div>
                <div class="col-md-12 position-relative">
                  <select
                    class="form-select  btn-pd"
                    v-model="obj.propCartao"
                    @change="verificarProp"
                  >
                    <option
                      :value="option.value"
                      v-for="(option, index) in options"
                      :key="index"
                      :disabled="option.value === null"
                    >
                      {{ option.text }}
                    </option>
                  </select>

                </div>

                <div v-if="propSituacao === 1">
                  <div class="col-md-12">
                    <input
                      type="text"
                      class="form-control btn-pd"
                      placeholder="CPF"
                      v-mask="mascara.cpf"
                      v-model="obj.cpf"
                    />
                  </div>
                </div>
                <div v-else-if="propSituacao === 0" class="g-2 row">
                  <div class="col-md-6">
                    <input
                      type="text"
                      class="form-control btn-pd"
                      placeholder="Nome"
                    />
                  </div>
                  <div class="col-md-6">
                    <input
                      type="text"
                      class="form-control btn-pd"
                      placeholder="CPF"
                      v-mask="mascara.cpf"
                      v-model="obj.cpf"
                    />
                  </div>

                  <div class="col-md-12">
                    <input
                      type="text"
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
                      placeholder="Nº"
                      class="form-control btn-pd"
                      v-model="obj.numero"
                    />
                  </div>
                  <div class="col-12 col-md-8">
                    <input
                      type="text"
                      placeholder="Complemento"
                      v-model="obj.complemento"
                      class="form-control btn-pd"
                    />
                  </div>

                  <div class="col-md-6">
                    <input
                      type="text"
                      placeholder="Bairro"
                      class="form-control btn-pd"
                      v-model="obj.bairro"
                    />
                  </div>
                  <div class="col-md-6">
                    <input
                      type="text"
                      placeholder="Endereço"
                      class="form-control btn-pd"
                      v-model="obj.endereco"
                    />
                  </div>

                  <div class="col-md-6">
                    <input
                      type="text"
                      placeholder="Cidade"
                      class="form-control btn-pd"
                      v-model="obj.cidade"
                    />
                  </div>
                  <div class="col-md-6">
                    <input
                      type="text"
                      placeholder="Estado"
                      class="form-control btn-pd"
                      v-model="obj.uf"
                    />
                  </div>
                </div>
                <div class="col-md-12">
              <div v-if="!processando" >
                <p
          class="text-start ps-1 mt-1 text-danger fw-bold"
          v-show="errors.mensagem"
        >
          {{ errors.mensagem }}
        </p>
                <button
                  type="submit"
                  class="button-register w-100"
                  
                  @click="efetuarPagamento(1)"
                >
                  PAGAR COM CARTAO
                </button>
                </div>
                <div class="spinner-border" role="status" v-else>
                  <button
                  type="submit"
                  class="button-register w-100"
                  
                >
                <span class="visually-hidden">Processando...</span>
                </button>
                
                 </div>

                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="accordion-item bg-gray">
          <button
            class="accordion-button collapsed hover-laranja fs-per fw-bold"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#pix"
            aria-expanded="false"
            aria-controls="flush-collapseOne"
            :disabled="!pay"
          >
            PIX
          </button>

          <div
            id="pix"
            class="accordion-collapse collapse"
            aria-labelledby="flush-headingOne"
            data-bs-parent="#accordionFlushExample"
          >
            <div class="accordion-body">
              <div class="col-md-12 mt-4">
                <div v-if="!processando" >
                <button
                  type="submit"
                  class="button-register w-100"
                  
                  @click="efetuarPagamento(2)"
                >
                  PAGAR COM PIX
                </button>
                </div>
                <div class="spinner-border" role="status" v-else>
                  <button
                  type="submit"
                  class="button-register w-100"
                  
                >
                <span class="visually-hidden">Processando...</span>
                </button>
                
                 </div>
              </div>
            </div>
          </div>
        </div>
        <div class="accordion-item bg-gray">
          <button
            class="accordion-button collapsed hover-laranja fs-per fw-bold"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#flush-collapseThree"
            aria-expanded="false"
            aria-controls="flush-collapseThree"
            :disabled="!pay"
          >
            Boleto
          </button>

          <div
            id="flush-collapseThree"
            class="accordion-collapse collapse"
            aria-labelledby="flush-headingThree"
            data-bs-parent="#accordionFlushExample"
          >
            <div class="accordion-body">
              <div class="col-md-12">
                <div v-if="!processando" >
                <button
                  type="submit"
                  class="button-register w-100"
                  
                  @click="efetuarPagamento(3)"
                >
                  PAGAR COM BOLETO
                </button>
                </div>
                <div class="spinner-border" role="status" v-else>
                  <button
                  type="submit"
                  class="button-register w-100"
                  
                >
                <span class="visually-hidden">Processando...</span>
                </button>
                
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- /container -->
</template>

<script>
import Api from '@/services/api';
export default {
  name: "BannerLogin",

  data() {
    return {
      propSituacao: null,
      options: [
        { value: null, text: "Proprietário do cartão?" },
        { value: 1, text: "O próprio Assinante" },
        { value: 0, text: "Outra pessoa" },
      ],
      processando: false,
      obj: {
        plano_id: null,
        cliente_id: null,
        nome_cartao: null,
        numero_cartao: null,
        cvv: null,
        mes_vencimento: null,
        ano_vencimento: null,
        propCartao: null,
        nome_prop_cartao: null,
        cpf: null,
        cep: null,
        uf: null,
        cidade: null,
        bairro: null,
        endereco: null,
        complemento: null,
        numero: null,
        ip: null,
        plano_id: null,
        tipo: null,
      },
      mascara: {
        cartao: "#### #### #### ####",
        cvv: "###",
        dataValidade: "##/##",
        cpf: "###.###.###-##",
        cep: "#####-###",
      },
      errors: {
        dataValidade: null,
        mes: null,
        ano: null,
        number: null,
        cvv: null,
        mensagem: null,
      },
      dataValidade: null,
      btn_pagamento: false,
      ano_atual: null,
      pagamento_confirmado: false,
    };
  },
  methods: {

    verificadata(){

      this.obj.mes_vencimento = +this.dataValidade.slice(0,this.dataValidade.indexOf('/'))
      this.obj.ano_vencimento = +this.dataValidade.slice(this.dataValidade.indexOf('/') + 1)
      this.ano_atual = new Date();
      let ano = this.ano_atual.getFullYear();
      
      if (!this.dataValidade) {
        this.errors.dataValidade = "Preencha a data de validade";
      } 
       if (this.obj.mes_vencimento > 12 || this.obj.mes_vencimento === 0) {
        this.errors.mes = "O mês não pode ser maior que 12 ou 00";
      }else {
        this.errors.mes = null
      }
      

       if (this.obj.ano_vencimento < 23  || this.obj.ano_vencimento === 0 ) {
        this.errors.ano = "O Ano não pode ser menor que 23 ou 00";
      }else {
        this.errors.ano = null
      }

    },
    efetuarPagamento(tipo){

      this.obj.tipo = tipo;
      this.obj.plano_id = this.$route.query.id;

      this.btn_pagamento = true;

       this.obj.mes_vencimento = +this.dataValidade.slice(0,this.dataValidade.indexOf('/'))
       this.obj.ano_vencimento = +this.dataValidade.slice(this.dataValidade.indexOf('/') + 1)
        
    
      this.obj.cliente_id = this.clienteId;
      this.processando = true;


      Api.post('/pagamento_asas', this.obj)
      .then(response => {
        this.btn_pagamento = false;
        this.processando = false;
        this.errors.mensagem = response.data.error
        
        if (response.data.status === true){
          this.pagamento_confirmado = true;

        }
      })
      .catch(error => {
        this.btn_pagamento = false;
        
      })
    },

    apenasNumeros(event) {
      let theEvent = event || window.event;
      let key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
      //let regex = /^[0-9.,]+$/;
      let regex = /^[0-9.]+$/;
      if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
      }
    },
    verificarProp() {
      this.propSituacao = this.obj.propCartao
      // if (propSelectValue === 1) {
      //   this.propSituacao = true;
      // } else if (propSelectValue === 0) {
      //   this.propSituacao = false;
      // }
    },
  },
  props: {
    pay: { type: Boolean },
    clienteId: { type: Number },
  },
};
</script>

<style scoped>
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
  top: 25%;
  font-size: 1.5rem;
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
  margin-left: 10px;
}

.input:hover,
.input:hover i {
  border-color: #f58634;
  color: #f58634;
}

.input input {
  width: 100%;
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

.laranja {
  color: #f58634;
}
@media (max-width: 760px) {
  .btn-pd {
  padding: 10px 20px;

  .bg-gray {
  box-shadow: 5px 5px 25px 5px rgba(0, 0, 0, 0.2);
  margin-left: 0px;
}
}


}
</style>
