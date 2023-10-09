import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { PLAY_HISTORY_KEY, playModeMap } from '@renderer/utils'

function getRandomIndex(playlist, currentIndex) {
  // 防止无限循环
  if (playlist.length === 1) {
    return currentIndex
  }
  let index = Math.round(Math.random() * (playlist.length - 1))
  if (index === currentIndex) {
    index = getRandomIndex(playlist, currentIndex)
  }
  return index
}


export const useMusicStore = defineStore('music', () => {
  const currentSong = ref<{
    [propName: string]: string
  }>({})
  // 当前播放时长
  const currentTime = ref(0)
  // 播放状态
  const playing = ref(false)
  // 播放模式
  const playMode = ref(playModeMap.sequence.code)
  // 播放列表显示
  const isPlaylistShow = ref(false)
  // 播放提示显示
  const isPlaylistPromptShow = ref(false)
  // 歌曲详情页显示
  const isPlayerShow = ref(false)
  // 播放列表数据
  const playlist = ref([])
  // 播放历史数据
  const playHistory = ref(localStorage.getItem(PLAY_HISTORY_KEY) || [])
  // 菜单显示
  const isMenuShow = ref(true)


  const currentIndex = computed(() => {
    return playlist.value.findIndex((item: any) => item.id == currentSong.value.id)
  })

  const nextSong = computed(()=>{
  
    const nextStratMap = {
      [playModeMap.sequence.code]: getSequenceNextIndex,
      [playModeMap.loop.code]: getLoopNextIndex,
      [playModeMap.random.code]: getRandomNextIndex
    }
    const getNextStrat = nextStratMap[playMode.value]
    const index = getNextStrat()

    return playlist[index]

    // 顺序
    function getSequenceNextIndex() {
      let nextIndex = currentIndex.value + 1
      if (nextIndex > playlist.value.length - 1) {
        nextIndex = 0
      }
      return nextIndex
    }

    // 随机
    function getRandomNextIndex() {
      return getRandomIndex(playlist,currentIndex.value)
    }

    // 单曲
    function getLoopNextIndex() {
      return currentIndex.value
    }
    
  }) 
//    const prevSong = computed(()=> {
//     const { playlist, playMode } = state
//     const prevStratMap = {
//       [playModeMap.sequence.code]: genSequencePrevIndex,
//       [playModeMap.loop.code]: getLoopPrevIndex,
//       [playModeMap.random.code]: getRandomPrevIndex
//     }
//     const getPrevStrat = prevStratMap[playMode]
//     const index = getPrevStrat()
  
//     return playlist[index]
  
//     function genSequencePrevIndex() {
//       let prevIndex = currentIndex.value - 1
//       if (prevIndex < 0) {
//         prevIndex = playlist.length - 1
//       }
//       return prevIndex
//     }
  
//     function getLoopPrevIndex() {
//       return getters.currentIndex
//     }
  
//     function getRandomPrevIndex() {
//       return getRandomIndex(playlist, getters.currentIndex)
//     }
//   }
// )
  return {
    currentSong,
    currentTime,
    playing,
    playMode,
    isPlaylistShow,
    isPlaylistPromptShow,
    isPlayerShow,
    playlist,
    playHistory,
    isMenuShow,
    currentIndex,
    nextSong
  }
})
