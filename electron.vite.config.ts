import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    css:{
      preprocessorOptions:{
        scss:{
          additionalData: `@import '@renderer/assets/css/mixin.scss'; @import '@renderer/assets/css/variables.scss';`,
        }
      }
    },
    plugins: [vue(),createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), 'src/renderer/src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
      customDomId: '__svg__icons__dom__',
    })]
  }
})
