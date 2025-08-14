<template>
  <header>
    <nav
      class="navbar navbar-expand-lg p-4 navbar-transparent fixed-top"
      data-js="header"
    >
      <div class="container">
        <router-link to="/" class="navbar-brand">
          <img
            src="../../assets/img/inzupt.png"
            alt="inzupt"
            width="220"
            class="logo"
          />
        </router-link>
        <div
          :class="situacao ? 'active' : ''"
          class="menu_hamburguer navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          @click="responsivo()"
        >
          <div class="one"></div>
          <div class="two"></div>
          <div class="three"></div>
        </div>

        <div class="collapse navbar-collapse mgt-2" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0"></ul>
          <div class="d-flex align-items-center flex-column flex-lg-row gap-4">
            <a class="nav-link text-white fs-3 links" href="#home">Home</a>
            <a class="nav-link text-white fs-3 links" href="#home">A plataforma</a>
            <a class="nav-link text-white fs-3 links" href="#faq">FAQ</a>
            <a class="nav-link text-white fs-3 links" href="#planos">Planos</a>
            
            <router-link to="/login"   class="link">
              <div  class="bg-laranja full text-center button rounded">
                <span 
                  class="fs-3 text color-cinza text-white fw-bold text-uppercase"
                >
                  Login
                </span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: "HeaderMenu",
  data() {
    return {
      situacao: false,
      value: 0,
    };
  },
  async mounted() {
    window.addEventListener("scroll", this.scrollHeader);
  },

  methods: {
    responsivo() {
      const botao = document.querySelector("[aria-expanded]");
      const valor = botao.getAttribute("aria-expanded");

      this.situacao = valor === "true" ? true : false;
    },
    scrollHeader() {
      const header = document.querySelector("[data-js]");

      if (header) {
        
        const sticky = header.offsetTop;
        if (window.pageYOffset > sticky) {
          header.classList.add("bg-nav");
        } else {
          header.classList.remove("bg-nav");
        }
      }
    },
  },
};
</script>

<style scoped>
.link {
  text-decoration: none;
}

.bg-nav {
  /* background-color: #0774ae !important; */
  background-image: linear-gradient(to right, #7ed0dd, #479fcf);
}

.navbar-transparent {
  background-color: transparent;
}
button {
  outline: 0;
  border: 0;
  background-color: transparent;
}

.navbar {
  box-shadow: none !important;
}

.button {
  padding: 15px 35px;
}
.navbar-toggler {
  border: 0 !important;
}

.menu_hamburguer {
  width: 40px;
  height: 30px;
  margin-right: 20px;
}
.menu_hamburguer div {
  background-color: #fff;
  height: 4px;
  width: 40px;
  margin: 5px auto;
  opacity: 1;
  transition-duration: 0.3s;
}

.menu_hamburguer.active .one {
  transform: rotate(45deg) translate(7px, 7px);
}

.menu_hamburguer.active .two {
  opacity: 0;
}

.menu_hamburguer.active .three {
  transform: rotate(-45deg) translate(5px, -7px);
}

.navbar {
  font-family: "Fira Sans", sans-serif;
}

.bold {
  font-weight: bold;
}

.navbar-nav button {
  width: 100%;
}
.full {
  width: 100%;
}

@media (max-width: 995px) {
  .link {
    width: 100%;
  }
  .mgt-2 {
    padding-top: 30px;
  }
}

@media (max-width: 997px) {
  nav.navbar {
    background-image: linear-gradient(to right, #7ed0dd, #479fcf);
  }
}

@media (max-width: 400px) {
  .logo {
    width: 140px;
  }
}
</style>
