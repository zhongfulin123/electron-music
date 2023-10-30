<template>
  <div>
    <div>热搜榜</div>
    <div class="list">
      <div class="item">
        <div class="rank">1</div>
        <div class="songInfo">
          <div>其实都没有</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  list?: any[]
}>()
console.log(props)
</script>

<style scoped lang="scss">
.list {
  display: flex;
  flex-direction: column;
  .item {
    display: flex;
  }
}
</style>
