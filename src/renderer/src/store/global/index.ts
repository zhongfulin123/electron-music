import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useGlobalStore = defineStore(
  'global',
  () => {
    const theme = ref('white')
    const muicPath = ref('')
    const downList = ref([])

    function setTheme(e: string) {
      theme.value = e
    }

    function setMusicPath(path) {
      muicPath.value = path
    }
     
    function setDownList (data){
      downList.value = data
    }

    return { theme, setTheme, muicPath, setMusicPath,downList,setDownList }
  },
  {
    persist: true
  }
)
