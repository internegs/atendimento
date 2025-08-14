<template>
  <section class="layout-modal-container">
    <slot></slot>
  </section>
</template>

<script setup>
defineOptions({
  name: 'BaseModal'
})


</script>

<style scoped lang="scss">
.layout-modal-container {
  @include flex-center();
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);

}
</style>
