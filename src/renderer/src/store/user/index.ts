import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useUserStore = defineStore('user', () => {
  const uid = ref('')
  const userInfo = ref<Record<string,any>>({})
  function setUid(data) {
    uid.value = data
  }
  function setUserInfo(data){
    userInfo.value =data
  }

  return { uid, setUid,setUserInfo,userInfo }
},{
  persist:[
    {
    key: 'uid',
    paths: ['uid']
    },
    {
      key: 'userInfo',
      paths: ['userInfo']
      },
]
})
