import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/discovery'
  },
  {
    path: '/discovery',
    name: 'discovery',
    component: () => import('@renderer/views/discovery/index.vue'),
    meta: {
      title: '发现音乐',
      icon: 'music'
    }
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
