<template>
  <div class="playlist-detail" v-if="playlist.id">
    <DetailHeader ref="header" :playlist="playlist" :songs="songs" />
    <!-- <div class="tabs-wrap">
      <Tabs :tabs="tabs" type="theme" v-model="activeTab" />
      <el-input
        :class="getInputCls()"
        @blur="onInputBlur"
        @focus="onInputFocus"
        class="input"
        placeholder="搜索歌单音乐"
        prefix-icon="el-icon-search"
        v-model="searchValue"
        v-show="activeTab === SONG_IDX"
      ></el-input>
    </div> -->
    <!-- <div class="empty" v-if="searchValue && !filteredSongs.length">
      未能找到和
      <span class="keyword">“{{ searchValue }}”</span>
      相关的任何音乐
    </div> -->
    <!-- <SongTable
      :highlightText="searchValue"
      :songs="filteredSongs"
      class="table"
      v-show="activeTab === SONG_IDX"
    /> -->
    <!-- <div class="comments" v-show="activeTab === COMMENT_IDX">
      <Comments :id="id" @update="onCommentsUpdate" type="playlist" />
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import DetailHeader from './Header.vue'
import { createSong } from '@renderer/utils'
// import SongTable from "@/components/song-table"
// import Comments from "@/components/comments"
// import { createSong, scrollInto } from "@/utils"
// import { getListDetail } from "@/api"
const MAX = 500
const SONG_IDX = 0
const COMMENT_IDX = 1
import { getSongDetail, getListDetail } from '@renderer/api'
import { onMounted, ref, watch } from 'vue'
const tabs = ref(['歌曲列表', '评论'])
const activeTab = ref(SONG_IDX)
const playlist = ref<Record<string,any>>({})
const songs = ref([])
const searchValue = ref('')
const inputFocus = ref(false)

const route = useRoute()

watch(
  () => route.params.id,
  (newval) => {
    init(newval)
  },
  {
    immediate: true
  }
)
async function init(newval) {
  const res = await getListDetail({ id: newval })
  if (res.code !== 200) return
  playlist.value = res.playlist
  genSonglist(playlist.value)
}
async function genSonglist(playlist) {
  const trackIds = playlist.trackIds.map(({ id }) => id)
  const songDetails = await getSongDetail(trackIds.slice(0, MAX))
  const songs = songDetails.songs.map(({ id, name, al, ar, mv, dt }) =>
    createSong({
      id,
      name,
      artists: ar,
      duration: dt,
      mvId: mv,
      albumName: al.name,
      img: al.picUrl
    })
  )
  songs.value = songs
}

// export default {
//   metaInfo() {
//     return {
//       title: this.playlist.name,
//     }
//   },
//   async created() {
//     this.SONG_IDX = SONG_IDX
//     this.COMMENT_IDX = COMMENT_IDX
//   },
//   data() {
//     return {
//       tabs: ["歌曲列表", "评论"],
//       activeTab: SONG_IDX,
//       playlist: {},
//       songs: [],
//       searchValue: "",
//       inputFocus: false,
//     }
//   },
//   methods: {
//     async init() {
//       const { playlist } = await getListDetail({ id: this.id })
//       console.log(playlist)
//       this.playlist = playlist
//       this.genSonglist(playlist)
//     },
//     async genSonglist(playlist) {
//       const trackIds = playlist.trackIds.map(({ id }) => id)
//       const songDetails = await getSongDetail(trackIds.slice(0, MAX))
//       const songs = songDetails.songs.map(({ id, name, al, ar, mv, dt }) =>
//         createSong({
//           id,
//           name,
//           artists: ar,
//           duration: dt,
//           mvId: mv,
//           albumName: al.name,
//           img: al.picUrl,
//         }),
//       )
//       this.songs = songs
//     },
//     onCommentsUpdate({ total }) {
//       this.tabs.splice(COMMENT_IDX, 1, `评论(${total})`)
//     },
//     onInputFocus() {
//       this.inputFocus = true
//     },
//     onInputBlur() {
//       this.inputFocus = false
//     },
//     getInputCls() {
//       return !this.inputFocus ? "inactive" : ""
//     },
//     scrollToHeader() {
//       const { header } = this.$refs
//       if (header) {
//         scrollInto(header.$el)
//       }
//     },
//   },
//   computed: {
//     id() {
//       return Number(this.$route.params.id)
//     },
//     filteredSongs() {
//       return this.songs.filter(({ name, artistsText, albumName }) =>
//         `${name}${artistsText}${albumName}`
//           .toLowerCase()
//           .includes(this.searchValue.toLowerCase()),
//       )
//     },
//   },
//   watch: {
//     id: {
//       handler() {
//         console.log(1111)
//         this.searchValue = ""
//         this.init()
//         this.scrollToHeader()
//       },
//       immediate: true,
//     },
//   },
//   components: { DetailHeader, SongTable, Comments },
// }
</script>

<style lang="scss" scoped>
// .playlist-detail {
//   width: 100%;

//   .tabs-wrap {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     margin: 0 24px;
//     border-bottom: 1px solid var(--border);

//     .input {
//       width: 125px;

//       &:not(:hover) {
//         &.inactive {
//           :deep(.el-input__inner) {
//             background: transparent !important;
//           }
//         }
//       }
//     }
//   }

//   .empty {
//     @include flex-center;
//     height: 200px;

//     .keyword {
//       color: $blue;
//     }
//   }

//   .comments {
//     padding: 16px 32px;
//   }
// }
</style>
