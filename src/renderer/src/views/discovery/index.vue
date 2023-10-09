<template>
    <div>
          <!-- <div @click="musicStore.increment()">+1</div> -->
        <!-- <i class="iconfont icon-home"></i> -->
    </div>
</template>

<script setup lang="ts">
import {useMusicStore} from '@renderer/store/music'
const musicStore = useMusicStore()
musicStore.currentTime = 5
console.log(musicStore.currentIndex)
</script>

<style scoped>

</style>