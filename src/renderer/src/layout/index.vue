<template>
  <div class="layout">
    <LayoutHeader />
    <div class="layout-body">
      <splitpanes>
        <pane :size="19.8" :min-size="19.8">
          <div class="layout-menu" v-show="isMenuShow">
            <LayoutMenu />
          </div>
        </pane>
        <pane min-size="70" size="80.2">
          <div class="content">
            <router-view :class="routerViewCls" />
          </div>
        </pane>
      </splitpanes>
    </div>

    <!-- <div class="layout-body">
      <div class="layout-menu" v-show="isMenuShow">
        <LayoutMenu />
      </div>
      <div class="content" id="page-content">
        <router-view :class="routerViewCls" />
      </div>
    </div> -->
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
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
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
:deep(.splitpanes__splitter) {
  background-color: var(--menu-item-border-bg);
  position: relative;
}
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
      height: 90%;
      padding-bottom: 50px;
      .router-view-center {
        max-width: $center-content-max-width;
        margin: auto;
      }
    }
  }
}
</style>
