<template>
  <svg :style="style" class="alert-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
    <circle class="alert-circle" cx="26" cy="26" r="23" fill="none" />
    <line class="alert-line" x1="26" y1="14" x2="26" y2="27" />
    <circle class="alert-dot" cx="26" cy="36" r="1" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({
  name: 'AlertIcon',
});

const props = defineProps({
  size: {
    type: Number,
    default: 120
  }
})

const style = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}))
</script>

<style scoped lang="scss">
.alert-icon {
  width: 100%;
  height: 100%;
  stroke: #f8890a;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  animation: scale .3s ease-in-out;
}

.alert-circle {
  stroke-dasharray: 157;
  stroke-dashoffset: 157;
  animation: draw-circle 0.4s ease-out forwards;
}

.alert-line {
  stroke-dasharray: 16;
  stroke-dashoffset: 16;
  animation: draw-line 0.3s 0.4s ease-out forwards;
}

.alert-dot {
  fill: #f8890a;
  opacity: 0;
  animation: fade-in 0.3s 0.4s ease-out forwards;
}

@keyframes draw-circle {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes draw-line {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes fade-in {
  to {
    opacity: 1;
  }
}

@keyframes scale {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
