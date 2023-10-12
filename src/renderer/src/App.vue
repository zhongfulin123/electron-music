<script setup lang="ts">
import layout from '@renderer/layout/index.vue'
import MiniPlayer from "@renderer/components/mini-player/index.vue"
import { onMounted } from 'vue'
import {useGlobalStore} from '@renderer/store/global'
import {getSongDetail} from '@renderer/api'
import { createSong } from '@renderer/utils'
const globalStore = useGlobalStore()
onMounted(()=>{
  window.api.initWatch(globalStore.muicPath)
  window.api.localDownloadList((_event, list) => {
    genSonglist(list)
})
})
async function genSonglist(playlist) {
  const trackIds = playlist.map(item=>item.split('.')[0])
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
  console.log(result)
}
</script>

<template>
      <layout></layout>
      <MiniPlayer></MiniPlayer>
</template>

<style scoped lang="scss">
</style>
