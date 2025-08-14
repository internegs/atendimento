<template>
  <section class="apresentacao p-4" style="padding-top: 60px">
    <div class="container-fluid">
      <div
        class="row d-flex flex-md-row justify-content-around align-items-center"
      >

      
      <div class="col-md-4 text-center">
          <h1 class="fw-bold f-36 text-dark  font-oswald titulo-plataforma">{{data[6].titulo}}</h1>
          <p class="text-dark mt-3 fs-4">
            {{data[6].resumo}}
          </p>

        </div>

        <div class="col-md-4 text-center">
          <img 
            src="../../assets/img/whatsapp.png"
            alt="marketing"
            class="img-apresentacao"
          />
          <div class="btn-div mt-2">
              <a  href="#planos" class="bg-laranja text-white rounded fs-4 fw-bold hover btn-pad" >
                CONHEÇA NOSSOS PLANOS
              </a>
          </div>
        </div>

        <div class="col-md-4 d-flex flex-column text-center" >
          <h1 class="fw-bold f-36 text-dark font-oswald">{{data[7].titulo}}</h1>
          <p class="text-dark mt-3 fs-4">
            {{data[7].resumo}}
          </p>

        </div>
      </div>
    </div>
  </section>
</template>


<script>
export default {
  name: "BannerHome",

  props: {
    data: Array,
  },
};
</script>


<style scoped>
.img-apresentacao {
  width: 250px;
}
 
.apresentacao {
  
 background:  #f2f2f2;
}

.btn-pad {
  padding: 15px 20px;
}

.hover:hover{
  background-color: #ce5600;
}
.f-36 {
  font-size: 46px;
}
.img-home {
  width: 90%;
}
.mr-60 {
  margin-right: 60px;
}
.btn-div button {
  padding: 10px 20px;
}

@media (max-width: 900px) {




  .img-apresentacao {
    margin-top: 30px;
    width: 100%;
  }
}

@media (max-width: 750px) {
  .btn-div a {
    width: 100%;
  }
}

.bg-color {
  background-image: linear-gradient(to right, #7ED0DD, #5ba3ca);
}
</style>