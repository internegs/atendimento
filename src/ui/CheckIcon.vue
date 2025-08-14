<template>
  <svg :style="style" class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
    <circle class="checkmark-circle" cx="26" cy="26" r="23" fill="none" />
    <path class="checkmark-check" fill="none" d="M14 27l7 7 16-16" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({
  name: 'CheckIcon',
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
.checkmark {
  width: 100%;
  height: 100%;
  stroke: #4caf50;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  animation: scale .3s ease-in-out;
}

.checkmark-circle {
  stroke-dasharray: 157;
  stroke-dashoffset: 157;
  animation: draw-circle 0.6s ease-out forwards;
}

.checkmark-check {
  stroke-dasharray: 36;
  stroke-dashoffset: 36;
  animation: draw-check 0.3s 0.6s ease-out forwards;
}

@keyframes draw-circle {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes draw-check {
  to {
    stroke-dashoffset: 0;
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
