import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useUserStore = defineStore('user', () => {
  const uid = ref('')
  function setUid(data) {
    uid.value = data
  }

  return { uid, setUid }
},{
  persist:{
    key: 'uid',
    paths: ['uid']
  }
})
