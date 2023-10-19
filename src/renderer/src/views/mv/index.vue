<template>
  <div @click="$router.back()">返回</div>
</template>

<script setup lang="ts">
import { useMusicStore } from '@renderer/store/music'
import { onMounted } from 'vue'
const { setPlayingState } = useMusicStore()
onMounted(() => {
  setPlayingState(false)
})
</script>

<style lang="scss" scoped></style>
