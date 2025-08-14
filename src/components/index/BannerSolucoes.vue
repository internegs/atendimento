<template>
  <section class="solucoes">
    <h1 class="text-center fs-10 font-oswald" style="padding-top: 50px">
      Por que escolher a plataforma INZUPT?
    </h1>
    <div class="container" style="margin-top: 40px">
      <div class="solucoes-grid">
       
        <div class="card solucao sombra" style="border-radius: 20px;" v-for="dados in data" :key="dados.id">


          <img v-show="dados.url_icon" :src="dados.url_icon" class="card-img-top  imagem"  />

          <div class="card-body">
            <h5 class="card-title text-dark fs-3 text-center">{{dados.titulo}}</h5>
            <p class="card-text text-center">
              {{dados.resumo}}
            </p>
          </div>
        </div>
        
      </div>
    </div>
  </section>
</template>


<script>

import Api from "@/services/api";

export default {
  name: "BannerSolucoes",
  data(){
    return{
      data: []
    }
  },
  mounted() {
    Api.get("/funcionalidades")
      .then((response) => {

        this.data=response.data
      })
      .catch((err) => {
        console.log(err)
       alert('ERRO NA API')
      });
  },
};
</script>



<style scoped>
.solucoes {
  margin-bottom: 50px;
}

.imagem {
  border-radius: 50%;
  width: 60%;
  height: 120px;
}

.sombra {
  box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.2);
}

.solucoes-grid {

  place-content: center;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.solucao {
  padding: 10px;
  display: flex;
  align-items: center;

  transition: .5s;
}

.solucao:hover{
  background-color: #f58634;
  color: #fff;
}

.solucao p {
  font-size: 1.2rem;
}
.fs-10 {
  font-size: 3rem;
}


@media(max-width: 600px) {
  .solucoes-grid{
    grid-template-columns: 1fr;
  }
}
</style>