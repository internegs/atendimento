<template>
  <div class="block-wrapper">
    <span class="week" v-text="formattedWeek" :style="styleDateNow"></span>
    <span class="day" v-text="formattedDay" :style="styleDateNow"></span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { format, parseISO } from 'date-fns'

defineOptions({ name: 'BlockItemHeader' })

const props = defineProps({
  week: {
    type: String,
    required: true,
  },

  date: {
    type: String,
    required: true
  },
})

const formattedWeek = computed(() => {
  return props.week.substring(0, 3).toUpperCase()
})

const formattedDay = computed(() => {
  const date = parseISO(props.date)

  return format(date, 'd')
})

const verifyDateNow = computed(() => {

  const dayNow = format(new Date(), 'yyyy-MM-dd')

  return dayNow === props.date
})

const styleDateNow = computed(() => ({
  color: verifyDateNow.value ? '#00D5DD' : 'inherit',
  transform: verifyDateNow.value ? 'scale(1.20)' : 'inherit',
}))

</script>

<style scoped lang="scss">
.block-wrapper {
  @include flex-col-center();
  padding: 0.6rem 0;

  @media (max-width: 1400px) {
    & {
      padding: 0.2rem 0;
    }
  }

  .week {
    font-weight: 500;

    @media(max-width: 1400px) {
      & {
        font-size: 12px;
      }
    }

    @media(max-width: 1028px) {
      & {
        font-size: 8px;
      }
    }

    @media (max-width: 680px) {
      & {
        font-size: 6px;
      }
    }
  }

  .day {
    font-size: 30px;
    font-weight: bold;

    @media(max-width: 1400px) {
      & {
        font-size: 20px;
      }
    }

    @media(max-width: 1028px) {
      & {
        font-size: 15px;
      }
    }

    @media (max-width: 680px) {
      & {
        font-size: 10px;
      }
    }
  }

}
</style>
