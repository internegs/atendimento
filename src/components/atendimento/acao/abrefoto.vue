<template>
    <Container>
      <div
        class="offcanvas offcanvas-end"
        style="width: 85%"
        tabindex="-1"
        id="abreFoto"
        aria-labelledby="offcanvasRightLabel"
      >
        <div class="offcanvas-header">
          <div class="col-md-6 text-center mb-4">
            <h2 class="offcanvas-title fs-3" id="offcanvasRightLabel">
              <b> Editar Usuário</b>
            </h2>
          </div>
  
          <button
            type="button"
            class="btn btn-danger ms-auto"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            Fechar
          </button>
        </div>
        <div class="offcanvas-body">
          <div class="container-fluid row">
            
            Foto
          </div>
        </div>
      </div>
    </Container>
  </template>

<script>
import Container from "@/components/GLOBALS/container.vue";
import apiImagem from "@/services/apiImagem";
import api from "@/services/api";


export default{
    name: "abreFoto",
   components: { Container },
}
</script>
