<template>
  <div class="bg-color">
    <div class="container color-branco">
      <footer class="row py-5 my-5 border-top">
        <div class="col-md-3 col-12 mb-3">
          <router-link
            to="/"
            class="d-flex align-items-center mb-4 link-dark text-decoration-none"
          >
            <img src="../../assets/img/inzupt.png" alt="" width="142" />
          </router-link>
        </div>

        <div class="col-md-3 col-12 mb-3">
          <h5 class="text-white fs-3 fw-bold">Informações</h5>
          <ul class="nav flex-column">
            <li class="nav-item mb-2">
              <a href="#home" class="nav-link p-0 text-white">Home</a>
            </li>
            <li class="nav-item mb-2">
              <a href="#planos" class="nav-link p-0 text-white">Planos</a>
            </li>

            <li class="nav-item mb-2">
              <a href="#planos" class="nav-link p-0 text-white">FAQ</a>
            </li>
            <li class="nav-item mb-2">
              <router-link
                to="/politica_privacidade"
                class="nav-link p-0 text-white"
                >Política de privacidade</router-link
              >
            </li>
          </ul>
        </div>

        <div class="col-md-3 col-12 mb-3">
          <h5 class="text-white fs-3 fw-bold">Contato</h5>
          <ul class="nav flex-column">
            <li class="nav-item mb-2">
              <a href="#" class="nav-link p-0 text-white">(65) 92001-1640</a>
            </li>
            <li class="nav-item mb-2">
              <a href="#" class="nav-link p-0 text-white"
                >atendimento@inzupt.com.br</a
              >
            </li>
           
          </ul>
        </div>

        <div class="col-md-3 col-12 mb-4">
          <div class="links">
            <h5 class="text-white fs-3 fw-bold">Redes Sociais</h5>
            <a
              href="https://www.facebook.com/inzupt"
              style="padding-left: 10px"
            >
              <img src="../../assets/img/homeFooter/facebook.png" alt="" />
            </a>
            <a
              href="https://api.whatsapp.com/send/?phone=556541410643&text=Oi+acessei+o+site+https%3A%2F%2Finzupt.com.br+e+gostaria+de+mais+informa%C3%A7%C3%B5es&type=phone_number&app_absent=0"
              style="padding-left: 10px"
            >
              <img src="../../assets/img/homeFooter/whatsapp.png" alt="" />
            </a>
            <a
              href="https://www.instagram.com/inzupt/"
              style="padding-left: 10px"
            >
              <img src="../../assets/img/homeFooter/instagram (1).png" alt="" />
            </a>
          </div>
        </div>
        <div class="col-md-12 mt-3">
          <div class="text-center fs-3">Copyright@INZUPT - 2022</div>
        </div>
      </footer>
    </div>
  </div>
</template>


<script>
export default {
  name: "BannerFooter",
};
</script>
<style scoped>
.color-branco {
  color: white;
}

.bg-color {
  background-image: linear-gradient(to right, #7ed0dd, #5ba3ca);
}
</style>