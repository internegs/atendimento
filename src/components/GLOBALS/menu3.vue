<template>
  <div style="margin-bottom: 55px">
    <nav class="navbar bg-dark fixed-top">
      <div class="container-fluid">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          class="offcanvas offcanvas-start"
          tabindex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div class="offcanvas-header" :class="menuType">
            <div class="">
              <h5 class="offcanvas-title text-white" id="offcanvasNavbarLabel">
                ADMIN compo
              </h5>
            </div>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div
            class="offcanvas-body d-flex flex-column flex-shrink-0 p-3"
            :class="menuType"
          >
            <ul class="nav nav-pills flex-column mb-auto">
              <li v-for="item in option" :key="item.name">
                <a
                  data-bs-dismiss="offcanvas"
                  href="#"
                  class="nav-link text-white"
                  :class="{ active: item.name == selected }"
                  @click="change(item.name)"
                >
                  <svg class="bi pe-none me-2" width="16" height="16">
                    <use />
                  </svg>
                  {{ item.target }}
                </a>
              </li>
              <li>
                <a href="#" class="nav-link text-white">SAIR</a>
              </li>
            </ul>
          </div>
        </div>
        <label class="switch">
          <input type="checkbox" />
          <span class="slider round"></span>
        </label>
      </div>
    </nav>
  </div>
</template>
  
  <script>
export default {
  name: "menuComponents",
  data() {
    return {
      a: null,
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
  },
  methods: {
    SelectedMenu(name) {
      alert(name);
    },
  },
};
</script>
  
  <style>
.menu-white {
  background: #e2e1e1;
}

.menu-white a {
  color: #111 !important;
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

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
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
  