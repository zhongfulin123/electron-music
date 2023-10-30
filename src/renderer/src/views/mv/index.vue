<template>
  <div class="container">
    <div @click="$router.back()" class="header"><Icon type="back"></Icon> 视频详情</div>
    <div id="vs" style="margin-top: 20px"></div>
    <div>
      <div class="avatar" v-for="(item, index) in mvDetail?.artists" :key="index">
        <img
          :src="item.img1v1Url"
          alt=""
          style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px"
        />
        <span>{{ item.name }}</span>
      </div>
      <div class="song-info">
        <div class="song-name">
          {{ mvDetail?.name }}
        </div>
        <div style="margin-top: 10px">
          <span>发布: {{ mvDetail?.publishTime }}</span>
          <span style="margin-left: 20px">播放: {{ formatNumber(mvDetail?.playCount) }}次</span>
        </div>
      </div>
    </div>

    <!-- <el-button type="" @click="queryMvDetail(10928821)">待完成。。。</el-button> -->
  </div>
</template>

<script setup lang="ts">
import { useMusicStore } from '@renderer/store/music'
import { onMounted, ref } from 'vue'
import { getMvDetail, getMvUrl } from '@renderer/api'
import { useRoute } from 'vue-router'
import { formatNumber } from '@renderer/utils/index'
import Player from 'xgplayer'
import 'xgplayer/dist/index.min.css'
const { setPlayingState } = useMusicStore()
onMounted(() => {
  console.log(1111)
  setPlayingState(false)
  queryMvDetail()
})
const route = useRoute()
const mvDetail = ref()
async function queryMvDetail(id?) {
  const res1 = await getMvDetail(id || route.params.id)
  if (res1.code !== 200) return
  mvDetail.value = res1.data
  const res2 = await getMvUrl(id || route.params.id)
  const player = new Player({
    id: 'vs',
    url: res2.data.url,
    width: 700,
    height: 400,
    playsinline: true,
    autoplay: true
  })
  console.log(player)
  // if (id) player.switchURL(res1.data.url)
}
</script>

<style lang="scss" scoped>
.xgplayer {
  background-color: transparent;
}
.container {
  max-width: $center-content-max-width;
  margin: 0 auto;
  .header {
    display: flex;
    font-size: 18px;
    font-weight: bold;
    margin-top: 15px;
  }
  .avatar {
    display: flex;
    align-items: center;
    margin-top: 15px;
  }
  .song-info {
    margin-top: 20px;
    .song-name {
      font-size: 18px;
      font-weight: bold;
    }
  }
}
</style>
