<template>
  <div :class="getPlayerShowCls" class="player">
    <div class="content" ref="playerRef">
      <div class="song">
        <div class="left">
          <img src="@renderer/assets/images/play-bar-support.png" class="bar-support" />
          <img src="@renderer/assets/images/play-bar.png" class="bar" :class="{ playing }" />
          <div class="outer" :class="{ paused: !playing }">
            <el-image :src="currentSong.img" alt="" lazy class="img-contianer" />
          </div>
        </div>
        <div class="right">
          <div class="title">{{ currentSong.name }}</div>
          <div class="lyricInfo">
            <div>歌手:{{ singer }}</div>
            <div class="alum">专辑: {{ album }}</div>
          </div>
          <div ref="wrapperRef" class="scrollbar-wrapper">
            <div style="height: 100%">
              <div
                v-for="(item, index) in lyricList"
                :key="index"
                class="scrollbar-content-item"
                ref="lyricRef"
                :style="{
                  color: activeIndex === index ? `var(--lyric-color-active)` : '',
                  fontWeight: activeIndex === index ? 'bold' : ''
                }"
              >
                {{ item.content }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-box" ref="bottomRef">
        <div class="left">
          <div class="title">全部评论({{ pagination.total }})</div>
          <Comment :commentList="playlistComment"></Comment>
          <div style="display: flex; justify-content: center; margin-top: 20px">
            <el-pagination
              v-if="pagination.total > 50"
              v-model:current-page="pagination.no"
              v-model:page-size="pagination.size"
              background="background"
              layout="prev, pager, next"
              :total="pagination.total"
              @current-change="queryComment()"
              @size-change="queryComment()"
            />
          </div>
        </div>
        <div class="right"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useMusicStore } from '@renderer/store/music'
import { storeToRefs } from 'pinia'
import { getLyric, getSongComment } from '@renderer/api'
import Comment from '@renderer/components/Comment.vue'
const { isPlayerShow, playing, currentSong, currentTime } = storeToRefs(useMusicStore())
import BScroll from '@better-scroll/core'
import ScrollBar from '@better-scroll/scroll-bar'
import MouseWheel from '@better-scroll/mouse-wheel'
BScroll.use(ScrollBar)
BScroll.use(MouseWheel)
const getPlayerShowCls = computed(() => {
  return isPlayerShow.value ? 'show' : 'hide'
})
onMounted(() => {})
let scroll = ref<any>()
const wrapperRef = ref()
const playerRef = ref()
function init() {
  queryComment()
  queryLyric()
  if (playerRef.value) playerRef.value.scrollIntoView()
}
const pagination = ref({
  total: 0,
  size: 50,
  no: 1
})
const playlistComment = ref()
const bottomRef = ref()
async function queryComment() {
  if (bottomRef.value) bottomRef.value.scrollIntoView()
  const res = await getSongComment({
    id: currentSong.value.id,
    offset: (pagination.value.no - 1) * pagination.value.size
  })
  if (res.code !== 200) return
  playlistComment.value = res.comments
  pagination.value.total = res.total
}

const lyricList = ref<Array<any>>([])
const activeIndex = computed(() => {
  return lyricList.value.length > 0
    ? lyricList.value.findIndex((item, index) => {
        const nextLyric = lyricList.value[index + 1]
        const time = currentTime.value * 1000
        return time >= item.lyricTime && (nextLyric ? time < nextLyric.lyricTime : true)
      })
    : -1
})
const lyricRef = ref()
watch(
  () => currentSong.value,
  () => {
    init()
  },
  {
    immediate: true
  }
)
watch(
  () => activeIndex.value,
  (newal) => {
    scroll.value && scroll.value.scrollToElement(lyricRef.value[newal], 200, 0, true)
  }
)
// 歌手信息
const singer = computed(() => {
  return currentSong.value?.artistsText
})

//专辑信息
const album = computed(() => {
  return currentSong.value?.albumName
})

async function queryLyric() {
  const res = await getLyric(currentSong.value.id)
  if (res.code !== 200) return
  lyricList.value = lyricTransform(res.lrc.lyric)
  nextTick(() => {
    if (!scroll.value) {
      scroll.value = new BScroll(wrapperRef.value, {
        scrollY: true,
        scrollbar: true,
        probeType: 3,
        mouseWheel: true
      })
    } else {
      scroll.value && scroll.value.refresh()
    }
  })
}

function lyricTransform(str: string) {
  const list = str.split('\n').filter((item) => Boolean(item))
  const result: Array<any> = []
  const reg = /\[(\d+:\d+\.\d+)\]((\S|\s)(.+))/
  const regex = /(\d{2}):(\d{2}).(\d{2})/
  for (const key in list) {
    const tmp = decodeURIComponent(list[key])
    const [, time, content] = tmp.match(reg) || []
    let lyricTime
    if (time && content) {
      const [, minute, second, millSecond] = time.match(regex)!
      lyricTime = Number(Number(minute) * 60 + Number(second)) * 1000 + Number(millSecond)
      result.push({
        lyricTime,
        content
      })
    }
  }
  return result
}
</script>

<style scoped lang="scss">
@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(1turn);
  }
}
:deep(.el-pagination.is-background .el-pager li.is-active) {
  background-color: #ec4141;
}
.player {
  position: fixed;
  top: $header-height;
  bottom: $mini-player-height;
  left: 0;
  right: 0;
  background: var(--body-bgcolor);
  z-index: $song-detail-z-index;
  overflow: hidden;
  overflow-y: auto;
  transition: transform 0.5s;

  &.hide {
    transform: translateY(105%);
  }

  &.show {
    transform: none;
  }
  .content {
    max-width: $center-content-max-width;
    margin: auto;
    height: 100%;
    .song {
      display: flex;
      height: 500px;
      .left {
        flex: 1;
        position: relative;
        height: 100%;
        .bar-support {
          position: absolute;
          width: 30px;
          height: 30px;
          z-index: 98;
          right: 210px;
        }
        .bar {
          width: 100px;
          height: 146px;
          position: absolute;
          z-index: 97;
          top: 10px;
          right: 132px;
          transform-origin: 0 0;
          transform: rotate(-30deg);
          transition: all 0.3s;

          &.playing {
            transform: rotate(5deg);
          }
        }
        .outer {
          position: absolute;
          right: 50px;
          top: 90px;
          width: 350px;
          height: 350px;
          box-sizing: border-box;
          border-radius: 50%;
          display: flex;
          z-index: 96;
          align-items: center;
          justify-content: center;
          background: var(--ls-bg);
          animation: rotate 20s linear infinite;
          border: 15px solid var(--ls-boder);
          &.paused {
            animation-play-state: paused;
          }
          .img-contianer {
            width: 230px;
            height: 230px;
            border-radius: 50%;
          }
        }
      }
      .right {
        flex: 1;
        padding: 20px;
        color: var(--lyric-color);
        font-size: 15px;
        .title {
          font-weight: bold;
          font-size: 20px;
          color: var(--lyric-title-color);
        }
        .lyricInfo {
          margin-top: 10px;
          display: flex;
          align-items: center;
          .alum {
            flex: 1;
            margin-left: 10px;
            @include text-ellipsis;
          }
        }

        .scrollbar-wrapper {
          position: relative;
          max-height: 380px;
          overflow: hidden;
          margin-top: 20px;
        }
        .scrollbar-content-item {
          padding: 10px 0;
        }
      }
    }
    .bottom-box {
      display: flex;
      box-sizing: border-box;
      padding: 0 20px 50px 30px;
      .left {
        flex: 4;
        .title {
          font-weight: bold;
        }
      }
      .right {
        flex: 3;
      }
    }
  }
}
</style>
