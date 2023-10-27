<template>
  <div class="container">
    <div @click="$router.back()" class="header"><Icon type="back"></Icon> 视频详情</div>
    <div id="vs"></div>
    <el-button type="" @click="queryMvDetail(10928821)">test</el-button>
  </div>
</template>

<script setup lang="ts">
import { useMusicStore } from '@renderer/store/music'
import { onMounted } from 'vue'
import { getMvDetail, getMvUrl } from '@renderer/api'
import { useRoute } from 'vue-router'
import Player from 'xgplayer'
import 'xgplayer/dist/index.min.css'
const { setPlayingState } = useMusicStore()
onMounted(() => {
  console.log(1111)
  setPlayingState(false)
  queryMvDetail()
})
const route = useRoute()
async function queryMvDetail(id?) {
  // const res = await getMvDetail(route.params.id)
  const res1 = await getMvUrl(id || route.params.id)
  const player = new Player({
    id: 'vs',
    url: res1.data.url,
    width: 700,
    height: 400,
    playsinline: true,
    autoplay: true
  })
  if (id) player.switchURL(res1.data.url)
}
</script>

<style lang="scss" scoped>
.container {
  max-width: $center-content-max-width;
  margin: 0 auto;
  .header {
    display: flex;
    font-size: 18px;
    font-weight: bold;
    margin-top: 15px;
  }
}
</style>
