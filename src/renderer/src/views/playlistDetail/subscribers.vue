<template>
  <div class="container">
    <el-row :gutter="30">
      <el-col :md="12" :lg="8" :xl="4" v-for="(item, index) in list" :key="index">
        <div class="item u-line-1">
          <el-image :src="item.avatarUrl" alt="" class="avatar" lazy />
          <div class="u-line-1" style="margin-left: 10px">
            <div style="display: flex">
              <span>{{ item.nickname }}</span>
              <span
                v-if="item.gender"
                style="margin-left: 5px; border-radius: 50%"
                :style="{ background: item.gender === 1 ? '#BFF3FF' : '#FFCCE7' }"
              >
                <Icon
                  :type="item.gender === 1 ? 'xingbienan' : 'xingbienv'"
                  :color="item.gender === 1 ? '#68BDE1' : '#EF77AA'"
                ></Icon>
              </span>
            </div>
            <div class="u-line-1" style="margin-top: 10px">{{ item.signature }}</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  list: Array<any>
}>()
</script>

<style scoped lang="scss">
.u-line-1 {
  @include text-ellipsis;
}
.container {
  padding: 0 36px;
  box-sizing: border-box;
  .item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .avatar {
      width: 70px;
      height: 70px;
      border-radius: 50%;
    }
  }
}
</style>
