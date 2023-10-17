<script setup lang="ts">
import layout from '@renderer/layout/index.vue'
import MiniPlayer from '@renderer/components/mini-player/index.vue'
import player from '@renderer/components/player.vue'
import { onMounted, onUnmounted } from 'vue'
import { useGlobalStore } from '@renderer/store/global'
import { useMusicStore } from '@renderer/store/music'
import { getSongDetail } from '@renderer/api'
import { createSong } from '@renderer/utils'
const globalStore = useGlobalStore()
const { setPlayingState } = useMusicStore()
onMounted(() => {
  window.api.initWatch(globalStore.muicPath)
  window.api.localDownloadList((_event, list) => {
    genSonglist(list)
  })
})
onUnmounted(() => {
  setPlayingState(false)
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
  <MiniPlayer></MiniPlayer>
  <player></player>
</template>

<style scoped lang="scss"></style>
