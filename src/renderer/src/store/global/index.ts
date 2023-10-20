import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useGlobalStore = defineStore(
  'global',
  () => {
    const theme = ref('white')
    const muicPath = ref('')
    const downList = ref([])
    const searchValue = ref('')
    const isSearchFouce = ref(false)

    function setTheme(e: string) {
      theme.value = e
    }

    function setMusicPath(path) {
      muicPath.value = path
    }

    function setDownList(data) {
      downList.value = data
    }

    return {
      theme,
      setTheme,
      muicPath,
      setMusicPath,
      downList,
      setDownList,
      searchValue,
      isSearchFouce
    }
  },
  {
    persist: {
      key: 'global',
      paths: ['theme', 'downList', 'muicPath']
    }
  }
)
