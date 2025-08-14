<template>
  <div v-if="showtooltip" class="tooltip-main" :style="positionStyles">
    <div class="tooltip-wrapper">
      <header>
        <h1>Informações do Paciente</h1>
      </header>

      <div class="description">
        <div class="description-row">
          <span class="label">Nome: </span>
          <span>{{ name }}</span>
        </div>

        <div class="description-row">
          <span class="label">Plano: </span>
          <span>{{ plan }}</span>
        </div>

        <div></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({
  name: 'ScheduledTooltips'
})

const props = defineProps({
  top: String,

  right: String,

  bottom: String,

  left: String,

  showtooltip: {
    type: Boolean,
    default: false,
  },

  name: String,

  plan: String
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 1rem 0.7rem;
  z-index: 10;

  border-radius: 5px;
  border: 1px solid #F8F8F8;
  background: #FFF;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.25);
  white-space: nowrap;
  color: #3B4A54;

  & .tooltip-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    & header {

      & h1 {
        font-size: large;

        @media(max-width: 1400px) {
          & {
            font-size: 16px;

          }
        }

        @media(max-width: 1028px) {
          & {
            font-size: 12px;

          }
        }
      }
    }

    & .description {
      width: 100%;

      &-row {

        @media(max-width: 1400px) {
          & {
            font-size: 14px;

          }
        }

        @media(max-width: 1028px) {
          & {
            font-size: 10px;

          }
        }

        & .label {
          font-weight: 500;
        }
      }
    }


  }

}
</style>
