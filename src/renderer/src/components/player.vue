<template>
  <div :class="getPlayerShowCls" class="player">
    <div class="content">
      <div class="song" ref="songRef">
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
              @current-change="queryComment(false)"
              @size-change="queryComment(false)"
            />
          </div>
        </div>
        <div class="right">
          <div v-if="SimiPlaylists.length > 0" style="margin-bottom: 20px">
            <div class="title">包含这首歌的歌单</div>
            <div class="simiPlaylists">
              <div
                v-for="(item, index) in SimiPlaylists"
                :key="index"
                class="item"
                @click="toPlaylist(item.id)"
              >
                <el-image :src="item.coverImgUrl" alt="" class="item-image" />
                <div class="name">{{ item.name }}</div>
              </div>
            </div>
          </div>
          <div v-if="simiSongs.length > 0">
            <div class="title">喜欢这首歌的人也听</div>
            <div class="simiPlaylists">
              <div
                v-for="(item, index) in simiSongs"
                :key="index"
                class="item"
                @click="playSong(item)"
              >
                <el-image :src="item.img" alt="" class="item-image" />
                <div class="name">
                  {{ item.name }} - {{ item.artists?.map((item) => item.name).join(' ') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useMusicStore } from '@renderer/store/music'
import { storeToRefs } from 'pinia'
import { getLyric, getSongComment, getSimiSongs, getSimiPlaylists } from '@renderer/api'
import Comment from '@renderer/components/Comment.vue'
const { isPlayerShow, playing, currentSong, currentTime, playHistory } = storeToRefs(
  useMusicStore()
)
const { setPlayerShow, startSong, setPlaylist } = useMusicStore()
import BScroll from '@better-scroll/core'
import ScrollBar from '@better-scroll/scroll-bar'
import MouseWheel from '@better-scroll/mouse-wheel'
import { createSong } from '@renderer/utils'
import { useRouter } from 'vue-router'
BScroll.use(ScrollBar)
BScroll.use(MouseWheel)
const getPlayerShowCls = computed(() => {
  return isPlayerShow.value ? 'show' : 'hide'
})

let scroll = ref<any>()
const wrapperRef = ref()
const songRef = ref()
function init() {
  queryComment(true)
  queryLyric()
  querySimiSongs()
  querySimiPlaylists()
  if (songRef.value) songRef.value.scrollIntoView()
}
/**
 * 跳转歌单
 */
const router = useRouter()
function toPlaylist(id) {
  setPlayerShow(false)
  router.push(`/playlist/${id}`)
}
/**
 * 播放当前歌曲
 */
function playSong(song) {
  startSong(song)
  setPlaylist(playHistory.value)
}

/**
 * 查询这首歌相似歌曲
 */
const simiSongs = ref<any[]>([])
async function querySimiSongs() {
  const res = await getSimiSongs(currentSong.value.id)
  if (res.code !== 200) return
  simiSongs.value = res.songs.map((song) => {
    const {
      id,
      name,
      artists,
      mvid,
      album: { picUrl },
      duration,
      ...res
    } = song
    return createSong({
      ...res,
      id,
      name,
      artists,
      duration,
      img: picUrl,
      mvId: mvid
    })
  })
}

/**
 * 查询包含这首歌歌单
 */
const SimiPlaylists = ref<any[]>([])
async function querySimiPlaylists() {
  const res = await getSimiPlaylists(currentSong.value.id)
  if (res.code !== 200) return
  SimiPlaylists.value = res.playlists
}

/**
 * 查询歌曲评论
 */
const pagination = ref({
  total: 0,
  size: 50,
  no: 1
})
const playlistComment = ref()
const bottomRef = ref()
async function queryComment(init?: boolean) {
  if (init) {
    pagination.value.no = 1
  }
  if (bottomRef.value && !init) bottomRef.value.scrollIntoView()
  const res = await getSongComment({
    id: currentSong.value.id,
    offset: (pagination.value.no - 1) * pagination.value.size
  })
  if (res.code !== 200) return
  playlistComment.value = res.comments
  pagination.value.total = res.total
}

/**
 * 计算当前应该选中那段歌词
 */
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

watch(
  () => [currentSong.value, getPlayerShowCls.value],
  (newal) => {
    if (newal[1] === 'show') init()
  },
  {
    immediate: true
  }
)

/**
 * 监听当前选中歌词滚动到对应元素
 */
const lyricRef = ref()
watch(
  () => activeIndex.value,
  (newal) => {
    if (lyricRef.value && lyricRef.value[newal]) {
      scroll.value && scroll.value.scrollToElement(lyricRef.value[newal], 200, 0, true)
    }
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

/**
 * 查询歌曲信息
 */
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

/**
 *
 * @param str 歌词
 * 转换歌词格式
 */
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
    overflow-y: auto;
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
      .title {
        font-weight: bold;
      }
      .left {
        flex: 8;
      }
      .right {
        flex: 4;
        @include text-ellipsis;
        margin-left: 100px;
        .simiPlaylists {
          margin-top: 10px;
          .item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            box-sizing: border-box;
            padding: 5px;
            border-radius: 5px;
            .item-image {
              width: 30px;
              height: 30px;
              border-radius: 5px;
              margin-right: 10px;
            }
            &:hover {
              background-color: var(--sx-color-hover);
            }
            .name {
              @include text-ellipsis;
            }
          }
        }
      }
    }
  }
}
</style>
