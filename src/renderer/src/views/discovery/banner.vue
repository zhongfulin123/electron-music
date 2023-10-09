<template>
  <el-carousel :interval="4000" class="banner-carousel" type="card">
    <el-carousel-item :key="banner.scm" v-for="banner in bannerList">
      <img :src="banner.imageUrl" class="banner-img" />
    </el-carousel-item>
  </el-carousel>
</template>

<script setup lang="ts">
import { getBanner } from '@renderer/api'
import { onMounted, ref } from 'vue'
const bannerList = ref<any[]>([])
async function getBannerList() {
  const res  = (await getBanner()) 
  if(res.code!==200) return
  bannerList.value = res.banners
}
onMounted(() => {
  getBannerList()
})
</script>

<style lang="scss" scoped>
.banner-carousel {
  :deep(.el-carousel__container) {
    height: 180px;
  }

  .banner-img {
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }
}
</style>
