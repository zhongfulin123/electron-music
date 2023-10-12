<template>
  <div style="display: flex; align-items: center">
    <div>下载目录:{{ globalStore.muicPath }}</div>
    <el-button @click="selectedDirectory" style="margin-left: 20px">设置目录</el-button>
  </div>
  <ZTable :tableData="globalStore.downList" :columns="columns" :isIndex="true" atviveId="downLoad">
    <template #name="{ row }">
      <div>
        <span
          :style="{ color: currentSong.id === row.id && 'downLoad' === songSheetId ? 'red' : '' }"
        >
          {{ row.name }}</span
        >
      </div>
    </template>
  </ZTable>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@renderer/store/global'
import ZTable from '@renderer/components/ZTable.vue'
import { useMusicStore } from '@renderer/store/music'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { formatTime } from '@renderer/utils'
const globalStore = useGlobalStore()
const { currentSong, songSheetId } = storeToRefs(useMusicStore())
async function selectedDirectory() {
  const res = await window.api.selectedDirectory()
  if (res) globalStore.setMusicPath(res)
}

const columns = ref([
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
</script>

<style scoped></style>
