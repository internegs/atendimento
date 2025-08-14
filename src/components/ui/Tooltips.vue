<template>
  <div v-if="showtooltip" class="tooltip-main" :style="positionStyles">
    <span>
      <slot></slot>
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({
  name: 'Tooltips'
})

const props = defineProps({
  top: String,

  right: String,

  bottom: String,

  left: String,

  showtooltip: {
    type: Boolean,
    default: false,
  }
})

const positionStyles = computed(() => {
  const styles = {}

  if (props.top) styles.top = props.top
  if (props.right) styles.right = props.right
  if (props.bottom) styles.bottom = props.bottom
  if (props.left) styles.left = props.left

  return styles
})

</script>

<style scoped lang="scss">
.tooltip-main {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 4px 10px;
  z-index: 10;

  border-radius: 5px;
  border: 1px solid #F8F8F8;
  background: #FFF;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.25);
  white-space: nowrap;

  & span {
    color: #3B4A54;
    font-weight: bold;

    @media(max-width: 1028px) {
      & {
        font-size: 14px;

      }
    }

    @media (max-width: 800px) {
      & {
        font-size: 11px;

      }
    }
  }
}
</style>
