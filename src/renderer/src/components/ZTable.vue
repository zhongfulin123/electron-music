<template>
  <div class="table_wrapper">
    <div class="table_tr">
      <div v-if="isIndex" style="min-width: 30px"></div>
      <div
        v-for="(item, index) in columns"
        :key="index"
        class="table_th u-line-1"
        :style="{ textAlign: item.align || 'left', flex: item.flex || '1' }"
      >
        {{ item.label }}
      </div>
    </div>

    <div v-if="tableData.length > 0">
      <div
        v-for="(record, pIndex) in tableData"
        :key="pIndex"
        class="table_tr"
        :class="[
          pIndex % 2 === 0 ? 'table_tr-doublle' : '',
          currentSong.id === record.id && songSheetId === atviveId ? 'table_tr-active' : ''
        ]"
        @dblclick="handleDbClick(record)"
      >
        <div v-if="isIndex" style="min-width: 30px; line-height: 40px">
          <Icon
            type="lababofang"
            color="#FB004A"
            v-if="currentSong.id === record.id && songSheetId === atviveId"
          ></Icon>
          <div v-else>
            {{ String(pIndex + 1).padStart(2, '0') }}
          </div>
        </div>
        <div
          v-for="(items, index) in columns"
          :key="index"
          class="table_td"
          :style="{ textAlign: items.align || 'left', flex: items.flex || '1' }"
        >
          <div v-if="items.slotName" class="u-line-1">
            <slot :name="items.slotName" :row="record"></slot>
          </div>
          <div v-else-if="items.render" v-html="items.render(record)" class="u-line-1">
          
          </div>
          <div v-else class="u-line-1">
            <div v-if="record?.isSearch" v-html="record[items.searchValue]" class="u-line-1"></div>
            <div v-else class="u-line-1">{{ record[items.value] }}</div> 
          </div>
        </div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMusicStore } from '@renderer/store/music'
import { storeToRefs } from 'pinia'
const { startSong, setPlaylist, setSongSheetId } = useMusicStore()
const { currentSong, songSheetId } = storeToRefs(useMusicStore())
const props = withDefaults(
  defineProps<{
    columns: any
    tableData: any
    tableBackground?: string
    isIndex: boolean
    atviveId: string | number
  }>(),
  {
    tableData: [],
    isIndex: false
  }
)

function handleDbClick(record) {
  startSong(record)
  setPlaylist(props.tableData)
  setSongSheetId(props.atviveId)
}
</script>

<style scoped lang="scss">
.u-line-1 {
  @include text-ellipsis;
}
.table_wrapper {
  font-size: 14px;
  .table_tr {
    display: flex;
    padding: 0 36px;
    cursor: default;
  }
  .table_tr-doublle {
    background: var(--table-tr-bg);
  }
  .table_tr-active {
    background: var(--table-tr-bg-active);
  }
  .table_th {
    margin: 0 10px;
    @include text-ellipsis;
    line-height: 40px;
  }
  .table_td {
    margin: 0 10px;
    @include text-ellipsis;
    line-height: 40px;
  }
}
</style>
