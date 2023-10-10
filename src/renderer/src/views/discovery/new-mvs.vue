<template>
  <div class="new-mvs" v-if="mvs.length">
    <Title>推荐MV</Title>
    <ul class="list-wrap">
      <li :key="mv.id" class="list-item" v-for="mv in mvs">
        <MvCard
          :author="mv.artistName"
          :id="mv.id"
          :img="mv.picUrl"
          :name="mv.name"
          :playCount="mv.playCount"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { getPersonalizedMv } from '@renderer/api'
import { onMounted, ref } from 'vue'
import MvCard from '@renderer/components/mv-card.vue'
import Title from './Title.vue'
const mvs = ref<any[]>([])
onMounted(() => {
  getMvs()
})
async function getMvs() {
  const res = await getPersonalizedMv()
  if (res.code !== 200) return
  mvs.value = res.result
}
</script>

<style lang="scss" scoped>
.new-mvs {
  @include list(25%);
}
</style>
