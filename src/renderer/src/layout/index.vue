<template>
  <div class="layout">
    <LayoutHeader />
    <div class="layout-body">
      <div class="layout-menu" v-show="isMenuShow">
        <LayoutMenu />
      </div>
      <div class="content" id="page-content">
        <router-view :class="routerViewCls" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMusicStore } from '@renderer/store/music'
import LayoutHeader from './header.vue'
import LayoutMenu from './menu.vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { menuRoutes } from '@renderer/router'

const musicStore = useMusicStore()
const { isMenuShow } = storeToRefs(musicStore)

/**
 * 需要居中对齐的路由
 */

const route = useRoute()
const routerViewCls = computed(() => {
  return menuRoutes.map((item) => item.name).includes(route.name as string)
    ? 'router-view-center'
    : ''
})
</script>

<style scoped lang="scss">
.layout {
  height: 100%;

  .layout-body {
    display: flex;
    height: calc(100% - #{$header-height});

    .layout-menu {
      // 这个100%已经减去了头部height
      height: calc(100% - #{$mini-player-height});
    }

    .content {
      flex: 1;
      overflow-y: auto;
      min-width: $layout-content-min-width;
      margin-bottom: $mini-player-height;

      .router-view-center {
        max-width: $center-content-max-width;
        margin: auto;
      }
    }
  }
}
</style>
