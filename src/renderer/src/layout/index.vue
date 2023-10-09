<template>
     <div class="layout">

    <LayoutHeader />
    <!-- <div class="layout-body">
      <div
        class="layout-menu"
        v-show="isMenuShow"
      >
        <LayoutMenu />
      </div>
      <div
        class="content"
        id="page-content"
      >
        <router-view />
      </div>
    </div> -->
  </div>
    <!-- <div class="box">
        77777
    </div>
    <el-button type="primary">Primary</el-button>
    <svg-icon name="close" color="#ff0000"></svg-icon>
    <img src="@renderer/assets/icons/close.svg"> -->
</template>

<script setup lang="ts">
import LayoutHeader from "./header.vue"
// import LayoutMenu from "./menu.vue"
// import redTheme from '@renderer/assets/css/themes/variables-red.js'
// import SvgIcon from '@renderer/components/SvgIcon.vue';
// console.log(redTheme)
// import {getBanner} from '@renderer/api/index'
// getBanner()

</script>

<style scoped lang="scss">
</style>