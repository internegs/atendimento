<template>
  <div>
    <nav class="navbar fixed-top" :class="tema ? 'menu-white' : 'bg-dark'">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel">
          <div class="offcanvas-header" :class="tema ? 'menu-white' : 'bg-dark'">
            <div class="">
              <h5 class="offcanvas-title text-white" id="offcanvasNavbarLabel">
                {{ titleMenu }}
              </h5>
            </div>
            <button type="button" class="btn-close" :class="tema ? '' : 'bg-white'" data-bs-dismiss="offcanvas"
              aria-label="Close"></button>
          </div>
          <div class="offcanvas-body d-flex flex-column flex-shrink-0 p-3"
            :class="tema ? 'menu-white' : 'text-bg-dark'">
            <ul class="nav nav-pills flex-column mb-auto">
              <li v-for="item in option" :key="item.name">
                <a data-bs-dismiss="offcanvas" href="#" class="nav-link text-white"
                  :class="{ active: item.name == selected }" @click="change(item.name)">
                  <svg class="bi pe-none me-2" width="16" height="16">
                    <use />
                  </svg>
                  {{ item.target }}
                </a>
              </li>
              <li @click="deslogar()" class="deslogar">
                SAIR
              </li>
            </ul>
          </div>
        </div>
        <div class="form-check form-switch fs-3">
          <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" v-model="tema" />
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import middleware from "@/services/middleware";
export default {
  name: "menuComponents",
  data() {
    return {
      // false === CLARO  ||  true === ESCURO
      tema: false,
    };
  },
  props: {
    option: Array,
    selected: String,
    change: { type: Function },
    menuType: {
      type: String,
      default: "menu-white",
    },
    titleMenu: {
      type: String,
      default: "",
    },
  },
  methods: {
    deslogar() {
      middleware.logout();
    },
  },
};
</script>

<style>
.deslogar {
  cursor: pointer;
}

.menu-white {
  background: #ffff !important;
}

.menu-white h5 {
  color: #111 !important;
}

.menu-white li a {
  color: #111 !important;
}

li a.active {
  color: #fff !important;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked+.slider {
  background-color: #2196f3;
}

input:focus+.slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked+.slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
