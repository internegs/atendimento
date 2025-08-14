<template>
  <div 
  class="container-fluid" >
  
    <slot></slot>
  </div>
</template>


<script>
export default {
  name: "ContainerTemplate",

  props: {
    nome:{
        default: 'senhor',
        nome: String
    },

  }

};
</script>


<style>
  .ml-auto {
  margin-left: auto;
}
.bg-cinza {
  background-color: #e3eaef !important;
}
.ml-20 {
  margin-left: 20px;
}
</style>