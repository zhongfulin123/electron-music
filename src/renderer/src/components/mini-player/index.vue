<template>
  <div class="mini-player" id="mini-player">
    <!-- 歌曲内容 -->
    <div class="song">
      <template v-if="hasCurrentSong">
        <div @click="togglePlayerShow" class="img-wrap">
          <div class="mask"></div>
          <el-image class="blur" :src="currentSong.img" lazy />
          <div class="player-control">
            <Icon :size="24" :type="playControlIcon" color="white" />
          </div>
        </div>
        <div class="content">
          <div class="top">
            {{ currentSong.name }}
          </div>
          <div class="bottom">
            {{ currentSong.artistsText }}
          </div>
        </div>
      </template>
    </div>
    <!-- 控制台 -->
    <div class="control">
      <Icon :size="24" @click="prev" class="icon" type="prev" />
      <el-popover :value="isPlayErrorPromptShow" placement="top" trigger="manual" width="160">
        <template #reference>
          <div @click="togglePlaying" class="play-icon" slot="reference">
            <Icon :size="24" :type="playIcon" color="white" />
          </div>
        </template>
        <p>请点击开始播放</p>
      </el-popover>
      <Icon :size="24" @click="next" class="icon" type="next" />
    </div>

    <div class="mode">
      <!-- 音量 -->
      <div class="volume-item">
        <Volume :volume="muiscVolume" @volumeChange="onVolumeChange" />
      </div>
      <!-- 模式 -->
      <el-popover placement="top" trigger="hover" width="160">
        <p>{{ playModeText }}</p>
        <template #reference>
          <Icon
            :size="20"
            :type="modeIcon"
            @click="onChangePlayMode"
            class="mode-item"
            slot="reference"
          />
        </template>
      </el-popover>
      <!-- 播放列表 -->
      <el-popover :value="isPlaylistPromptShow" placement="top" trigger="manual" width="160">
        <p>已更新歌单</p>
        <template #reference>
          <Icon
            :size="20"
            @click="togglePlaylistShow"
            class="mode-item"
            slot="reference"
            type="playlist"
          />
        </template>
      </el-popover>
    </div>
    <div class="progress-bar-container">
      <div>{{ formatTime(currentTime) }}</div>
      <div class="progress-bar-wrap">
        <ProgressBar
          :disabled="!hasCurrentSong"
          :percent="playedPercent"
          @percentChange="onProgressChange"
        />
      </div>
      <div>{{ formatTime(currentSong.duration / 1000) }}</div>
    </div>
    <audio :src="currentSong.url" @ended="end" @timeupdate="updateTime" ref="audio"></audio>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, nextTick } from 'vue'
import ProgressBar from './progress-bar.vue'
import Volume from './volume.vue'
import { useMusicStore } from '@renderer/store/music'
import { storeToRefs } from 'pinia'
import { playModeMap, isDef, formatTime } from '@renderer/utils'

const isPlayErrorPromptShow = ref(false)
const audio = ref()
const musicStore = useMusicStore()
const {
  muiscVolume,
  currentSong,
  currentTime,
  playing,
  playMode,
  isPlaylistShow,
  isPlaylistPromptShow,
  isPlayerShow,
  prevSong,
  nextSong
} = storeToRefs(musicStore)
const {
  setCurrentTime,
  setPlayingState,
  setPlayMode,
  setPlaylistShow,
  setPlayerShow,
  startSong,
  setMusicVolume
} = musicStore
onMounted(() => {
  audio.value.currentTime = currentTime.value
  audio.value.volume = muiscVolume.value
})


function togglePlaying() {
  if (!currentSong.value.id) {
    return
  }
  setPlayingState(!playing.value)
}

async function play() {
  try {
    await audio.value.play()
  } catch (error) {
    next()
  }
}
function pause() {
  audio.value.pause()
}
function updateTime(e) {
  const time = e.target.currentTime
  setCurrentTime(time)
}
function prev() {
  startSong(prevSong.value)
}
function next() {
  startSong(nextSong.value)
}
function end() {
  next()
}
function onProgressChange(percent) {
  audio.value.currentTime = currentSong.value.durationSecond * percent
  setPlayingState(true)
}
function onVolumeChange(percent) {
  audio.value.volume = percent
  setMusicVolume(percent)
}
function onChangePlayMode() {
  const modeKeys = Object.keys(playModeMap)
  const currentModeIndex = modeKeys.findIndex((key) => playModeMap[key].code === playMode.value)
  const nextIndex = (currentModeIndex + 1) % modeKeys.length
  const nextModeKey = modeKeys[nextIndex]
  const nextMode = playModeMap[nextModeKey]
  setPlayMode(nextMode.code)
}
function togglePlaylistShow() {
  setPlaylistShow(!isPlaylistShow.value)
}
function togglePlayerShow() {
  setPlayerShow(!isPlayerShow.value)
}
const hasCurrentSong = computed(() => {
  return isDef(currentSong.value.id)
})
const playIcon = computed(() => {
  return playing.value ? 'pause' : 'play'
})
const currentMode = computed(() => {
  return playModeMap[playMode.value]
})
const modeIcon = computed(() => {
  return currentMode.value.icon
})
const playModeText = computed(() => {
  return currentMode.value.name
})
const playedPercent = computed(() => {
  const { durationSecond } = currentSong.value
  return Math.min(currentTime.value / durationSecond, 1) || 0
})
const playControlIcon = computed(() => {
  return isPlayerShow.value ? 'shrink' : 'open'
})
let timer: any = null
watch(
  () => currentSong.value,
  (newSong, oldSong) => {
    // 清空了歌曲
    if (!newSong.id) {
      audio.value.pause()
      audio.value.currentTime = 0
      return
    }
    // 单曲循环
    if (oldSong && newSong.id === oldSong.id) {
      setCurrentTime(0)
      audio.value.currentTime = 0
      play()
      return
    }

    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      play()
    }, 1000)
  }
)
watch(
  () => playing.value,
  (newPlaying) => {
    nextTick(() => {
      newPlaying ? play() : pause()
    })
  }
)
</script>

<style lang="scss" scoped>
.mini-player {
  position: relative;
  position: fixed;
  z-index: $mini-player-z-index;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  height: $mini-player-height;
  padding: 8px 16px;
  padding-right: 24px;
  background: var(--body-bgcolor);
  border-top: 1px solid var(--menu-item-border-bg);

  .song {
    display: flex;
    align-items: center;
    flex: 1.5;
    overflow: hidden;
    .img-wrap {
      position: relative;
      margin-right: 8px;
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;
      @include img-wrap(40px);

      img {
        &.blur {
          filter: blur(2px);
        }
      }

      .player-control {
        @include abs-center;
      }

      .mask {
        @include abs-stretch;
        background: rgba(0, 0, 0, 0.2);
      }
    }

    .content {
      overflow: hidden;
      flex: 1;
      .top {
        @include text-ellipsis;
      }
      .bottom {
        margin-top: 5px;
        @include text-ellipsis;
      }
    }
  }

  .control {
    position: absolute;
    height: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    @include flex-center();
    top: -10%;

    .play-icon {
      @include flex-center();
      position: relative;
      width: 45px;
      height: 45px;
      margin: 0 16px;
      border-radius: 50%;
      background: $theme-color;
      cursor: pointer;

      // i {
      //   color: yellow;
      // }
      // .icon-play {
      //   transform: translateX(1px);
      // }
    }

    .icon {
      color: $theme-color;
    }
  }

  .mode {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 6;

    .mode-item {
      display: block;
      margin-right: 16px;
      width: 22px;
    }

    .volume-item {
      margin-right: 22px;
    }
  }
  .progress-bar-container {
    top: 70%;
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
    display: flex;
    align-items: center;
    .progress-bar-wrap {
      width: 300px;
      margin: 0 15px;
    }
  }
}

.icon {
  color: var(--font-color);
  cursor: pointer;
}
</style>
