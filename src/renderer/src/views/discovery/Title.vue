<template>
  <div class="title-wrap">
    <p class="title">
      <slot></slot>
    </p>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.title-wrap {
  display: flex;
  padding: 12px 0;

  .title {
    font-size: $font-size-title;
  }
}
</style>
