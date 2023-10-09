import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useGlobalStore = defineStore('global', () => {
  const theme = ref('white')
  function setTheme(e:string) {
    theme.value = e
  }
  return { theme, setTheme }
},{
  persist:true
})
