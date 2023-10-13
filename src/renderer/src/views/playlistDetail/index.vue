<template>
  <div class="playlist-detail" v-if="playlist.id" ref="headerRef">
    <DetailHeader :playlist="playlist" :songs="tableData" />
    <div class="search-box">
      <ZTab :list="tabs" v-model="activeTab"></ZTab>
      <el-input
        v-model="searchText"
        style="width: 150px;"
        size="small"
        placeholder="搜索歌单音乐"
        clearable 
        :prefix-icon="Search"
      />
    </div>
   
    <ZTable :tableData="filteredSongs" :columns="columns" :isIndex="true" :atviveId="atviveId" v-if="activeTab==1">
      <template #name="{ row }">
        <div class="u-line-1" style="display: flex; align-items: center">
          <div
            class="u-line-1"
            :style="{
              color: currentSong.id === row.id && atviveId === songSheetId ? '#EC4141' : '',
              flex: 3,
              'max-width': 'fit-content'
            }"
          >
          <div v-if="row?.isSearch" v-html="row.searchName" class="u-line-1" ></div>
           <div v-else  class="u-line-1" >{{ row.name }}</div>   
          </div>
          <div style="display: flex; flex: 1; height: 100%" v-if="row.mvId || row.fee">
            <div v-if="row.mvId" class="label">mv</div>
            <div v-if="row.fee === 1" class="label">vip</div>
          </div>
        </div>
      </template>
      <template #operation="{ row }">
        <Icon type="xiazai" @click.stop="download(row)"></Icon>
      </template>
    </ZTable>
    <div class="container-comment" v-if="activeTab==2" >
      <div v-if="hotComments.length>0&&pagination.no===1">
        <div class="title">精彩评论</div>
       <Comment  :commentList="hotComments"></Comment>
      </div>
      <div v-if="playlistComment.length>0" :style="{'margin-top': hotComments.length>0&&pagination.no===1?'50px': ''}">
        <div class="title">最新评论({{ pagination.total }})</div>
       <Comment  :commentList="playlistComment"></Comment>
      </div>
      <div style="display: flex;justify-content: center;margin-top: 20px;">
      <el-pagination
      v-model:current-page="pagination.no"
      v-model:page-size="pagination.size"
      background="background"
      layout="prev, pager, next"
      :total="pagination.total"
      @current-change="queryPlaylistComment($route.params.id)"
      @size-change="queryPlaylistComment($route.params.id)"
    />
    </div>
    </div>

  </div>
  <div class="box-empty" v-else>
    <el-empty description="暂无数据" />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import DetailHeader from './Header.vue'
import { createSong } from '@renderer/utils'
import ZTab from '@renderer/components/ZTab.vue'
import ZTable from '@renderer/components/ZTable.vue'
import { formatTime } from '@renderer/utils'
import { useMusicStore } from '@renderer/store/music'
import { useGlobalStore } from '@renderer/store/global'
import { checkMusic } from '@renderer/api'
import { storeToRefs } from 'pinia'
import {  Search } from '@element-plus/icons-vue'
const { currentSong, songSheetId } = storeToRefs(useMusicStore())
const { muicPath } = storeToRefs(useGlobalStore())
const playlist = ref<Record<string, any>>({})
import { getSongDetail, getListDetail,getPlaylistComment } from '@renderer/api'
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import Comment from '@renderer/components/Comment.vue'
import _ from 'lodash'
const activeTab = ref(1)
const atviveId = ref('')

const searchText=ref('')

const tabs = ref([
  {
    label: '歌曲列表',
    value: '1'
  },
  {
    label: '评论',
    value: '2'
  }
])
const tableData = ref([])
const pagination = ref({
  total: 0,
  size: 50,
  no: 1
})
const columns = ref([
  {
    label: '操作',
    value: 'operation',
    slotName: 'operation',
    align: 'center'
  },
  {
    label: '标题',
    value: 'name',
    searchValue: 'searchName',
    flex: '4',
    slotName: 'name'
  },
  {
    label: '歌手',
    value: 'artistsText',
    searchValue: 'searchArtistsText',
    flex: '3'
  },
  {
    label: '专辑',
    value: 'albumName',
    searchValue: 'searchAlbumName',
    flex: '2'
  },
  {
    label: '时间',
    value: 'durationSecond',
    render: (row) => `<div>${formatTime(row.durationSecond)}</div>`
  }
])

const route = useRoute()
const headerRef = ref()
const copyTabs = _.cloneDeep(tabs.value)
watch(
  () => route.params.id,
  (newval) => {
    if (headerRef.value) {
      headerRef.value.scrollIntoView({ behavior: 'smooth' })
    }
    atviveId.value = newval as string
    initPlayList(newval)
    queryPlaylistComment(newval)
  },
  {
    immediate: true
  }
)

/**
 * 获取歌单评论
 */
const playlistComment = ref([])
const hotComments = ref([])
 async function queryPlaylistComment(newval){
 const  res = await getPlaylistComment({
    id:newval,
    offset:(pagination.value.no - 1) * 50,
  })
  if(res.code!==200) return 
  playlistComment.value = res.comments
  if(pagination.value.no ===1) hotComments.value = res.hotComments
  pagination.value.total = res.total
  tabs.value[1].label = `${copyTabs[1].label}(${res.total}) `
}

/**
 * 
 * @param newval 当前歌单id
 */
async function initPlayList(newval) {
  const res = await getListDetail({ id: newval })
  if (res.code !== 200) {
    playlist.value = []
    return
  }
  playlist.value = res.playlist
  genSonglist(playlist.value)
}
/**
 * 
 * @param playlist 歌单列表
 */
async function genSonglist(playlist) {
  const trackIds = playlist.trackIds.map(({ id }) => id)
  const songDetails = await getSongDetail(trackIds.slice(0, trackIds.length))
  const result = songDetails.songs.map(({ id, name, al, ar, mv, dt, ...res }) =>
    createSong({
      ...res,
      id,
      name,
      artists: ar,
      duration: dt,
      mvId: mv,
      albumName: al.name,
      img: al.picUrl
    })
  )
  tableData.value = result
}
/**
 * 
 * @param result 替换的字符串
 * @param keyword 搜索关键字
 */

function useBrightenKeyword(result, keyword) {
  const Reg = new RegExp(keyword, 'ig')
  let res = '';
  if (result) {
    res = result.replace(Reg, `<span style="color: #507DAF;">${keyword}</span>`)
    return res
  }
  return result
}

const filteredSongs = computed(()=>{
  return searchText.value?tableData.value.filter(({ name, artistsText, albumName }) =>
        `${name}${artistsText}${albumName}`
          .toLowerCase()
          .includes(searchText.value.toLowerCase()),
      ).map((item:any)=>{
        return {
        ...item,
        isSearch:true,
        searchName: useBrightenKeyword(item.name,searchText.value),
        searchArtistsText: useBrightenKeyword(item.artistsText,searchText.value),
        searchAlbumName: useBrightenKeyword(item.albumName,searchText.value)
        }
      }) : tableData.value
})

/**
 * 下载歌曲
 */
const router = useRouter()
async function download(row) {
  if(!muicPath.value){
    ElMessage({
      duration:1000,
      type: 'warning',
      message: '请设置下载目录'
    })
    setTimeout(() => {
      router.push({
      path: '/download'
    })
    }, 500);
    
    return
  } 
  const res = await checkMusic(row.id)
  if (!(res.success && (row.fee == 8 || row.fee === 0))){
    ElMessage.warning(res.message === 'ok' ? '当前歌曲需要vip' : res.message)
    return
  }

  window.api.downLoadMusic(row.url, row.name, muicPath.value)
}
</script>

<style lang="scss" scoped>
.u-line-1 {
  @include text-ellipsis;
}
:deep(.el-pagination.is-background .el-pager li.is-active) {
  background-color: #EC4141;
}
.box-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
}
.playlist-detail {
  padding-bottom: 20px;
  .label {
    border: 1px solid #ed5454;
    padding: 0 4px;
    color: #ed5454;
    margin-left: 5px;
    height: 15px;
    line-height: 15px;

    font-size: 12px;
    cursor: pointer;
  }
  .search-box{
    margin: 30px 36px 20px 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .container-comment{
    margin: 0 36px;
    .title{
      font-size: 15px;
      font-weight: bold;
    }
  }
}
</style>
