<template>
  <div class="menu">
    <div class="menu-wrap">
      <menu-item :menusWithPlaylist="menusWithPlaylist"></menu-item>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { watch } from 'vue';
import { menuRoutes } from '@renderer/router'
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import MenuItem from './menuItem.vue'
import { getUserPlaylist } from '@renderer/api'
import { useUserStore } from '@renderer/store/user'
const userStore = useUserStore()

const { uid, userInfo } = storeToRefs(userStore)

const menusWithPlaylist = ref<any[]>([])
const myMenu = [
  {
    title: '我的音乐',
    children: [
      {
        path: `/playlist`,
        meta: {
          title: '我喜欢的音乐',
          icon: 'xihuan'
        }
      },
      {
        path: `/download`,
        meta: {
          title: '本地与下载',
          icon: 'xiazai'
        }
      }
    ]
  }
]
watch(
  () => uid.value,
  async (newval) => {
    if (newval) {
      const dynamicMenus = await queyUserPlayList()

      menusWithPlaylist.value = [...menuRoutes, ...dynamicMenus]
    } else {
      myMenu[0].children[0].path = `/playlist`
      menusWithPlaylist.value = [...menuRoutes, ...myMenu]
    }
  },
  {
    immediate: true
  }
)

async function queyUserPlayList() {
  const res = await getUserPlaylist(uid.value)
  if (res.code !== 200) return []

  const retMenus: any[] = []
  const id = res.playlist.find(
    (item) => item.userId === uid.value && item.name === userInfo.value.nickname + '喜欢的音乐'
  )?.id
  myMenu[0].children[0].path = `/playlist/${id}`

  const genPlaylistChildren = (playlist, icon?: string) =>
    playlist.map(({ id, name }) => ({
      path: `/playlist/${id}`,
      meta: {
        title: name,
        icon: icon || 'playlist-menu'
      }
    }))
  retMenus.push(...myMenu)
  retMenus.push({
    title: '创建的歌单',
    children: genPlaylistChildren(
      res.playlist.filter(
        (item) =>
          item.userId === uid.value && !(item.name === userInfo.value.nickname + '喜欢的音乐')
      )
    )
  })
  retMenus.push({
    title: '收藏的歌单',
    children: genPlaylistChildren(res.playlist.filter((item) => !(item.userId === uid.value)))
  })

  return retMenus
}
</script>

<style scoped lang="scss">
.menu {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: var(--menu-bgcolor);

  .menu-wrap {
    flex: 1;
    width: 100%;
    overflow: hidden;
    overflow-y: auto;
  }
}
</style>
