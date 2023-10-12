import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
export const menuRoutes = [
  {
    path: '/discovery',
    name: 'discovery',
    component: ()=>import('@renderer/views/discovery/index.vue'),
    meta: {
      title: '发现音乐',
      icon: 'music',
    },
  },
  {
    path: '/playlists',
    name: 'playlists',
    component: ()=>import('@renderer/views/playlists/index.vue'),
    meta: {
      title: '推荐歌单',
      icon: 'playlist-menu',
    },
  },
  {
    path: '/songs',
    name: 'songs',
    component: ()=>import('@renderer/views/songs/index.vue'),
    meta: {
      title: '最新音乐',
      icon: 'yinyue',
    },
  },
  {
    path: '/mvs',
    name: 'mvs',
    component: ()=>import('@renderer/views/mvs/index.vue'),
    meta: {
      title: '最新MV',
      icon: 'mv',
    },
  },
]
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/discovery'
  },
  {
    path: '/playlist/:id?',
    name: 'playlistDetail',
    component: ()=>import('@renderer/views/playlistDetail/index.vue'),
  },
  {
    path: '/download',
    name: 'download',
    component: ()=>import('@renderer/views/download/index.vue'),
  },
  ...menuRoutes
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
