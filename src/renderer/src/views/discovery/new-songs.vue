<template>
  <div class="new-songs" v-if="list.length">
    <Title>最新音乐</Title>
    <div class="list-wrap">
      <div :key="listIndex" class="list" v-for="(list, listIndex) in thunkedList">
        <SongCard
          :key="item.id"
          :order="getSongOrder(listIndex, index)"
          @click="onClickSong(listIndex, index)"
          class="song-card"
          v-bind="nomalizeSong(item)"
          v-for="(item, index) in list"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Title from './Title.vue'
import SongCard from './song-card.vue'
import { getNewSongs } from '@renderer/api'
import { createSong } from '@renderer/utils'
import { computed, onMounted, ref } from 'vue'
import { useMusicStore } from '@renderer/store/music'
const musicStroe = useMusicStore()
const { startSong, setPlaylist } = musicStroe
const chunkLimit = Math.ceil(10 / 2)
const list = ref<[]>([])
onMounted(() => {
  queryNewSongs()
})
async function queryNewSongs() {
  const res = await getNewSongs()
  if (res.code !== 200) return
  list.value = res.result
}
function getSongOrder(listIndex, index) {
  return listIndex * chunkLimit + index + 1
}
const normalizedSongs = computed(() => {
  return list.value.map((song) => nomalizeSong(song))
})
const thunkedList = computed(() => {
  return [list.value.slice(0, chunkLimit), list.value.slice(chunkLimit, list.value.length)] as any[]
})

function onClickSong(listIndex, index) {
  const nomalizedSongIndex = getSongOrder(listIndex, index) - 1
  const nomalizedSong = normalizedSongs.value[nomalizedSongIndex]
  startSong(nomalizedSong)
  setPlaylist(normalizedSongs.value)
}
function nomalizeSong(item) {
  const {
    id,
    name,
    song: {
      mvid,
      artists,
      album: { blurPicUrl },
      duration
    },
    ...res
  } = item
  return createSong({
    ...res,
    id,
    name,
    img: blurPicUrl,
    artists,
    duration,
    ...item.song,
    mvId: mvid
  })
}
</script>

<style lang="scss" scoped>
.new-songs {
  margin-bottom: 36px;
  .list-wrap {
    display: flex;

    .list {
      flex: 1;
      overflow: hidden;
    }
  }
}
</style>
