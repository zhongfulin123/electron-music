<template>
  <el-backtop :right="100" :bottom="100" target=".container" />
  <div class="container">
    <ZTab
      :list="tabs"
      v-model="activeTabValue"
      :isDefalut="3"
      @handleChange="getSongs"
      style="margin: 20px 36px"
    ></ZTab>

    <ZTable
      :tableData="tableData"
      :columns="columns"
      :isIndex="true"
      atviveId="newSongs"
      :isheader="false"
    >
      <template #name="{ row }">
        <div class="u-line-1" style="display: flex; align-items: center">
          <div
            class="u-line-1"
            :style="{
              color: currentSong.id === row.id && 'newSongs' === songSheetId ? '#EC4141' : '',
              flex: 3,
              display: 'flex',
              alignItems: 'center',
              'max-width': 'fit-content'
            }"
          >
            <el-image :src="row.img" alt="" lazy class="img-container" />
            <div class="u-line-1">{{ row.name }}</div>
          </div>
          <div style="display: flex; flex: 1; height: 100%" v-if="row.mvId || row.fee">
            <div v-if="row.mvId" class="label">mv</div>
            <div v-if="row.fee === 1" class="label">vip</div>
          </div>
        </div>
      </template>
    </ZTable>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getTopSongs } from '@renderer/api'
import ZTab from '@renderer/components/ZTab.vue'
import ZTable from '@renderer/components/ZTable.vue'
import { formatTime, createSong } from '@renderer/utils'
import { useMusicStore } from '@renderer/store/music'

import { storeToRefs } from 'pinia'
const { currentSong, songSheetId } = storeToRefs(useMusicStore())
const tabs = ref([
  { label: '全部', value: 0 },
  { label: '华语', value: 7 },
  { label: '欧美', value: 96 },
  { label: '韩国', value: 16 },
  { label: '日本', value: 8 }
])
const activeTabValue = ref(0)
onMounted(() => {
  getSongs()
})

const tableData = ref<Array<any>>()
const columns = ref([
  {
    label: '标题',
    value: 'name',
    searchValue: 'searchName',
    flex: '4',
    slotName: 'name'
  },
  {
    label: '歌手',
    value: 'artistsText',
    searchValue: 'searchArtistsText',
    flex: '3'
  },
  {
    label: '专辑',
    value: 'albumName',
    searchValue: 'searchAlbumName',
    flex: '2'
  },
  {
    label: '时间',
    value: 'durationSecond',
    render: (row) => `<div>${formatTime(row.durationSecond)}</div>`
  }
])
async function getSongs() {
  const res = await getTopSongs(activeTabValue.value)
  if (res.code !== 200) return
  tableData.value = res.data.map((song) => {
    const {
      id,
      name,
      artists,
      duration,
      mvid,
      album: { picUrl, name: albumName },
      ...res
    } = song
    return createSong({
      ...res,
      id,
      name,
      artists,
      duration,
      albumName,
      img: picUrl,
      mvId: mvid
    })
  })
}
</script>

<style scoped lang="scss">
.container {
  height: 100%;
  overflow-y: auto;
  .u-line-1 {
    @include text-ellipsis;
  }
  .img-container {
    width: 50px;
    height: 50px;
    margin-right: 10px;
    border-radius: 5px;
  }
  .label {
    border: 1px solid #ed5454;
    padding: 0 4px;
    color: #ed5454;
    margin-left: 5px;
    height: 15px;
    line-height: 15px;
    font-size: 12px;
    cursor: pointer;
  }
}
</style>
