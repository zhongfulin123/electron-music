<template>
  <div class="header drag" :class="[{ 'header-bottom': theme === 'dark' }]">
    <div class="left nodrag">
      <el-input
        placeholder="search"
        :prefix-icon="Search"
        @focus="isSearchFouce = true"
        @blur="isSearchFouce = false"
        style="height: 30px"
        v-model="searchValue"
      />
    </div>
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
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useGlobalStore } from '@renderer/store/global'
import _ from 'lodash'
import { storeToRefs } from 'pinia'
const isMax = ref(false)
function windowChange(type) {
  window.api.windowChange(type)
}
window.api.resizeWindow((_event, value) => {
  isMax.value = value
})
const { searchValue, isSearchFouce, theme } = storeToRefs(useGlobalStore())
</script>

<style scoped lang="scss">
:deep(.el-input .el-input__wrapper) {
  background-color: var(--header-input-bgcolor);
  box-shadow: none;
  border-radius: 20px;
}
:deep(.el-input__inner) {
  color: var(--header-input-color);
}
:deep(.el-input__inner::placeholder) {
  color: var(--header-input-placeholdercolor);
}
:deep(.el-input__prefix-inner) {
  color: var(--header-input-placeholdercolor);
}
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
  position: relative;
  background-color: var(--header-bgcolor);
  padding-right: 15px;

  :deep(.iconfont) {
    color: var(--header-font-color);
  }

  .left {
    height: 100%;
    position: absolute;
    left: 22%;
    display: flex;
    align-items: center;
  }

  .right {
    display: flex;
    height: 100%;
    align-items: center;
    .operation {
      display: flex;
    }
  }
}
</style>
