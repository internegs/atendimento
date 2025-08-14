import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAdmStore = defineStore('adm', () => {
  const id = ref(0)
  const isAdm = ref(false)

  return {id, isAdm}
})
