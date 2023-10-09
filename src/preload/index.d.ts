import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      windowChange:(type:number)=>any,
      resizeWindow:(...res)=>any
    }
  }
}
