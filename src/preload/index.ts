import { contextBridge,ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  windowChange: (type) => {
    return ipcRenderer.invoke('windowChange', type)
  },
  resizeWindow: (e)=>{
    return ipcRenderer.on('resizeWindow',e)
  },
  setpalySaate:(e)=>{
    return ipcRenderer.on('setpalySaate',e)
  },
  selectedDirectory:(e)=>{
    return ipcRenderer.invoke('selectedDirectory',e)
  },
  downLoadMusic:(url,outpath)=>{
    return ipcRenderer.invoke('downLoadMusic',url,outpath)
  },
  initWatch:(outpath)=>{
    return ipcRenderer.invoke('initWatch',outpath)
  },
  localDownloadList:(e)=>{
    return ipcRenderer.on('localDownloadList',e)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
