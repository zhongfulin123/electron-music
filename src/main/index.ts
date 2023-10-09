import { app, shell, BrowserWindow,Tray,Menu ,nativeImage} from 'electron'
import { join ,resolve} from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import logo from '../../resources/logo.png?asset'
import './drag'
function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    minWidth:1042,
    minHeight:677,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    ...(process.platform === 'linux' ? { logo } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  mainWindow.on('resize',(_event)=>{
    mainWindow.webContents.send('resizeWindow',mainWindow.isMaximized())
   })
 

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  const tray = new Tray(nativeImage.createFromPath(logo))
  const contextMenu = Menu.buildFromTemplate([{ label: '退出', role: 'quit' }])
  tray.setToolTip('音乐')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    mainWindow.show()
  })
}

app.whenReady().then(() => {

  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})