const {app, BrowserWindow, Menu, shell, MenuItem, globalShortcut, Notification} = require('electron')
const path = require('path')
const url = require('url')

let win

function createWindow () {
  win = new BrowserWindow({
    width: 1200,
    height: 800
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // win.webContents.openDevTools();

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', function () {
  createWindow()

  globalShortcut.register('Alt + 1', function() {
    win.show()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
