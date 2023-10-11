import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {playModeMap, getSongImg } from '@renderer/utils'
import { ElMessage } from 'element-plus'
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

export const useMusicStore = defineStore(
  'music',
  () => {
    const currentSong = ref<Record<string,any>>({})
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
    const playHistory = ref([])
    // 菜单显示
    const isMenuShow = ref(true)
    // 播放音量
    const muiscVolume= ref(0.75)
    //当前播放歌单

    const songSheetId = ref('')

    /**
     * 获取当前播放歌曲在列表中的下标
     */
    const currentIndex = computed(() => {
      return playlist.value.findIndex((item: any) => item.id == currentSong.value.id)
    })

    /**
     * 检测单曲是否有歌曲播放
     */
    const hasCurrentSong = computed(() => {
      return currentSong.value?.id !== null || currentSong.value?.id !== undefined
    })

    /**
     * 播放下一首
     */
    const nextSong = computed(() => {
      const nextStratMap = {
        [playModeMap.sequence.code]: getSequenceNextIndex,
        [playModeMap.loop.code]: getLoopNextIndex,
        [playModeMap.random.code]: getRandomNextIndex
      }
      const getNextStrat = nextStratMap[playMode.value]
      const index = getNextStrat()

      return playlist.value[index]

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
        return getRandomIndex(playlist.value, currentIndex.value)
      }

      // 单曲
      function getLoopNextIndex() {
        return currentIndex.value
      }
    })

    /**
     * 播放上一首
     */
    const prevSong = computed(() => {
      const prevStratMap = {
        [playModeMap.sequence.code]: genSequencePrevIndex,
        [playModeMap.loop.code]: getLoopPrevIndex,
        [playModeMap.random.code]: getRandomPrevIndex
      }
      const getPrevStrat = prevStratMap[playMode.value]
      const index = getPrevStrat()

      return playlist.value[index]

      function genSequencePrevIndex() {
        let prevIndex = currentIndex.value - 1
        if (prevIndex < 0) {
          prevIndex = playlist.value.length - 1
        }
        return prevIndex
      }

      function getLoopPrevIndex() {
        return currentIndex.value
      }

      function getRandomPrevIndex() {
        return getRandomIndex(playlist.value, currentIndex.value)
      }
    })

    async function startSong(rawSong) {
      const song = Object.assign({}, rawSong)
      if (!song.img) {
        if (song.albumId) {
          song.img = await getSongImg(song.id, song.albumId)
        }
      }
      setCurrentSong(song)
      setPlayingState(true)
      const playHistoryCopy = playHistory.value.slice() as any[]
      const findedIndex = playHistoryCopy.findIndex(({ id }) => song.id === id)
      if (findedIndex !== -1) {
        // 删除旧那一项, 插入到最前面
        playHistoryCopy.splice(findedIndex, 1)
      }
      playHistoryCopy.unshift(song)
      setPlayHistory(playHistoryCopy)
    }

    function clearCurrentSong() {
      setCurrentSong({})
      setPlayingState(false)
      setCurrentTime(0)
    }

    function clearPlaylist() {
      setPlaylist([])
      clearCurrentSong()
    }

    function clearHistory() {
      setPlayHistory([])
    }
    function addToPlaylist(song) {
      const copy = playlist.value.slice() as any[]
      if (!copy.find(({ id }) => id === song.id)) {
        copy.unshift(song)
        setPlaylist(copy)
      }
    }

    function setCurrentSong(data) {
      if(data.fee===1){
        ElMessage.warning('当前歌曲需要vip')
      }
      // ElMessage()
      currentSong.value = data
    }

    function setCurrentTime(data) {
      currentTime.value = data
    }
    function setPlayingState(data) {
      playing.value = data
    }
    function setPlayMode(data) {
      playMode.value = data
    }
    function setPlaylistShow(data) {
      isPlaylistShow.value = data
    }
    function setPlayerShow(data) {
      isPlayerShow.value = data
    }
    function setPlaylistPromptShow(data) {
      isPlaylistPromptShow.value = data
    }
    function setPlaylist(data) {
      playlist.value = data
    }
    function setPlayHistory(data) {
      playHistory.value = data
    }
    function setMenuShow(data) {
      isMenuShow.value = data
    }
    function setMusicVolume(data){
       muiscVolume.value = data
    }

    function setSongSheetId(data){
      songSheetId.value = data
    }

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
      muiscVolume,
      currentIndex,
      hasCurrentSong,
      nextSong,
      prevSong,
      songSheetId,
      startSong,
      clearCurrentSong,
      clearPlaylist,
      clearHistory,
      addToPlaylist,
      setCurrentSong,
      setCurrentTime,
      setPlayingState,
      setPlayMode,
      setPlaylistShow,
      setPlayerShow,
      setPlaylistPromptShow,
      setPlaylist,
      setPlayHistory,
      setMenuShow,
      setMusicVolume,
      setSongSheetId
    }
  },
  {
    persist:true
  }
)
