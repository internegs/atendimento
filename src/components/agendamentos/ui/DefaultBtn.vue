<template>
  <button :type="props.btnType" class="btn-container" @click="handleButtonClick" :style="btnStyles"
    :aria-label="ariaLabel || undefined" :disabled="disabled">
    <span>
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

defineOptions({ name: 'DefaultBtn' })

const props = defineProps({
  bg: {
    type: String,
    default: 'white',
  },

  borderColor: {
    type: String,
    default: '#FBFBFB',
  },

  txtColor: {
    type: String,
    default: '#4D4F5C',
  },

  txtSize: {
    type: String,
    default: '16px',
  },

  width: {
    type: String,
    default: 'auto',
  },

  height: {
    type: String,
    default: 'auto',
  },

  ariaLabel: {
    type: String,
    default: ''
  },

  rounded: {
    type: String,
    default: '6px',
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  btnType: {
    type: String,
    default: 'button'
  }

})

const emits = defineEmits(['handleClick'])

const windowWidth = ref(window.innerWidth)

const btnStyles = computed(() => ({
  backgroundColor: props.bg,
  borderColor: props.borderColor,
  color: props.txtColor,
  fontSize: props.txtSize,
  width: props.width,
  height: props.height,
  borderRadius: props.rounded,

}))

const handleButtonClick = (event) => {
  if (props.btnType === 'submit') {
    return
  }

  emits('handleClick', event)
}

onMounted(() => {
  addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
  addEventListener('resize', updateWindowWidth)
})

const updateWindowWidth = () => {
  return windowWidth.value = window.innerWidth
}

</script>

<style scoped lang="scss">
.btn-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 1rem;

  border: 1px solid;
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.05);
  transition: all 100ms ease;

  &:hover {
    transform: scale(1.02);
    background-color: #f4f4f4;
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    background: #e7e7e7 !important;
    border: none;
    transform: translateY(2px);
    box-shadow:
      inset 0 1px 4px rgba(0, 0, 0, 0.1),
      inset 0 1px 8px rgba(0, 0, 0, 0.1);
    cursor: not-allowed;
    opacity: 0.8;
    transform: none;
  }

  span {
    white-space: nowrap;
    font-weight: bold;
    font-size: 16px;

    @media (max-width: 1400px) {
      & {
        font-size: 14px;
      }
    }

    @media (max-width: 1028px) {
      & {
        font-size: 10px;
      }
    }

    @media (max-width: 640px) {
      & {
        font-size: 8px;
      }
    }
  }
}
</style>
