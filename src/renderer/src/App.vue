<script setup lang="ts">
import layout from '@renderer/layout/index.vue'
import { onMounted } from 'vue'
import { useGlobalStore } from '@renderer/store/global'
import { useMusicStore } from '@renderer/store/music'
import { getSongDetail } from '@renderer/api'
import { createSong } from '@renderer/utils'
const globalStore = useGlobalStore()
const { setPlayingState, setPlayerShow } = useMusicStore()
onMounted(() => {
  window.api.initWatch(globalStore.muicPath)
  window.api.localDownloadList((_event, list) => {
    genSonglist(list)
  })
})
window.api.setpalySaate((_envet, data) => {
  setPlayingState(data)
  setPlayerShow(data)
})
async function genSonglist(playlist) {
  const trackIds = playlist.map((item) => item.split('-')[1].split('.')[0])
  const songDetails = await getSongDetail(trackIds.slice(0, trackIds.length))
  const result = songDetails.songs?.map(({ id, name, al, ar, mv, dt, ...res }) =>
    createSong({
      ...res,
      id,
      name,
      artists: ar,
      duration: dt,
      mvId: mv,
      albumName: al.name,
      img: al.picUrl
    })
  )
  globalStore.setDownList(result)
}
</script>

<template>
  <layout></layout>
</template>

<style scoped lang="scss"></style>
