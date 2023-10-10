<template>
  <div class="recommend" v-if="list.length">
    <Title>推荐歌单</Title>
    <div class="list-wrap">
      <PlaylistCard
        :desc="item.copywriter"
        :id="item.id"
        :img="item.picUrl"
        :key="item.id"
        :name="item.name"
        v-for="item in list"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import PlaylistCard from '@renderer/components/playlist-card.vue'
import Title from './Title.vue'
import { getPersonalized } from '@renderer/api'

const list = ref<any[]>([])

onMounted(() => {
  getPersonalizedList()
})

async function getPersonalizedList() {
  const res = await getPersonalized({ limit: 10 })
  if (res.code !== 200) return
  list.value = res.result
}
</script>

<style lang="scss" scoped>
.list-wrap {
  margin: 0 -4px;
  display: flex;
  flex-wrap: wrap;
}
</style>
