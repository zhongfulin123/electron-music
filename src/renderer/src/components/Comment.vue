<template>
  <div class="container" v-for="(item, index) in commentList" :key="index">
    <div style="display: flex; align-items: flex-start">
      <el-image :src="item.user?.avatarUrl" alt="" v-if="item.time" class="avatar" lazy />
      <div
        :style="{
          'margin-left': item.time ? '' : '52px',
          background: item.time ? '' : `var(--comment-bg)`,
          marginTop: item.time ? '' : '-10px',
          padding: '8px',
          borderRadius: '5px',
          boxSizing: 'border-box'
        }"
      >
        <span style="color: #5091cb">{{ `${item.time ? '' : '@'}${item.user?.nickname} ` }}:</span>
        <span></span>{{ item.content }}
      </div>
    </div>
    <Comment v-if="item?.beReplied?.length > 0" :comment-list="item.beReplied"></Comment>
    <div
      v-if="item.time"
      style="border-bottom: 1px solid #f2f2f2; padding-bottom: 10px; margin-left: 60px"
      :style="{ 'border-bottom': `1px solid var(--comment-bg-line)` }"
    >
      {{ formatDate(item.time) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@renderer/utils'
withDefaults(
  defineProps<{
    commentList: any[]
  }>(),
  {
    commentList: () => []
  }
)
</script>

<style scoped lang="scss">
.container {
  // padding: 20px 0;
  font-size: 12px;
  margin: 10px 0;
  .avatar {
    @include img-wrap(40px);
    border-radius: 50%;
    margin-right: 12px;
  }
}
</style>
