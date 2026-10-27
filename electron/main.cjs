const path = require('node:path');
const { app, BrowserWindow } = require('electron');
const { pathToFileURL } = require('node:url');

const devServerUrl = 'http://127.0.0.1:3000';
const appEntry = pathToFileURL(path.resolve(__dirname, '..', 'dist', 'index.html')).href;

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#0a0a1a',
    autoHideMenuBar: true,
    title: 'Rail Mayhem: Depot to Depot',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', (event, url) => {
    const isAllowed = app.isPackaged
      ? url === appEntry
      : new URL(url).origin === new URL(devServerUrl).origin;
    if (!isAllowed) event.preventDefault();
  });

  if (app.isPackaged) {
    void window.loadFile(path.resolve(__dirname, '..', 'dist', 'index.html'));
  } else {
    void window.loadURL(devServerUrl);
  }
}

app.whenReady().then(() => {
  app.setAppUserModelId('com.lokirar0.railmayhem');
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
