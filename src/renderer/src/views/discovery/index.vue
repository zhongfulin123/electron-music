<template>
  <div class="discovery">
    <Banner />
    <NewPlaylists />
    <NewSongs />
    <NewMvs />
  </div>
</template>

<script setup lang="ts">
import Banner from './banner.vue'
import NewPlaylists from './new-playlists.vue'
import NewSongs from './new-songs.vue'
import NewMvs from './new-mvs.vue'
</script>

<style scoped lang="scss">
.discovery {
  padding: 18px 32px;
}
</style>
