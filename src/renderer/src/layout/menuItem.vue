<template>
    <div :key="index" class="menu-block" v-for="(menu, index) in menusWithPlaylist" @click.stop="toPage(menu)">
      <div class="menu-item" :class="[$route.path === menu.path ? 'menu-item-active': '']">
        <div v-if="menu?.title" class="menu-block-title">{{ menu.title }}</div>
        <Icon :type="menu?.meta?.icon" v-if="menu?.meta?.icon" style="margin-right: 5px;" :size="20"></Icon>
        <div class="menu-title" v-if="menu?.meta?.title">{{ menu?.meta?.title }}</div>
      </div>
      <menuItem :menus-with-playlist="menu?.children" v-if="menu?.children?.length > 0"></menuItem>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
 defineProps<{
  menusWithPlaylist: any[]
}>()

const router = useRouter()

function toPage(menu){
  console.log(menu)
  if(menu.path){
    router.push({
      path: menu.path
    })
  }
}
</script>

<style scoped lang="scss">
.menu-block {
  cursor: pointer;
  .menu-item {
    display: flex;
    align-items: center;
      padding: 10px 20px;
    justify-content: flex-start;
        &:hover {
        background: var(--menu-item-hover-bg);
      }
         &-active {
        // color: $theme-color;
        background: var(--menu-item-active-bg);
      }


    .menu-block-title {
      font-size: 13px;
      color: var(--font-color-grey2);
      @include text-ellipsis;
    }
    .menu-title{
      font-size: 13px;
      @include text-ellipsis;
    }
  }
}
</style>
