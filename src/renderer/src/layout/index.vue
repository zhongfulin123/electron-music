<template>
  <div class="layout">
    <LayoutHeader />
    <SearchMusic />
    <div v-if="$route.meta?.single">
      <router-view></router-view>
    </div>
    <div v-else class="layout-body">
      <splitpanes>
        <pane size="19.8" min-size="19.8">
          <div class="layout-menu">
            <LayoutMenu />
          </div>
        </pane>
        <pane min-size="70" size="80.2">
          <div class="content">
            <router-view :class="routerViewCls" />
          </div>
        </pane>
      </splitpanes>
      <MiniPlayer />
      <player />
    </div>
  </div>
</template>

<script setup lang="ts">
import MiniPlayer from '@renderer/components/mini-player/index.vue'
import player from '@renderer/components/player.vue'
import SearchMusic from '@renderer/components/SearchMusic.vue'
import LayoutHeader from './header.vue'
import LayoutMenu from './menu.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { menuRoutes } from '@renderer/router'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
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
:deep(.splitpanes__splitter) {
  background-color: var(--menu-item-border-bg);
  position: relative;
}

.layout {
  height: 100%;

  .layout-body {
    display: flex;
    overflow-y: auto;
    height: calc(100% - #{$header-height});

    .layout-menu {
      // 这个100%已经减去了头部height
      height: calc(100% - #{$mini-player-height});
      overflow-y: auto;
    }

    .content {
      flex: 1;
      height: calc(100% - #{$mini-player-height});
      overflow-y: auto;
      // padding-bottom: 50px;
      .router-view-center {
        max-width: $center-content-max-width;
        margin: auto;
      }
    }
  }
}
</style>
