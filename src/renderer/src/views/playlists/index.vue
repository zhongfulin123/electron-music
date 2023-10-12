<template>
  <div class="playlists" ref="playlists">
    <div class="top-play-list-card" v-if="topInfo.id">
      <TopPlaylistCard
        :desc="topInfo.description"
        :id="topInfo.id"
        :img="topInfo.coverImgUrl"
        :name="topInfo.name"
      />
    </div>
    <ZTab
      :list="tabs"
      v-model="activeTabValue"
      :isDefalut="false"
      @handleChange="queryPlaylists"
      style="margin: 20px 0"
    ></ZTab>
    <div class="playlist-cards">
      <PlaylistCard
        :desc="`播放量：${formatNumber(item.playCount)}`"
        :id="item.id"
        :img="item.coverImgUrl"
        :key="item.id"
        :name="item.name"
        v-for="item in list"
      />
    </div>
    <!-- <Pagination
      :current-page.sync="currentPage"
      :page-size="PAGE_SIZE"
      :total="total"
      @current-change="onPageChange"
      class="pagination"
    ></Pagination> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getTopPlaylists, getPlaylists } from '@renderer/api'
import TopPlaylistCard from './top-playlist-card.vue'
import PlaylistCard from '@renderer/components/playlist-card.vue'
import ZTab from '@renderer/components/ZTab.vue'
import { formatNumber } from '@renderer/utils'
const topInfo = ref<Record<string, any>>({})
const list = ref<any[]>([])
const tabs = ref([
  '全部',
  '欧美',
  '华语',
  '流行',
  '说唱',
  '摇滚',
  '民谣',
  '电子',
  '轻音乐',
  '影视原声',
  'ACG',
  '怀旧',
  '治愈',
  '旅行'
])
const activeTabValue = ref('全部')
const pagination = ref({
  total: 0,
  size: 50,
  no: 1
})
onMounted(() => {
  initData()
})
function initData() {
  queryPlaylists(true)
  queryTopPlaylists()
}
async function queryPlaylists(init: boolean = false) {
  if (init) {
    pagination.value.no = 1
    list.value = []
  }
  const res = await getPlaylists({
    limit: pagination.value.size,
    offset: (pagination.value.no - 1) * 50,
    cat: activeTabValue.value
  })
  if (res.code !== 200) return
  list.value = res.playlists
  pagination.value.total = res.total
  console.log(list.value, 'playlists')
}
async function queryTopPlaylists() {
  const res = await getTopPlaylists({
    limit: 1,
    cat: activeTabValue.value
  })
  if (res.code !== 200) return
  topInfo.value = res?.playlists[0] || {}
}
</script>

<style scoped lang="scss">
.playlists {
  padding: 12px;

  .top-play-list-card {
    margin-bottom: 16px;
  }

  .playlist-cards {
    display: flex;
    flex-wrap: wrap;
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 36px;
  }
}
</style>
