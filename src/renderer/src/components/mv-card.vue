<template>
  <div @click="goMv" class="mv-card">
    <div class="img-wrap">
      <el-image :src="img" lazy class="img-container" />
      <div class="play-count-wrap" v-if="playCount">
        <Icon type="play" />
        {{ formatNumber(playCount) }}
      </div>
      <div class="duration-wrap" v-if="duration">
        {{ formatTime(duration / 1000) }}
      </div>
    </div>
    <p class="name" v-if="name">{{ name }}</p>
    <p class="author" v-if="author">{{ author }}</p>
  </div>
</template>

<script setup lang="ts">
import { isDef, formatTime, formatNumber } from '@renderer/utils'
import { useRouter } from 'vue-router'
const props = defineProps(['id', 'img', 'duration', 'playCount', 'name', 'author'])
const router = useRouter()
function goMv() {
  if (isDef(props.id)) {
    router.push(`/mv/${props.id}`)
  }
}
</script>

<style lang="scss" scoped>
.mv-card {
  min-width: 140px;
  cursor: pointer;

  .img-wrap {
    position: relative;
    padding-top: 56%;

    .img-container {
      @include abs-stretch();
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }

    .play-count-wrap {
      display: flex;
      align-items: center;
      position: absolute;
      right: 2px;
      top: 2px;
      font-size: $font-size-sm;
      color: $white;

      i {
        display: inline-block;
        margin-right: 4px;
      }
    }

    .duration-wrap {
      position: absolute;
      right: 2px;
      bottom: 2px;
      font-size: $font-size-sm;
      color: $white;
    }
  }

  .name {
    margin-top: 8px;
    @include text-ellipsis;
    font-size: $font-size-sm;
  }

  .author {
    margin-top: 4px;
    @include text-ellipsis;
    font-size: $font-size-sm;
  }
}
</style>
