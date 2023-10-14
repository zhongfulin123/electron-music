<template>
    <div >
        <el-row :gutter="10">
    <el-col  :md="12" :lg="8" :xl="4"
    v-for="i in 100"
      >111</el-col>
  </el-row>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>