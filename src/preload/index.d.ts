import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      windowChange:(type:number)=>any,
      resizeWindow:(...res)=>any
      setpalySaate:(...res)=>any
      selectedDirectory:(...res)=>any
      downLoadMusic:(...res)=>any,
      initWatch:(...res)=>any,
      localDownloadList:(...res)=>any,
    }
  }
}
