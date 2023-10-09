<template>
  <div class="header drag" :class="[{ 'header-bottom': globalStore.theme === 'dark' }]">
    <div class="left nodrag">
      <!-- <Search /> -->
    </div>
    <!-- 缩起播放器 -->
    <!-- <div
        @click="onClickDown"
        class="shrink-player"
        v-if="isPlayerShow"
      >
        <Icon
          :backdrop="true"
          type="down"
        />
      </div> -->
    <!-- 路由记录器 -->
    <!-- <div
        class="history"
        v-show="!isPlayerShow"
      >
        <RoutesHistory />
      </div> -->
    <div class="right nodrag">
      <User></User>
 
        <Theme />
        <Icon type="suoxiaochuangkou1" class="ml-15" @handleClick="windowChange(1)"></Icon>
      <Icon
        :type="isMax ? 'suoxiaochuangkou' : 'fangda'"
        class="ml-15"
        @handleClick="windowChange(2)"
      ></Icon>
      <Icon type="guanbi" class="ml-15" @handleClick="windowChange(3)"></Icon>
      </div>
     
  </div>
</template>

<script setup lang="ts">
import Theme from '@renderer/components/theme.vue'
import User from '@renderer/components/User.vue'
import { ref } from 'vue'
import { useGlobalStore } from '@renderer/store/global'
const isMax = ref(false)
function windowChange(type) {
  window.api.windowChange(type)
}
window.api.resizeWindow((_event, value) => {
  isMax.value = value
})
const globalStore = useGlobalStore()
</script>

<style scoped lang="scss">
.ml-15 {
  margin-left: 15px;
}
.header-bottom {
  border-bottom: 1px solid #ec4141;
}
.header {
  display: flex;
  height: $header-height;
  width: 100%;
  justify-content: flex-end;
  background-color: var(--header-bgcolor);
  padding-right: 15px;

  :deep( .iconfont) {
    color: var(--header-font-color);
  }

  .left {
    height: 100%;
  }

  .right {
    display: flex;
    height: 100%;
    align-items: center;
    .operation{
      display: flex;
    }
  }
}
</style>
