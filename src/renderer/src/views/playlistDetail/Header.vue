<template>
  <div class="header" v-if="playlist.id">
    <div class="img-wrap">
      <el-image :src="playlist.coverImgUrl" lazy class="img-container" />
    </div>
    <div class="content">
      <div class="title-wrap">
        <span
          style="
            border: 1px solid red;
            padding: 1px 3px;
            font-size: 14px;
            color: red;
            margin-right: 10px;
            border-radius: 3px;
          "
          >歌单</span
        >
        <p class="title">{{ playlist.name }}</p>
      </div>
      <div class="creator-wrap">
        <el-aimge :src="playlist.creator.avatarUrl" class="avatar" lazy />
        <p class="creator">{{ playlist.creator.nickname }}</p>
        <p class="create-time">{{ formatDate(playlist.createTime, 'yyyy-MM-dd') }} 创建</p>
      </div>
      <div class="action-wrap">
        <NButton @click="playAll" class="button">
          <Icon class="icon middle" color="white" type="play-round" />
          <span class="middle">播放全部</span>
        </NButton>
      </div>
      <div class="desc-wrap">
        <p class="desc" v-if="playlist.trackCount">
          <span>歌曲:{{ formatNumber(playlist.trackCount) }}</span>
          <span style="margin-left: 20px">播放:{{ formatNumber(playlist.playCount) }}</span>
        </p>
        <p class="desc" v-if="playlist.description">
          <span class="value">简介：{{ playlist.description }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NButton from '@renderer/components/NButton.vue'
import { useMusicStore } from '@renderer/store/music'
import { formatDate, formatNumber } from '@renderer/utils'
const musicStore = useMusicStore()
const { setPlaylist, startSong } = musicStore
const props = defineProps({
  playlist: {
    type: Object,
    default: () => ({})
  },
  songs: {
    type: Array,
    default: () => []
  }
})
function playAll() {
  setPlaylist(props.songs)
  startSong(props.songs[0])
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  padding: 36px;
  box-sizing: border-box;
  .img-wrap {
    width: 200px;
    height: 200px;
    margin-right: 24px;

    .img-container {
      width: 100%;
      height: 100%;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    flex: 1;

    .title-wrap {
      display: flex;
      align-items: center;
      margin-bottom: 12px;

      .title {
        font-size: 18px;
        font-weight: bold;
      }
    }

    .action-wrap {
      margin-bottom: 15px;
      .button {
        background: #ec4141;
        color: #fbdfdd;
        border: none;
        display: flex;
        max-width: fit-content;
        align-items: center;
        border-radius: 20px;
        .icon {
          margin-right: 4px;
        }

        .middle {
          vertical-align: middle;
        }
      }
    }

    .creator-wrap {
      display: flex;
      align-items: center;
      margin-bottom: 18px;

      .avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 8px;
      }

      .creator {
        margin-right: 8px;
      }

      .create-time {
        font-size: $font-size-sm;
      }
    }
    .desc {
      margin-bottom: 8px;

      .label {
        display: inline-block;
        margin-right: 8px;
      }

      .value {
        @include text-ellipsis-multi(3);
      }
    }
  }
}
</style>
