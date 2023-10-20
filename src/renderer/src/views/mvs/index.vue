<template>
  <div class="container">
    <div class="title" ref="headerRef">全部MV</div>
    <div class="type">
      <div class="label">地区:</div>
      <ZTab
        :list="areaList"
        v-model="actviveArea"
        :isDefalut="2"
        @handleChange="queryAllMvs(true)"
      ></ZTab>
    </div>
    <div class="type">
      <div class="label">类型:</div>
      <ZTab
        :list="typeList"
        v-model="actviveType"
        :isDefalut="2"
        @handleChange="queryAllMvs(true)"
      ></ZTab>
    </div>
    <div class="type">
      <div class="label">排序:</div>
      <ZTab
        :list="sortList"
        v-model="actviveSort"
        :isDefalut="2"
        @handleChange="queryAllMvs(true)"
      ></ZTab>
    </div>
    <el-row :gutter="30">
      <el-col v-for="(mv, index) in mvs" :key="index" :md="8" :lg="6" @click="">
        <MvCard
          style="margin-bottom: 20px"
          :author="mv.artistName"
          :id="mv.id"
          :img="mv.cover"
          :name="mv.name"
          :playCount="mv.playCount"
        />
      </el-col>
    </el-row>
    <div style="display: flex; justify-content: center">
      <el-pagination
        v-model:current-page="pagination.no"
        v-model:page-size="pagination.size"
        background="background"
        layout="prev, pager, next"
        :total="pagination.total"
        @current-change="queryAllMvs(false)"
        @size-change="queryAllMvs(false)"
      />
    </div>

    <!-- <el-button @click="$router.push({ path: '/mv' })">跳转</el-button> -->
  </div>
</template>

<script setup lang="ts">
import ZTab from '@renderer/components/ZTab.vue'
import MvCard from '@renderer/components/mv-card.vue'
import { onMounted, ref } from 'vue'
import { getAllMvs } from '@renderer/api'

onMounted(() => {
  queryAllMvs(true)
})

const areaList = ref(['全部', '内地', '港台', '欧美', '韩国', '日本'])
const actviveArea = ref('全部')
const typeList = ref(['全部', '官方版', '原声', '现场版', '网易出品'])
const actviveType = ref('全部')
const sortList = ['上升最快', '最热', '最新']
const actviveSort = ref('上升最快')
const pagination = ref({
  no: 1,
  size: 96,
  total: 0
})
const mvs = ref<Record<string, any>>([])
const headerRef = ref()
async function queryAllMvs(init?: boolean) {
  if (init) {
    pagination.value.no = 1
  }
  if (headerRef.value) headerRef.value.scrollIntoView()
  const res = await getAllMvs({
    area: actviveArea.value,
    type: actviveType.value,
    order: actviveSort.value,
    offset: pagination.value.size * (pagination.value.no - 1)
  })
  if (res.code !== 200) return
  mvs.value = res.data
  if (init) pagination.value.total = res.count
}
</script>

<style scoped lang="scss">
:deep(.el-pagination.is-background .el-pager li.is-active) {
  background-color: #ec4141;
}

.container {
  padding: 20px 20px 50px 20px;
  .title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .type {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .label {
      margin-right: 10px;
    }
  }
}
</style>
