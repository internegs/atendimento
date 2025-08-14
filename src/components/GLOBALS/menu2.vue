<template>
  <header>
    <nav
      class="navbar navbar-expand-lg p-4 navbar-transparent"
      data-js="header"
    >
      <div class="container">
        <router-link to="/" class="navbar-brand">
          <img src="../../assets/img/inzap.png" alt="inzupt" width="120" />
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

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mb-2 mb-lg-0 ml-auto" style="">
            <li class="nav-item" v-for="item in option" :key="item.name">
              <a class="nav-link " aria-current="page" href="#" @click="change(item.name)">
                {{item.target}}
              </a>
            </li>
          </ul>
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
  props: {
    option: Array,
    selected: String,
    change: {type: Function}
  },
  methods: {
    responsivo() {
      const botao = document.querySelector("[aria-expanded]");
      const valor = botao.getAttribute("aria-expanded");

      this.situacao = valor === "true" ? true : false;
    },
  },
};
</script>
    
    
  <style scoped>
.ml-auto {
  margin-left: auto;
}
.link {
  text-decoration: none;
}

.preto {
  color: #111 !important;
}
.bg-branco {
  background-color: #fff !important;
}

.navbar-transparent {
  background-color: transparent;
}
button {
  outline: 0;
  border: 0;
  background-color: transparent;
}

.button {
  padding: 15px 10px;
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
  background-color: #111;
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
  .borda {
    border: 2px solid #0065ff;
    width: 100%;
  }
}

@media (max-width: 997px) {
  nav.navbar {
    background-color: #fff !important;
  }
  .links {
    color: #111 !important;
  }
}
</style>