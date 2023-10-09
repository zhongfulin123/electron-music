import { BrowserWindow, ipcMain } from 'electron'

ipcMain.handle('windowChange', (_event, type) => {
    const currentWindow = BrowserWindow.getFocusedWindow()!
    const strategy = {
      1: () => {
        currentWindow.minimize()
      },
      2: () => {
        if (currentWindow.isMaximized()) {
          currentWindow.restore()
        } else {
          currentWindow.maximize()
        }
        return currentWindow.isMaximized()
      },
      3: () => {
        currentWindow.hide()
      }
    }
   return strategy[type] && strategy[type]()
  })
  
  