<template>
  <div class="playlist-detail" v-if="playlist.id">
    <DetailHeader ref="header" :playlist="playlist" :songs="songs" />
    <ZTab :list="tabs" v-model="activeTab" style="margin: 30px 36px 20px 36px"></ZTab>
    <ZTable :tableData="tableData" :columns="columns" :isIndex="true" :atviveId="atviveId">
      <template #name="{ row }">
        <div>
          <span :style="{ color: currentSong.id === row.id && atviveId === songSheetId ? 'red' : '' }"> {{ row.name }}</span>
          <span v-if="row.mvId"  class="label">mv</span>
          <span v-if="row.fee===1"  class="label">vip</span>
        </div>
      </template>
      <template #operation="{ row }">
        <!-- {{row }} -->
        <Icon type="xiazai"></Icon>
      </template>
    </ZTable>
    <!-- <div class="tabs-wrap">
      <Tabs :tabs="tabs" type="theme" v-model="activeTab" />
      <el-input
        :class="getInputCls()"
        @blur="onInputBlur"
        @focus="onInputFocus"
        class="input"
        placeholder="搜索歌单音乐"
        prefix-icon="el-icon-search"
        v-model="searchValue"
        v-show="activeTab === SONG_IDX"
      ></el-input>
    </div> -->
    <!-- <div class="empty" v-if="searchValue && !filteredSongs.length">
      未能找到和
      <span class="keyword">“{{ searchValue }}”</span>
      相关的任何音乐
    </div> -->
    <!-- <SongTable
      :highlightText="searchValue"
      :songs="filteredSongs"
      class="table"
      v-show="activeTab === SONG_IDX"
    /> -->
    <!-- <div class="comments" v-show="activeTab === COMMENT_IDX">
      <Comments :id="id" @update="onCommentsUpdate" type="playlist" />
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import DetailHeader from './Header.vue'
import { createSong } from '@renderer/utils'
import ZTab from '@renderer/components/ZTab.vue'
import ZTable from '@renderer/components/ZTable.vue'
import { formatTime } from '@renderer/utils'
import { useMusicStore } from '@renderer/store/music'
import { storeToRefs } from 'pinia'
const { currentSong, songSheetId } = storeToRefs(useMusicStore())

const playlist = ref<Record<string, any>>({})
const songs = ref([])
import { getSongDetail, getListDetail } from '@renderer/api'
import { ref, watch } from 'vue'
const activeTab = ref(1)
const atviveId = ref('')
const tabs = ref([
  {
    label: '歌曲列表',
    value: '1'
  },
  {
    label: '评论',
    value: '2'
  }
])
const tableData = ref([])

const columns = ref([
  {
    label: '操作',
    value: 'operation',
    slotName: 'operation',
    align: 'center'
  },
  {
    label: '标题',
    value: 'name',
    flex: '4',
    slotName: 'name'
  },
  {
    label: '歌手',
    value: 'artistsText',
    flex: '3'
  },
  {
    label: '专辑',
    value: 'albumName',
    flex: '2'
  },
  {
    label: '时间',
    value: 'durationSecond',
    render: (row) => `<div>${formatTime(row.durationSecond)}</div>`
  }
])

const route = useRoute()

watch(
  () => route.params.id,
  (newval) => {
    atviveId.value = newval as string
    initPlayList(newval)
  },
  {
    immediate: true
  }
)
async function initPlayList(newval) {
  const res = await getListDetail({ id: newval })
  if (res.code !== 200) return
  playlist.value = res.playlist
  genSonglist(playlist.value)
}
async function genSonglist(playlist) {
  const trackIds = playlist.trackIds.map(({ id }) => id)
  const songDetails = await getSongDetail(trackIds.slice(0, trackIds.length))
  const result = songDetails.songs.map(({ id, name, al, ar, mv, dt,...res }) =>
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
  songs.value = result
  tableData.value = result
}
</script>

<style lang="scss" scoped>
.playlist-detail {
  .label{
    border:  1px solid #ED5454 ;padding: 0 4px;color: #ED5454;margin-left: 5px;font-size: 12px;cursor: pointer;
  }
  
}
</style>
