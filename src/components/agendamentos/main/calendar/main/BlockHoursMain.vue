<template>
  <div class="block-wrapper">
    <span class="hours" :style="isCurrentTime && 'transform: scale(1.2);'" v-text="hours"></span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({
  name: 'BlockHoursMain'
})

const props = defineProps({
  hours: {
    type: String,
    required: true
  },

  closest: String,
})

const isCurrentTime = computed(() => {
  return props.hours === props.closest
})


</script>

<style scoped lang="scss">
@mixin flex-col-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.block-wrapper {
  @include flex-col-center();
  padding: 1.5rem 0;

  @media (max-width: 1400px) {
    & {
      padding: 0.9rem 0;
    }
  }


  @media (max-width: 680px) {
    & {
      padding: 0.8rem 0.4rem;
    }
  }

  .hours {
    font-weight: bold;

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

    @media (max-width: 680px) {
      & {
        font-size: 6px;

      }
    }

    @media (max-width: 640px) {
      & {
        font-size: 8px;
        width: 1.5rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

      }
    }
  }

}
</style>
